import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RerunsMerchantComponent } from './reruns-merchant-data/reruns-merchant.component';
import { RerunRoutingModule } from './rerun-routing.module';
import { EtlSharedModule } from '../etl-shared/etl-shared.module';
import { RerunModalComponent } from './modals/rerun-modal/rerun-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RerunsDucmComponent } from './reruns-ducm/reruns-ducm.component';
import { RerunsComponent } from './reruns.component';


@NgModule({
  imports: [
    CommonModule,
    RerunRoutingModule,
    EtlSharedModule,
    NgbModule
  ],
  declarations: [RerunsMerchantComponent, RerunModalComponent, RerunsDucmComponent, RerunsComponent]
})
export class EtlRerunsModule { }
