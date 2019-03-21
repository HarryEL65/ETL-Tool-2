import { WpEtlInputModule } from './../../lib/wp-etl-input/wp-etl-input.module';
import { CaseInsensitivePipe } from './../../pipes/case-insensitive.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AddAccountMerchantComponent } from './add-account/add-account-merchant-data/add-account-merchant.component';
import { AccountManagementComponent } from './account-management.component';
import { EtlAcntMngmtRoutingModule } from './etl-acnt-mngmt-routing.module';
import { EtlSharedModule } from '../etl-shared/etl-shared.module';
 import { ChoosePopulationComponent } from '../etl-shared/choose-population/choose-population.component';
import { ChooseConfigurationComponent } from './add-account/choose-configuration/choose-configuration.component';
import { JsonLikeListComponent } from './add-account/choose-configuration/json-like-list/json-like-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalTestingComponent } from './modals/modal-testing/modal-testing.component';

import { NgModule } from '@angular/core';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { ModalRemoveComponent } from './modals/modal-remove/modal-remove.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { RemoveAccountComponent } from './remove-account/remove-account.component';
import { RemoveAccountMerchantComponent } from './remove-account/remove-account-merchant-data/remove-account-merchant.component';
import { EditAccountRoutingModule } from './edit-account/edit-account-routing.module';

@NgModule({
  declarations: [
    AddAccountMerchantComponent,
    AccountManagementComponent,
    ChooseConfigurationComponent,
    JsonLikeListComponent,
    ModalTestingComponent,
    ModalRemoveComponent,
    AddAccountComponent,
    RemoveAccountComponent,
    RemoveAccountMerchantComponent
  ],
  imports: [
    CommonModule,
    EtlSharedModule,
    EtlAcntMngmtRoutingModule,
    NgbModule,
    NgJsonEditorModule,
    WpEtlInputModule
    
  ],
  providers: [
  ]
})
export class EtlAcntMngmtModule { }
