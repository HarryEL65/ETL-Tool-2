import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../etl-shared/modal/modal.component';
import { ImportStatus } from '../../../../utilities/globals';


@Component({
  selector: 'wp-etl-load-validated-files-modal',
  templateUrl: './load-validated-files-modal.component.html',
  styleUrls: ['./load-validated-files-modal.component.scss']
})
export class LoadValidatedFilesModalComponent extends ModalComponent implements OnInit , OnChanges
{

  selectedAccountsName = [];
  selectedAccountsArray = [];
  title;
  numberOfFiles;
  loadingIndicator = false;
  isOkBtnDisabled = false;

  @Input() data;
  @Input() reportId;
  @Input() status;
  @Input() step = 1;
  @Input() isUploadeFilesCompleted;
  @Output() uploadAccountsEvent: EventEmitter<any> = new EventEmitter();
  
  ngOnInit() {
    if(this.status  === ImportStatus.VALIDATED) {
      this.title = 'Load "Validated" Files';
    } else if ( this.status === 'warning') {
      this.title = 'Load "Warning" Files';
    }
    this.numberOfFiles = this.data.accounts.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    for (const propName in changes) {
        const change = changes[propName];
        if (changes['isUploadeFilesCompleted']) {
           this.loadingIndicator = false;
        }
     }
  }

  changeStep() {
     this.step = 1;
  }


  uploadFiles() {
      this.loadingIndicator = true;
      this.uploadAccountsEvent.emit();
      this.isOkBtnDisabled = true;

  }

  resetStep() {
      this.isOkBtnDisabled = false;
      this.step = 1;
  }

}



