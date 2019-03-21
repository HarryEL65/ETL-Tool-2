import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Globals } from '../../../utilities/globals';
import { MediaQueriesService } from '../../../services/media-queries.service';



@Component({
  selector: 'wp-etl-choose-dates',
  templateUrl: './choose-dates.component.html',
  styleUrls: ['./choose-dates.component.scss']
})
export class ChooseDatesComponent implements OnInit, OnChanges {
  currentDate;
  dates;
  toDates = [];
  testMonthFrom;
  testMonthTo;
  numOfMonths = 24;

  @Input() action;
  @Output() dateFrom = new EventEmitter();
  @Output() dateTo = new EventEmitter();
  @Output() btnClickEvent = new EventEmitter();
  @Input() isManuaAccSelected;
  @Input() isJsonLikeSelected;
  @Input() name: string;

  @Input() isBtnEnabled;
  @Input() hasDatesPermission = true;
  
  @Input() reporId = this.globals.reportIds.MERCHANT_DATA;


  constructor(public globals: Globals,
              public mdqSrv: MediaQueriesService) { }

  ngOnInit() {
      // console.log('Choose dates init page');
      this.initializeDates();
  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line:forin
    for (const propName in changes) {
      const change = changes[propName];
      if (changes['isBtnEnabled']) {
        if (this.isBtnEnabled) {
//          console.log('isBtnEnabled', this.isBtnEnabled);
        }
      }
    }
  }

  private initializeDates() {
    this.currentDate = this.globals.getCurrentDate();
    this.dates = this.globals.getMonthsFromToday(this.numOfMonths);

    // Set the dates array (from date) - if user has permission and is merchant than he can choose to run a rerun
    // on the current date and the month before only else all other users can choose all the dates
    if (!this.hasDatesPermission) {
        this.dates = this.dates.slice(0, this.numOfMonths - this.dates[0].value + 2);
    }

    // {value: number, label:'date'}
    this.toDates = this.dates.slice(0, this.numOfMonths - this.dates[0].value + 1);


    // defining the default value for selectbox
    // this is the second option ==> not the current month but the last one
    if(this.action===this.globals.Action.RERUN_ACCOUNT_MOBILE) {
      this.testMonthFrom = this.dates[1];
    } else {
      this.testMonthFrom = this.dates[0];
    }

    this.dateFrom.emit(this.testMonthFrom);

    // defining the default value for selectbox
    // this is the second option ==> not the current month but the last one
    if(this.action===this.globals.Action.RERUN_ACCOUNT_MOBILE) {
      this.testMonthTo = this.dates[1];
    } else {
      this.testMonthTo = this.dates[0];
    }
    
    
    this.dateTo.emit(this.testMonthTo);

  }

  addAccount() {
    this.btnClickEvent.emit('');
  }

  getFromDateSelection(fromDate) {

    // Set as default value the first
    if (this.testMonthFrom.value > this.testMonthTo.value) {
      this.testMonthTo  =  fromDate;
    }

    this.dateFrom.emit(fromDate);

    this.getAheadsDates(fromDate);
    this.dateTo.emit(this.testMonthTo);

  }

  getToDateSelection(toDate) {
    this.dateTo.emit(toDate);
  }

  getAheadsDates(fromDate) {
    // {value: number, label:'date'}
      
      // If the report type is "DUCM" you can run only one month
      if (this.reporId == this.globals.reportIds.DUCM){
          let rangeDates = this.numOfMonths - fromDate.value;
          this.toDates = this.dates.slice(rangeDates, rangeDates + 1)
          this.testMonthTo = fromDate;
      } else {
          this.toDates = this.dates.slice(0, this.numOfMonths - fromDate.value + 1);
      }
      
  }

}
