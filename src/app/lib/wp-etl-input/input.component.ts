import { Component, OnInit, Input, ContentChild, HostBinding } from '@angular/core';
import { InputRefDirective } from '../common/input-ref.directive';


@Component({
  selector: 'wp-etl-input',
  template: `
    <div class="icon-ctnr" *ngIf="iconPos==='left'">
      <i class="fa"  [ngClass]="classes"></i>
    </div>

    <ng-content></ng-content>

    <div class="icon-ctnr" *ngIf="iconPos==='right'">
      <i class="fa" [ngClass]="classes"></i>
    </div>
  `,
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input() icon: string;
  @Input() rows: any;
  @Input() iconPos;

  @ContentChild(InputRefDirective)
  input: InputRefDirective;


  @HostBinding('class.focus')
  get focus() {
    return this.input ? this.input.focus : false;
  }

  constructor() {
    this.iconPos ? this.iconPos = this.iconPos : this.iconPos = 'left';
  }

  get classes() {
    const cssClasses = {
      fa: true
    };
    cssClasses['fa-' + this.icon] = true;
    return cssClasses;
  }


}
