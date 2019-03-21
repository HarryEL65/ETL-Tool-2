import { MediaQueriesService } from './../../../../../services/media-queries.service';
import {
  Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges,
  OnDestroy, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { Globals } from '../../../../../utilities/globals';
import { Observable } from 'rxjs/Observable';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { AddAccountService } from '../../../../../services/add-account.service';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { SideBarTogglerService } from '../../../../../services/side-bar-toggler.service';
import { JsonLockService } from '../../../../../services/json-lock.service';
import { CaseInsensitivePipe } from '../../../../../pipes/case-insensitive.pipe';
import { EtlAuthenticationService } from '../../../../../services/etl-authentication.service';


/**
 * 
 * 
 * @export
 * @class JsonLikeListComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 * @implements {OnDestroy}
 * @implements {AfterViewInit}
 * @implements {AfterViewChecked}
 */
@Component({
  selector: 'wp-etl-json-like-list',
  templateUrl: './json-like-list.component.html',
  styleUrls: ['./json-like-list.component.scss'],
})

export class JsonLikeListComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {


  /**
   * 
   * *-------------
   * !   Variables
   * *-------------
   *  
   * @memberOf JsonLikeListComponent
   */
  columns = [];
  rows = [];
  selected = [];
  defautJsonLike;
  accntsLikeJsonName;
  accntsLikeJsonTemp;
  accntsLikeJson = null;
  lock: false;
  selection;
  isOpen;
  hasPermission = false;
  private currentComponentWidth;

  /**
   * 
   * *-----------------
   * !   Decorators    
   * *-----------------
   * @memberOf JsonLikeListComponent
   */
  @Input() isLocked: any = {};
  @Input() manAccSelection;
  @Input() loadingIndicator = true;
  @Output() JsonLikeSelect = new EventEmitter();
  @Output() newJsonTemplate = new EventEmitter();

  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(public globals: Globals,
    public mdqSrv: MediaQueriesService,
    private addAccountService: AddAccountService,
    private sideBarService: SideBarTogglerService,
    private jsonLockSrv: JsonLockService,
    public ref: ChangeDetectorRef,
    public caseInsense: CaseInsensitivePipe,
    public authenticationService: EtlAuthenticationService) { }

  /**  
  *   ?----------------------
  *   ? LIFE CYCLE FUNCTIONS 
  *   ?---------------------
  */

 /**
   *  * --------------
   *  !    ngOnInit: 
   *  * --------------
   * 
   *  This event initializes after Angular first displays the data-bound properties
   *  or when the component has been initialized. This event is basically called only after the ngOnChanges()events.
   *  This event is mainly used for the initialize data in a component
   *  
   *  @memberOf JsonLikeListComponent
   */   

  ngOnInit() {

    this.authenticationService.hasPermission('add_new_json').subscribe(res => {
      if (res) {
        this.setPermission(true);
        return;
      } else {
        this.setPermission(false);
        return;
      }
    });

    this.jsonLockSrv.change.subscribe(isLock => {
      this.lock = isLock;
    });

    if (this.isLocked) {
      this.lock = this.isLocked;
    }
    this.loadData();

  }

  /**
   *  *--------------------
   *  ! ngAfterViewInit
   *  *--------------------
   * 
   *  This lifecycle hook method executes when the component’s view has been fully initialized.
   *  This method is initialized after Angular initializes the component’s view and child views
   *  It is called after ngAfterContentChecked().
   *  This lifecycle hook method only applies to components. 
   * 
   *  @memberOf JsonLikeListComponent
   */

  ngAfterViewInit() {

    this.table.columnMode = ColumnMode.force;

  }

  /**
   * *---------------------
   * ! ngAfterViewChecked 
   * *---------------------
   * 
   *  This method is called after the ngAterViewInit() method. 
   *  It is executed every time the view of the given component has been checked 
   *  by the change detection algorithm of Angular. 
   *  This method executes after every subsequent execution of the ngAfterContentChecked(). 
   *  This method also executes when any binding of the children directives has been changed. 
   *  So this method is very useful when the component waits for some value which is coming 
   *  from its child components.
   * 
   * 
   * @memberOf JsonLikeListComponent
   */
  ngAfterViewChecked() {

    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.ref.detectChanges();
    }

  }


  /**
   * *----------------
   * !  ngOnDestroy 
   * *----------------
   * 
   *  This method will be executed just before Angular destroys the components.
   *  This method is very useful for unsubscribing from the observables and detaching 
   *  the event handlers to avoid memory leaks. Actually, it is called just before the instance 
   *  of the component is finally destroyed. 
   *  This method is called just before the component is removed from the DOM.
   * 
   * 
   * @memberOf JsonLikeListComponent
   */
  ngOnDestroy(): void {
    this.addAccountService.getJsonLikeList.unsubscribe();
  }


  /**
   * *------------------
   * !   ngOnChanges 
   * *------------------
   * 
   *  This event executes every time when a value of an input control within the component has been changed.
   *  Actually, this event is fired first when a value of a bound property has been changed.
   *  It always receives a change data map, containing the current and previous value of the bound property wrapped
   *  in a SimpleChange.
   * 
   * @param {SimpleChanges} changes 
   * 
   * @memberOf JsonLikeListComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLocked']) {
      // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      const curVal = JSON.stringify(changes['isLocked'].currentValue);
      const prevVal = JSON.stringify(changes['isLocked'].previousValue);
      if (curVal !== prevVal) {

        this.lock = changes['isLocked'].currentValue;
        // // Emit to parent the jsonLike selected only when user has
        // // locked the json by click on "Choose this JSON" in JsonLikeView comp.
        if (this.lock && this.selection) {
          this.JsonLikeSelect.emit(this.selection);
        }
      }
    } else if (changes['loadingIndicator']) {
      if (this.loadingIndicator) {
        this.newJsonTemplate.emit(false);
      }
    }

  }

  /**
   * *-------------------------
   * !   calculateRowHeight
   * *-------------------------
   * 
   * @returns 
   * 
   * @memberOf JsonLikeListComponent
   */
  calculateRowHeight() {
    return 100;
  }


  /**
   * *-------------------------
   * !   onDetailToggle
   * *-------------------------
   * 
   * @param {any} event 
   * 
   * @memberOf JsonLikeListComponent
   */
  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }

  /**
   * *-------------------------
   * !   toggleExpandRow
   * *-------------------------
   * 
   * @param {any} row 
   * 
   * @memberOf JsonLikeListComponent
   */
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }


  /**
   * *--------------
   * !   fetch
   * *--------------
   * 
   * @private
   * @param {any} cb 
   * 
   * @memberOf JsonLikeListComponent
   */
  private fetch(cb) {

    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/jsonLikeList.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();

  }

  /**
   * *--------------
   * !   loadData
   * *--------------
   * 
   * @private
   * 
   * @memberOf JsonLikeListComponent
   */
  private loadData(): void {

    this.addAccountService.getJsonLikeList.subscribe(res => {
      this.accntsLikeJsonName = [];
      this.accntsLikeJsonTemp = [...res.ActiveAccounts];
      this.accntsLikeJson = res.ActiveAccounts;
      this.accntsLikeJson.map((row) => {
        this.accntsLikeJsonName.push(row.accName);
      });
      this.rows = this.accntsLikeJson;
      this.loadingIndicator = false;
      if (this.rows.length > 0) {
        this.newJsonTemplate.emit(false);
      }
      //* Set the first jsonlike from the list
      //* to be the default selected.
      this.selected = [this.accntsLikeJson[0]];
      this.defautJsonLike = (this.accntsLikeJson[0]) ? this.accntsLikeJson[0].accID : null;
      if (typeof this.defautJsonLike === 'number') {
        this.JsonLikeSelect.emit(this.defautJsonLike);
      } else if (this.defautJsonLike === null) {
        this.JsonLikeSelect.emit(null);
      }
    });

  }

  /**
   * *-----------------
   * !  setPermission
   * *-----------------
   * 
   * @param {boolean} val 
   * 
   * @memberOf JsonLikeListComponent
   */
  setPermission(val: boolean) {

    this.hasPermission = val;

  }

  /**
   * *--------------------------
   * ! addNewJsonTemplate
   * *---------------------------
   * 
   * @memberOf JsonLikeListComponent
   */
  addNewJsonTemplate() {

    this.newJsonTemplate.emit(true);
    this.JsonLikeSelect.emit({ 'fake': 'true' });

  }


  /**
   * *--------------
   * !  onSelect
   * *--------------
   * 
   * @param {any} { selected } 
   * 
   * @memberOf JsonLikeListComponent
   */
  onSelect({ selected }) {

    this.selected = [...selected];
    this.selection = [...selected][0].accID;

  }


  /**
   * *------------------------
   * !   filterJsonLikeTable
   * *------------------------
   * 
   * @param {any} event 
   * 
   * @memberOf JsonLikeListComponent
   */
  filterJsonLikeTable(event) {

    const val = event;
    const re = val;
    let temp = this.accntsLikeJsonTemp;
    if (val) {
      temp = this.accntsLikeJsonTemp.filter((row) => this.caseInsense.transform(row.accName, val, true));
      this.rows = temp;
      this.selected = [this.rows[0]];
      if (Array.isArray(this.selected) && this.selected[0] !== undefined) {
        this.selection = this.selected[0].accID;
      } else if (this.selected) {
        this.selection = this.selected['accID'];
      } else {
        this.selection = '';
      }
      this.defautJsonLike = this.selection;
    } else { // when clear filter from selection

      if (val !== "") {
        this.accntsLikeJsonName = [...this.accntsLikeJsonName];
        this.accntsLikeJsonTemp = [...this.accntsLikeJsonTemp];
        this.accntsLikeJson = [...this.accntsLikeJsonTemp];
      }
      this.rows = this.accntsLikeJson;
      this.loadingIndicator = false;
      if (this.rows.length > 0) {
        this.newJsonTemplate.emit(false);
      }
      //* Set the first jsonlike from the list
      //* to be the default selected.
      this.selected = [this.accntsLikeJson[0]];
      this.selection = [this.selected[0].accID];
      this.defautJsonLike = (this.accntsLikeJson[0]) ? this.accntsLikeJson[0].accID : null;
      if (typeof this.defautJsonLike === 'number') {
        this.JsonLikeSelect.emit(this.defautJsonLike);
      } else if (this.defautJsonLike === null) {
        this.JsonLikeSelect.emit(null);
      }
    }
    this.JsonLikeSelect.emit(this.selection);

  }


  /**
   * *-------------------
   * !  updateFilter
   * *-------------------
   * 
   * @param {any} $event 
   * 
   * @memberOf JsonLikeListComponent
   */
  updateFilter($event) {

    if (typeof $event === 'object') {
      setTimeout(() => this.filterJsonLikeTable($event.target.value));
    } else if (typeof $event === 'string') {
      setTimeout(() => this.filterJsonLikeTable($event), 300);
    } else {
      this.filterJsonLikeTable(undefined);
    }

  }

  /**
   * *----------------------------
   * ! displaySelectedJsonLike
   * *----------------------------
   * 
   * @param {any} accID 
   * 
   * @memberOf JsonLikeListComponent
   */
  displaySelectedJsonLike(accID) {

    if (typeof accID === 'number') {
      this.JsonLikeSelect.emit(accID);
    }

  }

}
