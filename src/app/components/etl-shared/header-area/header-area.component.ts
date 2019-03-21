import { ImportStatus } from './../../../utilities/globals';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wp-etl-header-area',
  template: `
    <div class='header-area' [ngClass]="{'validated': styleComp === ImportStatus.VALIDATED, 'warning': styleComp === ImportStatus.WARNING, 'failed': styleComp === ImportStatus.FAILED}">
      <span class='title'>{{title}}</span>
    </div>
  `,
  styles: [`
    :host {

    }
    .title {
      display: inline-block;
      margin-bottom: 12px;
      line-height: 24px;
      color: #3E445C;
      font-size: 18px;
      font-weight: 700;
      font-family: 'Open Sans', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
    }
    .header-area {
      border-bottom: 1px solid #9EB1C2;
      margin-top: 30px;
      margin-bottom: 30px;
    }

    .header-area.validated {
      border-bottom: 1px solid #43BA8A;
    }
    .header-area.validated .title {
        color: #43BA8A;
      }
    .header-area.warning {
      border-bottom: 1px solid #FF8000;
    }
    .header-area.warning .title {
      color: #FF8000;
    }
    .header-area.failed {
      border-bottom: 1px solid #EE5858;
    }
    .header-area.failed .title {
      color: #EE5858;
    }
  `]
})
export class HeaderAreaComponent implements OnInit {
  ImportStatus = ImportStatus;
  @Input() title;
  @Input() styleComp;

  constructor() { }

  ngOnInit() {
  }

}
