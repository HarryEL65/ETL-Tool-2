// import {Component, Input, OnInit, ViewChild} from '@angular/core';
// import { NavItem } from '../../../../models/nav-item';

// @Component({
//   selector: 'wp-etl-menu-item',
//   templateUrl: './menu-item.component.html',
//   styleUrls: ['./menu-item.component.scss']
// })
// export class MenuItemComponent implements OnInit {

//   selectedItem;

//   @Input() isRoot=false;
//   @Input() items: NavItem[];
//   @ViewChild('childMenu') public childMenu;

//   constructor() {}

//   ngOnInit() {
//     console.log('items are', this.items);
//   }

 

//   toggle(item, event): void {
//     event.stopPropagation();
//     // this.selectedItem = this.selectedItem === item ? null : item;
    
//     // // toggle the active-link class
//     // const menuItem = event.currentTarget;
    
//     // if (menuItem.classList.contains("active")){
//     //     menuItem.classList.add("active");
//     // } else {
//     //     const activeMenu = document.querySelectorAll(".main-menu > .menu-item.active");
//     //     if (activeMenu !== undefined && activeMenu.length > 0){
//     //         activeMenu[0].classList.remove("active");
//     //     }
//     // }
//     this.selectedItem = this.selectedItem === item ? null : item;
        
//         // toggle the active-link class
//         const menuItem = event.currentTarget;
        
//         if (menuItem.classList.contains("active")){
//             menuItem.classList.add("active");
//         } else {
//             const activeMenu = document.querySelectorAll(".main-menu > .menu-item.active");
//             if (activeMenu !== undefined){
//                 activeMenu[0].classList.remove("active");
//             }
//         }
// };

//     calculateHeight(event): void {
//         const wrapBtn = event.currentTarget;
//         const subMenu = wrapBtn.getElementsByClassName("sub-menu");
        
//         // check if subMenu has height, if so remove it
//         if (subMenu[0].offsetHeight === 0) {
//             const subMenuItems = subMenu[0].children;
//             let sumHeight = 0;
            
//             for (var i=0; i<subMenuItems.length; i++){
//               sumHeight += subMenuItems[i].offsetHeight;
//             }
            
//             // add the height to the parent
//             subMenu[0].style.height = sumHeight + "px";
//         } else {
//             subMenu[0].style.height = 0 + "px";
//         }
//     }

// }