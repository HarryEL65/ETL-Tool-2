import { JsonLockService } from './../../../services/json-lock.service';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Globals } from '../../../utilities/globals';
import { AppEventBusService } from '../../../app.event-bus.service';
import { SecondLevelFilterService } from '../../../services/second-level-filter.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'wp-etl-second-level-filter',
  templateUrl: './second-level-filter.component.html',
  styleUrls: ['./second-level-filter.component.scss']
})
export class SecondLevelFilterComponent implements OnInit, OnDestroy {
  
  @Input() accountsName; // Holds the accounts name list for the selected affiliate program
  
  @Output() filterData = new EventEmitter();
  @Output() affiliatesChanged = new EventEmitter();
  
  @ViewChild('accntsSelect') public ngSelect: NgSelectComponent;
  @ViewChild('affiliates') public ngSelectAffiliate: NgSelectComponent;
  @ViewChild('inputFilter') public inputFilter: ElementRef;
  
  // Variables for the framework request using the WebSockets
  affiliatesList = null;
  selectedAffiliate = null;
  affiliatesName;
  isJsonLocked = false;
  
  
  constructor(private eventBusService: AppEventBusService,
              private secondLevelFilterService: SecondLevelFilterService,
              private jsonLockSrv: JsonLockService) { }
  
  ngOnInit() {
    // console.log('second-level-filter init');
    // console.log(this.secondLevelFilterService.getAction());
    this.loadData();
    this.jsonLockSrv.change.subscribe(isLock => {
      this.isJsonLocked = isLock;
    });
  }

  focusInputFilter($event) {
    setTimeout(() => {
      if (this.inputFilter) {
        this.inputFilter.nativeElement.focus()
      } else {
        return;
      }
    }, 300);
  }

  ngOnDestroy(): void {
      this.secondLevelFilterService.getAffiliatedAccnts.unsubscribe();
  }


  private loadData(): void {
      // Subscribe to the getAffilates function which will return the affiliate accounts list
      this.secondLevelFilterService.getAffiliatedAccnts.subscribe(res => {
        if (res) {
          this.affiliatesList = res;
          this.selectedAffiliate = res[0].Id;
        }
      });
      // Get the list of affiliates
      this.secondLevelFilterService.getAffiliates();
  }


  // /* demy data */
  private fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/affiliates.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateFilter($event) {
    if ( typeof $event === 'object') {
      setTimeout(() => this.filterData.emit($event.target.value));
    } else if (typeof $event === 'string') {
      setTimeout(() => this.filterData.emit($event), 300);
    } else {
      this.filterData.emit(' ');
    }
  }

  getAffilateSelection(event) {
    if(event && event.Id){
      this.affiliatesChanged.emit('');
    }
    // document.getElementById('searchAccountSelect').innerText = '';
    // this.ngSelect.clea
    if (document.querySelector('#searchAccountSelect .ng-value-label.ng-star-inserted')) {
      document.querySelector('#searchAccountSelect .ng-value-label.ng-star-inserted').innerHTML = '';
    }
    // Reset the Search Accounts select box if any selection
    // In case a json from the previous affiliate selection is locked
    // we unlock the json selection
    if (this.isJsonLocked) {
      this.jsonLockSrv.lock(false); // ==>  will unlock
    }

    if (event && event.Id) {
      this.secondLevelFilterService.initManualAccntsTable(event);
    } else if (!event) { // event undifined ==> click on 'x' (reset filter)
      this.secondLevelFilterService.initManualAccntsTable('fake-data');
    }
  }

}
