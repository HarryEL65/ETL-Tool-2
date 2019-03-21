import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wp-etl-reruns',
  template: `
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
`,
styles: [`
:host {block}
`]
})
export class RerunsComponent implements OnInit {

  constructor(public router: Router) { }

  isManualSlctd = false;
  ngOnInit() {}

}
