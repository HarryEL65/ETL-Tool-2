import { MediaQueriesService } from './../../../../services/media-queries.service';
import { EtlAuthenticationService } from './../../../../services/etl-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
// import { Observable } from 'rxjs/Observable';

import { Observable, Subject, ReplaySubject } from 'rxjs';
// import { from, of, range } from 'rxjs/create';
import { map, filter, switchMap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { Globals } from '../../../../utilities/globals';
import { RouteInfo } from '../../../../models/routerInfo';
import { SideBarTogglerService } from '../../../../services/side-bar-toggler.service';
import { User } from '../../../../models/user';

@Component({
  selector: 'wp-etl-current-location-title',
  templateUrl: './current-location-title.component.html',
  styleUrls: ['./current-location-title.component.scss']
})
export class CurrentLocationTitleComponent implements OnInit {
  isOpen;
  route: string;
  currRouteItem: string;
  currRouteIcon: string;
  currSubIcon: string;
  menuItems: any[];
  loggedinUser: User;
  showOverlay: false;
  val;

  @Input() state;
  constructor(location: Location, 
              public globals: Globals,
              public mdqSrv: MediaQueriesService,
              router: Router,
              private sideBarService: SideBarTogglerService,
              private etlAuthSrv: EtlAuthenticationService) {
    router.events.subscribe((val) => {
      if ( location.path() !== '') {
        if(location.path().indexOf('/admin')!==-1){
          this.val = 1;
        } else {
          this.val=2;
        }
        this.menuItems = this.globals.etlPathMappToTitles;
        const segments = location.path().split('/');
        const currRouteItems = this.menuItems.find(item => item.path.includes(segments[segments.length - this.val]));
        if ( currRouteItems !== undefined ) {
                this.currRouteItem = currRouteItems.title;
                this.currRouteIcon = currRouteItems.headerIcon;
                this.currSubIcon = currRouteItems.subIconClass;
              }
      } else {
        this.currRouteItem = 'Home';
        this.currRouteIcon = 'Home';
      }
    });
   }
  ngOnInit() {
    this.sideBarService.change.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
    this.loggedinUser = this.etlAuthSrv.getUserDetails();
  }

  logout() {
    this.etlAuthSrv.logout().subscribe(
        data => {
            // console.log('received login data ' + JSON.stringify(data));
        },
        error => {
            // console.log('got error : ' + JSON.stringify(error));
        });
  }


    // An event fired when the dropdown is opened or closed
    onOpenChange(event) {
      this.showOverlay = event;
  }


}
