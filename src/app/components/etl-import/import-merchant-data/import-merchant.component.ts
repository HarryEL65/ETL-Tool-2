import { ValidationMessage } from './../../../models/import-types';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaQueriesService } from '../../../services/media-queries.service';
import { Globals, ImportStatus } from '../../../utilities/globals';
import { LoadFilesService } from '../../../services/load-files.service';
import { AppEventBusService } from '../../../app.event-bus.service';
import { SideBarTogglerService } from '../../../services/side-bar-toggler.service';
import { Subscription } from "rxjs";



@Component({
  selector: 'wp-etl-import-merchant',
  templateUrl: './import-merchant.component.html',
  styleUrls: ['./import-merchant.component.scss']
})
export class ImportMerchantComponent implements OnInit, OnDestroy {
    
  private subscription = new Subscription(); // Collection to handle all subscriptions
    
  ImportStatus = ImportStatus;
  private subscribed = false;
  validatedFiles=[];
  warningFiles=[];
  failedFiles=[];
  isValidatedLoading = true;
  isWarningLoading = true;
  isFailedLoading = true;
  isMinimized;
  isValidationReturned = false;

  constructor(public globals: Globals,
              public mdqSrv: MediaQueriesService,
              private eventBusService: AppEventBusService,
              public loadFilesSrv: LoadFilesService,
              private sideBarService: SideBarTogglerService) {
  }

  ngOnInit() {

    this.isMinimized = this.sideBarService.getSideBarToggledState();
    this.sideBarService.change.subscribe(isMinimized => {
      this.isMinimized = isMinimized;
    });

    if (this.eventBusService.connected === true) {
      // console.log('init page without connect');
      this.initPage();

    } else {
//        console.log("import connect");
      this.eventBusService.connect(() => {
        this.initPage();
      });
    }
  }

  private initPage(): void {

    // TODO: add code for register handlers to changed events
    if (this.subscribed === false) {

        this.subscribed = true;
        this.eventBusService.subscribeToActions('ACCOUNTS_CHANGES', (error, msg) => {

        });
        this.eventBusService.subscribeToActions('HEALTHCHECK_STATUS_CHANGE', (error, msg) => {

        });

    } else {
        // console.log('Already subscribed');
    }
    
    const validateSubscription = this.loadFilesSrv.validateFilesEvent.subscribe((res) => {
        console.log('data received from the server', res)
        this.validatedFiles = res.validatedFiles;
        this.warningFiles = res.warningFiles;
        this.failedFiles = res.failedFiles;
        this.isValidatedLoading = false;
        this.isWarningLoading = false;
        this.isFailedLoading = false;
        this.isValidationReturned = !this.isValidationReturned;
    }, (err) => {
        console.error('Error validating files flow', err);
        this.isValidationReturned = !this.isValidationReturned;
        this.isValidatedLoading = false;
        this.isWarningLoading = false;
        this.isFailedLoading = false;
    });
    
    this.subscription.add(validateSubscription);
        
        
//    const uploadSubscription = this.loadFilesSrv.uploadFilesEvent.subscribe((res) => { });
//    this.subscription.add(uploadSubscription);
}


  ngOnDestroy() {
    this.subscribed = false;
    this.subscription.unsubscribe(); // unsubscribe from all event emitter
    this.eventBusService.unsubscribeFromActions('ACCOUNTS_CHANGES');
    this.eventBusService.unsubscribeFromActions('HEALTHCHECK_STATUS_CHANGE');
    this.eventBusService.disconnect();
  }
  
  validateFiles(files){
      this.loadFilesSrv.validateFiles(files);
  }
  
  clearFiles(){
      this.loadFilesSrv.reset();
  }

}
