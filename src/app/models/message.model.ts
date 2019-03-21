export class Status {
    level: number;
    description: string;

    constructor() {
        this.level = 0;
        this.description = '';
    }
}

export class Routing {
    to: string;
    from: string;

    constructor() {
        this.to = '';
        this.from = '';
    }
}

export class User {
    username: string;
    token: any;

    constructor() {
        this.username = '';
        this.token = {};
    }
}

// Application level data will be passed in the Body of the message
export class Body {
    status: Status;
    routing: Routing;
    data: any;
    id: any;
    user: User;
    version: string;
    type: string;

    constructor(){
        this.status = new Status();
        this.routing = new Routing();
        this.data = {};
        this.id = "";
        this.user = new User();
        this.version = "1.0";
        this.type = "send";
    }
}

//SockJS message fields - address, body, replyAddress, headers and type are must in order to send message successfully
export class Message {
    address: string;
    body: Body;
    status: Status;
    routing: Routing;
    replyAddress: string;
    headers: any;
    type: string;

    constructor(){
        this.address = "";
        this.body = new Body();
        this.replyAddress = "";
        this.headers = "";
        this.type = "";
    }
}