import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * 
 * 
 * @export
 * @class AddAccountComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'wp-etl-add-account',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
`,
  styles: [`
:host {block}
`]
})

export class AddAccountComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() { }

}
