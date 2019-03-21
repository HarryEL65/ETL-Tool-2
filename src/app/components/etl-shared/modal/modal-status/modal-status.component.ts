import { Globals, ImportStatus } from './../../../../utilities/globals';
import { Component, Input, ViewChild, AfterContentInit, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ModalComponent } from '../../../etl-shared/modal/modal.component';
import { Router } from '@angular/router';
import { Action as ACTION_TYPE} from '../../../../utilities/globals';

@Component({
  selector: 'wp-etl-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrls: ['./modal-status.component.scss']
})
export class ModalStatusComponent extends ModalComponent implements OnInit, OnChanges, AfterContentInit {

  ACTION =  ACTION_TYPE
  originalStatus;
  currentStatus;
  @Input() action: string;
  @Input() data: any[] = [];
  @Input() mdqSrv:any;
  @Input() rprtId;
  @Input() actName: string;
  @Input() affillatePrgmName: string;
  @Input() accId: number;
  @Input() account;
  @Input() madeBy: string;
  @Input() loggedInUser: string;
  @Input() isMerchant; boolean;

  @Input()
  get status() {
    return this.currentStatus;
  }
  @Output() statusChange  = new EventEmitter();
  set status(val) {
     this.currentStatus = val;
     this.statusChange.emit(val);
  }

  @ViewChild('modalStatus') private modalStatus;
  title;


  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.originalStatus === 'testing') {
          this.originalStatus = changes.status.currentValue;
      }
  }

  // A lifecycle hook that is called after Angular has fully initialized all content of a directive
  ngAfterContentInit() {

    this.originalStatus = this.status;

    if (this.originalStatus === 'pending') {

      this.title  = this.affillatePrgmName + ' ' + this.actName + ' - ' + 'Pending Acceptance';

    } else if(this.action === this.ACTION.IMPORT_FILES) {

      this.title = this.title + ' - ' + this.capitalizeFirstLetter(this.originalStatus) ;    

    } else {
      this.title = this.affillatePrgmName + ' ' + this.actName + ' - ' + this.capitalizeFirstLetter(this.originalStatus) ;
    }
  }

  convertStatus(status){
    if(status === ImportStatus.VALIDATED){
      return 'accepted'
    } else if ( status === 'warning') {
      return 'running'
    } else {
      return status;
    }
  }

  // TODO: get the data from clicking on the row to be transferred to the modal
  // Allows a parent component access the open modal function
  openModal() {
    // console.log('In myOpen function from the modal-status OVERRIDE');
    // TODO: Set the modal with the values
    setTimeout(() => {
      this.originalStatus = this.status;
      this.open(this.modalStatus);
    });
  }
  isPendingWizardAllowed() {
    return this.originalStatus === 'pending' && (( this.loggedInUser === this.madeBy) || !this.isMerchant);
  }

  capitalizeFirstLetter(word) {
    if (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      return '';
    }
  }

  setNewStatus(val) {
    this.currentStatus = val;
  }

}
