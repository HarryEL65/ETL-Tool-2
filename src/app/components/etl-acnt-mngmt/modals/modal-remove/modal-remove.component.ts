import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalComponent } from '../../../etl-shared/modal/modal.component';
import { AddAccountService } from '../../../../services/add-account.service';
import { RemoveActiveAccountService } from '../../../../services/remove-active-account.service';
import { Body } from '../../../../models/message.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

/**
 * 
 * 
 * @export
 * @class ModalRemoveComponent
 * @extends {ModalComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'wp-etl-modal-remove',
  templateUrl: './modal-remove.component.html',
  styleUrls: ['./modal-remove.component.scss']
})
export class ModalRemoveComponent extends ModalComponent implements OnInit {

  /**
    * *-------------
    * !   Variables
    * *-------------
   * 
   * 
   * @memberOf ModalRemoveComponent
  */

  step;
  selectedAccountsName = [];
  selectedAccountsArray = [];

  /**
    * *----------------
    * !   DECORATORS
    * *---------------- 
   * 
   * 
   * @memberOf ModalRemoveComponent
   */
  @Input() routerRef;
  @Input() get selectedAccounts() {
    return this.selectedAccountsArray;
  }

  @Output() removeAccountEvent = new EventEmitter();
  @Output() selectedAccountsChange = new EventEmitter();
  set selectedAccounts(val) {
    this.selectedAccountsArray = val;
    this.selectedAccountsChange.emit(this.selectedAccountsArray);
  }
  @ViewChild('modalRemove') modalRemove;


  /**
   *  * --------------
   *  !    ngOnInit: 
   *  * --------------
   * 
   *  This event initializes after Angular first displays the data-bound properties
   *  or when the component has been initialized. This event is basically called only after the ngOnChanges()events.
   *  This event is mainly used for the initialize data in a component
   * 
   *  @memberOf ChangeRecordTypeMerchantComponent
   */
  ngOnInit() {
    this.step = 'areYouSure';

  }

  /**
    * *----------------
    * !   openModal
    * *---------------- 
   * 
   * 
   * @memberOf ModalRemoveComponent
   */
  openModal() {
    // TODO: Set the modal with the values
    this.step = 'areYouSure';
    this.open(this.modalRemove);
  }

  /**
  * *--------------------
  * !   retrieveTooltip
  * *------------------- 
  * 
  * @returns 
  * 
  * @memberOf ModalRemoveComponent`
  */
  retrieveTooltip() {
    this.selectedAccountsName = [];
    this.selectedAccounts.forEach((acc) => {
      this.selectedAccountsName.push(acc.accName);
    });
    return this.selectedAccountsName.join(', ');
  }

  /**
  * *--------------------------
  * !   removeSelectedAccounts
  * *-------------------------- 
  * 
  * @param {any} $event 
  * 
  * @memberOf ModalRemoveComponent
  */
  removeSelectedAccounts($event) {
    this.step = 'success';
    this.removeAccountEvent.emit();
    // trigger the test Account Service
  }
  /**
  * *----------------------
  * !   backToRemoveAccnts
  * *---------------------- 
   * 
   * @param {any} $event 
   * 
   * @memberOf ModalRemoveComponent
   */
  backToRemoveAccnts($event) {
    this.selectedAccounts = [];
    // this.modalRemove.d('Cross click');
  }


  /**
   * *----------------------
   * !   toogleBackNavLayer
   * *--------------------- 
   * 
   * @param {any} c 
   * 
   * @memberOf ModalRemoveComponent
   */
  toogleBackNavLayer(c) {
    c('Close click');
    if (document.querySelector('.mp-back')) {
      let element: HTMLElement = document.querySelector('.mp-back') as HTMLElement;
      element.click();
      this.routerRef.navigate(['/home']);
    }
  }


}
