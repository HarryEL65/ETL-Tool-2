import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * 
 * 
 * @export
 * @class ChangeRecordTypeComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'wp-etl-change-record-type',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  :host {block}
  `]
})
export class ChangeRecordTypeComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    
  }

}
