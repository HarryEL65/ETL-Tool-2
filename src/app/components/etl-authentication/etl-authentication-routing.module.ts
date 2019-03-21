import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NoAccessPageComponent } from '../etl-shared/no-access-page/no-access-page.component';

const authenticationRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'access-denied',  redirectTo: '/access-denied', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '/not-found'},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(authenticationRoutes)
  ],
  exports: [RouterModule]
})
export class EtlAuthenticationRoutingModule { }
