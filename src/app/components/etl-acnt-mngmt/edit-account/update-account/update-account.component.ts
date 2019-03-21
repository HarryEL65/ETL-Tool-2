import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wp-etl-update-account',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  :host {block}
  `]
})
export class UpdateAccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
