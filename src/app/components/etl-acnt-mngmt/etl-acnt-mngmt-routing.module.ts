import { EditAccountComponent } from './edit-account/edit-account.component';
import { NgModule, Component } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AddAccountComponent } from './add-account/add-account.component';
import { AddAccountMerchantComponent } from './add-account/add-account-merchant-data/add-account-merchant.component';
import { RemoveAccountComponent } from './remove-account/remove-account.component';
import { RemoveAccountMerchantComponent } from './remove-account/remove-account-merchant-data/remove-account-merchant.component';
import { UpdateAccountMerchantComponent } from './edit-account/update-account/update-account-merchant-data/update-account-merchant.component';
import { AccountManagementComponent } from './account-management.component';
import { EtlRoleGuard } from '../../guards/etl-role.guard';
import { ChangeRecordTypeMerchantComponent } from './edit-account/change-record-type/change-record-type-merchant-data/change-record-type-merchant.component';
import { ChangeRecordTypeComponent } from './edit-account/change-record-type/change-record-type.component';
import { EtlAuthGuard } from '../../guards/etl-auth.guard';

const acntMngmtRoutes: Routes = [
  {
    path: '',
    component: AccountManagementComponent,

    children: [
    {
        path: 'add-account',
        component: AddAccountComponent,
        children: [
        {
            path: 'rptId::merchant-data',
            component: AddAccountMerchantComponent,
            data: {
              breadcrumb: 'Add Account'
          }
        }
      ]
    },
    {
        path: 'remove-account',
        component: RemoveAccountComponent,
        children: [
          {
              path: 'rptId::merchant-data',
              component: RemoveAccountMerchantComponent,
              data: {
                breadcrumb: 'remove Account'
            }
          }
        ]
      },
      { 
          path: 'edit-account', 
          loadChildren: '../../components/etl-acnt-mngmt/edit-account/edit-account.module#EditAccountModule',
          // canActivateChild: [EtlAuthGuard]
          data: {
            breadcrumb: 'Edit Account'
        }
      },
     
    ]
  },
  
];
@NgModule({
  imports: [
    RouterModule.forChild(acntMngmtRoutes)
  ],
  exports: [RouterModule]
})
export class EtlAcntMngmtRoutingModule { }
