import { MediaQueriesService } from './../../../../../services/media-queries.service';
// import { forkJoin } from 'rxjs/observable/forkJoin';
import { ChangeRecordTypeService } from './../../../../../services/change-record-type.service';
import { SideBarTogglerService } from './../../../../../services/side-bar-toggler.service';
import { EtlAuthenticationService } from './../../../../../services/etl-authentication.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppEventBusService } from '../../../../../app.event-bus.service';
import { DataBody } from '../../../../../models/data-body';
import { SecondLevelFilterService } from '../../../../../services/second-level-filter.service';
import { Action } from '../../../../../utilities/globals';



/**
 * 
 * 
 * @export
 * @class ChangeRecordTypeMerchantComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'wp-etl-change-record-type-merchant',
    templateUrl: './change-record-type-merchant.component.html',
    styleUrls: ['./change-record-type-merchant.component.scss'],
    providers: [SecondLevelFilterService, ChangeRecordTypeService]
})
export class ChangeRecordTypeMerchantComponent implements OnInit, OnDestroy {

    /**
    * *-------------
    * !   Variables
    * *-------------
    * @memberOf ChangeRecordTypeMerchantComponent
    */
    ACTION = Action;
    private subscribed = false;
    selectedAffiliateProgram;
    dataBody: DataBody = new DataBody();
    isSuper = false;
    isManualSlctd = false;
    resultSet;
    status = 'passed';
    maxSlctnRcrdAllowed;
    btnText = 'Apply';
    isMinimized;
    hasMultiSelectPermission = false;
    hasPermission = false;
    isLoading = false;
    rprtId = 'MERCHANT_DATA';

    /**
     * *-----------------
     * !   Decorators    
     * *-----------------
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    @ViewChild('modalChngRcrdStatus') modalChngRcrdStatus;
    @ViewChild('modalChangeRcrdType') modalChangeRcrdType;

    constructor(public authenticationService: EtlAuthenticationService,
        public changeRcrdTypeSrv: ChangeRecordTypeService,
        private eventBusService: AppEventBusService,
        private sideBarService: SideBarTogglerService,
        private secondLevelFilterService: SecondLevelFilterService,
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
     *  @memberOf ChangeRecordTypeMerchantComponent
     */
    ngOnInit() {
        this.isMinimized = this.sideBarService.getSideBarToggledState();
        this.sideBarService.change.subscribe(isMinimized => {
            this.isMinimized = isMinimized;
        });

        if (this.eventBusService.connected === true) {
            this.initPage();
        } else {
            this.eventBusService.connect(() => {
                this.initPage();
            });
        }
        this.checkPermission();
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
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    ngOnDestroy() {
        this.subscribed = false;
        this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
        this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
        this.changeRcrdTypeSrv.changeRecorsdResultSet.unsubscribe();
        this.eventBusService.disconnect();
    }


    /**
     *  * --------------
     *  !   initPage: 
     *  * --------------
     * 
     * @private
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    private initPage(): void {
        if (this.subscribed === false) {
            this.subscribed = true;
            this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {
                if (error) {
                    console.error('Error subscribing to event ACCOUNTS_CHANGES', error);
                    return;
                }
                if (msg) {

                    // the account that has been updated
                    const account = msg.request.account;
                    const affiliate_prog = { Id: account.affiliateProgramID, Name: account.affiliateProgramName };

                    // We need to refresh the accounts table only if the user is working on the same affiliate program, else it will
                    // refresh the page when it's not required
                    if (this.selectedAffiliateProgram.Id == account.affiliateProgramID) {
                        // Update the Manual/Active accounts table
                        this.secondLevelFilterService.initManualAccntsTable(affiliate_prog);
                    }
                }
            });

            this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => { });

            // Subscribe to the change record type results.
            // after a user click the response will get to the subscribe and will handle the result here
            this.changeRcrdTypeSrv.changeRecorsdResultSet.subscribe((msg) => {
                if (msg.status.description === 'failed') {
                    //               console.log("recived error from service");
                    this.isLoading = false;
                    this.resultSet = msg.data.accounts;
                    this.status = msg.status.description;
                    this.modalChngRcrdStatus.openModal();
                    this.resetSelectedAccounts();
                } else {
                    this.isLoading = false;
                    this.resultSet = msg.data.accounts;
                    this.checkResultSetStatus();
                    this.modalChngRcrdStatus.openModal();
                }
            });

        } else {
            // console.log('Already subscribed');
        }

    }

    /**
     * 
     * *----------------------------
     * !  openChangeRcrdTypeModal
     * *----------------------------
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    openChangeRcrdTypeModal() {
        this.modalChangeRcrdType.openModal()
    }

    /**
     * *-------------------
     * !  checkPermission
     * *-------------------
     * 
     *  Check if the user have permission for "Change Record Type" and if the user is from type "Merchant"
     *  Merchant-Data Users of type superuser are allowed to select and change up to to 20 records,
     *  While simple Merchant-Data Users are allowed to select and change only on single record at a time.
     *  hence the permission will be set to "false"
     * 
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    checkPermission() {

        const hasRoleObservable = this.authenticationService.hasRole(['admin', 'super', 'merchant']);
        hasRoleObservable.subscribe((res) => {
            this.setPermission(res)
        });

        const hasRoleIsuperObs = this.authenticationService.hasRole(['super', 'admin']);
        hasRoleIsuperObs.subscribe((res) => {
            this.setIsSuper(res)
        });
    }

    /**
     * *-----------------
     * !   setIsSuper
     * *-----------------
     * 
     * @param {any} val 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    setIsSuper(val) {
        val ? this.maxSlctnRcrdAllowed = 20 : this.maxSlctnRcrdAllowed = 1;
    }


    /**
     * *------------------
     * !  setPermission
     * *------------------
     * 
     * @param {boolean} val 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    setPermission(val: boolean) {
        this.isSuper = val;
    }

    /**
     * *--------------------
     * !  changeRecordType
     * *--------------------
     * 
     * @param {any} event 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    changeRecordType(event) {
        this.isLoading = true;
        this.changeRcrdTypeSrv.changeRecordType(this.dataBody, this.rprtId);
        this.resetSelectedAccounts();
    }

    /**
     * 
     * *------------------------
     * !  checkResultSetStatus
     * *------------------------
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    checkResultSetStatus() {
        this.resultSet.map((row) => {
            if (row.status !== 'success') {
                this.status = 'failed';
            } else {
                this.status = 'passed';
            }
        })
    }

    /**
     * 
     * *------------------------
     * !  resetSelectedAccounts
     * *------------------------
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    resetSelectedAccounts() {
        this.dataBody.accounts = [];
    }

    /**
     * 
     * *------------------------
     * !  affiliateChange
     * *------------------------
     * 
     * *Reset the previous manual accounts selected after each new affiliate selection
     * @param {any} $event 
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    affiliateChange($event) {
        this.setSelectedAffiliateProgram($event);

        this.dataBody.setAccounts([]);
        this.isManualSlctd = false;
    }

    /**
     * 
     * *-------------------------------
     * !    activeAccountsSelected
     * *-------------------------------
     * 
     * @param {any} $activeAccounts 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    activeAccountsSelected($activeAccounts) {
        this.dataBody.setAccounts($activeAccounts);
        this.isManualSlctd = this.dataBody.accounts.length > 0 ? true : false;
    }

    /**
     *  
     * *---------------------
     * !    setFromDate
     * *--------------------- 
     *     
     *  Change record type works with a MM/YYYY format which is different from the dataBody.setFromDate function
     *  so we kind of over writing the set fromDate parameter
     * 
     * @param {any} event 
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    setFromDate(event) {
        this.dataBody.fromDate = event.label;
    }

    /**
     * 
     * *---------------------------------
     * !    setSelectedAffiliateProgram
     * *--------------------------------- 
     * 
     * @param {any} data 
     * 
     * @memberOf ChangeRecordTypeMerchantComponent
     */
    setSelectedAffiliateProgram(data) {
        this.selectedAffiliateProgram = data.name;
    }

}
