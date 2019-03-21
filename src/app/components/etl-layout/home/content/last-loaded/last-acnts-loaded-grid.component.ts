import { Globals } from './../../../../../utilities/globals';
import { ModalComponent } from './../../../../etl-shared/modal/modal.component';
import { Router } from '@angular/router';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import {
  Component, ViewChild, ViewEncapsulation, Input, OnInit, TemplateRef,
  AfterViewInit, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { Account } from '../../../../../models/account';
import { OnChanges, OnDestroy } from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { EtlAuthenticationService } from '../../../../../services/etl-authentication.service';

import { Subscription } from 'rxjs';
import { MediaQueriesService } from '../../../../../services/media-queries.service';
import { LoadFilesService } from '../../../../../services/load-files.service';

@Component({
  selector: 'wp-etl-last-acnts-loaded-grid',
  templateUrl: './last-acnts-loaded-grid.component.html',
  styleUrls: ['./last-acnts-loaded-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LastAcntsLoadedGridComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  private subscription = new Subscription(); // Collection to handle all subscriptions

  private currentComponentWidth;
  public loggedInUser;

  @Input() rows = [];
  selected: any[] = [];
  @Input() lstAcntsLoadedLoadIndic;
  @ViewChild('tableWrapperLastLoadedAcc') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // @ViewChild( 'modalConfig' ) modalConfigComponent;


  // Permission for clicking the pending acceptance
  hasPermission = false;
  isMerchant = false;
  firstTime = true;
  rprtId;

  expanded: any = {};

  constructor(public ref: ChangeDetectorRef,
    private authenticationService: EtlAuthenticationService,
    public router: Router,
    public globals: Globals,
    public mdqSrv: MediaQueriesService,
    public LoadFilesSrv: LoadFilesService
  ) { }

  ngOnInit() {
    const hasPermissionSubscribe = this.authenticationService.hasPermission('go_live').subscribe(res => {
      if (res) {
        this.setPermission(true);
        return;
      } else {
        this.setPermission(false);
        return;
      }
    });

    this.subscription.add(hasPermissionSubscribe);


    const hasRoleSubscribe = this.authenticationService.hasRole(['merchant']).subscribe(res => {
      this.setIsMerchant(res);
    });

    this.subscription.add(hasRoleSubscribe);

    this.loggedInUser = this.authenticationService.getUserDetails().userName;

    if (this.router.url === '/home/rptId::webpals-mobile') {
      this.rprtId = 'DUCM';
    } else if (this.router.url === '/home/rptId::merchant-data') {
      this.rprtId = 'MERCHANT_DATA';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // unsubscribe from all event emitter
  }

  ngAfterViewInit() {
    if(this.table) {
      this.table.columnMode = ColumnMode.force;
    }
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
    if (this.mdqSrv.XL && !this.firstTime) {
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
  click(event) {
    if (event.type === 'click') {
      event.cellElement.blur();
    }
  }
  // openModalConfig(event) {
  //   setTimeout(() => {
  //     this.modalConfigComponent.openModal()
  //   }, 300)
  // }



}
