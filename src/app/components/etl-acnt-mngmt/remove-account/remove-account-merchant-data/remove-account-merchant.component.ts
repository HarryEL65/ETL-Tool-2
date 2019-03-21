import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppEventBusService } from '../../../../app.event-bus.service';
import { ProtocolService } from '../../../../services/protocol.service';
import { Globals } from '../../../../utilities/globals';
import { RemoveActiveAccountService } from '../../../../services/remove-active-account.service';
import { EtlAuthenticationService } from '../../../../services/etl-authentication.service';
import { SecondLevelFilterService } from '../../../../services/second-level-filter.service';
import { SideBarTogglerService } from '../../../../services/side-bar-toggler.service';
import { MediaQueriesService } from '../../../../services/media-queries.service';

@Component({
  selector: 'wp-etl-remove-merchant.account',
  templateUrl: './remove-account-merchant.component.html',
  styleUrls: ['./remove-account-merchant.component.scss'],
  providers: [RemoveActiveAccountService, SecondLevelFilterService]
})
export class RemoveAccountMerchantComponent implements OnInit, OnDestroy {

  dataBody = {
    accounts: [],
    // reportType: 'MerchantData'
    reportType: this.globals.reportIds['MERCHANT_DATA']
  };

  // Variables for the framework request using the WebSockets
  private subscribed = false;
  isRmvBtnDisabled;
  isJsonLikeSlctd;
  isMinimized;

  @ViewChild('modalRemove') private modalRemove;

  constructor( public authenticationService: EtlAuthenticationService,
               private eventBusService: AppEventBusService,
               private rmvActiveAccntSrv: RemoveActiveAccountService,
               private sideBarService: SideBarTogglerService,
               public globals: Globals,
               public mdqSrv: MediaQueriesService,
               public router: Router
              //  private secondLevelFilterService: SecondLevelFilterService
              ) { }


  // Remove Active account as the parent component for all the child components
  // Will be responsible for the connection to the WebSocket

  ngOnInit() {
    this.isMinimized = this.sideBarService.getSideBarToggledState();
    // console.log('Remove Account init page');

    this.sideBarService.change.subscribe(isMinimized  => {
      this.isMinimized  = isMinimized ;
    });


    if (this.eventBusService.connected === true ) {
        // console.log('init page without connect');
        this.initPage();

    } else {
        this.eventBusService.connect( () => {
            // console.log('init page after connect');
            this.initPage();
        });
    }
  }

  ngOnDestroy() {
      // console.log('Destroy was called');
      this.subscribed = false;
      this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
      this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
      this.rmvActiveAccntSrv.removeAccountEvent.unsubscribe();
      this.eventBusService.disconnect();
  }

  private initPage(): void  {

    // TODO: add code for register handlers to changed events
    if (this.subscribed === false) {
        // console.log('subscribing to ACCOUNTS_CHANGES Address');
        // console.log('subscribing to HEALTHCHECK_STATUS_CHANGE Address');

        this.subscribed = true;
        this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {
            // console.log(error);
            // console.log('New message arrived ' + JSON.stringify(msg));
        });
        this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
            // console.log(error);
            // console.log('New message arrived ' + JSON.stringify(msg));
        });
    } else {
        // console.log('Already subscribed');
    }
  }

  public removeActiveAcount() {
    // this.rmvActiveAccntSrv.removeAccounts(this.dataBody);
    this.modalRemove.openModal();
  }

  test(message) {
    // console.log('The parent component recieved the following message from its modal: ');
    // console.log(message);
  }

  affiliateChange($event) {
    // after every new selection in the affiliate
    // reset the previous manual accounts selected;
    this.dataBody.accounts = [];
  }

  removeAccounts() {
    // subscribe to the add account event
    this.rmvActiveAccntSrv.removeAccountEvent.subscribe(res => {
       // console.log('recieved message from remove account: ');
       // console.log(res);
      });
    const data = this.rmvActiveAccntSrv.removeAccounts(this.dataBody);
    // console.log(data);
  }

  manualAccountsSelected($manualAccnts) {
    // console.log('/*---------- choose Populattion Comp. --------------*/');
    // console.log('those are the "manual accounts" selected ', $manualAccnts);
    this.dataBody.accounts = $manualAccnts;
    this.isRmvBtnDisabled = this.dataBody.accounts.length > 0 ? true : false;
  }

}
