import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from '../../../etl-shared/modal/modal.component';


@Component({
  selector: 'wp-etl-rerun-modal',
  templateUrl: './rerun-modal.component.html',
  styleUrls: ['./rerun-modal.component.scss']
})
export class RerunModalComponent extends ModalComponent implements OnInit {
 
  selectedAccountsName = [];
  selectedAccountsArray = [];
  title;
  step:any = 1;
  @Input() data;
  @Input() reporId;
  @Output() resetEvent: EventEmitter<any> = new EventEmitter();
  @Output() rerunAccountsEvent: EventEmitter<any> = new EventEmitter();
  aff_name;
  fromDate;

  ngOnInit() {
    this.title = 'Rerun Account';
    this.changeStep();
    if(!this.data) {
      this.step = 'home-dcum-rerun-succeeded'
    }
  }

  changeStep() {
     // console.log(this.data);
     this.step = 1;
    //  this.aff_name = this.data.accounts[0].accName;
    //  this.fromDate = this.data.fromDate;
  }

  retrieveTooltip() {
    this.selectedAccountsName = [];
    this.data.accounts.forEach((acc) => {
      this.selectedAccountsName.push(acc.accName);
    });
    return this.selectedAccountsName.join(', ');
  }

  rerun() {
      this.step = 2;
      this.rerunAccountsEvent.emit();
      // reset the accounts selection to none;
      this.resetEvent.emit();
  }

  resetStep() {
      this.step = 1;
  }

}
