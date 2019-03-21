import { MediaQueriesService } from './../../../../services/media-queries.service';
import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { JsonLikeListComponent } from './json-like-list/json-like-list.component';
import { JsonLikeViewComponent } from '../../../etl-shared/json-like-view/json-like-view.component';
import { EtlSharedModule } from '../../../etl-shared/etl-shared.module';
import { Globals } from '../../../../utilities/globals';

/**
 * 
 * 
 * @export
 * @class ChooseConfigurationComponent
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'wp-etl-choose-configuration',
  templateUrl: './choose-configuration.component.html',
  styleUrls: ['./choose-configuration.component.scss']
})
export class ChooseConfigurationComponent implements AfterViewInit  {

  /**
   * *-------------
   * !  Variables
   * *-------------
   * @memberOf ChooseConfigurationComponent
   */
  globalData;
  isLocked: any;
  isNewJsonTemplate: false;
  selectedJsonLike;

  /**
   * *---------------
   * !   Decorators
   * *---------------
   * 
   * @memberOf ChooseConfigurationComponent
   */
  @Input() isLoading;
  @Input('selected') manualAccsSelected: string;
  @Output() jsonLikeSelected = new EventEmitter();
  @ViewChild(JsonLikeListComponent)
  private jsonLikeList: JsonLikeListComponent;
  @ViewChild(JsonLikeViewComponent)
  private jsonLikeView: JsonLikeViewComponent;

  constructor(public globals: Globals,
              public mdqSrv: MediaQueriesService) { }

  /** 
   *  * ----------------------------------
   *  !  Lifecycle Hook: ngAfterViewInit:
   *  * ----------------------------------                       
   *  
   *  This lifecycle hook method executes when the component’s view has been fully initialized.   
   *  This method is initialized after Angular initializes the component’s view and child views.  
   *  It is called after ngAfterContentChecked().                                                 
   **/               
  
  ngAfterViewInit() {
    this.jsonLikeView.jsonLike = this.selectedJsonLike;
  }

  /**
   * * -------------------------
   * !  Function: showJsonLike
   * * -------------------------
   * @param {any} event 
   * @memberOf ChooseConfigurationComponent
   */
  showJsonLike(event) {
    if (event) {
      if ( this.jsonLikeList.accntsLikeJson.length > 0  ) {
        const data = this.jsonLikeList
                       .accntsLikeJson.filter(v => v.accID  == (event.target ? event.target.value : event) );
        this.selectedJsonLike = data[0];
        this.globalData = {};
        this.globalData.accName = data[0].accName;
        this.globalData.accID = data[0].accID;
        this.globalData.recordType = data[0].recordType;
        this.jsonLikeView.extractData(this.selectedJsonLike);
      }
    } else {
      this.jsonLikeSelected.emit(this.selectedJsonLike);
      this.jsonLikeView.extractData(null);
    }

  }

  /**
   * * ---------------------------------
   * !    Function: getJsonLockStatus
   * * ---------------------------------
   * @param {any} $event 
   * @memberOf ChooseConfigurationComponent
   */
  getJsonLockStatus($event) {
    this.isLocked = $event.isLocked;
    if (this.isLocked) {
    // console.log('Json is Locked whit the following selection: ', this.selectedJsonLike);
      this.jsonLikeSelected.emit($event);
    } else {
      // Reset the JsonLikeSelected
      this.jsonLikeSelected.emit('doReset');
    }
  }

  /**
   * * --------------------------------------
   * ! Function: newJsonTemplateTriggered
   * * --------------------------------------
   * 
   * @param {any} $event 
   * @memberOf ChooseConfigurationComponent
   */
  newJsonTemplateTriggered($event) {
    this.isNewJsonTemplate = $event;
  }


}
