import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtlLayoutComponent } from './etl-layout.component';
import { PageNotFoundComponent } from '../../components/etl-layout/page-not-found/page-not-found.component';
import { HomeMerchantComponent } from '../../components/etl-layout/home/home-marchant-data/home-merchant.component';
import { EtlAuthGuard } from '../../guards/etl-auth.guard';
import { EtlRoleGuard } from '../../guards/etl-role.guard';
import { HomeDucmComponent } from './home/home-ducm/home-ducm.component';
import { EtlUrlAccessGuard } from '../../guards/etl-url-access.guard';

const etlLayoutAppRoutes: Routes = [
    {
        path: '',
        component: EtlLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },
            // This is the dashboard
            { 
                path: 'home',
                component: HomeComponent,
                children: [
                     { 
                         path: 'rptId::merchant-data',
                         component: HomeMerchantComponent,
                         canActivate: [EtlUrlAccessGuard], 
                    }, 
                    { 
                        path: 'rptId::webpals-mobile', 
                        component: HomeDucmComponent,
                        canActivate: [ EtlUrlAccessGuard, EtlRoleGuard],
                        data: {
                           expectedRole: ['super', 'webpals_mobile', 'admin'] 
                        }
                    },
            ]},
            { path: 'acnt-mngmt', loadChildren: '../../components/etl-acnt-mngmt/etl-acnt-mngmt.module#EtlAcntMngmtModule',
                canActivateChild: [EtlUrlAccessGuard, EtlAuthGuard]
            },
            {
                path: 'reruns', loadChildren: '../../components/etl-reruns/etl-reruns.module#EtlRerunsModule',
                // { path: 'reruns-merchant-data', loadChildren: '../../components/etl-reruns/etl-reruns.module#EtlRerunsModule',
                canActivateChild: [EtlUrlAccessGuard, EtlAuthGuard]
            },
            {
                path: 'import', loadChildren: '../../components/etl-import/etl-import.module#EtlImportModule',
                canActivateChild: [EtlUrlAccessGuard, EtlAuthGuard]
            },
            {
                path: 'user-management', loadChildren: '../../components/etl-user-management/etl-user-management.module#EtlUserManagementModule',
                canActivateChild: [EtlUrlAccessGuard, EtlAuthGuard]
            },
            {
                path: 'admin',
                loadChildren: '../../components/etl-admin/etl-admin.module#EtlAdminModule',
                canActivateChild: [EtlUrlAccessGuard, EtlAuthGuard],
                data: {
                    expectedRole: ['admin']
                }
            }
        ]
    }

];



@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(etlLayoutAppRoutes),
    ],
    exports: [RouterModule],
})
export class EtlLayoutRoutingModule { }
