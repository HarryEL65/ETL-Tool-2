import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'wp-etl-account-management',
  template: `
    <div class="outer-outlet"> 
    <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
  :host {block}
  `]
})
export class AccountManagementComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //  this.router.navigate(['acnt-mngmt', 'add-account', 'rptId::merchant-data'])
  }

}
