import { CaseInsensitivePipe } from './../../../pipes/case-insensitive.pipe';
import { Subscription } from 'rxjs/Subscription';
import { UserManagementService } from './../../../services/user-management.service';
import { MediaQueriesService } from './../../../services/media-queries.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Globals } from '../../../utilities/globals';
import { AppEventBusService } from '../../../app.event-bus.service';
import { SideBarTogglerService } from '../../../services/side-bar-toggler.service';
import { MenuService } from '../../../services/menu.service';

@Component({
    selector: 'wp-etl-user-management-all-rprt-id',
    templateUrl: './user-management-all-rprt-id.component.html',
    styleUrls: ['./user-management-all-rprt-id.component.scss']
})
export class UserManagementAllRprtIdComponent implements OnInit, OnDestroy {

    private subscription = new Subscription(); // Collection to handle all subscriptions
    private subscribed = false;

    isMinimized

    users = null;
    usersName: any;
    usersTemp: any;
    usersLoadIndic = true;

    roles = null;
    rolesName: any;
    rolesTemp: any;
    rolesLoadIndic = true;

    constructor(public globals: Globals,
        public mdqSrv: MediaQueriesService,
        public userMngmtSrv: UserManagementService,
        private eventBusService: AppEventBusService,
        private sideBarService: SideBarTogglerService,
        public caseInsense: CaseInsensitivePipe,
        public menuService: MenuService) { }

    ngOnInit() {

        this.isMinimized = this.sideBarService.getSideBarToggledState();
        // console.log('User Management');
        this.sideBarService.change.subscribe(isMinimized => {
            this.isMinimized = isMinimized;
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

    ngOnDestroy() {
        //  console.log('Home component Destroy was called');
        this.subscribed = false;
        this.subscription.unsubscribe(); // unsubscribe from all event emitter
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

        this.getUserManagementData();


    }

    // Listen to the changes on the WebSocket, also handle the direct replies
    private subscribeToChanges(): void {
        this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {
            // console.log(error);
            // error.message.status.errors
            // console.log('New message arrived ' + JSON.stringify(msg));
        });
    }

    getUserManagementData() {
        console.log('users-mgmnt works!')
        this.userMngmtSrv.getUserManagementData();
        this.userMngmtSrv.fetchUserMngmntEvent.subscribe((res) => {
            console.log('getUserManagementData res', res)
            let { availableRoles, channels, permissions, roles, users } = res;
            console.log('availableRole', availableRoles);
            console.log('channels', channels);
            console.log('permissions', permissions);
            console.log('roles', roles);
            console.log('users', users);

            // ==========================

            this.usersName = [];
            this.usersTemp = [...res.users];

            this.users = res.users;
            this.users.map((row) => {
                // row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                this.usersName.push(row.name);
            });

            // ===========================

            this.rolesName = [];
            this.rolesTemp = [...res.roles];

            this.roles = res.roles;
            this.roles.map((row) => {
                // row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy');
                this.rolesName.push(row.name);
            });

            // ==========================
        })


    }

    showUserCardDetails(e) {
      console.log('showUserCardDetails', e)
    }


    filterUsersTable(e) {
        if (this.usersTemp) {
            // filter our data
            const val = e;

            const temp = this.usersTemp.filter((row) => this.caseInsense.transform(row.name, val, true));
            // update the users
            this.users = temp;
        }
    }

    filterRolesTable(e) {
        if (this.rolesTemp) {
            // filter our data
            const val = e;

            const temp = this.rolesTemp.filter((row) => this.caseInsense.transform(row.name, val, true));
            // update the users
            this.roles = temp;
        }
    }

}
