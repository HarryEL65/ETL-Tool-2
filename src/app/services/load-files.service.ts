// import { ImportStatus } from './../utilities/globals';
import { EtlFile } from './../models/import-types';
import { AppEventBusService } from './../app.event-bus.service';
import { Injectable, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Globals, ImportStatus } from '../utilities/globals';
import 'rxjs/add/operator/map'
import { Http, Response } from '@angular/http';
import { EtlFiles, ValidationResultMessage } from '../models/import-types';
// import { LoggedInUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoadFilesService implements OnDestroy {

  filesList: Array<EtlFiles>;
  validatedFiles: Array<EtlFiles>;
  warningFiles: Array<EtlFiles>;
  failedFiles: any;

  @Output() validateFilesEvent = new EventEmitter();
  @Output() uploadFilesEvent = new EventEmitter();
  @Output() fetchLastLoadedEvent = new EventEmitter();

  constructor(public globals: Globals,
    private eventBusService: AppEventBusService,
    public http: Http) { }

  ngOnDestroy(): void {

  }

  /* the function is in charge of dispacthing data to the relevant tables
     according to the File.ValidationResultMessage.resultStatus*/
  filterDataByStatus(data: Array<EtlFiles>) {
    console.log(data);
    data = data['filesValidation'];
    this.validatedFiles = data.filter((file) => {
      console.log(file);
      if (file['validationResultMessage']) {
        return file['validationResultMessage'].resultStatus === ImportStatus.VALIDATED;
      }
    }
    );
    this.warningFiles = data.filter((file) => {
      console.log(file);
      if (file['validationResultMessage']) {
        return file['validationResultMessage'].resultStatus === ImportStatus.WARNING
      }
    });
    this.failedFiles = data.filter((file) => {
      console.log(file);
      if (file['validationResultMessage']) {
        return file['validationResultMessage'].resultStatus === ImportStatus.FAILED
      } else if (file['errors']) {

        file['key'] = "_____";
        file['fileName'] = file['fileName'];
        file['affiliateProgramName'] = "____";
        file['accName'] = "___";
        file['legalCompany'] = "____";
        file['recordType'] = "_____";
        file['effectiveDate'] = "_____";
        file['validationResultMessage'] = {
          resultStatus: file['status'],
          validationMessageArray: [{
            errors: [file['errors'][0]['description']],
            status: file['errors'][0]['status'],
            testName: file['errors'][0]['type']
          }
          ]

        }
        return true;
      }
    });

    console.log('filterDataByStatus validatedStatusFiles', this.validatedFiles);
    console.log('filterDataByStatus waringStatusFiles', this.warningFiles);
    console.log('filterDataByStatus FailedStatusFiles', this.failedFiles);

    return {
      validatedFiles: this.validatedFiles,
      warningFiles: this.warningFiles,
      failedFiles: this.failedFiles
    }

  }


  loadMockValidatedFiles() {
    this.http.get("../../assets/data/ImportedFiles.json")
      .map(data => data.json() as Array<EtlFiles>)
      .subscribe(data => {
        console.log(data);
        let filesList;
        filesList = this.filterDataByStatus(data);

        this.validateFilesEvent.emit(filesList);
      });
  }

  loadMockLastLoadedAccounts() {

    this.http.get("../../assets/data/lastLoadedAccounts.json")
      .map(data => data.json())
      .subscribe(data => {
        // console.log(data);
        // let lastLoadedAccounts = data;
        // filesList = this.filterDataByStatus(data);

        this.fetchLastLoadedEvent.emit(data);
      });

  }

  loadMocUploadedFilesResult(filesList) {

    // this.http.get("../../assets/data/ImportedFiles.json")
    // .map(data => data.json() as Array<EtlFiles>)
    // .subscribe(data => {
    //   console.log(data);
    //   let filesList;
    //   filesList = this.filterDataByStatus(data);

    //   this.validateFilesEvent.emit(filesList);
    // });
    // const message = 'All ' + filesList.length + ' were loaded and waiting for the DWH to collect'

    this.uploadFilesEvent.emit(filesList);
  }


  validateFiles(filesList) {

    const route = this.globals.SrvRoute.VLDT_FILES;
    //    console.log("Sending to Validation Flow");
    //    console.log(filesList);
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      'reportType': this.globals.reportIds['MERCHANT_DATA'],
      'fileList': filesList
    }, (error, message) => {
      if (error) {
        this.validateFilesEvent.error(error);
      }
      if (message) {
        this.validateFilesEvent.emit(this.filterDataByStatus(message));
      }
    });

    // TODO: disable the belowed section
    // ONLY for MOCK Purpose
    //    this.loadMockValidatedFiles();
  }

  uploadFiles(filesList) {
    // console.log('data.config', data.config);
    
    console.log("UPLOADING FILE to SERVER");
    console.log(filesList);
      
    const route = this.globals.SrvRoute.UPL_FILES;
     this.eventBusService.send(route, {
       'reportType': this.globals.reportIds['MERCHANT_DATA'],
       'fileList': filesList
     }, (error, message) => {
       if (error) {
         console.error('Error: ' + route);
//         return;
         this.uploadFilesEvent.error(error);
       }
       if (message) {
         console.log("recieved reply after Uploading file");
         console.log(message);
         this.uploadFilesEvent.emit(message);
       }
     });
//    this.loadMocUploadedFilesResult(filesList);
  }

  fetchLastLoadedAccounts() {
    
    const route = this.globals.SrvRoute.LAST_LOADED;
    // TODO: enable the belowed section
    
      this.eventBusService.send(route, {
        'reportType': this.globals.reportIds['MERCHANT_DATA']
      }, (error, message) => {
        if (error) {
            // console.error('Error: ' + route);
            return;
        }
        if (message) {
            console.log('received last loaded accounts from server : ');
            console.log(message);
            this.fetchLastLoadedEvent.emit(message);
        }
      });

    // TODO: disable the belowed section
    // ONLY for MOCK Purpose
  
//    this.loadMockLastLoadedAccounts();
  }

  reset() {
    // trigger an set of empty arrays to reset the validations tables && to hide them
    const emptyFilesList = {
      validatedFiles: [],
      warningFiles: [],
      failedFiles: []
    }
    this.validateFilesEvent.emit(emptyFilesList);
  }



}
