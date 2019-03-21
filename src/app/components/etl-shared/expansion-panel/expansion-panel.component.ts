import { MediaQueriesService } from './../../../services/media-queries.service';
import { Globals } from './../../../utilities/globals';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnChanges } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
// import { Globals } from '../../../utilities/globals';


@Component({
  selector: 'wp-etl-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit, AfterViewChecked {

  displayTable;
  displayTableChkBox: ElementRef;
  isRefreshed = false;
  selectedAccnt = '';
  @Input() title;
  @Input() id;
  @Input() searchEntityName;
  @Input() searchPlaceHolder;
  // @Input() lastRerunsActsName;
  @Output() filterData = new EventEmitter();
  // @Output() filterRerunsData = new EventEmitter();
  @ViewChild('displayTableChkBox') set content (content: ElementRef) {
    this.displayTableChkBox = content;
  }
  
  @Input() reportId = this.globals.reportIds.MERCHANT_DATA;
  
  public model: any;

  constructor ( public globals: Globals,
                public mdqSrv: MediaQueriesService ) { }

  ngOnInit() {
    this.filterData.subscribe((data) => this.selectedAccnt = data);
  }



  ngAfterViewChecked() {
    if (this.displayTableChkBox && this.displayTableChkBox.nativeElement.checked) {
      // Hack the origal issue is that somehow not all  the tables row are displayed
      // ... the Dom of the Table is not fully updated.
      // for this reason I trigger a updateFilter with an empty val to retrieve all the rows.

      // TODO: find a better solution
      if (!this.isRefreshed) {
        this.isRefreshed = true;
        const event = {
          target: {
            value: ''
          }
        };
        this.updateFilter(event, true);
      }
    } else {
      this.isRefreshed = false;
    }
  }


  onToogleTable(value: boolean) {
    this.displayTable = value;
    if (value) {
      this.updateFilter(this.selectedAccnt, false);
    }
  }

  updateFilter($event, manualTriger) {
    if (!manualTriger || !this.displayTableChkBox.nativeElement.checked) {
      this.displayTableChkBox.nativeElement.checked = true;
      if ( typeof $event === 'object') {
        setTimeout(() => this.filterData.emit($event.target.value));
      } else if (typeof $event === 'string') {
        setTimeout(() => this.filterData.emit($event), 300);
      } else {
        this.filterData.emit(' ');
      }
    }
  }
}
