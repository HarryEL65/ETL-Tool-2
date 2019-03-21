import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wp-etl-remove-account',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
`,
 styles: [`
 :host {block}
 `]
})
export class RemoveAccountComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    // this.router.navigate(['acnt-mngmt', 'remove-account', 'rptId::merchant-data'])
  }

}
