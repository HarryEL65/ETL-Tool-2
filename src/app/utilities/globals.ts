import { MediaQueriesService } from './../services/media-queries.service';
// import { Observable } from 'rxjs/Observable';
import { Observable, Subject, ReplaySubject } from 'rxjs';
// import { from, of, range } from 'rxjs/create';
import { map, filter, switchMap } from 'rxjs/operators';

import { EtlAuthenticationService } from './../services/etl-authentication.service';
import { RouteInfo } from './../models/routerInfo';
import { DataType } from './../models/dataType';
import * as TableConfig from './../models/tableConfig';
import * as acntData from './../models/account';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Table } from '../models/tableConfig';
// import { Router } from '@angular/router';

export enum Action  {
    ADD_ACCOUNT           = 'add-account',
    CHANGE_RECORD_TYPE    = 'change-record-type',
    CHANGE_MAPPING        = 'change-mapping',
    HOME_PAGE             = 'home-page',
    HOME_PAGE_IMPORT      = 'home-page-import',
    IMPORT_FILES          = 'import-files',
    REMOVE_ACCOUNT        = 'remove-account',
    RERUN_ACCOUNT         = 'rerun-account',
    RERUN_ACCOUNT_MOBILE  ='rerun-account-mobile',
  };

export enum ImportStatus {
  VALIDATED = 'validated',
  WARNING   = 'warning',
  FAILED    = 'failed'
} 
@Injectable()
export class Globals {
  
  // Store a reference to the enum Action
  Action =  Action;

  constructor( private authenticationService: EtlAuthenticationService,
               private mdqSrv: MediaQueriesService ) {
               mdqSrv.initMediaQueries();
  }

  error;
  isMinimized:boolean = false;


  reportIds = {
    'MERCHANT_DATA': 'MerchantData',
    'DUCM':          'DUCM',
    'ALL':           'All'
  };
  reportIdStr = {
    'MERCHANT_DATA': 'MERCHANT DATA',
    'DUCM': 'WEBPALS MOBILE',
    // 'ALL': 'ALL REPORTS ID'

  }
  reportTypes: DataType[] = [
    { id: 1, name: this.reportIdStr.MERCHANT_DATA , description: 'Merchant data represent an account' },
    { id: 2, name: this.reportIdStr.DUCM, description: 'Player data represent an account' },
    // { id: 3, name: this.reportIdStr.ALL , description: 'for all the report Ids' },
    // { value: 3, name: 'SlabelID', description: 'Sub value represent anlabelcount' },
    // { value: 4, name: 'ClabelKSMOB', description: 'Clicks mob represent an account' },
    // { value: 5, name: 'MlabelAR MEDIA', description: 'Marmar media represent an account' }
  ];

 
  etlPathMappToTitles: any[] = [


    { path: 'home', title: 'HOME PAGE', headerIcon: 'home' },
    { path: 'acnt-mngmt', title: 'ACCOUNT MANAGEMENT', headerIcon: 'acnt-mngmt' },
    { path: 'add-account', title: 'Add Account', headerIcon: 'acnt-mngmt', subIconClass: 'add-account' },
    { path: 'remove-account', title: 'Remove Account', headerIcon: 'acnt-mngmt', subIconClass: 'remove-account' },
    { path: 'edit-account', title: 'Edit Account', headerIcon: 'acnt-mngmt' },
    { path: 'change-record-type', title: 'Change Record Type', headerIcon: 'acnt-mngmt', subIconClass: 'change-record-type'   },
    { path: 'change-mapping', title: 'Change Mapping', headerIcon: 'acnt-mngmt', subIconClass: 'change-mapping' },
    { path: 'reruns', title: 'RERUNS', headerIcon: 'reruns' },
    { path: 'import', title: 'IMPORT', headerIcon: 'import' },
    { path: 'user-management', title: 'USER MANAGEMENT', headerIcon: 'user-management'}, 
    { path: 'admin', title: 'ADMINISTRATION', headerIcon: 'admin', subIconClass: ''},
    { path: 'settings', title: 'Settings', headerIcon: 'admin', subIconClass: 'setting'},
    { path: 'config', title: 'Config', headerIcon: 'admin', subIconClass: 'config'},
    { path: 'logs', title: 'Logs', headerIcon: 'admin', subIconClass: 'logs'},


  ];

  // ========================== Home Page ========================

  Status: acntData.Status[] = [
    { type: 1, title: 'P. Acceptance', icon: 'assets/svg/status/pending.svg', class: 'pending' },
    { type: 2, title: 'Testing', icon: 'assets/svg/status/testing.svg', class: 'testing' },
    { type: 3, title: 'Failed', icon: 'assets/svg/status/failed.svg', class: 'failed' },
    { type: 4, title: 'Accepted', icon: 'assets/svg/status/accepted.svg', class: 'accepetd' },
    { type: 5, title: 'Canceled', icon: 'assets/svg/status/canceled.svg', class: 'canceled' },
    { type: 6, title: 'Running', icon: 'assets/svg/status/running.svg', class: 'running' },
    { type: 7, title: 'Passed', icon: 'assets/svg/status/passed.svg', class: 'passed' },
  ];

  SrvRoute =  {
    'AFFIL_PRGMS_PLTFRMS' : 'AFFILIATE_PROGRAMS_PLATFORMS',
    'MANUAL_ACCNTS' :       'MANUAL_ACCOUNTS',
    'ACTIVE_ACCNTS':        'ACTIVE_ACCOUNTS',
    'LAST_ADDED_ACCTNS':    'LAST_ADDED_ACCOUNTS',
    'RRUN_ACTVY':           'RERUN_ACTIVITY',
    'RMV_ACTVY':            'REMOVE_ACTIVITY',
    'GO_LIVE':              'GO_LIVE',
    'RVRT_ACCNT':           'REVERT_ACCOUNT',
    'ADD_ACCNT':            'ADD_ACCOUNTS',
    'RMV_ACTV_ACCNT':       'REMOVE_ACTIVE_ACCOUNT',
    'RERUN_ACTV_ACCNT':     'RERUN_ACTIVE_ACCOUNT',
    'RUN_NOW':              'RUN_NOW',
    'UPDATE_ACCNT_CONFIG':  'UPDATE_ACCOUNT_CONFIGURATION',
    'CHNG_RCRD_TYPE':       'CHANGE_RECORD_TYPE',
    'VLDT_FILES':           'VALIDATE_FILES',
    'UPL_FILES':            'UPLOAD_FILES',
    'LAST_LOADED':          'LAST_LOADED_ACCOUNTS',
    'GET_USER_MNGNT_DATA': 'USER_MNGNT_GET_ALL_DATA',
    'GET_ALL_USERS':        'USER_MNGMT_GET_ALL_USERS',
    'GET_ALL_ROLES':        'USER_MNGMT_GET_ALL_ROLES',
    'CREATE_USER':          'USER_MGMNT_CREATE_USER',
    'UPDATE_USER':          'USER_MGMNT_UPDATE_USER',
    'DELETE_USER':          'USER_MGMNT_DELETE_USER',
    'CREATE_ROLE':          'USER_MNGNT_CREATE_ROLE',
    'UPDATE_ROlE':          'USER_MNGMT_UPDATE_ROLE',
    'DELETE_ROLE':          'USER_MNGMT_DELETE_ROLE',
    


  };

  recordsType = [
    { value: 'daily', label: 'daily'},
    { value: 'monthly', label: 'monthly'},
    { value: 'daily-monthly', label: 'daily-monthly'}
  ];


  //  ========================= utilities function =================

  setCssRootProp(variable_name, value){
    document.documentElement.style.setProperty('--'+ variable_name, value);
  };
  
  getCssRootProp(variable_name){
    return getComputedStyle(document.documentElement).getPropertyValue('--'+ variable_name);
  };
 
  hasPermission ( permission: string ) {
    if (permission !== 'ok') {
      // console.log('permission from globals file', permission);
      return new Promise(resolve => {
        return this.authenticationService.hasPermission(permission)
        .subscribe( res   => {
                    if (res) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                 },
            error => {
                   this.error = error;
                   resolve(false);
            });

      });
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
    }
  }

  convertToDate(unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(unix_timestamp);
    return date;
  }

  populateDates() {
    const currentDate = this.getCurrentDate();
  }

  getCurrentDate() {
    const today: any = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; // January is 0!
    const yyyy: any = today.getFullYear();

    // const utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');


    if (dd < 10) {
      dd = '0' + dd;
    }

    return {
      day: dd,
      month: mm,
      year: yyyy,
      todayFull: mm + '/' + dd + '/' + yyyy,
      todayShort: mm + '/' + yyyy
    };
  }


  getMonthsFromToday(numOfMonth) {
    let nOfMth: number = numOfMonth;
    let numOfYear = Math.floor(numOfMonth / 12);
    let remainer = 0, num;
    if ( numOfMonth % 12 !== 0) {
      // the remainer num Of month
      remainer = numOfMonth % 12;
      // add a year for Iteration
      numOfYear++ ;
    }

    const currDate = this.getCurrentDate();
    const monthData = [];

    for (let year = currDate.year, index = 1; year >= (currDate.year - numOfYear)  ; year-- , index++) {
      if (index === 1) {
        for (let month = currDate.month; month > 0; month--) {
          monthData.push({value: nOfMth-- , label: (month  < 10 ? '0' + month : month) + '/' + year});
        }
//        console.log('index', index);
      } else if (index > 1 && index <= numOfYear) {
        for (let month = 12; month > 0; month--) {
          monthData.push({value: nOfMth-- , label: (month  < 10 ? '0' + month : month) + '/' + year});
        }
//        console.log('index', index);
      } else if (index === numOfYear + 1) {
          // remainer ? ( numOfMonth < 12 ? num = 12 - (numOfMonth - monthData.length) :
          //              num = 12 - (numOfMonth - monthData.length) : num = currDate.month;
          num = currDate.month;
          // Currently support only mutilple of 12 months (12,24,36...)
          // ==> no support for remainer...see above
          for (let month = 12; month > num; month--) {
            monthData.push({value: nOfMth-- , label: (month  < 10 ? '0' + month : month) + '/' + year});
          }
//          console.log('index', index);
      }
//      console.log('monthData', monthData);
    }
    return monthData;
  }

  getLastDayOfMonth(date) {
    // Day 0 is the last day in the previous month
    const dateTo = date.split('/');
     return new Date(dateTo[1], dateTo[0], 0).getDate();
  }

 
  sortAlphaNum(a, b) {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;
    const aA = a.replace(reA, '');
    const bA = b.replace(reA, '');
    if (aA === bA) {
      const aN = parseInt(a.replace(reN, ''), 10);
      const bN = parseInt(b.replace(reN, ''), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  }
  
  // Global variables for cache requests
  affiliateListArray = [];
  
  getAffiliateList(){
      return this.affiliateListArray;
  }
  
  setAffiliateList(data){
      this.affiliateListArray = data;
  }

}
