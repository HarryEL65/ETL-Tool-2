import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caseInsensitive'
})
/*-----------------------------------------------------------------------------------------------------------*
|     sample: // return this.caseInsense.transform(row.accName, row.accName).indexOf(val) !== -1 || !val;    |
*------------------------------------------------------------------------------------------------------------*/

export class CaseInsensitivePipe implements PipeTransform {

  transform(stringToSearchIn: any, termToSearch: any, returnAsBoolean: boolean) {
    if (!termToSearch) { return stringToSearchIn; }
    try {
      let returnedData = stringToSearchIn.match(new RegExp(termToSearch, 'i')).input;
      return returnedData = returnAsBoolean ? true : returnedData;
    } catch ( err ) {
      return  false;
    }
  }

}


          