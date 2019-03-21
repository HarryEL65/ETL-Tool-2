import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EtlUserManagementComponent } from './etl-user-management.component';
import { EtlUserManagementRoutingModule } from './etl-user-management-routing.module';
import { UserManagementAllRprtIdComponent } from './user-management-all-rprt-id/user-management-all-rprt-id.component';

import { EtlSharedModule } from '../etl-shared/etl-shared.module';
import { UsersMgmntComponent } from './user-management-all-rprt-id/users-mgmnt/users-mgmnt.component';
import { RolesMgmntComponent } from './user-management-all-rprt-id/roles-mgmnt/roles-mgmnt.component';
import { UserManagementService } from '../../services/user-management.service';
import { UserCardDetailsComponent } from './user-management-all-rprt-id/users-mgmnt/user-card-details/user-card-details.component';

@NgModule({
  imports: [
    CommonModule,
    EtlUserManagementRoutingModule,
    EtlSharedModule,
    NgbModule,
  ],
  declarations: [ EtlUserManagementComponent, 
                  UserManagementAllRprtIdComponent, 
                  UsersMgmntComponent,
                  RolesMgmntComponent,
                  UserCardDetailsComponent
                ],
  providers: [UserManagementService]
})
export class EtlUserManagementModule { }

