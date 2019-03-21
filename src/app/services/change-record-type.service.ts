import { Injectable, Output, EventEmitter } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';
import { Message } from '../models/message.model';


@Injectable({
  providedIn: 'root'
})
export class ChangeRecordTypeService {

  isOpen = false; // test should remove
  message: Message = new Message();
  
  
  @Output() change: EventEmitter<boolean> = new EventEmitter(); // test should remove
  
  @Output() rerunAccountEvent = new EventEmitter();

  @Output() changeRecorsdResultSet = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService) { }


  changeRecordType(data, id ?) {
        const route = this.globals.SrvRoute.CHNG_RCRD_TYPE;
        const body = {
            'reportType': this.globals.reportIds[id],
            'accounts': data.accounts ,         
            'recordType': data.recordType,      
            'startDate':   data.fromDate      
        };
        this.eventBusService.send(route, body, (error, message) => {
          if (error) {
            console.error('Error: ' + route);
            console.error(error);
            this.changeRecorsdResultSet.emit(error.message);
            return;
          }
          if (message) {
//              console.log(message);
            this.message.body.data = message;
            this.changeRecorsdResultSet.emit(this.message.body);
            return;
          }
        });
  }

}
