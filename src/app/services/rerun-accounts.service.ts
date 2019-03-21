import { Injectable, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';

@Injectable()
export class RerunAccountsService implements OnDestroy {

  isOpen = false; // test should remove
  // affiliates = null;
  // manulaAccnts = null;

  @Output() change: EventEmitter<boolean> = new EventEmitter(); // test should remove
  // @Output() getJsonLikeList = new EventEmitter();
  @Output() rerunAccountEvent = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService) { }

  ngOnDestroy(): void {
      // console.log('Remove active account service Destroy');
  }

  // testChangeRecordType() {
      
  //     this.isOpen = true;

  //     this.change.emit(this.isOpen);
  // }

  // fetch the change record type Table
  initActiveAccountsTable(affiliate_prog) {
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
          // console.log(message);
          // this.getJsonLikeList.emit(message);
        }
      });
  }

  rerunAccounts(data, id ?) {
        const route = this.globals.SrvRoute.RERUN_ACTV_ACCNT;
        const body = {
            'reportType': this.globals.reportIds[id],
            'accounts': data.accounts , // <= accounts array same representation as what you get from the above MANUAL_ACCOUNTS output
            'fromDate': data.fromDate,      // dd/MM/yyyy
            'toDate':   data.toDate           // dd/MM/yyyy
        };
        this.eventBusService.send(route, body, (error, message) => {
          if (error) {
            // console.error('Error: ' + route);
            return;
          }
          if (message) {
           // console.log('Rerun Accounts succesfully: ');
           // console.log(message);

          }
        });
  }

}
