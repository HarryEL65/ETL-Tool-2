import { ETLConstants } from '../utilities/Constants';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateTimeFormat'
})
export class CustomDateTimePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, ETLConstants.DATE_TIME_FORMAT);
  }
}
