import { PageNotFoundComponent } from './components/etl-layout/page-not-found/page-not-found.component';
import { NoAccessPageComponent } from './components/etl-shared/no-access-page/no-access-page.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, CanActivate, PreloadAllModules } from '@angular/router';
import { EtlAuthGuard } from './guards/etl-auth.guard';
import { compileComponentFromMetadata } from '@angular/compiler';

const etlAppRoutes: Routes = [
  {
    path: '',
    // lazy loading of the EtlLayout module
    loadChildren: './components/etl-layout/etl-layout.module#EtlLayoutModule',
    canActivate: [EtlAuthGuard]
  },
  {
    path: '',
    // lazy loading of the EtlAuthentication module
    loadChildren: './components/etl-authentication/etl-authentication.module#EtlAuthenticationModule'
  },
  { path: 'access-denied', component: NoAccessPageComponent},

  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];
@NgModule({
  declarations: [],

  imports: [
    RouterModule.forRoot(etlAppRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
