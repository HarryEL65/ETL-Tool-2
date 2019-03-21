import { Component, Input } from '@angular/core';

@Component({
  selector: 'wp-etl-svg-icon',
  styleUrls: ['./svg-icon.component.scss'],
  template: `
    <svg title="">
      // SVG elements don't have properties, therefore attribute binding is needed
      // https://stackoverflow.com/a/35082700
      <use attr.xlink:href="assets/svg/symbol-defs.svg#{{icon}}"></use>
    </svg>
  `
})
export class SvgIconComponent {
  @Input() icon: string;
}