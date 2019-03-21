import { SideBarTogglerService } from './../../../services/side-bar-toggler.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wp-etl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // @Input() state;
  isOpen = false;
  constructor(private sideBarService: SideBarTogglerService) { }

  ngOnInit() {
    this.sideBarService.change.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

}
