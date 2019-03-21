import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../etl-shared/modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wp-etl-modal-testing',
  templateUrl: './modal-testing.component.html',
  styleUrls: ['./modal-testing.component.scss']
})
export class ModalTestingComponent extends ModalComponent implements OnInit {
  selectedAccountsName = [];
  selectedAccountsArray = [];
  step;
  @Input() get selectedAccounts() {
    return this.selectedAccountsArray;
  }
  @Input() routerRef;
  @Output() selectedAccountsChange = new EventEmitter();

  set selectedAccounts(val) {
    this.selectedAccountsArray = val;
    this.selectedAccountsChange.emit(this.selectedAccountsArray);
  }
  @Output() reset = new EventEmitter();
  @Output() testAccountEvent = new EventEmitter();
  @ViewChild('modalTesting') private modalTesting;

  

  ngOnInit() {
    // this.selectedAccounts.forEach((acc) => this.selectedAccountsName.push(acc.accName));
    this.step = 'approval-step';
  }

  openModal() {
    // TODO: Set the modal with the values
    this.open(this.modalTesting);
  }

  retrieveTooltip() {
    this.selectedAccountsName = [];
    this.selectedAccounts.forEach((acc) => {
      this.selectedAccountsName.push(acc.accName);
    });
    return this.selectedAccountsName.join(', ');
  }

  testAccounts($event) {
    this.step = 'finish-step';
    this.testAccountEvent.emit();

    // trigger the test Account Service
  }

  toogleBackNavLayer(c){
    c('Close click');
    if(document.querySelector('.mp-back')) {
      let element: HTMLElement =  document.querySelector('.mp-back') as HTMLElement;
      element.click();
      
      this.routerRef.navigate(['/home']);

    }
  }

}
