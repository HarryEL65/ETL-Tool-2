import { MediaQueriesService } from './../../../services/media-queries.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Globals } from '../../../utilities/globals';

@Component({
  selector: 'wp-etl-choose-record-type',
  templateUrl: './choose-record-type.component.html',
  styleUrls: ['./choose-record-type.component.scss'],
})
export class ChooseRecordTypeComponent implements OnInit {
    
    // Variables to update Parent component
    @Output() recordTypeEmitter = new EventEmitter();
    @Output() startDateEmitter = new EventEmitter();
    @Output() ApplyClickEvent = new EventEmitter();

    @Input() isLoading;
    @Input() isBtnEnabled;
    @Input() name;
    
    // Date variables
    currentDate;
    numOfMonths;
    dates;
    startDate;
    
    // Record Type variables
    recordsType; // list of records type
    recordType; // the default value to present in the select box
    
  constructor(public globals: Globals,
              public mdqSrv: MediaQueriesService) { }

  ngOnInit() {
    this.isBtnEnabled = false;

    this.initializeStartDate();
    this.initializeRecordType();
  }

  private initializeStartDate () {
    this.numOfMonths = 12;
    this.currentDate = this.globals.getCurrentDate();
    this.dates = this.globals.getMonthsFromToday(this.numOfMonths);
    this.startDate = this.dates[0];
    
    this.startDateEmitter.emit(this.startDate);
  }

  private initializeRecordType () {
      this.recordsType = this.globals.recordsType; // Get the list of records type
      this.recordType = this.recordsType[0]; // Set the default value to present in the select box
      
      // Update the data.body with the default value - can be done when creating the object
      this.recordTypeEmitter.emit(this.recordType.label);
  }
  
  // get the chosen record type and emit it to the parent to update the data object
  public getRecordType(recordType) {
//    console.log('getRecordType' , recordType);
    this.recordTypeEmitter.emit(recordType.label);
  }
  
  // get the chosen start date and emit it to the parent to update the data object
  public getStartDate(startDate) {
    console.log('getStartDate' , startDate);
    this.startDateEmitter.emit(this.startDate);
  }

  public ApplyChangeRecord(){
    this.ApplyClickEvent.emit('')
  }
}
