import { MediaQueriesService } from './../../../services/media-queries.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EtlAuthenticationService } from '../../../services/etl-authentication.service';
import { AppEventBusService } from '../../../app.event-bus.service';
import { SecondLevelFilterService } from '../../../services/second-level-filter.service';
import { RerunAccountsService } from '../../../services/rerun-accounts.service';
import { DataBody } from '../../../models/data-body';
import { SideBarTogglerService } from '../../../services/side-bar-toggler.service';
import { Globals } from '../../../utilities/globals';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'wp-etl-reruns-merchant',
  templateUrl: './reruns-merchant.component.html',
  styleUrls: ['./reruns-merchant.component.scss'],
  providers: [SecondLevelFilterService, RerunAccountsService]
})
export class RerunsMerchantComponent implements OnInit, OnDestroy {

  // Variables for the framework request using the WebSockets
  private subscribed = false;

  // Component variables
  dataBody: DataBody = new DataBody();
  isManualSlctd = false;
  isJsonLikeSlctd;
  btnText = 'Rerun';
  isMinimized;

  hasDatesPermission = false;
  hasPermission = false;

  @ViewChild('modalRerun') private modalRerun;

  constructor(public authenticationService: EtlAuthenticationService,
              public rerunActSvr: RerunAccountsService,
              private eventBusService: AppEventBusService,
              private sideBarService: SideBarTogglerService,
              public globalService: Globals,
              public mdqSrv: MediaQueriesService) { }

  // Reruns account as the parent component for all the child components:
  // (second-level-filter, choose-population, choose-dates)
  // Will be responsible for the connection to the WebSocket and for providing the addAccountService
  ngOnInit() {
    this.isMinimized = this.sideBarService.getSideBarToggledState();
      // console.log('Add Reruns init page');
    this.sideBarService.change.subscribe(isMinimized  => {
    this.isMinimized  = isMinimized ;
    });

    if (this.eventBusService.connected === true ) {
        // console.log('init page without connect');
        this.initPage();

    } else {
        // console.log('RERUNS CONNECT');
        this.eventBusService.connect( () => {
            // console.log('init page after connect');
            this.initPage();
        });
    }
      // call Function to set if has permission to rerun account but not for Merchant Users
      this.checkPermission();
  }

  private initPage(): void {
    if (this.subscribed === false) {
        // console.log('subscribing to ACCOUNTS_CHANGES Address');
        this.subscribed = true;
        this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {
            // console.log(error);
            // console.log('New message arrived ' + JSON.stringify(msg));
        });
        // console.log('subscribing to HEALTHCHECK_STATUS_CHANGE Address');
        this.subscribed = true;
        this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
            // console.log(error);
            // console.log('New message arrived ' + JSON.stringify(msg));
        });

    } else {
        // console.log('Already subscribed');
    }
  }

  ngOnDestroy() {
    // console.log('rerun-account Destroy was called');
    this.subscribed = false;
    this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
    this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
    this.rerunActSvr.rerunAccountEvent.unsubscribe();
    this.eventBusService.disconnect();
  }

  // Reset the previous manual accounts selected after each new affiliate selection
  affiliateChange($event) {
      this.dataBody.setAccounts([]);
      this.isManualSlctd = false;
  }

  activeAccountsSelected($activeAccounts) {
      // console.log('/*---------- choose Population Comp. --------------*/');
      // console.log('those are the "active accounts" selected ', $activeAccounts);
      this.dataBody.setAccounts($activeAccounts);
      this.isManualSlctd = this.dataBody.accounts.length > 0 ? true : false;
  }

  rerunAccounts() {
      // console.log('---rerun account click---');
      // console.log(this.dataBody);

    // subscribe to the add account event
    this.rerunActSvr.rerunAccountEvent.subscribe(res => {
       // console.log('recieved message from rerun account: ');
       // console.log(res);
    });
    this.rerunActSvr.rerunAccounts(this.dataBody, 'MERCHANT_DATA');
  }

  resetSelectedAccounts() {
      this.dataBody.accounts = [];
  }

  openRerunModal() {
      this.modalRerun.openModal();
  }

  // sets the Date Permission to activate a rerun
  setDatesPermission(val: boolean) {
      this.hasDatesPermission = val;
  }

  // sets the Permission to activate a rerun without taking role in consideration
  setPermission(val: boolean) {
      this.hasPermission = val;
  }

  // Check if the user have permission for "RERUN" and if the user is from type "Merchant"
  // Users of type Merchant are not allowed to perform "RERUNS" on more than the last two months
  // hence the permission will be set to "false"
  checkPermission() {

      let currPermission;
      let currRole;

      forkJoin(
              this.authenticationService.hasPermission('rerun_account'),
              this.authenticationService.hasRole(['merchant'])
      )
      .subscribe(([hasPermission, hasRole]) => {
         currPermission = hasPermission ? true : false;
         currRole = hasRole ? true : false;

         this.setDatesPermission(currPermission && !currRole);
         this.setPermission(currPermission);
      });

  }

}
