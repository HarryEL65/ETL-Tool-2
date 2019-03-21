import { MediaQueriesService } from './../../../../../services/media-queries.service';
import { Globals } from './../../../../../utilities/globals';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { Component,
         ViewChild,
         ViewEncapsulation,
         Input,
         OnInit,
         TemplateRef,
         AfterViewInit, AfterViewChecked, ChangeDetectorRef
        } from '@angular/core';

import { Account } from '../../../../../models/account';
import { CustomDatePipe } from '../../../../../pipes/custom-date.pipe';
import { CustomDateTimePipe } from '../../../../../pipes/custom-date-time.pipe';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'wp-etl-last-reruns-grid',
  templateUrl: './last-reruns.component.html',
  styleUrls: ['./last-reruns.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    DatePipe,
    CustomDatePipe,
    CustomDateTimePipe,
  ]
})
export class LastRerunsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  private currentComponentWidth;
  @Input() title;
  @Input() rows;
  @Input() rerunAcntsAddLoadIndic;

  @ViewChild('tableWrapperLastRerunAcc') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('modalRerun') modalRerun;
  @ViewChild('modalStatus') modalStatus;
  @ViewChild('acntName') acntName;

  rprtId;
  selected: any[] = [];

  expanded: any = {};
  firstTime = true;

  constructor(public ref: ChangeDetectorRef,
              private datePipe: DatePipe,
              public router: Router,
              public globals: Globals,
              public mdqSrv: MediaQueriesService) {
  }

  ngOnInit() {
    if ( this.router.url === '/home/rptId::webpals-mobile' ) {
         this.rprtId = 'DUCM';
    } else if ( this.router.url === '/home/rptId::merchant-data') {
      this.rprtId = 'MERCHANT_DATA';
    }

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
    // this.error = this.convertArrOfObjctsToCSV({ data: row.report });
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

  // openStatusModal(status) {
  //   if ( status == 'failed' || status == 'Failed') {
  //     this.modalStatus.openModal();
  //   } else if ( status == 'passed' || status == 'Passed') {
  //     this.modalRerun.openModal();
  //   }
  // }

}
