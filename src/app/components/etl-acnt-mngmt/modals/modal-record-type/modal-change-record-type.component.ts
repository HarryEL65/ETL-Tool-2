import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../etl-shared/modal/modal.component';

/**
 * 
 * 
 * @export
 * @class ModalChangeRecordTypeComponent
 * @extends {ModalComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'wp-etl-modal-change-record-type',
  templateUrl: './modal-change-record-type.component.html',
  styleUrls: ['./modal-change-record-type.component.scss']
})
export class ModalChangeRecordTypeComponent extends ModalComponent implements OnInit {

  /**
  * *-------------
  * !   Variables
  * *-------------
  * @memberOf ModalChangeRecordTypeComponent
  */
  selectedAccountsName = [];
  selectedAccountsArray = [];
  step;

  /**
   * *-----------------
   * !   Decorators    
   * *-----------------
   * 
   * @memberOf ModalChangeRecordTypeComponent
   */
  @Input() get selectedAccounts() {
    return this.selectedAccountsArray;
  }
  @Output() selectedAccountsChange = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() changeRecordsTypeEvent = new EventEmitter();
  @ViewChild('modalChangeRcrdType') private modalChangeRcrdType;

  set selectedAccounts(val) {
    this.selectedAccountsArray = val;
    this.selectedAccountsChange.emit(this.selectedAccountsArray);
  }

  
  /**
   *  * --------------
   *  !    ngOnInit: 
   *  * --------------
   * 
   *  This event initializes after Angular first displays the data-bound properties
   *  or when the component has been initialized. This event is basically called only after the ngOnChanges()events.
   *  This event is mainly used for the initialize data in a component
   * 
   *  @memberOf ModalChangeRecordTypeComponent
   */
  ngOnInit() {
  }

  /**
   *  * --------------
    *  !    openModal 
   *  * --------------
   * 
   * 
   * @memberOf ModalChangeRecordTypeComponent
   */
  openModal() {
    this.open(this.modalChangeRcrdType);
  }

  /**
   *  * -------------------
   *  !    retrieveTooltip 
   *  * -------------------
   * 
   * @returns 
   * 
   * @memberOf ModalChangeRecordTypeComponent
   */
  retrieveTooltip() {
    this.selectedAccountsName = [];
    this.selectedAccounts.forEach((acc) => {
      this.selectedAccountsName.push(acc.accName);
    });
    return this.selectedAccountsName.join(', ');
  }

  /**
   *  * -------------------
   *  !    changeRecordsType 
   *  * -------------------
   * 
   * @param {any} $event 
   * 
   * @memberOf ModalChangeRecordTypeComponent
   */
  changeRecordsType($event) {
    $event()// d('Cross click');
    this.changeRecordsTypeEvent.emit();
  }

}
