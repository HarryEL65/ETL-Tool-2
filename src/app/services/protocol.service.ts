import { Injectable } from '@angular/core';
import { SchemaValidatorService } from "./schema-validator.service";
import { Message } from "../models/message.model";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class ProtocolService {

    message: Message;

    // We use the messages array to keep track on all the SEND messages we build for the WebSockets
    // By keeping this track we can ensure each sent message can return to it's original reply Handler
    private messages: any = {}; 

    constructor(private schemaValidator: SchemaValidatorService, private jwtHelper: JwtHelperService) { 
    }
    
    // Builds a new Message and add it to the messages array
    buildMessage(message: any){
//        console.log("Protocol recieved the following message: ");
//        console.log(message);
        const decoded = this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());
        
        this.message = new Message();
        
        // ensure it is an array
        if(!this.messages[message.replyAddress]){
            this.messages[message.replyAddress] = [];
        }
        
        // SockJS must have this fields for a message to be sent in the WebSockets event bus
        this.message.address = message.address;
        this.message.body.data = message.body;
        this.message.replyAddress = message.replyAddress;
        this.message.headers = message.headers;
        
        // Application Additional fields for message protocol
        this.message.body.routing.to = message.address;
        this.message.body.routing.from = message.replyAddress;
        this.message.type = message.type;
        
        // Set the user details - username and token to each message
        this.message.body.user.username = decoded.user.username;
        this.message.body.user.token = decoded.user.token;
        
       
        this.messages[message.replyAddress].push(this.message);
        
//        console.log(this.message);
//        
//        console.log("The Messages array is: ");
//        console.log(this.messages);
//        console.log(this.messages[message.replyAddress]);
        
        return this.message;
        
    }
    
    // Prepare the message to be returned to the client according to the Reply Address
    parseMessage(json){
//        console.log("Inside Parse message: ");
//        console.log(json);
        // Messages received from the server should be on the same structure, so if the schema is valid
        // we only need to return the message
        if(this.schemaValidator.validateSchema(json.body)){
            // return the current message by it's reply Address
//            console.log(this.messages);
            if(typeof this.messages[json.address] === 'undefined'){
                return json;
            } else {
//                console.log(this.messages[json.address]);
                const currMessage = this.messages[json.address][0];
                
                currMessage.body = json.body; // update the body of the message to return
                currMessage.body.routing.to = currMessage.replyAddress; // update the reply address
//                console.log("The message to return is: ");
//                console.log(currMessage);
                return currMessage;
            }
           
        } else {
            console.error("Failed to set Message, JSON Schema is invalid");
            return false;
        }
    }

}
