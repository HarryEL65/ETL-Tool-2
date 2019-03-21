import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'wp-etl-error-message',
  template: `
  <div *ngIf="status" class="error-msg-ctnr">
  <div data-ng-show="showError" ng-class="{fade:doFade}" class="alert alert-danger"><strong>Error:{{status}}</strong> {{errorMsg}}
  </div>
  `,
  styles: [`
    :host {
        position: relative;
        top: -180px;
    }
          `]
})
export class ErrorMessageComponent implements OnInit {
  @Input() status: '';
  @Input() errorMsg: '';
  showError = false;
  doFade = false;

  constructor() { }

  ngOnInit() {
    this.showError = true;

    setTimeout(function() {
      this.doFade = true;
      // console.log('FADE');
    }, 2500);
  }

}
