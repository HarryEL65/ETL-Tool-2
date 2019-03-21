import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { routerTransition } from '../../../router.animations';
import { EtlAuthenticationService } from '../../../services/etl-authentication.service';

import { User } from '../../../models/user';
import { ErrorMessageComponent } from '../../etl-shared/error-message/error-message.component';
import { JwtHelperService  } from '@auth0/angular-jwt';

@Component({
  selector: 'wp-etl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  // getting access to the local referentce defined in our Html template
  // throug the @ViewChild directive and assinging it to the variable
  // loginForm of type NgForm
  @ViewChild('lgFrm') loginForm: NgForm;
  user: User = { username: '', password: '' };
  isSubmitted = false;
  loading = false;
  returnUrl: string;
  error: {status: string, message: string};
  rememberMe = true;

  isError = false;
  @ViewChild('username') username: NgModel;

  // spinner/loading settings
  color = '$base-light-green!important';
  mode = 'indeterminate';
  value = 33;


  constructor(public router: Router,
              private route: ActivatedRoute,
              private authenticationService: EtlAuthenticationService,
              private jwtHelper: JwtHelperService) {
  }

  ngOnInit() {
    this.error = {status : '', message : ''};
    // Subscribe to the logout observable
//    this.authenticationService.logout().subscribe(data => {
//        // console.log(data);
//    }, error => {
//        // console.log(error);
//    });
    if (localStorage.getItem('currentUser')) {
        localStorage.removeItem('currentUser');
    } else {
        sessionStorage.removeItem('currentUser');
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin() {
    this.isSubmitted = true;
    this.user.username = this.loginForm.value.username;
    this.user.password = this.loginForm.value.password;
    this.loading = true;
    // Subscribe to the login observable
    this.authenticationService.login(this.user.username, this.user.password, this.rememberMe)
      .subscribe(
        data => {
          // console.log('received login data ' + JSON.stringify(data));
          const decoded = this.jwtHelper.decodeToken(data.token);
          this.user.name = decoded.user.properties.name;
          this.user.surname = decoded.user.properties.surname;
          this.user.mail = decoded.user.properties.mail;

          this.router.navigate(['/home']);
          this.loading = false;
          this.loginForm.reset();
          this.isSubmitted = false;
        },
        error => {
// //          console.log('got error : ' + JSON.stringify(error));
          this.error.status = error.status;
          this.error.message = error.message;
          this.loading = false;
          this.isSubmitted = false;

          this.isError = true;
          this.username.control.setErrors({'notUnique': true});
        });

  }

  onForgotPwrd() {}

  onFocus() {
      if ( this.isError ) {
          this.isError = false;
          this.loginForm.reset();
          this.rememberMe = true;
      }
  }

}
