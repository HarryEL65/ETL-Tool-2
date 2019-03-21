import { MediaQueriesService } from './../../../../../services/media-queries.service';
import { Globals } from './../../../../../utilities/globals';
import { AppEventBusService } from '../../../../../app.event-bus.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EtlAuthenticationService } from '../../../../../services/etl-authentication.service';
import { UpdateActiveAccountsService } from '../../../../../services/update-active-accounts.service';
import { SecondLevelFilterService } from '../../../../../services/second-level-filter.service';
import { DataBody } from '../../../../../models/data-body';
import { SideBarTogglerService } from '../../../../../services/side-bar-toggler.service';


/**
 * 
 * 
 * @export
 * @class UpdateAccountMerchantComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'wp-etl-update-account-merchant',
    templateUrl: './update-account-merchant.component.html',
    styleUrls: ['./update-account-merchant.component.scss'],
    providers: [UpdateActiveAccountsService, SecondLevelFilterService]

})
export class UpdateAccountMerchantComponent implements OnInit, OnDestroy {

    /**
    * *-------------
    * !   Variables
    * *-------------
    * @memberOf UpdateAccountMerchantComponent
    */

    private subscribed = false;
    dataBody: DataBody = new DataBody();
    isMinimized;
    isUpdateBtnEnabled;
    isActiveAcountSlctd;
    hasPermission = false;

    constructor(public authenticationService: EtlAuthenticationService,
        private eventBusService: AppEventBusService,
        private updActiveAccntSrv: UpdateActiveAccountsService,
        private sideBarService: SideBarTogglerService,
        public globals: Globals,
        public mdqSrv: MediaQueriesService) { }

    /**  
    *   ?----------------------
    *   ? LIFE CYCLE FUNCTIONS 
    *   ?---------------------
    */

    /**
     *  * --------------
     *  !    ngOnInit: 
     *  * --------------
     * 
     *  This event initializes after Angular first displays the data-bound properties
     *  or when the component has been initialized. This event is basically called only after the ngOnChanges()events.
     *  This event is mainly used for the initialize data in a component
     * 
     *  @memberOf AccountMerchantComponent
     */        

    ngOnInit() {
        this.isMinimized = this.sideBarService.getSideBarToggledState();
        // console.log('Update Account init page');
        this.sideBarService.change.subscribe(isMinimized => {
            this.isMinimized = isMinimized;
        });

        if (this.eventBusService.connected === true) {
            // console.log('init page without connect');
            this.initPage();
        } else {
            this.eventBusService.connect(() => {
                // console.log('init page after connect');
                this.initPage();
            });
        }

        this.authenticationService.hasPermission('edit_account').subscribe(res => {
            if (res) {
                this.setPermission(true);
                return;
            } else {
                this.setPermission(false);
                return;
            }
        });
    }

    /**
     * *----------------
     * !  ngOnDestroy  
     * *---------------
     * 
     * This method will be executed just before Angular destroys the components.
     * This method is very useful for unsubscribing from the observables and detaching the event handlers
     * to avoid memory leaks. Actually, it is called just before the instance of the component is finally destroyed.
     *  This method is called just before the component is removed from the DOM.
     * 
     * @memberOf UpdateAccountMerchantComponent
     */
    ngOnDestroy() {
        // console.log('Destroy was called');
        this.subscribed = false;
        this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
        this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
        this.updActiveAccntSrv.updateActiveAccountsEvent.unsubscribe();
        this.eventBusService.disconnect();
    }

    /**  
    *   ?---------------------------------------------------------------------------------------
    */

    /**
     * *-----------------------
     * !   affiliateChange
     * *-----------------------
     * Reset the previous manual accounts selected after each new affiliate selection
     * 
     * @param {any} $event 
     * 
     * @memberOf UpdateAccountMerchantComponent
     */
    affiliateChange($event) {
        this.dataBody.setAccounts([]);
    }

    /**
     * 
     * *-----------------------
     * !   initPage
     * *-----------------------
     * @private
     * 
     * @memberOf UpdateAccountMerchantComponent
     */
    private initPage(): void {
        // TODO: add code for register handlers to changed events
        if (this.subscribed === false) {
            this.subscribed = true;
            this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {
                // console.log(error);
            });
            this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
                // console.log(error);
            });
        } else {
            // console.log('Already subscribed');
        }
    }

    /**
     * *-----------------------
     * !   initPage
     * *-----------------------
     * 
     * @param {any} $activeAccnts 
     * 
     * @memberOf UpdateAccountMerchantComponent
     */
    activeAccountsSelected($activeAccnts) {
        this.dataBody.setAccounts($activeAccnts);
        this.isUpdateBtnEnabled = this.dataBody.accounts.length > 0 && this.hasPermission ? true : false;
    }

    /**
     * *-----------------------
     * !   updateActiveAcount
     * *-----------------------
     * 
     * @memberOf UpdateAccountMerchantComponent
     */
    public updateActiveAcount() {
        this.updActiveAccntSrv.updateActiveAccountsEvent.subscribe(res => {
            // console.log(res);
        });
        console.log(this.dataBody);
        this.updActiveAccntSrv.updateActiveAccounts(this.dataBody);

        this.dataBody.accounts = [];

    }

    /**
     * *-----------------------
     * !   setPermission
     * *-----------------------
     * 
     * @param {boolean} val 
     * 
     * @memberOf UpdateAccountMerchantComponent
     */
    setPermission(val: boolean) {
        this.hasPermission = val;
    }

}
