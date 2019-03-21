import { Injectable } from '@angular/core';
import * as Ajv from 'ajv';

var ajv = new Ajv();

@Injectable()
export class SchemaValidatorService {

    private schema = {
            "$id": "http://example.com/example.json",
            "type": "object",
            "definitions": {},
            "properties": {
              "status": {
                "$id": "/properties/status",
                "type": "object",
                "properties": {
                  "level": {
                    "$id": "/properties/status/properties/level",
                    "type": "integer",
                    "title": "The Level Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": 0,
                    "examples": [
                      0
                    ]
                  },
                  "description": {
                    "$id": "/properties/status/properties/description",
                    "type": "string",
                    "title": "The Description Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      "success"
                    ]
                  }
                },
                "required": [
                  "level"
                ]
              },
              "routing": {
                "$id": "/properties/routing",
                "type": "object",
                "properties": {
                  "to": {
                    "$id": "/properties/routing/properties/to",
                    "type": "string",
                    "title": "The To Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      "to_queue"
                    ]
                  },
                  "from": {
                    "$id": "/properties/routing/properties/from",
                    "type": "string",
                    "title": "The From Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      "from_queue"
                    ]
                  }
                },
                "required": [
                  "to",
                  "from"
                ]
              },
              "data": {
                "$id": "/properties/data",
                "type": "object",
                "properties": {
                  "param1": {
                    "$id": "/properties/data/properties/param1",
                    "type": "string",
                    "title": "The Param1 Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      "data1"
                    ]
                  },
                  "param2": {
                    "$id": "/properties/data/properties/param2",
                    "type": "string",
                    "title": "The Param2 Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      "data2"
                    ]
                  }
                }
              },
              "type": {
                "$id": "/properties/type",
                "type": "string",
                "title": "The Type Schema",
                "description": "An explanation about the purpose of this instance.",
                "default": "",
                "examples": [
                  "send"
                ]
              },
              "id": {
                "$id": "/properties/id",
                "type": "string",
                "title": "The Id Schema",
                "description": "An explanation about the purpose of this instance.",
                "default": "",
                "examples": [
                  "id"
                ]
              },
              "user": {
                "$id": "/properties/user",
                "type": "object",
                "properties": {
                  "username": {
                    "$id": "/properties/user/properties/username",
                    "type": "string",
                    "title": "The Username Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      ""
                    ]
                  },
                  "token": {
                    "$id": "/properties/user/properties/token",
                    "type": "string",
                    "title": "The Sessionid Schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                      "abcde"
                    ]
                  }
                },
                "required": [
                  "username"
                ]
              },
              "version": {
                "$id": "/properties/version",
                "type": "string",
                "title": "The Version Schema",
                "description": "An explanation about the purpose of this instance.",
                "default": "1.0",
                "examples": [
                  "10.100000381469727"
                ]
              }
            },
            "required": [
              "status",
              "routing",
              "type",
              "id",
              "user",
              "version",
            ]
            };
      
    private validate = ajv.compile(this.schema);
    private errrorLog;

    constructor() { }
    
    validateSchema(data){
//        console.log(data);
        var valid = this.validate(data);
        if (valid) {
//            console.log("Valid!");
            return data;
        } else {
            // console.log('Invalid: ' + ajv.errorsText(this.validate.errors));
            this.errrorLog = ajv.errorsText(this.validate.errors);
            return false;
        }
    };
    
    getErrorLog(){
        return this.errrorLog;
    }

}
