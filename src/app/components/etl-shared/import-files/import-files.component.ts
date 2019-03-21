import { Globals } from './../../../utilities/globals';
import { MediaQueriesService } from './../../../services/media-queries.service';
import { Component, ElementRef, ViewChild, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { DataImport } from '../../../models/dataImport';
import { forkJoin } from "rxjs";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

@Component({
  selector: 'wp-etl-import-files',
  templateUrl: './import-files.component.html',
  styleUrls: ['./import-files.component.scss']
})
export class ImportFilesComponent implements OnInit, OnChanges {
  
  selectedFiles: FileList;
  ImportFiles: DataImport[] = [];
  textType = /text.*/;
  observableArray : Observable<any>[] = [];
  loadingIndicator = false;
  
  loading: boolean = false;
  areFilesChoosen = false;
  maxFilesSelectionAllowed = 20;
  isMaxFilesSelectionExeeded = false;
  isFileTypeMismatch = false;
  fileTypeMismatchName = null;
  typeMismatchFilesArray = [];

  @Input() accept;
  @Input() defaultPath;
  @Input() isValidationReturned;
  @ViewChild('fileInput') fileInput: ElementRef;
  
  @Output() handleFilesEvent = new EventEmitter();
  @Output() clearFilesEvent = new EventEmitter();
  
  

  constructor(public globals: Globals, public mdqSrv: MediaQueriesService) {}

  ngOnInit() {}


  handleFilesInput(files: FileList) {
    if (files.length > 0) {
      this.isMaxFilesSelectionExeeded = false;
      this.isValidationReturned = false;
      this.loadingIndicator = true;
      if (files && files.length > 0 && files.length < 21) {

        this.readFileList(files);

        Observable.forkJoin(this.observableArray).subscribe(results => {
          this.handleFilesEvent.emit(this.ImportFiles);
          this.areFilesChoosen = true;
        });
        this.selectedFiles = files;
        this.areFilesChoosen = true;
      }
      else if (files.length > 20) {
        this.isMaxFilesSelectionExeeded = true;
        this.loadingIndicator = false;
        console.log(files.length);
        console.log('You can load only 20 files in one session. Please choose files again');
      }
    }
  }
  
  
  /*
   * Read each file in the fileList and add it to the DataImport array which will be sent to the websocket
   * each FileReader is an async process so we subscribe to it using the forkJoin that will invoke once all
   * files have been read
   */
  readFileList(files: FileList) {
    
      Array.from(files).forEach( file => {
         // check if the file is from type .txt
         if(file.type.match(this.textType)) {
            //  this.fileTypeMismatchName = null;
             this.isFileTypeMismatch = false;
             let fileObservable = new Observable(observer => {
               let reader = new FileReader();
               reader.onload = () => {
                   let currFile = new DataImport(file.name, file.type, file.size);

                   // The getBinary method in the server expects a Base64 encoded binary
                   // so we encode the file data using the btoa() function
                   let fileData = new Uint8Array(reader.result);
                   let b64encoded = btoa(String.fromCharCode.apply(null, fileData));
                   
                   currFile.data = b64encoded;
                   
                   this.ImportFiles.push(currFile);
                   
                   observer.next(currFile);
                   observer.complete();
               }
               reader.readAsArrayBuffer(file); // we read the file as Buffer(byte) array
             })
             
             this.observableArray.push(fileObservable); // add to the observable array to whom we subscribe above
         } else {
             console.log("file type mismatch");
             this.loadingIndicator = false;
             this.isFileTypeMismatch = true;
             this.typeMismatchFilesArray.push(file.name);
         }
      });
  }


  clearFile() {
    this.clearFilesEvent.emit();
    this.areFilesChoosen = false;
    this.ImportFiles = []; 
    this.observableArray = []; 
    this.loadingIndicator = false;
    this.selectedFiles = null;
    // Adding this line otherwise no event triggered when
    // selecting twice the same file
    this.fileInput.nativeElement.value = null;
    // this.isFileTypeMismatch = false;
    this.typeMismatchFilesArray = [];
    
    // this.isValidationReturned = false;
  }

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    for (const propName in changes) {
       const change = changes[propName];
       if (changes['isValidationReturned']) {
         this.loadingIndicator = false;
      }
    }
  }
  

}
