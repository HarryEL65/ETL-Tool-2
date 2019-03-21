import { MediaQueriesService } from './../../../../services/media-queries.service';
import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Globals } from '../../../../utilities/globals';
import { ChangeDetectorRef } from '@angular/core';
import { SideBarTogglerService } from '../../../../services/side-bar-toggler.service';

@Component({
  selector: 'wp-etl-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit,  AfterViewChecked {

  segments;
  isOpen;
  // menuItems;
  segmentDetails = [];
  @Input() state;
  constructor(location: Location,
              public router: Router,
              private globals: Globals,
              private cdRef: ChangeDetectorRef,
              private sideBarService: SideBarTogglerService,
              public mdqSrv: MediaQueriesService) {
    router.events.subscribe((val: any) => {
      const menuItems = this.globals.etlPathMappToTitles;
      if (val) {

        const url = val.url;
        if ( url !== undefined ) { this.segmentDetails = []; }
        // arr = split the string with '/' delimiter and remove the empty path
        this.segments = url !== undefined ? url.split('/').filter(function (n) { return n !== ''; }) : 'home';
        if (this.segments && this.segments !== 'home') {
          // if (this.segments.length === 1 && this.segments[0] === 'acnt-mngmt') {
          //   this.segments.push('add-account');
          // }
          this.segments.forEach((segment) => {
            menuItems.find( (item, index, obj)  => {
              if (item.path.includes(segment)) {
                 this.segmentDetails.push(item);
                 return true;
              }
              return false;
            });
          });
        }
      } else {
        return this.segments.push('Home Page');
      }
      this.cdRef.detectChanges();
    });
  }
  ngOnInit() {

    this.sideBarService.change.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
    
  }
  ngAfterViewChecked(){
 
  }
  
}
