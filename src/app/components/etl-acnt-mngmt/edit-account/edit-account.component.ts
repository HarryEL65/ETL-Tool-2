import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * 
 * 
 * @export
 * @class EditAccountComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'wp-etl-edit-account',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  :host {block}
  `]
})
export class EditAccountComponent implements OnInit {

  constructor(public router: Router) { }

  /**
   *  * --------------
   *  !    ngOnInit: 
   *  * --------------
   * 
   *  This event initializes after Angular first displays the data-bound properties
   *  or when the component has been initialized. This event is basically called only after the ngOnChanges()events.
   *  This event is mainly used for the initialize data in a component
   * 
   *  @memberOf EditAccountComponent
   */     
  ngOnInit() {
      // this.router.navigate(['acnt-mngmt', 'edit-account', 'change-record-type', 'rptId::merchant-data']);
  }

}
