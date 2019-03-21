import { EditAccountRoutingModule } from './edit-account-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAccountMerchantComponent } from './update-account/update-account-merchant-data/update-account-merchant.component';
import { EditAccountComponent } from '../edit-account/edit-account.component';
import { ChangeRecordTypeMerchantComponent } from './change-record-type/change-record-type-merchant-data/change-record-type-merchant.component';
import { ChangeRecordTypeComponent } from './change-record-type/change-record-type.component';
import { ModalChangeRecordTypeComponent } from '../modals/modal-record-type/modal-change-record-type.component';
import { EtlAcntMngmtModule } from '../etl-acnt-mngmt.module';
import { EtlSharedModule } from '../../etl-shared/etl-shared.module';
 import { ChoosePopulationComponent } from '../../etl-shared/choose-population/choose-population.component';
import { ChooseConfigurationComponent } from '../add-account/choose-configuration/choose-configuration.component';
import { JsonLikeListComponent } from '../add-account/choose-configuration/json-like-list/json-like-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { UpdateAccountComponent } from './update-account/update-account.component';


/**
 * ! EDIT ACCOUNT MODULE
 * 
 * @export
 * @class EditAccountModule
 */
@NgModule({

  declarations: [
      UpdateAccountMerchantComponent,
      EditAccountComponent,
      ChangeRecordTypeMerchantComponent,
      ChangeRecordTypeComponent,
      ModalChangeRecordTypeComponent,
      UpdateAccountComponent,
  ],
  imports: [
      CommonModule,
      EtlSharedModule,
      EditAccountRoutingModule,
      NgbModule,
      NgJsonEditorModule
  ],
  providers: []
})
export class EditAccountModule { }
