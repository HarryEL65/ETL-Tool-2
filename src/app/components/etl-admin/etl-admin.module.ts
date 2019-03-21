import { EtlAdminComponent } from './etl-admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationComponent } from './configuration/configuration.component';
import { LogsComponent } from './logs/logs.component';
import { EtlAdminRoutingModule } from './etl-admin-routing.module';
import { EtlSharedModule } from '../etl-shared/etl-shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    EtlAdminRoutingModule,
    EtlSharedModule,
    NgJsonEditorModule,
    NgbModule
  ],
  declarations: [
    EtlAdminComponent,
    ConfigurationComponent,
    LogsComponent,
    SettingsComponent
  ]
})
export class EtlAdminModule { }
