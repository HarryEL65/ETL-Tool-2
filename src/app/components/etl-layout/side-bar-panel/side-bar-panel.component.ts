import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { ParentMenuService } from '../../../services/parent-menu.service';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'wp-etl-side-bar-panel',
  templateUrl: './side-bar-panel.component.html',
  styleUrls: ['./side-bar-panel.component.scss']
})
export class SideBarPanelComponent implements OnInit {
  // isParentMenuDisplayed = false;
  isWelcomeCompDisplayed = true;
  navItems;
  // isExpanded: boolean;
  @Input() state: boolean;
  @Output() expand = new EventEmitter<any>();

  constructor(public menuService: MenuService) { }

  ngOnInit() {
    this.getMenu();
  }
  
  getMenu(): void {
      this.navItems = this.menuService.getMenu();
//        console.log(this.navItems);
  }   

  doExpand(eventData) {
    this.expand.emit({
      state: eventData
    });
  }
}
