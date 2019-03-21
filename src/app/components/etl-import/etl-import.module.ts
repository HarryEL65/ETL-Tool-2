import { EtlImportRoutingModule } from './etl-import-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtlSharedModule } from '../etl-shared/etl-shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImportComponent } from './import.component';
import { ImportMerchantComponent } from './import-merchant-data/import-merchant.component';
import { ValidationTableComponent } from './validation-table/validation-table.component';
import { LoadValidatedFilesModalComponent } from './modals/load-validated-files-modal/load-validated-files-modal.component';


@NgModule({
  imports: [
    CommonModule,
    EtlImportRoutingModule,
    EtlSharedModule,
    NgbModule,
  ],
  declarations: [
    ImportComponent,
    ImportMerchantComponent,
    ValidationTableComponent,
    LoadValidatedFilesModalComponent
  ]

})
export class EtlImportModule { }
