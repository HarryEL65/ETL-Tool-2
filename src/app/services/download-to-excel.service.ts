import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadToExcelService {

  constructor() { }

  /*==================================================================================*/
  /* convertArrOfObjctsToCSV will take any array of objects and create CSV data First.
     The function loops through the keys on one of the objects to
     create a header row, followed by a newline.
     Then we loop through each object and write out the values of each property. */
  /*==================================================================================*/

  public convertArrOfObjctsToCSV(args) {
    let result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data.length > 0 ? args.data : [{ nodata: 'No data available' }];

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) {
          result += columnDelimiter;
        }
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  /* ============================ *
  /* Download the file to Excel  */
  /* ============================ */

  public downloadToCSV(args) {
    let data, filename, link;
   
    if (args.errMsg) {
        args.data = args.errMsg;
    }
    else { 
      if ( args.data) {
        data =  args.data;
      } else {
        data =  args;
      }
    }
    
    // if(Array.isArray(args.data)){
      if(Array.isArray(data)){
        let csv = this.convertArrOfObjctsToCSV({
            data: data
        });
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    }
    
    filename = args.filename || filename;
    filename = filename + '.csv';
    
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  }

}
