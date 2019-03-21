import { RerunsDucmComponent } from './reruns-ducm/reruns-ducm.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RerunsMerchantComponent } from './reruns-merchant-data/reruns-merchant.component';
import { RerunsComponent } from './reruns.component';
import { EtlRoleGuard } from '../../guards/etl-role.guard';
import { EtlUrlAccessGuard } from '../../guards/etl-url-access.guard';

const rerunRoutes: Routes = [
  {
    path: '',
    component: RerunsComponent,
    children: [
      {
        path: 'rptId::merchant-data',
        component: RerunsMerchantComponent,
        canActivate: [EtlUrlAccessGuard, EtlRoleGuard],
        data: {
          breadcrumb: 'RERUNS',
           expectedRole: ['admin', 'super', 'dev', 'merchant']
        }
      },
      { path: 'rptId::webpals-mobile', 
        component: RerunsDucmComponent,
        canActivate: [EtlUrlAccessGuard, EtlRoleGuard],
        data: {
              expectedRole: ['super', 'webpals_mobile', 'admin'] 
            // expectedRole: ['admin', 'super', 'dev', 'webpals_mobile']
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(rerunRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class RerunRoutingModule { }
