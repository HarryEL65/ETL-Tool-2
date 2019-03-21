import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { forkJoin } from 'rxjs/observable/forkJoin';

import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { EtlAuthenticationService } from '../services/etl-authentication.service';


@Injectable()
export class EtlRoleGuard implements CanActivate {

  constructor(public auth: EtlAuthenticationService, public router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    
    // decode the token to get its payload
    if ( !this.auth.isAuthenticated() ) {
      this.router.navigate(['/login']);
      return Observable.of(false);
    }

    //  console.log('passed authentication, checking for role compliance with expected role ' + expectedRole );
    return this.auth.hasRole(expectedRole);
    
  }
  
  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
      return this.canActivate(route);
  }
  
}
