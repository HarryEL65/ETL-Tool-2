import { MediaQueriesService } from './../../../../services/media-queries.service';
import { CaseInsensitivePipe } from './../../../../pipes/case-insensitive.pipe';
import { Component, OnInit, OnChanges, Inject, Injectable, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Globals } from '../../../../utilities/globals';
import { AppEventBusService } from '../../../../app.event-bus.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RevertAccountService } from '../../../../services/revert-account.service';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { RerunAccountsService } from '../../../../services/rerun-accounts.service';
import { SideBarTogglerService } from '../../../../services/side-bar-toggler.service';
import { SecondLevelFilterService } from '../../../../services/second-level-filter.service';
import { LoadFilesService } from '../../../../services/load-files.service';
import { MenuService } from '../../../../services/menu.service';

@Component({
  selector: 'wp-etl-home-merchant',
  templateUrl: './home-merchant.component.html',
  styleUrls: ['./home-merchant.component.scss'],
  providers: [DatePipe, RevertAccountService, RerunAccountsService, SecondLevelFilterService]
})
@Injectable()
export class HomeMerchantComponent implements OnInit, OnChanges, OnDestroy {

  private subscription = new Subscription(); // Collection to handle all subscriptions

  title;

  // TODO: add strong type
  lastAddedAccounts = null;
  lastAddedAccountsName: any;
  lastAddedAccountsTemp: any;
  lastAddedAccountsLoadIndic = true;

  rerunActiveAccounts = null;
  rerunActiveAccountsName: any;
  rerunActiveAccountsTemp: any;
  rerunAccountsLoadIndic = true;


  lastRemovedAccounts = null;
  lastRemovedAccountsName: any;
  lastRemovedAccountsTemp: any;
  lastRemovedAccountsLoadIndic = true;


  lastLoadedAccounts = null;
  lastLoadedAccountsName: any;
  lastLoadedAccountsTemp: any;
  lastLoadedAccountsLoadIndic = true;
  lastLoadedSubscription;

  isMinimized;
  hasInportPermission;



  // Rerun Active Accounts
  // Variables for the framework request using the WebSockets
  private accounts = null;
  private subscribed = false;
  private accountsHeaders = null;
  private accountsData = null;
  
  // Variable to cache the affiliate list
  affiliatesList = [];

    constructor(public globals: Globals,
        public mdqSrv: MediaQueriesService,
        private eventBusService: AppEventBusService,
        private secondLevelFilterService: SecondLevelFilterService,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        private revertAccountService: RevertAccountService,
        private sideBarService: SideBarTogglerService,
        public caseInsense: CaseInsensitivePipe,
        public loadFilesService: LoadFilesService,
        public menuService: MenuService
    ) { }

    ngOnInit() {
        this.hasInportPermission = this.hasInportNavigation();
        this.isMinimized = this.sideBarService.getSideBarToggledState();
        // console.log('Home component init page');
        this.sideBarService.change.subscribe(isMinimized  => {
            this.isMinimized  = isMinimized ;
        });
        
        if (this.eventBusService.connected === true) {
            // console.log('init page without connect');
            this.loadData();
        } else {
            this.eventBusService.connect(() => {
                // console.log('init page after connect');
                this.loadData();
            });
        }
    }
    
    hasInportNavigation() {
        return this.menuService.getMenu().find( (item) => item.title === 'Import');
    }
    ngOnChanges() {

    }

    ngOnDestroy() {
        //  console.log('Home component Destroy was called');
        this.subscribed = false;
        this.subscription.unsubscribe(); // unsubscribe from all event emitter
        this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
        this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
        this.eventBusService.disconnect();
    }

    private loadData(): void {

        if (this.subscribed === false) {
            // console.log('subscribing to Accounts changes Address');
            this.subscribed = true;
            this.subscribeToChanges();
        } else {
            // console.log('Already subscribed');
        }

        this.getLastAddedAccounts();
        this.getRerunActiveAccounts();
        this.getLastRemovedAcccount();
        this.getLastlLoadedAccounts();

        this.subscribeToRevertAccount();
        
        this.getAffiliateList();
    }

   private fetch(cb) {
       const req = new XMLHttpRequest();
       req.open('GET', `assets/data/acnts.json`);

       req.onload = () => {
           cb(JSON.parse(req.response));
       };

       req.send();
   }

    private getLastAddedAccounts(): void {
        if (this.lastAddedAccounts === null) {
            // console.log('Sending event bus call');
            const route = this.globals.SrvRoute.LAST_ADDED_ACCTNS;
            this.eventBusService.send(route, {
                 'send_email': false,
                 'recipiants': '',
                 'request': 'ListAccounts',
                 'reportType': this.globals.reportIds['MERCHANT_DATA']
            }, (error, message) => {
                if (error) {
                    // console.error('Error getting LastAddedAccounts', error);
                    return;
                }
                if (message) {
//                    console.log("last added accounts");
//                    console.log(message);
                    setTimeout(() => { this.lastAddedAccountsLoadIndic = false; }, 1500);
//                    console.log('recieved reply from LastAddedAccounts : ');
//                    console.log(message);
                    this.lastAddedAccountsName = [];
                    this.lastAddedAccountsTemp = [...message.AddedAccounts];

                    this.lastAddedAccounts = message.AddedAccounts;
                    this.lastAddedAccounts.map((row) => {
                        row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                        this.lastAddedAccountsName.push(row.accName);
                    });
                    // console.log('lastAddedAccounts', this.lastAddedAccounts);
                }
            });
        }
    }

    private getRerunActiveAccounts(): void {
        if (this.rerunActiveAccounts === null) {
            // console.log('get Rerun Active Accounts');
            const route = this.globals.SrvRoute.RRUN_ACTVY;
            this.eventBusService.send(route, {
                'request': 'RerunActiveAccounts',
                'reportType': this.globals.reportIds['MERCHANT_DATA']
            }, (error, message) => {
                if (error) {
                    // console.error('Error RerunActiveAccounts', error);
                    return;
                }
                if (message) {
                    this.rerunActiveAccountsName = [];
                    this.rerunActiveAccountsTemp = [...message.RerunAccountList];
                    // console.log('recieved reply from getRerunActiveAccounts : ');
                    // console.log(message);

                    setTimeout(() => { this.rerunAccountsLoadIndic = false; }, 3500);
                    this.rerunActiveAccounts = message.RerunAccountList;
                    this.rerunActiveAccounts.map((row) => {
                        if (this.isValidTimeStamp(row.timeStamp)) {
                         row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                        }
//                        if (row.runPeriodStart && this.isValidTimeStamp(row.runPeriodStart) ) {
//                            row.runPeriodStart = this.datePipe.transform(this.globals.convertToDate(row.runPeriodStart), 'dd/MM/yyyy');
//                        }
//                        if ( row.runPeriodEnd && this.isValidTimeStamp(row.runPeriodEnd) ) {
//                            row.runPeriodEnd = this.datePipe.transform(this.globals.convertToDate(row.runPeriodEnd), 'dd/MM/yyyy');
//                        }
                        this.rerunActiveAccountsName.push(row.accName);
                    });
                }
            });
        }
    }

    isValidTimeStamp(date) {
       return new Date(date).getTime() > 0;
    }

    private getLastRemovedAcccount(): void {
        if (this.lastRemovedAccounts === null) {
            const route = this.globals.SrvRoute.RMV_ACTVY;
            this.eventBusService.send(route, { 'reportType': this.globals.reportIds['MERCHANT_DATA'] }, (error, message) => {
                if (error) {
                    // console.error('Error getting RemovedAccounts', error);
                    return;
                }
                if (message) {
                     // console.log('recieved reply from getRemoveAccounts : ');
                     // console.log(message);

                    this.lastRemovedAccountsName = [];
                    this.lastRemovedAccountsTemp = [...message.RemovedAccounts];
                    setTimeout(() => { this.lastRemovedAccountsLoadIndic = false; }, 3500);

                    this.lastRemovedAccounts = message.RemovedAccounts;
                    this.lastRemovedAccounts.map((row) => {
                        row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                        this.lastRemovedAccountsName.push(row.accName);
                    });
                }
            });
        }
    }

    private getLastlLoadedAccounts(): void {
        if (this.lastLoadedAccounts === null) {
            this.loadFilesService.fetchLastLoadedAccounts();

            this.lastLoadedSubscription = this.loadFilesService.fetchLastLoadedEvent.subscribe((res) => {
                res = res.AddedFiles;
                console.log(res);
                // console.log('fetchLastLoadedEvent', res)
                this.lastLoadedAccounts = res;
                

                    this.lastLoadedAccountsName = [];
                    this.lastLoadedAccountsTemp = [ ... res]
                    setTimeout(() => { this.lastLoadedAccountsLoadIndic = false; }, 3500);

                    this.lastLoadedAccounts = res;
                    this.lastLoadedAccounts.map( (row) => {    
                        // row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                        this.lastLoadedAccountsName.push(row.accName);
                    });
                
            });
            
        }
    }
    
    // Cache the affiliate list
    private getAffiliateList(){
        this.affiliatesList = this.globals.getAffiliateList();
        
        if (this.affiliatesList.length === 0 ){
            // Subscribe to the getAffilates function which will return the affiliate accounts list
            const getAffiliateAccountsSubscribe = this.secondLevelFilterService.getAffiliatedAccnts.subscribe(res => {
               if (res) {
                   this.affiliatesList = res;
                   this.globals.setAffiliateList(res);
               } 
            });
            this.subscription.add(getAffiliateAccountsSubscribe);
            
            // Get the list of affiliates
            this.secondLevelFilterService.setAction('add-account');
            this.secondLevelFilterService.getAffiliates();
        }
    }

    // Notifies when a revert account is sent on the WebSocket, can also listen to direct replies if necessary
    private subscribeToRevertAccount() {
        const revertAccSubscribe = this.revertAccountService.revertAccountEmitter.subscribe(() => {
           this.lastAddedAccountsLoadIndic = true;
        });

        this.subscription.add(revertAccSubscribe);
    }

    // Listen to the changes on the WebSocket, also handle the direct replies
    private subscribeToChanges(): void {
        // console.log('subscribe to ACCOUNTS_CHANGES');
        // console.log('subscribe to HEALTHCHECK_STATUS_CHANGE');

        let updateIndex;
        let updatedAccountsArray;
        this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {
            if (error) {
                // console.error('Error subscribing to event ACCOUNTS_CHANGES', error);
                return;
            }
            if (msg) {
                console.log('The message that has been updated from ACCOUNTS CHANGES is: ');
                console.log(msg);

                // the accID that has been updated
                const accId = msg.request.accID;

                // find the array that need to be updated - lastAddedAccounts, rerunActiveAccounts or lastRemovedAccounts
                if (msg.EVENT_TYPE === 'UpdateRerun') {
                    // send to update the rerunActiveAccounts array
                    // find the index on of the account that need to be updated in the array
                    updateIndex = this.findAccIndex(accId, this.rerunActiveAccounts);
                    // update the array with the new values
                    updatedAccountsArray = this.updateArray(msg, updateIndex, this.rerunActiveAccounts);

                    this.rerunActiveAccounts = [...updatedAccountsArray];
                } else {
                    // send to update the lastAddedAccounts
                    updateIndex = this.findAccIndex(accId, this.lastAddedAccounts);
                    // update the array with the new values
                    updatedAccountsArray = this.updateArray(msg, updateIndex, this.lastAddedAccounts);

                    // This row is for Refreshing the table
                    this.lastAddedAccounts = [...updatedAccountsArray];
                }

                console.log('The index is: ');
                console.log(updateIndex);
                console.log(this.lastAddedAccounts);

                // Remove the loading indicator when the update is done
                setTimeout(() => {
                    this.lastAddedAccountsLoadIndic = false;
                }, 500 );

            }
        });
         this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
              // console.log(error);
              // error.message.status.errors
              // console.log('New message arrived ' + JSON.stringify(msg));
          });
    }

    filterLastAddedTable(e) {
        if (this.lastAddedAccountsTemp) {
            // filter our data
            const val = e;

            const temp = this.lastAddedAccountsTemp.filter( (row) => this.caseInsense.transform(row.accName, val, true) );
            // update the lastAddedAccounts
            this.lastAddedAccounts = temp;
        }
    }

    filterRerunsTable(e) {
        if (this.rerunActiveAccountsTemp) {
            // filter our data
            const val = e;
            const temp = this.rerunActiveAccountsTemp.filter( (row) => this.caseInsense.transform(row.accName, val, true) );
            // update the lastAddedAccounts
            this.rerunActiveAccounts = temp;
        }
    }

    filterLastRemovedTable(e) {
        if (this.lastRemovedAccountsTemp) {
            // filter our data
            const val = e;
            const temp = this.lastRemovedAccountsTemp.filter( (row) => this.caseInsense.transform(row.accName, val, true) );
            // update the lastAddedAccounts
            this.lastRemovedAccounts = temp;
        }
    }

    filterLastLoadedTable(e) {
        if (this.lastLoadedAccountsTemp) {
            // filter our data
            const val = e;
            const temp = this.lastLoadedAccountsTemp.filter( (row) => this.caseInsense.transform(row.accName, val, true) );
            // update the lastAddedAccounts
            this.lastLoadedAccounts = temp;
        }
    }
    // This function will get the updated status in the 'last added account' row according to the type of the request
    private getUpdateStatus(msg) {

        switch (msg.EVENT_TYPE) {
            case 'AddAcount': {
                console.log(msg.request.toStatus);
                if (msg.request.toStatus === 'TESTING') {
                    return 'testing';
                } else {
                    return msg.request.toStatus;
                }
            }
            case 'UpdateAccount': {
                console.log(msg.request.toStatus);
                return msg.request.toStatus;
            }
            case 'GoLive': {
                console.log(msg.request.toStatus);
                return msg.request.toStatus;
            }
            case 'RunNowAccount': {
                console.log(msg.request.account.status);
                return msg.request.account.status;
            }
            case 'RevertAccount': {
                console.log(msg.request.toStatus);
                return msg.request.toStatus;
            }
            case 'RemoveAccount': {
                console.log(msg.request.toStatus);
//                return msg.request.toStatus;
                return 'accepted';
            }
            case 'RerunAccount': {
                console.log(msg.response.status);
                return msg.response.status;
            }
            case 'UpdateRerun': {
                console.log(msg.request.toStatus);
                return msg.request.toStatus;
            }
            default: {
                console.log(msg.EVENT_TYPE);
                console.log('Invalid event in getUpdateStatus function');
                break;
            }
        }
    }

    private findAccIndex(accID, accountsArray) {
        let currItem;
        for (let i = 0; i < accountsArray.length; i++) {
            currItem = accountsArray[i];
            if (currItem.accID === accID) {
                // The specific row that need to be updated according to the accId
                return i;
            }
        }
        return;
    }

    updateArray(msg, updateIndex, accountsArray) {
        if (typeof updateIndex != 'undefined') {
            const updatedStatus = this.getUpdateStatus(msg);

            if (typeof msg.request.reports != 'undefined') {
                accountsArray[updateIndex].outputFiles = msg.request.reports;
            }

            accountsArray[updateIndex].status = updatedStatus;

            if (msg.user.username != '') {
                accountsArray[updateIndex].madeByName = msg.user.username;
            }

            if (typeof msg.response.timeStamp != 'undefined') {
                // tslint:disable-next-line:max-line-length
                accountsArray[updateIndex].timeStamp = this.datePipe.transform(this.globals.convertToDate(msg.response.timeStamp), 'dd/MM/yyyy');
            }
        }
        return accountsArray;
    }

}
