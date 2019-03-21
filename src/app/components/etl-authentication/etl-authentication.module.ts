import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { EtlAuthenticationRoutingModule } from './etl-authentication-routing.module';
import { EtlAuthenticationService } from '../../services/etl-authentication.service';
import { EtlAuthGuard } from '../../guards/etl-auth.guard';

import { MatSpinner, MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material';
import { EtlSharedModule } from '../etl-shared/etl-shared.module';

@NgModule({
  declarations: [LoginComponent,
                 LogoutComponent],
  imports: [
  CommonModule,
    FormsModule,
    EtlAuthenticationRoutingModule,
    EtlSharedModule,

    // loading the angular matspinner modules
    MatProgressSpinnerModule,

  ],
  providers: [EtlAuthenticationService,
              EtlAuthGuard]
})
export class EtlAuthenticationModule { }
