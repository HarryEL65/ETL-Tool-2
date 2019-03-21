import { Globals } from './../../../utilities/globals';
import { SideBarTogglerService } from './../../../services/side-bar-toggler.service';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { MediaQueriesService } from '../../../services/media-queries.service';

@Component({
  selector: 'wp-etl-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss']
})
export class HamburgerComponent implements OnInit {

  @Input() sideNavRef;
  @Input() sideNavContent;

  // @Input() state = '';
  constructor(private sideBarService: SideBarTogglerService,
              public globals: Globals,
              public mdqSrv: MediaQueriesService) { }

  ngOnInit() {
  }
  toggle(val) {
    const hamburger = window.document.querySelectorAll('#nav-icon1');
    hamburger[0].classList.toggle('open');
    this.collapseExpandSidePanel(val);
    // console.log('sideNavRef', this.sideNavRef);
    if (this.mdqSrv.XS) {

      if (this.sideNavRef._elementRef.nativeElement.classList.contains('expanded')) {
        this.sideNavRef._elementRef.nativeElement.classList.remove('expanded');
        this.sideNavRef._elementRef.nativeElement.classList.add('collapsed');
      } else {
        this.sideNavRef._elementRef.nativeElement.classList.add('expanded');
        this.sideNavRef._elementRef.nativeElement.classList.remove('collapsed');
      }
      if (this.sideNavContent._container._element.nativeElement.childNodes[4].classList.contains('expanded')) {
        this.sideNavContent._container._element.nativeElement.childNodes[4].classList.add('collapsed-xs');
        this.sideNavContent._container._element.nativeElement.childNodes[4].classList.remove('expanded');
      } else {
        this.sideNavContent._container._element.nativeElement.childNodes[4].classList.remove('collapsed-xs');
        this.sideNavContent._container._element.nativeElement.childNodes[4].classList.add('expanded');
      }
    }
  }
  // }
  // checkToggleState() {
  //   if (!this.mdqSrv.XL) {
  //     this.toggle();
  //   }
  // }

    collapseExpandSidePanel (val) {
      this.sideBarService.toggle(val);
    // this.isCollapsed = !this.isCollapsed;
    // if (this.isCollapsed) {
    // //   // document.querySelectorAll('input[name=toggle-menuItem]:checked');
    //   if (document.querySelectorAll('input[name=toggle-menuItem]:checked').length > 0) {
    //      document.querySelectorAll('input[name=toggle-menuItem]:checked')[0]['checked'] = false;
    //   }
    // }
  }

}
