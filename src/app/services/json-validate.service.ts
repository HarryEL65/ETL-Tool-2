import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class JsonValidateService {

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  validate(isValid) {
    this.change.emit(isValid);
  }

}
