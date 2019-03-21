import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtlUserManagementComponent } from './etl-user-management.component';
import { UserManagementAllRprtIdComponent } from './user-management-all-rprt-id/user-management-all-rprt-id.component';

const userManagementRoutes: Routes = [
  {
    path: '',
    component:EtlUserManagementComponent,
    children: [
      {
        path: 'rptId::all',
        component: UserManagementAllRprtIdComponent,
        data: {
          breadcrumb: 'USER_MANAGEMENT'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userManagementRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class EtlUserManagementRoutingModule { }
