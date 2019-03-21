import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'wp-etl-home',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
`,
styles: [`
:host {block}
`]
})
export class HomeComponent implements OnInit {

//   routeLinks: any[];
//   activeLinkIndex = -1;

  constructor(private router: Router,
              public menuService: MenuService) {}

  ngOnInit() {
    
  }

  

}
