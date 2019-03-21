import { GlobalMessageNotificationService } from './global-message-notification.service';
/**
 * Based on Vertx EventBus Client (https://github.com/vert-x3/vertx-bus-bower)
 * Requires SockJS Client
 */

import { Injectable, EventEmitter } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { ProtocolService } from './protocol.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Injectable()
export class EventBusService {

    static initialized = false;
    static MAX_EVENT_QUEUE_SIZE = 100;
    static STATE_CONNECTING = 0;
    static STATE_OPEN = 1;
    static STATE_CLOSING = 2;
    static STATE_CLOSED = 3;
    static TYPE_PUBLISH = 'publish';
    static TYPE_SEND = 'send';
    static TYPE_REGISTER = 'register';
    static TYPE_REGISTER_HANDLER = 'registerHandler';
    static TYPE_UNREGISTER = 'unregister';
    static TYPE_UNREGISTER_HANDLER = 'unregisterHandler';

    public close: EventEmitter<any> = new EventEmitter<any>();
    public open: EventEmitter<any> = new EventEmitter<any>();

    private defaultHeaders: any;
    private eventQueue: QueuedEvent[];
    private handlers: any = {};
    private replyHandlers: any = {};
    private sockJS;
    private state: number;


  //  this.toastr.success('Welcome to the ETL Tool!!! :-)');
  //  this.toastr.warning('Pay attention!!!...this is just a warning. :-)');
  //  this.toastr.error('OMG!!!...Sorry try again. :-(');
  //  this.toastr.info('Did you know? ...Your doing well. :-(');


    constructor( private protocol: ProtocolService, private toastr: ToastrService,
                 private notyfySvr: GlobalMessageNotificationService ) {
        if (EventBusService.initialized) {
            throw new Error('Only one vertx eventBus can exist per application.');
        }
        EventBusService.initialized = true;
    }

    get connected(): boolean {
////        console.log('checking connected');
////        console.log(this.state);
        return this.state === EventBusService.STATE_OPEN;
    }

    connect(url: string, defaultHeaders: any = null, options: any = {}): void {
//        console.log("connect is called");
        const pingInterval = options.vertxbus_ping_interval || 5000;
        let pingTimerID;

        this.defaultHeaders = {
                'Sec-WebSocket-Extensions': 'permessage-deflate'
            };
        this.defaultHeaders =  mergeHeaders(this.defaultHeaders, defaultHeaders);
        this.eventQueue = [];
        this.handlers = {};
        this.replyHandlers = {};
        this.sockJS = new SockJS(url, null, options);
        this.state = EventBusService.STATE_CONNECTING;

        const sendPing = () => {
            this.sockJS.send(JSON.stringify({type: 'ping'}));
        };

        this.sockJS.onopen = () => {
            // console.log('EventBus service open');
            this.state = EventBusService.STATE_OPEN;
            // Send the first ping then send a ping every pingInterval milliseconds
            sendPing();
            this.flushEventQueue();
            pingTimerID = setInterval(sendPing, pingInterval);
            this.open.emit(null);
        };

        this.sockJS.onclose = (e) => {
            // console.log('EventBus service closed');
            this.state = EventBusService.STATE_CLOSED;
            if (pingTimerID) {
              clearInterval(pingTimerID);
            }
            this.close.emit(null);
        };

        this.sockJS.onmessage = (e) => {
            const json = JSON.parse(e.data);

////            console.log('json recieved is: ');
////            console.log(json);
            if (json.type === 'err') {
                this.toastr.error('json recieved is ', JSON.stringify(json));
            } else {
                // this.toastr.warning('json recieved is ', JSON.stringify(json));
            }

            // Split handeling the message for the POC and for the production

            // send json message to the protocol for validate and parsing
            const parsedMessage = this.protocol.parseMessage(json);
//            console.log('The parsed json message is: ');
//            console.log(parsedMessage);
            // if we received a parsed message, we now have the json['data'] property
            if (parsedMessage) {
                const jsonBody = parsedMessage.body;
                const routing = jsonBody.routing;
                const status = jsonBody.status;
                const data = jsonBody.data;
//                console.log('printing all handlers');
//                console.log(this.handlers);
//                console.log('printing all reply handlers');
//                console.log(this.replyHandlers);

                // define a reply function on the message itself
                if (parsedMessage.replyAddress) {
                    Object.defineProperty(jsonBody, 'reply', {
                        value: function (message, headers, callback) {
                            this.send(parsedMessage.replyAddress, message, headers, callback);
                        }
                    });
                }

                if (this.handlers[parsedMessage.address]) {
                    // iterate all registered handlers
                    const handlers = this.handlers[parsedMessage.address];
                    for (let i = 0; i < handlers.length; i++) {
                        // console.log('sending json to handler ' + i + ' for address ' + routing.to);
                        if (status.description === 'err' || status.level === 1) {
                            handlers[i]({
                                failureCode: status.level,
                                failureType: status.description,
                                message: jsonBody
                            });
                            // this.toastr.error(status.description, jsonBody);
                            this.notyfySvr.setGlobalMessage(status.errors);
                        } else {
                            this.notyfySvr.setGlobalMessage([]);
                            handlers[i](null, data);
                        }
                    }
                } else if (this.replyHandlers[routing.to]) {
                    // Might be a reply message
//                     console.log('invoking reply handlers in address ' + routing.to );
                    const handler = this.replyHandlers[routing.to];
//                    console.log('got reply handler');
//                    console.log(handler);
                    delete this.replyHandlers[routing.to];
                    if (status.description === 'err' || status.level === 1) {
                        handler({
                            failureCode: status.level,
                            failureType: status.description,
                            message: jsonBody
                        });
                        // this.toastr.error(status.description, jsonBody);
                        this.notyfySvr.setGlobalMessage(status.errors);
                    } else {
////                        console.log('sending message to handler ' + JSON.stringify(data));
////                        console.log(data);
                        this.notyfySvr.setGlobalMessage([]);
                        handler(null, data);
                        // this.toastr.success(status.description, 'invoking reply handlers in address ' + routing.to );

                    }
                } else {
                    if (status.description === 'err' || status.level === 1 ) {
                        try {
                            // console.error(json);
                            this.notyfySvr.setGlobalMessage(status.errors);
                        } catch (e) {
                            //// dev tools are disabled so we cannot use console on IE
                        }
                    } else {
                        this.notyfySvr.setGlobalMessage([]);
                        try {
                            // console.warn('No handler found for message: ', json);
                            // this.toastr.error(status.description, 'No handler found for message: ', json);
                        } catch (e) {
                            //// dev tools are disabled so we cannot use console on IE
                        }
                    }
                }
            } else {
                // console.error('Failed to recieve parsed message from server');
                // this.toastr.error('Failed to recieve parsed message from server');
                // this.notyfySvr.setGlobalMessage('Failed to recieve parsed message from server');
            }

        };
    }

    disconnect() {
        // console.log(this.sockJS);
        if (this.sockJS) {
//             console.log('DISCONNECT');
            this.flushEventQueue();
            this.state = EventBusService.STATE_CLOSING;
            this.sockJS.close();
        }
        this.replyHandlers = {};
        this.handlers = {};
    }

    /**
     * Publish a message
     *
     * @param {String} address
     * @param {Object} body
     * @param {Object} [headers]
     */
    publish(address: string,
            body: any,
            headers?: any) {
        if (this.connected) {
            const message: any = {
                address: address,
                body: body,
                headers: mergeHeaders(this.defaultHeaders, headers),
                type: EventBusService.TYPE_PUBLISH
            };

            this.sockJS.send(JSON.stringify(message));
        } else {
            this.addEventToQueue({address, body, type: EventBusService.TYPE_PUBLISH});
        }
    }

    /**
     * Send a message
     *
     * @param {String} address
     * @param {Object} body
     * @param {Function} [replyHandler]
     * @param {Object} [headers]
     */
    send<T>(address: string,
            body: any,
            replyHandler?: Function,
            headers?: any): void {
        if (this.connected) {
//             console.log('eb connected');

            const message: any = {
                address: address,
                body: body,
                headers: mergeHeaders(this.defaultHeaders, headers),
                type: EventBusService.TYPE_SEND
            };

            if (replyHandler) {
                const replyAddress = makeUUID();
                message.replyAddress = replyAddress;
                this.replyHandlers[replyAddress] = replyHandler;
//                console.log(JSON.stringify(this.replyHandlers));
//                console.log(this.replyHandlers);
            }

//            console.log('sending msg');
//            console.log(JSON.stringify(message));


            // New Protocol message - Build the message before sending it on the sockJS event bus
            const protoclMessage = this.protocol.buildMessage(message);
////            console.log('sending msg 2');

////            console.log(JSON.stringify(protoclMessage));

            this.sockJS.send(JSON.stringify(protoclMessage));

//            this.sockJS.send(JSON.stringify(message));
        } else {
            this.addEventToQueue({address, handler: replyHandler, body, type: EventBusService.TYPE_SEND});
        }
    }

    /*sendWithTimeout<T>(address: string, message: any, timeout: number, replyHandler?: Function): EventBus {
     return this.eventBus.sendWithTimeout(address, message, replyHandler);
     };
     setDefaultReplyTimeout(millis: number): EventBus {
     return this.eventBus.setDefaultReplyTimeout(millis);
     };*/

    /**
     *
     * @param address
     * @param headers
     */
    register<T>(address: string,
                headers?: any): void {
        if (this.connected) {
            const envelope: any = {
                address: address,
                headers: mergeHeaders(this.defaultHeaders, headers),
                type: EventBusService.TYPE_REGISTER
            };

            this.sockJS.send(JSON.stringify(envelope));
        }
    }

    /**
     * Register a new handler
     *
     * @param {String} address
     * @param {Function} handler
     * @param {Object} [headers]
     */
    registerHandler<T>(address: string,
                       handler: Function,
                       headers?: any): void {
        if (this.connected) {
            // ensure it is an array
            if (!this.handlers[address]) {
                this.handlers[address] = [];
                // First handler for this address so we should register the connection
                this.register(address, headers);
            }

            this.handlers[address].push(handler);
            // console.log('Printing handlers');
            // console.log(this.handlers);
        } else {
            this.addEventToQueue({address, handler, type: EventBusService.TYPE_REGISTER_HANDLER});
        }
    }

    /**
     *
     * @param address
     * @param headers
     */
    unregister<T>(address: string,
                  headers?: any): void {
        if (this.connected) {
            const envelope: any = {
                address: address,
                headers: mergeHeaders(this.defaultHeaders, headers),
                type: EventBusService.TYPE_UNREGISTER
            };

            this.sockJS.send(JSON.stringify(envelope));
        }

        delete this.handlers[address];
    }

    /**
     * Unregister a handler
     *
     * @param {String} address
     * @param {Function} handler
     * @param {Object} [headers]
     */
    unregisterHandler<T>(address: string,
                         handler: Function,
                         headers?: any): void {
        if (this.connected) {
            const handlers = this.handlers[address];

            if (handlers) {
                const idx = handlers.indexOf(handler);
                if (idx !== -1) {
                    handlers.splice(idx, 1);
                    if (handlers.length === 0) {
                        // No more local handlers so we should unregister the connection
                        this.unregister(address, headers);
                    }
                }
            }
        } else {
            this.addEventToQueue({address, handler, type: EventBusService.TYPE_UNREGISTER});
        }
    }

    // PRIVATE

    private addEventToQueue(event) {
        if (!this.eventQueue) {
            return;
        }
        this.eventQueue.push(event);
        if (this.eventQueue.length > EventBusService.MAX_EVENT_QUEUE_SIZE) {
            // Remove oldest events from the queue
            this.eventQueue.splice(0, this.eventQueue.length - EventBusService.MAX_EVENT_QUEUE_SIZE);
        }
    }

    private flushEventQueue() {
        if (!this.connected) {
            return;
        }
        while (this.eventQueue.length > 0) {
            const event: QueuedEvent = this.eventQueue.shift();
            switch (event.type) {
                case EventBusService.TYPE_PUBLISH:
                    this.publish(event.address, event.body);
                    break;
                case EventBusService.TYPE_REGISTER_HANDLER:
                    this.registerHandler(event.address, event.handler);
                    break;
                case EventBusService.TYPE_UNREGISTER_HANDLER:
                    this.unregisterHandler(event.address, event.handler);
                    break;
                case EventBusService.TYPE_SEND:
                    this.send(event.address, event.body, event.handler);
                    break;
            }
        }
    }

}

interface QueuedEvent {
    address: string;
    body: any; // Only for PUBLISH/SEND events
    handler: Function; // Only for REGISTER/SEND events
    headers: any;
    type: string;
}

function makeUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a, b) {
        return b = Math.random() * 16, (a === 'y' ? b & 3 | 8 : b | 0).toString(16);
    });
}

function mergeHeaders(defaultHeaders, headers) {
    if (defaultHeaders) {
        if (!headers) {
            return defaultHeaders;
        }

        for (const headerName in defaultHeaders) {
            if (defaultHeaders.hasOwnProperty(headerName)) {
                // user can overwrite the default headers
                if (typeof headers[headerName] === 'undefined') {
                    headers[headerName] = defaultHeaders[headerName];
                }
            }
        }
    }

    // headers are required to be a object
    return headers || {};
}

