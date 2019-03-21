import { Injectable } from '@angular/core';
import { EventBusService } from './services/event-bus.service';
import { environment } from '../environments/environment';
import { JwtHelperService  } from '@auth0/angular-jwt';

@Injectable()
export class AppEventBusService {

    private currentUser: string;

    constructor(private eventBusService: EventBusService,
                private jwtHelper: JwtHelperService) {
    }

    connect(onOpen: Function) {
        if (this.jwtHelper.isTokenExpired()) {
        //    console.log('AppEventBusService.connect - JWT expired cant connect to event bus');
           return;
        }
        if (!this.enabled) {
        //   console.log('AppEventBusService.connect - Disabled ');
        }

        if (this.connected) {
        //   console.log('AppEventBusService.connect - Already connected ');
          onOpen();
          return;
        }

        // Subscribe to close event
        this.eventBusService.close.subscribe(() => {
            // console.log('AppEventBusService.close');
//             onClose();

        });
        // Subscribe to open event
        this.eventBusService.open.subscribe(() => {
            onOpen();
        });
        // Connect
        // console.log('AppEventBusService.connect ' + environment.eventBusURL);
        this.eventBusService.connect(environment.eventBusURL, this.buildHeaders());
    }

    disconnect() {
        this.eventBusService.disconnect();
    }

    get connected(): boolean {
        return this.eventBusService.connected;
    }

    get enabled(): boolean {
        return environment.eventBusURL && environment.eventBusURL !== '';
    }

    // /**
    //  *
    //  */
    // initializeCounter() {
    //     if (!this.enabled) return;
    //     if (this.connected) {
    //         let body: any = {};
    //         this.eventBusService.send('counter::total', body, (error, message) => {
    //             if (message && message.body) {
    //                 message.body;
    //             }
    //             if (error) {
    //                 console.error(error);
    //             }
    //         });
    //     }
    // }


    send(eventBusAddress: string, body: any, handler: Function) {
      this.eventBusService.send(eventBusAddress, body, handler);
    }

    /**
     *
     * @param eventBusAddress
     */
    subscribeToActions(eventBusAddress: string, handler: Function) {
        if (!this.enabled) {
          return;
        }
        this.eventBusService.registerHandler(eventBusAddress, handler);
    }

    /**
     *
     * @param eventBusAddress
     */
    unsubscribeHandlerFromActions(eventBusAddress: string, handler: Function) {
        if (!this.enabled) {
          return;
        }
        this.eventBusService.unregisterHandler(eventBusAddress, handler);
    }

    unsubscribeFromActions(eventBusAddress: string) {
        if (!this.enabled) {
          return;
        }
        this.eventBusService.unregister(eventBusAddress);
    }


    // PRIVATE

    private buildHeaders() {
        // TODO Authentication header
        return {
            currentUser: this.currentUser
        };
    }

}
