import { Injectable, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Globals } from '../utilities/globals';
import { AppEventBusService } from '../app.event-bus.service';
import { DatePipe } from '@angular/common';

@Injectable()
export class SecondLevelFilterService implements OnDestroy {

  affiliates = [];
  action;

  @Output() getAffiliatedAccnts = new EventEmitter();
  @Output() getManualAccnt = new EventEmitter();
  @Output() getAffiliateProgramName = new EventEmitter();

  constructor(public globals: Globals, private eventBusService: AppEventBusService, private datePipe: DatePipe) { }

  ngOnDestroy(): void {
      // console.log('Second level filter service Destroy');
  }

  // return the list of affiliates from the DWH
  getAffiliates(): void {
      
       // check if you have the affiliate list in the cache
       this.affiliates = this.globals.getAffiliateList();

      if (this.affiliates.length === 0) {
          const route = this.globals.SrvRoute.AFFIL_PRGMS_PLTFRMS;
          this.eventBusService.send(route, {
            // TODO: replace with the correct body
            'send_email': false,
            'recipiants': '',
            'request': '',
            'reportType': this.globals.reportIds['MERCHANT_DATA']
          }, (error, message) => {
            if (error) {
              // console.error('Error getting affiliates', error);
              return;
            }
            if (message) {
//                console.log("new affiliates not from cache");
              this.affiliates = message.Affiliate_Programs;
              if (this.affiliates) {
                  // return the affiliates to the second level filter
                  this.getAffiliatedAccnts.emit(this.affiliates);

                  // Update the table according to the selected affiliate
                  this.initManualAccntsTable(this.affiliates[0]);
              }
            }
          });
        } else {
//            console.log("return result from cache");
            // Proceed the process from the cache 
            // return the affiliates to the second level filter
            this.getAffiliatedAccnts.emit(this.affiliates);

            // Update the table according to the selected affiliate
            this.initManualAccntsTable(this.affiliates[0]);
        }
  }

  // Table we be updated according the Route which is set by the Step
  // (MANUAL_ACCOUNTS or ACTIVE_ACCOUNTS) when choose-population is initialized
  initManualAccntsTable(affiliate_prog) {
      const affiliate_prog_id = Number(affiliate_prog.Id);

//       console.log('The action is: ');
//       console.log(this.action);
      const route = this.getRoute(this.action);
//       console.log('the Route is: ');
//       console.log(route);

      this.eventBusService.send(route, {
                'send_email': false,
                'recipiants': '',
                'request': '',
                'reportType': this.globals.reportIds['MERCHANT_DATA'],
                'affiliateProgramID': affiliate_prog_id
              }, (error, message) => {
               if (error) {
                   // console.error('Error getting manual accounts from' + route, error);
                   return;
               }
               if (message) {
                   // Update the manual account name
                   if (message.ActiveAccounts && message.ActiveAccounts.length > 0) {
                        // message.ActiveAccounts.map ((row) => 
                       // tslint:disable-next-line:max-line-length
                       //    row.timeStamp = this.datePipe.transform(this.globals.convertToDate(row.timeStamp), 'dd/MM/yyyy'));
                   } else if (message.accounts && message.accounts.length === 0) {
                       this.getManualAccnt.emit('fake');
                   }
                   
                   this.getAffiliateProgramName.emit({'id' : affiliate_prog_id, 'name': affiliate_prog});

                   // return the result to the choose-population component
                   this.getManualAccnt.emit(message);
               }
        });
 }

  setAction(action) {
      this.action = action;
  }

  getAction() {
      return this.action;
  }

  getRoute(action) {
      let route;
      switch (action) {
          case 'add-account':
              route = this.globals.SrvRoute.MANUAL_ACCNTS;
              break;
          case 'rerun-account':
              route = this.globals.SrvRoute.ACTIVE_ACCNTS;
              break;
          case 'remove-account':
              route = this.globals.SrvRoute.ACTIVE_ACCNTS;
              break;
          case 'change-mapping':
              route = this.globals.SrvRoute.ACTIVE_ACCNTS;
              break;
          case 'change-record-type': 
              route = this.globals.SrvRoute.MANUAL_ACCNTS;
          default:
              break;
      }

      return route;

  }

}
