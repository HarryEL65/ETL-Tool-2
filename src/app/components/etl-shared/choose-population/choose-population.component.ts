import { DatePipe } from '@angular/common';
import { } from '@angular/compiler/src/core';
// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, Output, EventEmitter, OnDestroy, Input,
  AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Globals } from '../../../utilities/globals';
import { AddAccountService } from '../../../services/add-account.service';
import { Subscription } from 'rxjs/Subscription';
import { SecondLevelFilterService } from '../../../services/second-level-filter.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { CaseInsensitivePipe } from '../../../pipes/case-insensitive.pipe';
import { CustomDatePipe } from '../../../pipes/custom-date.pipe';
import { CustomDateTimePipe } from '../../../pipes/custom-date-time.pipe';
import { MediaQueriesService } from '../../../services/media-queries.service';




@Component({
  selector: 'wp-etl-choose-population',
  templateUrl: './choose-population.component.html',
  styleUrls: ['./choose-population.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChoosePopulationComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  private subscription = new Subscription(); // Collection to handle all subscriptions
  columns = [];
  rows = [];
  selectedAccountsArray = [];
  ids = [];

  isAdvancedMode;
  editorOptions: JsonEditorOptions;
  options = {
    mode: 'view'
  };
  jsonConfigsTempArr = [];

  // selected = [];
  isRowLimitation;
  currentDate;
  dates;
  currentComponentWidth;
  loadingIndicator = true;
  affiliateProgramName;
  manulaAccntsName;
  manulaAccnts = null;
  firstTime = true;
  @Input() isMultiSelect;
  @Input() maxSlctnRcrdAllowed?=20;
  @Input() selected;
  @Input() action;
  @Input() isMultiSelection;
  @Output() isLoadingAfterNewAffiliate = new EventEmitter();
  @ViewChild('tableWrapper') tableWrapper;
  // @ViewChild('tableAccounts') tableAccounts: any;
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  // this the same as the previos line
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // @ViewChild( 'modalConfigRmv' ) modalConfigComponent;


  @Output() selectedAccounts = new EventEmitter();
  @Output() affiliateChng = new EventEmitter();
  @Output() jsonLikeList = new EventEmitter();

  
  constructor(public globals: Globals,
    public mdqSrv: MediaQueriesService,
              private secondLevelFilterService: SecondLevelFilterService,
              public ref: ChangeDetectorRef,
              private datePipe: DatePipe,
              public caseInsense: CaseInsensitivePipe
            ) { }
            
            ngOnInit() {
    const GLOBAL_ACTION = this.globals.Action;
    // console.log('Choose-population init page');
    this.loadData(this.action);
    this.secondLevelFilterService.setAction(this.action); // Set the step - add account, rerun account, Need to support remove account
    this.isRowLimitation = false;
    this.createEditor();
  }

  ngOnDestroy(): void {
      // console.log('choose-population destroy');
      this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.table.columnMode = ColumnMode.force;
  }
  ngAfterViewChecked() {
    // Check if the table size has changed,
    // tslint:disable-next-line:max-line-length
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
       this.ref.detectChanges();
    }
  }
  private initializeDates() {
    this.currentDate = this.globals.getCurrentDate();
    this.dates = this.globals.getMonthsFromToday(24);
  }

  // /* demy data */
  private fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/manualAccounts.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
  changeLoadingIndicator() {
    this.loadingIndicator = true;
    this.isLoadingAfterNewAffiliate.emit(true);
  }


  private loadData(action): void {
      let _self = this;
      const ACTION = this.globals.Action;
      const getAffProgSubscribe = this.secondLevelFilterService.getAffiliateProgramName.subscribe(res => {
          this.affiliateProgramName = res.id;
          this.affiliateChng.emit(res);

          // activate the add account service json like if action == add account
          switch (action) {
              case ACTION.ADD_ACCOUNT:
                  // Update the json like table according to the affiliate program
                  // emit the updateJsonLikeList function in the add-account.component.ts
                  this.jsonLikeList.emit(res.name);
                  break;
              case ACTION.REMOVE_ACCOUNT:
                  break;
              case ACTION.CHANGE_MAPPING:
                  break;
              default:
                  break;
          }
      });

      this.subscription.add(getAffProgSubscribe);

      

      const getManualAccntSubscribe = this.secondLevelFilterService.getManualAccnt.subscribe(res => {
         this.manulaAccntsName = [];
         this.manulaAccnts = res.accounts || res.ActiveAccounts; // TODO: support more scenarios
         if (this.manulaAccnts) {
           this.rows = this.manulaAccnts.filter((row) => {
               if (row.affiliateProgramID == this.affiliateProgramName)  {
                   this.manulaAccntsName.push(row.accName);
                   row.timeStamp = row.timeStamp;
                   return row.affiliateProgramID == this.affiliateProgramName || !this.affiliateProgramName;
               }
           });
           // the param 'firstTime' is needed in order to bypass
           // error: query at index -1 failed: Fenwick tree array not initialized
           window.setTimeout( () => this.firstTime = false, 300);
        }
         this.loadingIndicator = false;
         this.isLoadingAfterNewAffiliate.emit(false);
      });

      this.subscription.add(getManualAccntSubscribe);

  }

  filterManualAccntsTable(e) {
    // filter our data
    const val = e;
    let temp;
    if (val) {
      temp = this.manulaAccnts.filter( row => this.caseInsense.transform(row.accName, val, true));
    } else {
      temp = this.manulaAccnts;
    }
    this.rows = temp;
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [ this.rows[1], this.rows[3] ];
  }

  remove() {
    this.selected = [];
  }


  onSelect({ selected }) {

    if ( selected && selected.length > 0 && selected.length <= this.maxSlctnRcrdAllowed || this.action === this.globals.Action.REMOVE_ACCOUNT) {
      // console.log('Select Event', selected, this.selected);
      // // console.log('jsonConfigsTempArr', this.jsonConfigsTempArr);
      this.mappEditedConfigToSelectedRows(selected, this.jsonConfigsTempArr);
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
      this.selectedAccounts.emit(this.selected);
      this.isRowLimitation = false;

    } else  if ( selected && selected.length === 0 ) {

      this.isRowLimitation = false;
      this.selectedAccounts.emit([]);

    } else if ( selected &&  selected.length >= this.maxSlctnRcrdAllowed ) {

      this.isRowLimitation = true;
      this.selectedAccounts.emit(this.selected);

    }
  }

  copyLinkToClipBoard($event, str) {
    // Create a <textarea> element
    const el = document.createElement('textarea');
    // Set its value to the string that you want copied
    el.value = str;
    // Make it readonly to be tamper-proof
    el.setAttribute('readonly', '');
    // Move outside the screen to make it invisible
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    // Append the <textarea> element to the HTML document
    document.body.appendChild(el);
    // Check if there is any content selected previously
    // Store selection if found
    // Mark as false to know no selection existed before
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    // Select the <textarea> content
    el.select();
    // Copy - only works as a result of a user action (e.g. click events)
    document.execCommand('copy');
    // Remove the <textarea> element
    document.body.removeChild(el);
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
  }

  // hack to prevent Error in console
  // ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. 
  // Previous value: 'className: datatable-body-cell sort-active active'. 
  // Current value: 'className: datatable-body-cell sort-active'
  click(event){
    // console.log(event)
    if(event.type === 'click'){
      event.cellElement.blur();
    }
  }

  // openModalConfig(event) {

  //   setTimeout( () => {
  //       this.modalConfigComponent.openModal()
  //   }, 300)  
  //  }

  onCheckboxChangeFn($event) {
// //     console.log('$event from choose population: ', $event);
//     this.selectedAccounts.emit($event);
  }


  onDetailToggle(event, id) {
    // // console.log('Detail Toggled', event);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
    // this.error = this.convertArrOfObjctsToCSV({ data: row.report });
  }


  calculateRowHeight() {
    // tslint:disable-next-line:max-line-length
   // const header = document.querySelector('.datatable-header-cell-label');
    if ( this.mdqSrv.XL && !this.firstTime && (this.action !== this.globals.Action.CHANGE_MAPPING)) {
       this.table.rowDetail.collapseAllRows();
     // header.click();
      return 0;
    }
    if ( this.action === this.globals.Action.CHANGE_MAPPING) {
      return 550;
    }
    return 200;
  }

  mappEditedConfigToSelectedRows(selectedRowsArr, jsonsConfigArr) {
    selectedRowsArr.filter( (row) => {
        jsonsConfigArr.filter( (ele) => {
          if ( row.accID === parseInt(ele.accID, 10) ) {
            return row.config = ele.config;
          }
      });
    });
  }

  getData() {
    // retrieve the ID of the specific json edited.
    let editedRow, idx;
    const id = this.editor.jsonEditorContainer.nativeElement.parentElement.id;
    // console.log('editor id: ', id);
    const changedJson = this.editor.get();
    // console.log('config: ', changedJson);
    const currEditedElem = document.querySelectorAll('input[class="' + id + '"]')[0];

    // 'jsonConfigsTempArr' is an array that will holds all the edited configurations.
    // first it is an empy array.
    // if the array already contains configurations then
    if ( this.jsonConfigsTempArr.length > 0 ) {
       // find the currently edited configuration 'editedRow' among all the configurations
       // already edited
        editedRow = this.jsonConfigsTempArr.filter( (ele, index) => {
          idx = index;
          // return a single row where the current editor id fit one of
          // the already json configurations id
          return parseInt(ele.accID, 10) === parseInt(id, 10);
        });
        // we are checking if there is a row that fit the
        // currentlty edited json configuration
        if (editedRow.length === 1) {
          // In case such a row is returned we are storing the current edited json with
          // it's new changes within the jsonConfigsTempArr and overwriting the previous value
          // in the relevant idx
          this.jsonConfigsTempArr[idx].config = changedJson;
          // console.log(this.jsonConfigsTempArr);
        } else {
          // in case no row is returned,
          // it means that the current edited json has not been previously edited
          // and we are adding the entry in the 'jsonConfigsTempArr'
          this.jsonConfigsTempArr.push({accID: id, config: changedJson});
          // console.log(this.jsonConfigsTempArr);
        }
    } else {
      // if the 'jsonConfigsTempArr' array is empty and does not contains any configurations
      // we are adding the currently edited configuratinon.
      this.jsonConfigsTempArr.push({accID: id, config: changedJson});
      // console.log(this.jsonConfigsTempArr);
    }
    if ( currEditedElem ) {
      this.rows.filter( (row) => {
        if ( row.accID === parseInt( id, 10)) {
          console.log('row', row);
          this.mappEditedConfigToSelectedRows([row], this.jsonConfigsTempArr);
        }
      });
    }

    // this.saveJson(id, changedJson);
    // this.jsonConfigsTempArr.push({accID: id, config: changedJson});
  }


  change() {
    // // console.log('Dev-------> change in json:' + this.editor);
    this.getData();
  }

  createEditor() {
    // const container = document.getElementById('json-editor-' + this.jsonLike.accID);
    // var editor = new JSONEditor(container);
    this.editorOptions = new JsonEditorOptions();

    // TODO: check the user permissions and allow specific action accordingly
    this.editorOptions.modes = ['view', 'tree']; // set all allowed modes
    this.options.mode = 'view'; // set only one mode
    this.editorOptions.onChange = this.change.bind(this);

  }

}
