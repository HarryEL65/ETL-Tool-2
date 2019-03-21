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
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'wp-etl-home-ducm',
  templateUrl: './home-ducm.component.html',
  styleUrls: ['./home-ducm.component.scss'],
  providers: [DatePipe, RevertAccountService, RerunAccountsService]
})
@Injectable()
export class HomeDucmComponent implements OnInit, OnChanges, OnDestroy {

  private subscription = new Subscription(); // Collection to handle all subscriptions

  title;

  rerunActiveAccounts = null;
  rerunActiveAccountsName: any = [];
  rerunActiveAccountsTemp: any;
  rerunAccountsLoadIndic = true;

  isMinimized;

  // Rerun Active Accounts
  // Variables for the framework request using the WebSockets
  private accounts = null;
  private subscribed = false;
  private accountsHeaders = null;
  private accountsData = null;

  constructor(public globals: Globals,
              private eventBusService: AppEventBusService,
              private datePipe: DatePipe,
              private toastr: ToastrService,
    // private revertAccountService: RevertAccountService,
              private sideBarService: SideBarTogglerService,
              public caseInsense: CaseInsensitivePipe,
              public mdqSrv: MediaQueriesService) { }

  ngOnInit() {
    this.isMinimized = this.sideBarService.getSideBarToggledState();
    // console.log('Home component init page');
    this.sideBarService.change.subscribe(isMinimized  => {
        this.isMinimized  = isMinimized ;
    });

    if (this.eventBusService.connected === true) {
        // console.log('init page without connect');
        this.loadData();
    } else {
        // console.log('HOME PAGE connect');
        this.eventBusService.connect(() => {
            // console.log('init page after connect');
            this.loadData();
        });
    }
  }

  ngOnChanges() {}

  ngOnDestroy() {
    // console.log('Home component Destroy was called');
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
      this.getRerunActiveAccounts();
  }

  private getRerunActiveAccounts(): void {
    if (this.rerunActiveAccounts === null) {
        // console.log('get Rerun Active Accounts');
        const route = this.globals.SrvRoute.RRUN_ACTVY;
        // Todo: change the reportType to 'Ducm'
        this.eventBusService.send(route, {
            'request': 'RerunActiveAccounts',
            'reportType': environment.WEBPALS_MOBILE.reportType
        }, (error, message) => {
            if (error) {
                // console.error('Error RerunActiveAccounts', error);
                return;
            }
            if (message) {
                console.log(message);
                this.rerunActiveAccountsName = [];
                this.rerunActiveAccountsTemp = [...message.RerunAccountList];

                setTimeout(() => { this.rerunAccountsLoadIndic = false; }, 3500);
                this.rerunActiveAccounts = message.RerunAccountList;
                this.rerunActiveAccounts.map((row) => {
                    if (this.isValidTimeStamp(row.timeStamp)) {
                    //  row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                    }
                    this.rerunActiveAccountsName.push(row.accName);
                });
                
            }
        });
    }
  }

  isValidTimeStamp(date) {
      return new Date(date).getTime() > 0;
  }

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
            }
    
        }
    });
    
    this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
          // console.log(error);
          // error.message.status.errors
          // console.log('New message arrived ' + JSON.stringify(msg));
    });
  }

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

  filterRerunsTable(e) {
    if (this.rerunActiveAccountsTemp) {
        // filter our data
        const val = e;
        const temp = this.rerunActiveAccountsTemp.filter( (row) => this.caseInsense.transform(row.accName, val, true) );
        
        // update the lastAddedAccounts
        if (temp.length > 0){
            this.rerunActiveAccounts = temp;
        }
    }
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
