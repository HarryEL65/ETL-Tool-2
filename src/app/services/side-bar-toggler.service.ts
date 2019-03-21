import { MediaQueriesService } from './media-queries.service';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Globals } from '../utilities/globals';

@Injectable()
export class SideBarTogglerService {

  isOpen = false;
  
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(public globals: Globals,
              public mdqSrv: MediaQueriesService) {
    globals.isMinimized = false;
    mdqSrv.mediaQueryChange.subscribe( (mdq) => {

      if ( mdq !== 'XL' &&  !globals.isMinimized) {
        this.toggle(null);
      } else if ( mdq === 'XL' && !globals.isMinimized) { // come back to XL while isMini false
        // this.toggle();
      } else if ( mdq === 'XL' && globals.isMinimized) { // come back to XL while isMini true
        // this.toggle();
      }

    });
  }

  toggle(val) { // val is to detect if manual click on hamburger or mediaquery change
      this.isOpen = !this.isOpen;
      // if ( !this.mdqSrv.XS ) {

        if (this.isOpen && val) {

          this.globals.isMinimized = true;
          this.change.emit(this.isOpen);

        } else if (!this.isOpen && val) {

          if (!this.mdqSrv.XL) {

            this.globals.isMinimized = true;
            this.change.emit(!this.isOpen);

          } else {

            this.globals.isMinimized = false;
            this.change.emit(this.isOpen);

          }
        } else {
          this.change.emit(this.isOpen);
        }
  }
  getSideBarToggledState() {
    return this.isOpen ;
  }
}
