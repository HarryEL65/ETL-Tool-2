import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wp-etl-user-management',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
`,
styles: [`
:host {block}
`]
})

export class EtlUserManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}