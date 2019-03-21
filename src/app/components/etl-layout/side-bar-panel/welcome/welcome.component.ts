import { MediaQueriesService } from './../../../../services/media-queries.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { EtlAuthenticationService } from '../../../../services/etl-authentication.service';
import { User } from '../../../../models/user';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from './../../../../utilities/globals';

@Component({
  selector: 'wp-etl-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  loggedinUser: User;
  showOverlay: false;
  isWelcomeCompDisplayed: true;
  @Input() state: boolean;
  @Input() isVisible?:boolean;

  constructor(private etlAuthSrv: EtlAuthenticationService,
              config: NgbDropdownConfig,
              public globals: Globals,
              public mdqSrv: MediaQueriesService) {
      config.placement = 'bottom-right';
  }

  ngOnInit() {
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
