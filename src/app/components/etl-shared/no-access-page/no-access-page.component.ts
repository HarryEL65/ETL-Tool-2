import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'wp-etl-no-access-page',
  templateUrl: './no-access-page.component.html',
  styleUrls: ['./no-access-page.component.scss'],
  animations: [routerTransition()],
  host: {'[@routerTransition]': ''}
})
export class NoAccessPageComponent implements OnInit {

  constructor(public router: Router, public location: Location) { }

  ngOnInit() {
    console.log(this.location.path());
  }

  redirectToHomePage () {
    this.router.navigate(['/home']);
  }
}
