import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportComponent } from './import.component';
import { ImportMerchantComponent } from './import-merchant-data/import-merchant.component';

const importRoutes: Routes = [
  {
    path: '',
    component:ImportComponent,
    children: [
      {
        path: 'rptId::merchant-data',
        component: ImportMerchantComponent,
        data: {
          breadcrumb: 'IMPORT'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(importRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class EtlImportRoutingModule { }
