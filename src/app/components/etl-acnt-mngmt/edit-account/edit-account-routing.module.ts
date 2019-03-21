import { UpdateAccountMerchantComponent } from './update-account/update-account-merchant-data/update-account-merchant.component';
import { ChangeRecordTypeMerchantComponent } from './change-record-type/change-record-type-merchant-data/change-record-type-merchant.component';
import { ChangeRecordTypeComponent } from './change-record-type/change-record-type.component';
import { EditAccountComponent } from './edit-account.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateAccountComponent } from './update-account/update-account.component';


// ! EDIT ACCOUNTS ROUTES
const editAccntsRoutes: Routes = [
  {
    path: '',
    component: EditAccountComponent,

    children: [
      {
        path: 'change-record-type',
        component: ChangeRecordTypeComponent,

        children: [
          {
            path: 'rptId::merchant-data',
            component: ChangeRecordTypeMerchantComponent,
            data: {
              breadcrumb: 'Change Record Type'
            }
          }
        ]
      },
      {
        path: 'change-mapping',
        component: UpdateAccountComponent,

        children: [
          {
            path: 'rptId::merchant-data',
            component: UpdateAccountMerchantComponent,
            data: {
              breadcrumb: 'Change Mapping Type'
            }
          }
        ]
      }


    ]
  }
]

/**
 * 
 * 
 * @export
 * @class EditAccountRoutingModule
 */
@NgModule({
  imports: [
    RouterModule.forChild(editAccntsRoutes)
  ],
  exports: [RouterModule]
})
export class EditAccountRoutingModule { }
