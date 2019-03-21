import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';

@Injectable()
export class UpdateActiveAccountsService implements OnDestroy {

  @Output() updateActiveAccountsEvent = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService) { }

  ngOnDestroy(): void {
    // console.log('Update active account service Destroy');
  }

  updateActiveAccounts(data) {
    // console.log('Edit Active account send WebSocket');
    // TODO: verify that the path (UPDATE_ACTIVE_ACCOUNT) is the correct one on the server
    const route = this.globals.SrvRoute.UPDATE_ACCNT_CONFIG;
    const body = {
        'send_email': false,
        'recipiants': '',
        'reportType': this.globals.reportIds['MERCHANT_DATA'],
        'accounts': data.accounts , // <= accounts array same representation as what you get from the above MANUAL_ACCOUNTS output
    };
    this.eventBusService.send(route, body, (error, message) => {
      if (error) {
          // console.error('Error: ' + route);
          return;
      }
      if (message) {
         // console.log('Update Active Accounts  successfully : ');
         // console.log(message);
      }
    });
  }

}
