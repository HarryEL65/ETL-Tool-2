import { MediaQueriesService } from './../../services/media-queries.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { SideBarTogglerService } from '../../services/side-bar-toggler.service';
import { GlobalMessageNotificationService } from '../../services/global-message-notification.service';
import { Globals } from '../../utilities/globals';
import { Subscription } from "rxjs";

@Component({
  selector: 'wp-etl-etl-layout',
  templateUrl: './etl-layout.component.html',
  styleUrls: ['./etl-layout.component.scss'],
  animations: [routerTransition()]
})
export class EtlLayoutComponent implements OnInit {
  isFaded = false;
  isCollapsed = false;
  // systemMessage = 'Were sorry. Service is temporarily unavailable, please tyr again later';
  systemMessage;
  
  // Variables to cache the affiliate list
  private subscription = new Subscription(); // Collection to handle all subscriptions
  

  constructor(private sideBarService: SideBarTogglerService,
              private notifySrv: GlobalMessageNotificationService,
              private router: Router,
              public globals: Globals,
              public mdqSrv: MediaQueriesService) { }

  ngOnInit() {
    // console.log('etl layout init');
    this.notifySrv.notifyMessgEvent.subscribe((msg) => {
      this.systemMessage = msg;
    });
    this.sideBarService.change.subscribe(isOpen => {
      this.isCollapsed = !isOpen;
      this.doExpand(this.isCollapsed);
    });
    
  }
  
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }


  doExpand(eventData) {
    this.isCollapsed = !eventData;
  }
  
}
