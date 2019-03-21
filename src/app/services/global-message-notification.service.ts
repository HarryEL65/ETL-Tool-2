import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class GlobalMessageNotificationService {

@Output() notifyMessgEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  setGlobalMessage(msg) {
    this.notifyMessgEvent.emit(msg);
  }

}
