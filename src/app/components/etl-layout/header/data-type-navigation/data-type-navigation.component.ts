import { MenuService } from './../../../../services/menu.service';
import { Globals } from '../../../../utilities/globals';
import { Component, OnInit, Input } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material';
import { Router, UrlTree, PRIMARY_OUTLET, UrlSegmentGroup, UrlSegment, NavigationEnd } from '@angular/router';
import { forkJoin } from "rxjs";
import { EtlAuthenticationService } from '../../../../services/etl-authentication.service';

@Component({
    selector: 'wp-etl-data-type-navigation',
    templateUrl: './data-type-navigation.component.html',
    styleUrls: ['./data-type-navigation.component.scss']
})
export class DataTypeNavigationComponent implements OnInit {
    tabs = [];
    activeLinkIndex = -1;
    currLocationRouteLinks = [];
    currSegment;
    hasPermission = false;
    activeTab;
    activeTabIndex;


    @Input() state;
    constructor(public globals: Globals,
        private router: Router,
        public authenticationService: EtlAuthenticationService,
        public menuService: MenuService) { }

    ngOnInit() {

        this.tabs = this.getTabs();

        // Get the current URL segments example http://localhost:4200/reruns/rptId::webpals-mobile will return [reruns, rptId]
        const segments = this.getUrlSegment();
        this.setCurrSegment(segments[0].path);
        this.setTabLinks(segments);



        // Subscribe tp router NavigationEnd event
        // TODO: need to support sub level navigation for tabs, currently will run only when navigating for a new first level menu
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const routeSegments = this.getUrlSegment();
                this.currSegment = routeSegments[0].path;
                this.setTabLinks(routeSegments);
                this.setDefaultLocationUrl();
            }
        });
    }

    getTabs() {
        return this.menuService.getTabs();
    }
    getUrlSegment() {
        // Deconstruct the url -> get the segment which indicates for which primary section in the navigation we are
        const tree: UrlTree = this.router.parseUrl(this.router.url);
        const segmentGroup: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
        const segment: UrlSegment[] = segmentGroup.segments;

        return segment;
    }

    setTabLinks(segments) {
        let path;
        let pathConfig;
        for (let i = 0; i < segments.length; i++) {
            path = segments[i].path;
            if (pathConfig === undefined) {
                pathConfig = this.tabs[path];
            } else {
                if (pathConfig[path]) {
                    pathConfig = pathConfig[path];
                } else if (pathConfig["children"]) {
                    this.currLocationRouteLinks = pathConfig["children"][path].tabs;
                    break;
                } 
                // else {
                //     this.currLocationRouteLinks = pathConfig[path].tabs;
                // }
            }
            if (pathConfig && pathConfig.tabs !== undefined) {
                this.currLocationRouteLinks = pathConfig.tabs;
                break;
            } else {
                if (this.tabs[path] && this.tabs[path].children) {
                    pathConfig = this.tabs[path].children;
                }
                continue;
            }
        }

    }

    setCurrTab() {
        if (this.currLocationRouteLinks) {
            this.activeLinkIndex = this.currLocationRouteLinks.indexOf(this.currLocationRouteLinks.find(
                (tab) => {
                    return tab.link === this.router.url;
                }
            ));
        } else {
            console.log('----currLocationRouteLinks undefined--');
        }
    }

    setCurrSegment(segment) {
        this.currSegment = segment;
    }
    
    /**
     * setDefaultLocationUrl
     * will set the default tab on a page according to user role/authentication
    * */
    setDefaultLocationUrl() {
        let reportId;
        const segments = this.router.url.split('/');
        if (segments && segments.length > 2) {
            reportId = segments[segments.length - 1];
        }
        if (this.currLocationRouteLinks) {
            if (reportId) {
                // set in local storage a new key that will hold the current reportId key
                // no need to JSON.stringify the item value since this a string and not an object
                window.localStorage.setItem('reportId', reportId);
            }

            if (this.currLocationRouteLinks.length === 1) {
                this.activeTab = this.currLocationRouteLinks[0];
            } else if (this.currLocationRouteLinks.length > 1) {
                this.activeTabIndex = this.currLocationRouteLinks.indexOf(this.currLocationRouteLinks.find(
                    (tab) => {
                        return tab.link === this.router.url;
                    }
                ));
            }
            this.setCurrTab();
            if (this.currLocationRouteLinks.length === 1) {
                this.router.navigate([this.activeTab.link]);
            }
            else if (this.currLocationRouteLinks.length > 1) {
                if (this.activeTabIndex === -1) {
                    // retrieve from local storage reportId key
                    // this is a string already parsed ==> no need to JSON.parse
                    const reportId = window.localStorage.getItem('reportId');
                    // in case url == <host>:<port>/home or <host>:<port> 
                    if (reportId) {
                        const item = this.currLocationRouteLinks.filter(elem => {
                            return elem.link.indexOf(reportId) !== -1
                        });
                        if (item && item[0].link) {
                            this.router.navigate([item[0].link]);
                        } else {
                            this.router.navigate([this.currLocationRouteLinks[0].link]);
                        }
                    } else {
                        this.router.navigate([this.currLocationRouteLinks[0].link]);
                    }
                } else {
                    this.router.navigate([this.currLocationRouteLinks[this.activeTabIndex].link]);
                }
            }
        }
    }
}