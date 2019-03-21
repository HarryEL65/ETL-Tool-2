import { MediaQueriesService } from './../../../services/media-queries.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EtlAuthenticationService } from '../../../services/etl-authentication.service';
import { AppEventBusService } from '../../../app.event-bus.service';
import { SecondLevelFilterService } from '../../../services/second-level-filter.service';
import { RerunAccountsService } from '../../../services/rerun-accounts.service';
import { DataBody } from '../../../models/data-body';
import { SideBarTogglerService } from '../../../services/side-bar-toggler.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Globals } from '../../../utilities/globals';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'wp-etl-reruns-ducm',
  templateUrl: './reruns-ducm.component.html',
  styleUrls: ['./reruns-ducm.component.scss'],
  providers: [RerunAccountsService]
})
export class RerunsDucmComponent implements OnInit, OnDestroy{

    // Variables for the framework request using the WebSockets
    private subscribed = false;

    // Component variables
    dataBody: DataBody = new DataBody();

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
        
        // this.dataBody.setAccounts([{"accID":34, "reportType": this.globalService.reportIds.DUCM}]);
    }

    private initPage(): void {
        if (this.subscribed === false) {
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

    rerunAccounts() {
        this.dataBody.setAccounts([{"accID": environment.WEBPALS_MOBILE.accID, "reportType": environment.WEBPALS_MOBILE.reportType}]);
        // console.log('---rerun account click---');
        // console.log(this.dataBody);
    
        // subscribe to the add account event
        this.rerunActSvr.rerunAccountEvent.subscribe(res => {
             console.log('recieved message from rerun account: ');
             console.log(res);
        });
        this.rerunActSvr.rerunAccounts(this.dataBody, 'DUCM');
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

    // Check if the user have permission for "RERUN" and if the user is from type "webpals_mobile"
    // Users of type webpals_mobile are not allowed to perform "RERUNS" on more than the last two months
    // hence the permission will be set to "false"
    checkPermission() {
    
        let currPermission;
        let currRole;
    
        forkJoin(
            this.authenticationService.hasPermission('rerun_account'),
            this.authenticationService.hasRole(['webpals_mobile'])
        )
        .subscribe(([hasPermission, hasRole]) => {
           currPermission = hasPermission ? true : false;
           currRole = hasRole ? true : false;
    
           this.setDatesPermission(currPermission && !currRole);
           this.setPermission(currPermission);
        });
    }

}
