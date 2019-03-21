import {
  Component,
  ViewChild,
  ViewEncapsulation,
  Input,
  OnInit,
  TemplateRef,
  AfterViewInit, AfterViewChecked, ChangeDetectorRef,
  OnChanges, SimpleChanges } from '@angular/core';


import { Account } from '../../../../../models/account';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { Globals } from '../../../../../utilities/globals';
import { MediaQueriesService } from '../../../../../services/media-queries.service';

@Component({
  selector: 'wp-etl-last-removed-grid',
  templateUrl: './last-removed.component.html',
  styleUrls: ['./last-removed.component.scss']
})
export class LastRemovedComponent implements OnInit , AfterViewInit, AfterViewChecked, OnChanges {

  private currentComponentWidth;
  @Input() title;
  @Input() rows;
  @Input() lstRmvAcntsAddLoadIndic;

  @ViewChild('tableWrapperLastRemovedAcc') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild( 'modalConfig' ) modalConfigComponent;

  firstTime = true;
  expanded: any = {};

  constructor(public ref: ChangeDetectorRef, 
              public globals: Globals,
              public mdqSrv: MediaQueriesService) {
  }

  ngOnInit() {

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

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line:forin
    for (const propName in changes) {
        const change = changes[propName];
        if (changes['rows'] && this.rows) {
          if (this.rows.length > 0) {
            window.setTimeout( () => this.firstTime = false, 300);
          }
        }
      }
  }

  getRowHeight(row) {
    if (!row) { return 71; }
    if (row.height === undefined)  { return 71; }
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


  calculateRowHeight() {
    // tslint:disable-next-line:max-line-length
        if ( this.mdqSrv.XL && !this.firstTime) {
          this.table.rowDetail.collapseAllRows();
        }
        return 100;
  }

  toggleExpandRow(row) {
      this.table.rowDetail.toggleExpandRow(row);
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

  openModalConfig(event) {

    setTimeout( () => {
        this.modalConfigComponent.openModal()
    }, 300)  
   }

}
