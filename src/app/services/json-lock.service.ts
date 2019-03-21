import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class JsonLockService {

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  lock(isLocked) {
    this.change.emit(isLocked);
  }
}
