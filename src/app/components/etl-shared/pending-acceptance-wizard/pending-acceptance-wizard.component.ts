import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Globals } from '../../../utilities/globals';
import { AppEventBusService } from '../../../app.event-bus.service';
import { NgForm } from '@angular/forms';
import { TruncateModule } from 'ng2-truncate';


import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';

import { Observable, Subject, ReplaySubject } from 'rxjs';
// import { from, of, range } from 'rxjs/create';
import { map, filter, switchMap } from 'rxjs/operators';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/merge';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';

import { routerTransition } from '../../../router.animations';
import { RevertAccountService } from '../../../services/revert-account.service';
import { RerunAccountsService } from '../../../services/rerun-accounts.service';
import { DataBody } from '../../../models/data-body';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';

@Component({
    selector: 'wp-etl-pending-acceptance-wizard',
    templateUrl: './pending-acceptance-wizard.component.html',
    styleUrls: ['./pending-acceptance-wizard.component.scss'],
    animations: [routerTransition()]
})
export class PendingAcceptanceWizardComponent implements OnInit, OnDestroy {

    private subscription = new Subscription(); // Collection to handle all subscriptions

    @Input() accName;
    @Input() accId;
    @Input() account;
    @Output() close = new EventEmitter();
    @Output() retrievedStatus = new EventEmitter();

    model: any;

    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    formater;
    isGoLive = true;
    isError = false;
    currentDate;
    selectedRunFrom;
    selectedRunTo;
    dates;
    step;
    numOfMonths = 24;

    toDates = [];
    testMonthFrom;
    testMonthTo;

    dataBody: DataBody = new DataBody();
    // dataBody = {
    //     accounts: [],
    //     config: {},
    //     fromDate: '',
    //     toDate: '',
    //     reportType: 'MerchantData'
    // };

    constructor(private globals: Globals,
        private eventBusService: AppEventBusService,
        private revertAccountService: RevertAccountService,
        private rerunActSvr: RerunAccountsService) { }

    ngOnInit() {

        this.accName = this.removeStatusFromName();

        this.initializeDates();
        // console.log('dates from wizard', this.dates);
        // console.log('pending acceptance init page');
        this.step = 1;
    }

    private initializeDates() {
        this.currentDate = this.globals.getCurrentDate();
        this.dates = this.globals.getMonthsFromToday(this.numOfMonths);


        // this.toDates = this.globals.getMonthsFromToday(this.numOfMonths);
        this.toDates = this.dates.slice(0, this.numOfMonths - this.dates[0].value + 1);

        this.selectedRunFrom = this.dates[0];
        this.selectedRunTo = this.dates[0];
    }

    getFromDateSelection(fromDate) {
        if (this.selectedRunFrom.value > this.selectedRunTo.value) {
            this.selectedRunTo  =  fromDate;
        }
        this.getAheadsDates(fromDate);
    }

    getToDateSelection(toDate) {
        // this.dateTo.emit(toDate);
    }

    getAheadsDates(fromDate) {
        // {value: number, label:'date'}
        this.toDates = this.dates.slice(0, this.numOfMonths - fromDate.value + 1);
    }
    setData() {
        // console.log(' --- set data --- ');
        // this.dataBody.accounts = [];
        this.dataBody.setAccounts([this.account]);
        this.dataBody.setFromDate(this.selectedRunFrom);
        this.dataBody.setToDate(this.selectedRunTo);
        // console.log(this.dataBody);
    }

    private getLastDayOfMonth(date) {
        // Day 0 is the last day in the previous month
        const dateTo = date.split('/');
         return new Date(dateTo[1], dateTo[0], 0).getDate();
    }

    ngOnDestroy(): void {
        // console.log('pending-acceptence Destroy');
//        this.revertAccountService.pendingAcceptentceEmitter.unsubscribe();

        this.subscription.unsubscribe(); // unsubscribe from all event emitter
    }

    removeStatusFromName () {
        const status = '- Pending Acceptance';
        this.accName = this.accName.replace(status, '');
        return this.accName;
    }

    formatter = (x: { val: string }) => x.val;

    goLive() {
        // // console.log('Sending event bus call');
        const route = this.globals.SrvRoute.GO_LIVE;

        // tslint:disable-next-line:max-line-length
        try {
            // tslint:disable-next-line:max-line-length
            this.eventBusService.send(route, { 'accID': this.accId, 'reportType':this.globals.reportIds['MERCHANT_DATA'], 'publish_address': 'ACCOUNTS_CHANGES' }, (error, message) => {
                if (error) {
                    console.error('Error Go Live Activity', error);
                    this.isGoLive = false;
                    this.isError = true;
                  //  this.retrievedStatus.emit('pending');
                    return;
                }
                if (message) {
                     console.log('recieved reply from Go Live Activity : ');
                     console.log(message);
                    this.isGoLive = true;
                    this.isError = false;
                    this.step = 2;
                  //  this.retrievedStatus.emit('accepted');
                }
            });
            setTimeout(() => this.step = 2, 1000 );
        } catch (e) {
            console.log(e);
        }

    }

    runNow() {
        this.step = 3;
    }

    closeErrorMsg() {
        this.isError = false;
    }

    onSubmit(f: NgForm) {
        //    // console.log(f.value);  // { first: '', last: '' }
        //    // console.log(f.valid);  // false
    }

    // Run Now flow
    runNowFinal() {
        try {

            setTimeout(() => this.step = 4, 1000 );

            // Set Data body for the run now flow
            this.setData();

            // console.log('Run Now account send WebSocket');
            const route = this.globals.SrvRoute.RUN_NOW;

            const body = this.dataBody;
            this.eventBusService.send(route, body, (error, message) => {
              if (error) {
                console.error('Error: ' + route);
                return;
              }
              if (message) {
               // console.log('Run Now Accounts succesfully: ');
               // console.log(message);
               this.retrievedStatus.emit('accepted');

              }
        });
    } catch (e) {
        console.log(e);
    }
    }

    revertAccount() {
        // console.log('revert account activated');
        // Subscribe to error event if the revert account Websocket failed
        const revertAccSubscribe = this.revertAccountService.pendingAcceptentceEmitter.subscribe((error) => {
            this.isError = error;
        });

        this.subscription.add(revertAccSubscribe);

        // Send on the WebSocket
        this.revertAccountService.revertAccount(this.accId);

        setTimeout(() => this.step = 0, 2000 );
        this.close.emit('just close the modal from revert!');
    }

    goToAreYouSure() {
        this.step = 0;
    }
    finalClose () {
        this.close.emit('just close the modal from final!');
    }
}
