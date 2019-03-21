import { MediaQueriesService } from './../../../services/media-queries.service';
import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { Globals, Action } from '../../../utilities/globals';
import { DownloadToExcelService } from '../../../services/download-to-excel.service';

@Component({
  selector: 'wp-etl-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  // public Action = Action;
  @ViewChild('filesListTable') filesListTable: any;
  @ViewChild('fileStatus') fileStatus: TemplateRef<any>;
  // @ViewChild('fileDownload') fileDownload: TemplateRef<any>;



  // @Input() title;
  @Input() rows;
  @Input() action;
  @Input() status;
  columns;
  error;

  constructor( public globals: Globals,
               public mdqSrv: MediaQueriesService,
               public downloawdToCsvSrv: DownloadToExcelService) { }

  ngOnInit() {
    // console.log('file-list component init');
    setTimeout(() => this.dispatchResizeEvent(), 600);
  }
  dispatchResizeEvent() {
    window.dispatchEvent(new Event('resize'));
    // console.log('resize was triggered');
  }
  capitalizeFirstLetter(word) {
//    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }

  toggleExpandRow(row) {
    this.filesListTable.rowDetail.toggleExpandRow(row);
    if ( this.action === Action.CHANGE_RECORD_TYPE ) {
      row.error = row.errors[0].description;
    } else if ( this.action === Action.IMPORT_FILES) { 
      row.error = row.errors[0];
    }   
    else {
      this.error = this.downloawdToCsvSrv.convertArrOfObjctsToCSV({ data: row.report });
    }
  }

  getTitle(row) {
    return row.status === 'failed'? 'Error:' : 'Warning';
  }

downloadToCSV(args) {
  args.filename = args.filename || 'export';
  this.downloawdToCsvSrv.downloadToCSV(args)
}


}
