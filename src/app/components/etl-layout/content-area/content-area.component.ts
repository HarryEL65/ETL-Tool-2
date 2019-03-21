import { Globals } from './../../../utilities/globals';
import { SideBarTogglerService } from './../../../services/side-bar-toggler.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wp-etl-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.scss']
})
export class ContentAreaComponent implements OnInit {
  isMinimized = false;
  constructor(private sideBarService: SideBarTogglerService,
              public globals: Globals) { }

  ngOnInit() {
    this.isMinimized = this.sideBarService.getSideBarToggledState();
    this.sideBarService.change.subscribe(isMinimized => {
      this.isMinimized = isMinimized;
    });
  }


}
