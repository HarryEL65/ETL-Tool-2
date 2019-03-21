import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';


@Injectable()
export class RemoveActiveAccountService implements OnDestroy {

  isOpen = false; // test should remove
  // affiliates = null;
  // manulaAccnts = null;

  @Output() change: EventEmitter<boolean> = new EventEmitter(); // test should remove
  // @Output() getJsonLikeList = new EventEmitter();
  @Output() removeAccountEvent = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService) { }

  ngOnDestroy(): void {
      // console.log('Remove active account service Destroy');
  }

  testRemoveActiveAcount() {
      // console.log('RemoveActiveAccountService');
      this.isOpen = true;

      this.change.emit(this.isOpen);
  }

  // Get the json-like-list
  initActiveAccountsTable(affiliate_prog) {
      // console.log(affiliate_prog);
      const val = affiliate_prog;
      affiliate_prog = Number(affiliate_prog.Id);

      const route = this.globals.SrvRoute.ACTIVE_ACCNTS;
      this.eventBusService.send(route, {
        'send_email': false,
        'recipiants': '',
        'reportType': this.globals.reportIds['MERCHANT_DATA'],
        'affiliateProgramID': affiliate_prog // TODO: should get it from Second Level Filter
      }, (error, message) => {
        if (error) {
          // console.error('Error getting accntsLikeJson', error);
          return;
        }
        if (message) {
          // return the message to the json-like-list
          // this.getJsonLikeList.emit(message);
          // console.log(message);
        }
      });
  }

  removeAccounts(data) {
      // console.log('Remove Active account send WebSocket');
        const route = this.globals.SrvRoute.RMV_ACTV_ACCNT;
        const body = {
            'send_email': false,
            'recipiants': '',
            'reportType': this.globals.reportIds['MERCHANT_DATA'],
            'accounts': data.accounts , // <= accounts array same representation as what you get from the above MANUAL_ACCOUNTS output
        };
        this.eventBusService.send(route, body, (error, message) => {
          if (error) {
            // console.error('Error: ' + route);
            return error;
          }
          if (message) {
           // console.log('Active Accounts removed successfully : ');
           // console.log(message);
           this.initActiveAccountsTable(data.accounts);
           return message;
          }
        });
  }

}
