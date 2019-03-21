import { Injectable } from '@angular/core';

import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Globals } from '../utilities/globals';

interface User {
  token: string;
}

@Injectable()
export class EtlAuthenticationService {
  
  // list of Roles and Permissions
  role;
  permissions;
  

  constructor(public http: HttpClient, 
              private jwtHelper: JwtHelperService, 
              public router: Router) { }


  login(username: string, password: string, rememberMe: boolean) {
      // tslint:disable-next-line:max-line-length
      return this.http.post<User>(environment.beURL + '/login', JSON.stringify({ username: username, password: password }), { withCredentials: true }).map(response => {
      const user = response;
      // console.log('login successful if theres a jwt token in the response : ' + JSON.stringify(user));

//      console.log('Remember Me status is: ' + rememberMe);

      if (rememberMe) {
        if (user && user.token) {
          // Save the token in localStorage
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          // console.log('re-printing out token ' + JSON.parse(localStorage.getItem('currentUser')).token);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      } else {
        // Save the token in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
      }
      
      let userDetails = this.getUserDetails();
      this.setRoles(userDetails.roles);
      this.setPermissions(userDetails.permissions);
      
      return user;

    });
  }


  // This is an observable - we subscribe to this method in the login.component.ts file
  logout() {
    // remove user from local storage to log user out
    // console.log('clearing current user');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.jwtHelper.tokenGetter());
    
    // when logout we need to reset this list variables
    this.role = [];
    this.permissions = [];
    
    // tslint:disable-next-line:max-line-length
    return this.http.post<User>(environment.beURL + '/logout', JSON.stringify({}), { withCredentials: true, headers: headers  }).map(response => {
      const user = response;
      // console.log('logout successful if theres a jwt token in the response : ' + JSON.stringify(user));

      if (localStorage.getItem('currentUser')) {
          localStorage.removeItem('currentUser');
      } else {
          sessionStorage.removeItem('currentUser');
      }
      if (localStorage.getItem('reportId')){
        localStorage.removeItem('reportId');
      }
      if (localStorage.getItem('allAllowedPath')) {
          localStorage.removeItem('allAllowedPath');
      }

      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser')) {
// //      console.log('We have a JWT token in the localStorage or in the sessionStorage');
// //      console.log('isTokenExpired: ' + this.jwtHelper.isTokenExpired());
      if (!this.jwtHelper.isTokenExpired()) {
        // logged in so return true
// //        console.log('token not expired');
// //        console.log('token expiration date is ' + this.jwtHelper.getTokenExpirationDate());
        return true;
      } else {
// //        console.log('token was expired, exiperation date set to ' + this.jwtHelper.getTokenExpirationDate());
      }
    } else {
// //      console.log('user not found routig to login page ');
    }

    return false;
  }
  
  hasRole(roles: String[]): Observable<boolean> { 
      if (typeof this.role === 'undefined' || this.role.length === 0){
          let userDetails = this.getUserDetails();
          this.setRoles(userDetails.roles);
      }
      
      // check if the role is matching the RegEx pattern
      for (let i = 0; i < roles.length; i++) {
          let pattern = new RegExp(roles[i].toString());
          if (pattern.test(this.role.toString())) {
              return Observable.of(true);
          }
      }
      
      return Observable.of(false);
  }
  
  private handleError(error: any ) {
    return Observable.throw(error);
  }
  
  hasPermission(permission: String): Observable<boolean> {
      // check if the permissions map is set, if not create it according to the permissions of the user in Mongo
      if (typeof this.permissions === 'undefined' || this.permissions.length === 0){
          let userDetails = this.getUserDetails();
          this.setPermissions(userDetails.permissions);
      }
      
      // check if the permission is matching the RegEx pattern
      for (let i = 0; i < this.permissions.length; i++) {
          let pattern = new RegExp(this.permissions[i]);
          if (pattern.test(permission.toString())) {
              return Observable.of(true);
          }
      }
      
      return Observable.of(false);
  }

  getUserDetails() {
    if (this.isAuthenticated()) {
      //      const decoded = this.jwtHelper.decodeToken(localStorage.getItem('currentUser'));
      const decoded = this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());
      
      return {
        name: decoded.user.properties.name,
        surname: decoded.user.properties.surname,
        mail: decoded.user.properties.mail,
        userName: decoded.user.username,
        roles: decoded.user.properties.roles,
        permissions: decoded.user.properties.permissions,
        thumbnail: 'data:image/jpeg;base64,' + this.thumbnailGetter()
      };
    }
  }
  
    getUserRole() {
      let userDetails = this.getUserDetails();
      console.log(userDetails);
      this.role = userDetails.roles[0];
      console.log('from getUserRole - auth', this.role);
      return this.role;
    }

  
  thumbnailGetter() {
    let user = {thumbnail: ""};
    if (localStorage.getItem('currentUser')) {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } else {
        user = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    if (user) {
      return user.thumbnail;
    }
    return '';
  }
  
  setRoles(roles){
      // convert the roles array to a map to improve search
      this.role = roles.map(function(str) {
         if (str !== '*') {
             return new RegExp(str);
         } else {
             return new RegExp('.' + str);
         }
      });
  }
  
  setPermissions(permissions){
      // convert the permissions array to a list of RegEx
      this.permissions = permissions.map(function(str) {
          if (str !== '*') {
              return new RegExp(str);
          } else {
              return new RegExp('.' + str);
          }
      });
  }

}
