import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wp-etl-svg-Failed',
  template: `
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
  <defs>
      <style>.cls-1{fill:#EE5858;}</style>
  </defs>
  <title>Status_icons</title>
  <path class="cls-1" d="M9,2A7,7,0,1,1,2,9,7,7,0,0,1,9,2M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"/>
  // tslint:disable-next-line:max-line-length
  <polygon class="cls-1" points="12.6 6.67 11.33 5.4 9 7.73 6.67 5.4 5.4 6.67 7.73 9 5.4 11.33 6.67 12.6 9 10.27 11.33 12.6 12.6 11.33 10.27 9 12.6 6.67"/>
  </svg>
  `,
  styleUrls: ['./svg-failed.component.scss']
})
export class SvgFailedComponent implements OnInit {

  @Input() svgClasses: string;

  constructor() { }

  ngOnInit() {
  }

}
