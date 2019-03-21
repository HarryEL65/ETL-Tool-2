import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';


@Injectable()
export class AddAccountService implements OnDestroy  {

  isOpen = false; // test should remove
  affiliates = null;
  manulaAccnts = null;

  @Output() change: EventEmitter<boolean> = new EventEmitter(); // test should remove
  @Output() getJsonLikeList = new EventEmitter();
  @Output() addAccountEvent = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService) { }

  ngOnDestroy(): void {
      // console.log('Add account OnDestroy service');
  }

  testAddAccount() {
      // console.log('AddAccountService');
      this.isOpen = true;
      this.change.emit(this.isOpen);
  }

  // Get the json-like-list
  initPopulateTable(affiliate_prog) {
      // console.log(affiliate_prog);
      const val = affiliate_prog;
      affiliate_prog = Number(affiliate_prog.Id);

      const route = this.globals.SrvRoute.ACTIVE_ACCNTS;
      this.eventBusService.send(route, {
        'reportType': this.globals.reportIds['MERCHANT_DATA'],
        'affiliateProgramID': affiliate_prog // TODO: should get it from Second Level Filter
      }, (error, message) => {
        if (error) {
          // console.error('Error getting accntsLikeJson', error);
          return;
        }
        if (message) {
          // return the message to the json-like-list
          this.getJsonLikeList.emit(message);
        }
      });
  }

  addAccount(data) {
       console.log('data.config', data.config);
        const route = this.globals.SrvRoute.ADD_ACCNT;
        this.eventBusService.send(route, {
          'reportType': this.globals.reportIds['MERCHANT_DATA'],
          'recordType': data.recordType, // monthly, daily, daily-monthly
          'accounts': data.accounts , // <= accounts array same representation as what you get from the above MANUAL_ACCOUNTS output
          'config':   data.config ,     // <= <the chosen config json object>
          'fromDate': data.fromDate,      // dd/MM/yyyy
          'toDate':   data.toDate
        }, (error, message) => {
          if (error) {
              // console.error('Error: ' + route);
              return;
          }
          if (message) {
              // console.log('account added succesfully : ');
              // console.log(message);
              this.addAccountEvent.emit(message);
          }
        });
  }

}
