import { SettingsComponent } from './settings/settings.component';
import { EtlAdminComponent } from './etl-admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { LogsComponent } from './logs/logs.component';

const etlAdminRoutes: Routes = [
  {
    path: '',
    component: EtlAdminComponent,
    
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          breadcrumb: 'Settings'
        }
      },
      {
        path: 'config',
        component: ConfigurationComponent,
        data: {
          breadcrumb: 'Configuration'
        }
      },
      {
        path: 'logs',
        component: LogsComponent,
        data: {
          breadcrumb: 'Logs'
        }
      }

    ]
  },
  //   { path: 'etl-page-not-found', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(etlAdminRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class EtlAdminRoutingModule { }
