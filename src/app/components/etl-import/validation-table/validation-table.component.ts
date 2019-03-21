import { DownloadToExcelService } from './../../../services/download-to-excel.service';
import { DataBody } from './../../../models/data-body';
import { Globals, ImportStatus, Action } from './../../../utilities/globals';
import { ModalComponent } from './../../etl-shared/modal/modal.component';
import { Router } from '@angular/router';
import {SimpleChanges} from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, ViewChild, ViewEncapsulation, Input, OnInit, TemplateRef,
         AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Account } from '../../../models/account';
import { OnChanges, OnDestroy } from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { EtlAuthenticationService } from '../../../services/etl-authentication.service';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { MediaQueriesService } from '../../../services/media-queries.service';
import { LoadFilesService } from '../../../services/load-files.service';

@Component({
  selector: 'wp-etl-validation-table',
  templateUrl: './validation-table.component.html',
  styleUrls: ['./validation-table.component.scss']
})
export class ValidationTableComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy { 

    private subscription = new Subscription(); // Collection to handle all subscriptions
    
    private currentComponentWidth;
    public loggedInUser;
    public validationTitle
    public actionBtnTitle;
    public isValidationInfoEnabled;
    public rprtId = 'MERCHANT_DATA';
    public modalStep = 1;
    dataBody: DataBody = new DataBody();
    ImportStatus = ImportStatus;
    Action = Action;
    public isUploadeFilesCompleted=false;
    // public: isBtnEnabled;
  
    // @Input() title;
    @Input() rows;
    selected: any[] = [];
    @Input() loadIndicator;
    @Input() status=ImportStatus.VALIDATED;
    @ViewChild('tableWrapperValidation') tableWrapper;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    @ViewChild('uploadModal') uploadModal;

  
  
    // Permission for clicking the pending acceptance
    hasPermission = false;
    isMerchant = false;
    firstTime = true;
  
    expanded: any = {};


  constructor(public ref: ChangeDetectorRef,
    private authenticationService: EtlAuthenticationService,
    public router: Router,
    public globals: Globals,
    public mdqSrv: MediaQueriesService,
    public loadFileSrv: LoadFilesService,
    public downloadToCsvSrv: DownloadToExcelService
  ) {}

  ngOnInit() {

    this.setValidationStatusTitle();

    const uploadSubscription = this.loadFileSrv.uploadFilesEvent.subscribe( res => {
      // display file Upload popup status
      console.log('end of upload process');
      // const message = 'All ' + res.length + ' were loaded and waiting for the DWH to collect';
      // // set step 2 of Load Validated Files Modal;
      this.isUploadeFilesCompleted = true;
      this.modalStep = 2;
      // this.uploadModal.openModal()
    },error => {
        this.modalStep = 3;
        console.error('Error uploading files to landing zone', error);
        this.isUploadeFilesCompleted = true;
    });
    
    this.subscription.add(uploadSubscription);

  }

  // onDeletedataChange(event, row){
  //   console.log('event', event);
  //   console.log('row', row);
  //   if (row.isDeleted === undefined) {
  //     row.isDeleted = true;
  //     console.log('row.isDeleted', row.isDeleted);
  //   } else {
  //     row.isDeleted = !row.isDeleted;
  //     console.log('row.isDeleted', row.isDeleted);
  //   }
  // }
  setTooltip(text) {
    return this.mdqSrv.XS ? text : '';
  }

  onSelect({ selected }) {

      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
      console.log('selected',this.selected);
      // this.selectedAccounts.emit(this.selected);
      // this.isRowLimitation = false;
  }
  
  setValidationStatusTitle() {

    if(this.status === ImportStatus.VALIDATED) {

      this.validationTitle = `VALIDATED FILES (${this.rows.length} files)`  
      this.actionBtnTitle = "Load";
      this.isValidationInfoEnabled = false;

    } else if(this.status === ImportStatus.WARNING) {

      this.validationTitle = `WARNING FILES (${this.rows.length} files)`;
      this.actionBtnTitle = "Load";
      this.isValidationInfoEnabled = true;

    } else if(this.status === ImportStatus.FAILED) {

      this.validationTitle = `FAILED FILES (${this.rows.length} files)`
      this.actionBtnTitle = "Download Failures";
      this.isValidationInfoEnabled = false;    
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // unsubscribe from all event emitter
  }

  ngAfterViewInit() {
    this.table.columnMode = ColumnMode.force;
  }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.ref.detectChanges();
    }
  }

  getRowHeight(row) {
    if (!row) { return 71; }
    if (row.height === undefined) { return 71; }
    return row.height;
  }

  sortAlphaNum(a, b) {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;
    const aA = a.replace(reA, '');
    const bA = b.replace(reA, '');
    if (aA === bA) {
      const aN = parseInt(a.replace(reN, ''), 10);
      const bN = parseInt(b.replace(reN, ''), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  }


  setPermission(val: boolean) {
      this.hasPermission = val;
  }
  setIsMerchant(val: boolean) {
      this.isMerchant = val;
  }
  
  calculateClasses(value) {
      if (!this.hasPermission && value === 'pending') {
          return {
              'disabled': true
          };
      }
  }
  
  calculateRowHeight() {
    // tslint:disable-next-line:max-line-length
        if ( this.mdqSrv.XL && !this.firstTime) {
             this.table.rowDetail.collapseAllRows();
        }
        // if ( this.mdqSrv.MD || this.mdqSrv.LG || this.mdqSrv.XL) {
            return 100;
        // } else {
            // return 200;
        // }
  }
  
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
    // this.error = this.convertArrOfObjctsToCSV({ data: row.report });
  }
  
  // hack to prevent Error in console
  // ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. 
  // Previous value: 'className: datatable-body-cell sort-active active'. 
  // Current value: 'className: datatable-body-cell sort-active'
  click(event){
    if(event.type === 'click'){
      event.cellElement.blur();
    }
  }

  uploadValidatedFiles () {
    this.rows.map((row) => {
      return this.selected.map( (sel) => {
        if(sel.fileName === row.fileName) {
          row.isDeleted = true;
        }
      })
    })
    // this.dataBody.setAccounts(this.rows); 
    this.loadFileSrv.uploadFiles(this.rows);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) { 
      const change = changes[propName]; 
      if(changes.rows.currentValue !== changes.rows.previousValue) 
      if (changes['rows'] && this.rows) { 
        if (this.rows.length > 0) { 
          this.dataBody.setAccounts(this.rows); 
        } 
      } 
    } 
  }

  // Clicking on this button will download an Excel file
  // holding the failed file names and the validations list (including the status)
  downloadFailure () {
    const rows = this.rows;
    const failureFiles = rows.filter(row => row.validationResultMessage.resultStatus === 'failed');
    console.log('failureFiles', failureFiles);
    let failedValidations = failureFiles.map(row => {
      return row.validationResultMessage.validationMessageArray.map(msg => {
        return {
          fileName : row.fileName,
          testName : msg.testName,
          status   : msg.status
        }
        
      }).filter(msg => msg.status === ImportStatus.FAILED);
    });
    console.log('failedValidations', failedValidations);
    // concatenate dynamically all the array to a single array
    const flattenedValidations = [].concat(...failedValidations);
    console.log('failedValidations', flattenedValidations);
    flattenedValidations['filename'] = 'ValidationsFailures'
    this.downloadToCsvSrv.downloadToCSV(flattenedValidations);
    
  }

  openUploadModal(status) {
    this.modalStep = 1;
    this.uploadModal.openModal();
  }

  validateAction(status) {
    if (status === ImportStatus.VALIDATED || status === ImportStatus.WARNING) {
      this.openUploadModal(status);
    } else if (status === ImportStatus.FAILED){
      this.downloadFailure();
    }
  }

  onCheckboxChangeFn(){
    
  }

}
