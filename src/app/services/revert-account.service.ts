import { Injectable, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';

@Injectable()
export class RevertAccountService implements OnDestroy {

  @Output() revertAccountEmitter = new EventEmitter();
  @Output() pendingAcceptentceEmitter = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService) { }

  ngOnDestroy(): void {
      // console.log('revert account service destroy');
  }

  revertAccount(accId) {
      const route = this.globals.SrvRoute.RVRT_ACCNT;

      // tslint:disable-next-line:max-line-length
      this.eventBusService.send(route, { 'accID': accId, 'reportType': this.globals.reportIds['MERCHANT_DATA'], 'publish_address': 'ACCOUNTS_CHANGES' } , (error, message) => {
          // Return direct reply to caller - home component, will activate the loading indicator
          this.revertAccountEmitter.emit();

          if (error) {
              // console.error('Error getting Revert Account', error);
              // Return the error message to the pending acceptance wizard
              this.pendingAcceptentceEmitter.emit(true);
              return;
          }
          if (message) {
              // console.log('recieved reply from RevertAccountService : ');
              // console.log(message);
              // If needed we can return a direct reply to the caller - Home compoentn
              // But we use the account changes to do the update
//              const reply = { 'accID': accId, 'toStatus': 'canceled' }

          }
      });
  }

}
