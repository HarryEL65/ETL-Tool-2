import { MediaQueriesService } from './../../../../services/media-queries.service';
import { GlobalMessageNotificationService } from './../../../../services/global-message-notification.service';
import { JsonValidateService } from '../../../../services/json-validate.service';
import { SideBarTogglerService } from '../../../../services/side-bar-toggler.service';
import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppEventBusService } from '../../../../app.event-bus.service';
import { ProtocolService } from '../../../../services/protocol.service';
import { Globals } from '../../../../utilities/globals';
import { AddAccountService } from '../../../../services/add-account.service';
import { EtlAuthenticationService } from '../../../../services/etl-authentication.service';
import { SecondLevelFilterService } from '../../../../services/second-level-filter.service';
import { DataBody } from '../../../../models/data-body';
import { Router } from '@angular/router';

@Component({
    selector: 'wp-etl-add-account-merchant',
    templateUrl: './add-account-merchant.component.html',
    styleUrls: ['./add-account-merchant.component.scss'],
    providers: [AddAccountService, SecondLevelFilterService]
})
export class AddAccountMerchantComponent implements OnInit, OnDestroy {

    // Variables for the framework request using the WebSockets
    private subscribed = false;

    // Component variables
    dataBody: DataBody = new DataBody();
    isManualSlctd;
    isActiveAcctSlctd;
    isJsonLikeSlctd = false;
    isMinimized;
    btnTxt = 'Add Account';
    isNewAffiliatesDataLoading = false;
    //   @Output() isJsonValid = new EventEmitter();
    isJsonValid = true;

    @ViewChild('modalTesting') private modalTesting;

    constructor(public authenticationService: EtlAuthenticationService,
        private jsonValidateSrv: JsonValidateService,
        private eventBusService: AppEventBusService,
        private addAccntSvr: AddAccountService,
        private sideBarService: SideBarTogglerService,
        public globals: Globals,
        public mdqSrv: MediaQueriesService,
        public router: Router) { }

    // Add account as the parent component for all the child components:
    // (second-level-filter, choose-population, choose-configuration, choose-dates)
    // Will be responsible for the connection to the WebSocket and for providing the addAccountService
    ngOnInit() {
        this.isMinimized = this.sideBarService.getSideBarToggledState();
        this.sideBarService.change.subscribe(isMinimized => {
            this.isMinimized = isMinimized;
        });


        this.jsonValidateSrv.change.subscribe(isValid => {
            this.isJsonValid = isValid;
        });

        if (this.eventBusService.connected === true) {
            this.initPage();

        } else {
            this.eventBusService.connect(() => {
            this.initPage();
          });
        }
    }

    ngOnDestroy() {
        this.subscribed = false;
        this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
        this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
        this.addAccntSvr.addAccountEvent.unsubscribe();
        this.eventBusService.disconnect();
    }

    // Reset the previous manual accounts selected after each new affiliate selection
    affiliateChange($event) {
        this.dataBody.setAccounts([]);
        this.isManualSlctd = false;
    }

    isLoading($event) {
        this.isNewAffiliatesDataLoading = $event;
    }

    manualAccountsSelected($manualAccnts) {
        this.dataBody.setAccounts($manualAccnts);
        this.isManualSlctd = this.dataBody.accounts.length > 0 ? true : false;
    }
    activeAccountSelected($activeAccnts) {
        this.dataBody.setAccounts($activeAccnts);
        this.isActiveAcctSlctd = this.dataBody.accounts.length > 0 ? true : false;
    }


    jsonLikeSelected($jsonLike) {
        let jsonLikeConfig;
        let recordType;
        if ($jsonLike && $jsonLike !== 'doReset') {
            $jsonLike.config ? $jsonLike.config = $jsonLike.config : $jsonLike.config = $jsonLike.jsonSlctn.config;
            $jsonLike.recordType ? $jsonLike.recordType = $jsonLike.recordType : $jsonLike.recordType = $jsonLike.jsonSlctn.recordType;
            jsonLikeConfig = $jsonLike.config;
            recordType = $jsonLike.recordType;
        }
        this.dataBody.setConfig(jsonLikeConfig);
        this.dataBody.setRecordType(recordType);
        if (this.dataBody.accounts.length === 0) {
            // this scenario is reached when no  json likes are retrieved for the selected affiliated
            // and we are in new json template mode
            this.isJsonLikeSlctd = true;
            // we set by default isJsonValid as false since we are creating from scratch the json 
        }

        this.isJsonLikeSlctd = this.dataBody.config && (this.dataBody.accounts.length) > 0 ? true : false;
        // we set by default isJsonValidd as true since we are receiving the json from server
    }

    private initPage(): void {

        // TODO: add code for register handlers to changed events
        if (this.subscribed === false) {
            this.subscribed = true;
            this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {
        });
        this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
                // console.log(error);
                // console.log('New message arrived ' + JSON.stringify(msg));
            });

        } else {
            // console.log('Already subscribed');
        }
    }


    addAccount() {
        this.modalTesting.openModal();
    }

    testAccounts() {
        this.addAccntSvr.addAccountEvent.subscribe(res => {
            // console.log('recieved message from add account: ');
            // console.log(res);
        });

        this.addAccntSvr.addAccount(this.dataBody);

    }

    addMoreAccount($event) {

    }

    // Subscribe to jsonLikelist Event - will be invoked when choose-population calls it
    updateJsonLikeList($event) {
        this.addAccntSvr.initPopulateTable($event);
    }

}
