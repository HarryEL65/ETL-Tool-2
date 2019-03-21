import { MenuService } from './../services/menu.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EtlUrlAccessGuard implements CanActivate {
  constructor(public menuSrv: MenuService, 
              public router: Router,
              public location: Location) {}
  canActivate(route: ActivatedRouteSnapshot):boolean {

    if(this.menuSrv.hasAccessToPath(this.location.path())) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }

  }

    
  canActivateChild(route: ActivatedRouteSnapshot):boolean{
    return this.canActivate(route);
}
}
