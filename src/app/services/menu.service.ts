import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { EtlAuthenticationService } from './etl-authentication.service';
import { adminMenu, adminTabs } from '../menus/admin-menu';
import { superMenu, superTabs } from '../menus/super-menu';
import { devMenu, devTabs } from '../menus/dev-menu';
import { merchantMenu, merchantTabs } from '../menus/merchant-menu';
import { webpalsMobileMenu, webpalsMobileTabs } from '../menus/webpals-mobile-menu';
import { NavItem } from '../models/nav-item';

@Injectable()
export class MenuService{
    allTabsUser;
    
    adminMenu: NavItem[] = adminMenu;
    adminTabs: any = adminTabs;

    superMenu: NavItem[] = superMenu;
    superTabs: any = superTabs;

    merchantMenu: NavItem[] = merchantMenu;
    merchantTabs: any = merchantTabs;

    devMenu: NavItem[] = devMenu;
    devTabs: any = devTabs;

    webpalsMobileMenu: NavItem[] = webpalsMobileMenu;
    webpalsMobileTabs: any = webpalsMobileTabs;
    
    role;
    
    constructor(public authenticationService: EtlAuthenticationService){}

    hasAccessToPath(path: string) {
        //verify that the key does not already exist;
        if(localStorage.getItem('allAllowedPath')===null) {

            this.allTabsUser = JSON.stringify(this.getTabs());
            // if the key does not exist created it and set the value of 'allTabsUser'
            localStorage.setItem('allAllowedPath', this.allTabsUser);
            // The key is removed after logout 

        } else {

                // if the key already exist just retrieve it's value
                this.allTabsUser = localStorage.getItem('allAllowedPath')

        }

        let pathPattern = new RegExp(path);
        if (pathPattern.test(this.allTabsUser)) {
            return true;
        } else {
            return false;
        }
    }
    
    getMenu(): NavItem[]{
        
        
        return this.getMenuByRole(this.authenticationService.getUserRole());
        //   return this.getMenuByRole('webpals_mobile');
    }
    
    getMenuByRole(role: string) {
        // console.log("got role " + role);
        
        switch(role) {
            case 'admin':
                return this.adminMenu
                
            case 'super':
                return this.superMenu

            case 'merchant':
                return this.merchantMenu
                    
            case 'dev':
                return this.devMenu

            case 'webpals_mobile':
                return this.webpalsMobileMenu
                    
            default:
                break;
        }
    }
    
    getTabs(): NavItem[]{
        return this.geTabsByRole( this.authenticationService.getUserRole());
        //  return this.geTabsByRole('webpals_mobile');
    }

    geTabsByRole(role: string) {
        // console.log("got role " + role);
        
        switch(role) {
            case 'admin':
                 return  this.adminTabs

            case 'super':
                 return this.superTabs

            case 'merchant':
                 return this.merchantTabs

            case 'dev':
                 return this.devTabs

            case 'webpals_mobile':
                 return this.webpalsMobileTabs

            default:
                break;
        }
    }

}