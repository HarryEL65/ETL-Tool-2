import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'wp-etl-etl-admin',
  template: `
    <div class="outer-outlet">
    <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
  :host {block}
  `]
})
export class EtlAdminComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
