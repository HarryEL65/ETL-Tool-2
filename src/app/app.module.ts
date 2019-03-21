import { MediaQueriesService } from './services/media-queries.service';
import { PageNotFoundComponent } from './components/etl-layout/page-not-found/page-not-found.component';
import { JsonLockService } from './services/json-lock.service';
/*=============== Modules ==================*/
// The BrowserModule contains all the common directives (ngclass, ngif, ngfor) and others requires
// when your application bootstrap.
// BrowserModule should only be use in the AppModule, while the CommonModule should be use in all the
// other modules.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*----------- Third parties modules ----------------*/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
// import { Http, HttpModule, HttpClient } from '@angular/http';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { EtlAuthGuard } from './guards/etl-auth.guard';
import { EtlRoleGuard } from './guards/etl-role.guard';
import { EtlUrlAccessGuard } from './guards/etl-url-access.guard';

import { EtlAuthenticationService } from './services/etl-authentication.service';
//            ng-bootstrap
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';



/*================ Components =======================*/
/*------------The bootstrap component---------------*/
import { AppComponent } from './app.component';

/*================ Global =====================*/
import { Globals } from './utilities/globals';
import { SchemaValidatorService } from './services/schema-validator.service';
import { ProtocolService } from './services/protocol.service';
import { EventBusService } from './services/event-bus.service';
import { AppEventBusService } from './app.event-bus.service';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';


// import { HttpClientModule } from '@angular/common/http';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  // for development
  // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets/i18n/', '.json');
  // return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SideBarTogglerService } from './services/side-bar-toggler.service';
import { GlobalMessageNotificationService } from './services/global-message-notification.service';
import { DatePipe } from '@angular/common';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { CaseInsensitivePipe } from './pipes/case-insensitive.pipe';

import { RequestCache, RequestCacheWithMap } from './request-cache.service';
import { MessageService } from './message.service';
import { httpInterceptorProviders } from './http-interceptors/index';
import { JsonValidateService } from './services/json-validate.service';
import { MenuService } from './services/menu.service';
// import { RerunsComponent } from './reruns.component';
import { HttpModule } from '@angular/http';
import { NoAccessPageComponent } from './components/etl-shared/no-access-page/no-access-page.component';


export function tokenGetter() {
//  console.log('token getter invocation');
  const user = '';
  if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
  } else {
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
  }

//  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (this.user) {
    return this.user.token;
  }
  return '';
}


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NoAccessPageComponent,
    // RerunsComponent
    // CaseInsensitivePipe
  ],
  imports: [

    BrowserModule,
    // BreadcrumbsModule,
    AngularSvgIconModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:8080'],
        skipWhenExpired: false,
      }
    }),
    /*-- ng-boostrap module --*/
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true
    }),
    ToastContainerModule,
    HttpModule

  ],
  providers: [MediaQueriesService,
              Globals,
              DatePipe,
              JwtHelperService,
              SchemaValidatorService,
              ProtocolService,
              EtlAuthGuard,
              EtlRoleGuard,
              EtlUrlAccessGuard,
              EtlAuthenticationService,
              EventBusService, // Should be first, since AppEventBusService depends on it
              AppEventBusService,
              SideBarTogglerService,
              JsonLockService,
              JsonValidateService,
              GlobalMessageNotificationService,
              MenuService,
              MessageService,
              { provide: RequestCache, useClass: RequestCacheWithMap },
              httpInterceptorProviders
            ],

  bootstrap: [AppComponent]
})
export class AppModule { }

