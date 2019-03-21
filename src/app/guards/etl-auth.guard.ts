import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EtlAuthenticationService } from '../services/etl-authentication.service';


@Injectable()
export class EtlAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: EtlAuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuthenticated()) {
          return true;
        }

        this.router.navigate(['/login']);
        return false;
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.canActivate(route, state);
  }
}
