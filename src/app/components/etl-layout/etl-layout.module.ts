import { LastAcntsLoadedGridComponent } from './home/content/last-loaded/last-acnts-loaded-grid.component';
import { EtlImportModule } from './../etl-import/etl-import.module';

// import { BreadcrumbsModule } from 'ng2-breadcrumbs';
// Unlike the sharedModule the CoreModule will only be imported by a single module: the root module  (AppModule)

// CommonModule: gives you access to the common directives (ngclass, ngif, ngfor)
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/*---------------- custom Module ------------------*/
import { EtlSharedModule } from './../etl-shared/etl-shared.module';
import { EtlLayoutRoutingModule } from './etl-layout-routing.module';

/*---------------- custom Components ------------------*/
import { HomeMerchantComponent } from './home/home-marchant-data/home-merchant.component';
import { HeaderComponent } from './header/header.component';
import { SideBarPanelComponent } from './side-bar-panel/side-bar-panel.component';
import { WelcomeComponent } from './side-bar-panel/welcome/welcome.component';
import { NavigationComponent } from './side-bar-panel/navigation/navigation.component';
import { LogoComponent } from './side-bar-panel/logo/logo.component';
import { TopNavigationComponent } from './header/top-navigation/top-navigation.component';
import { DataTypeNavigationComponent } from './header/data-type-navigation/data-type-navigation.component';
import { CurrentLocationTitleComponent } from './header/current-location-title/current-location-title.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContentAreaComponent } from './content-area/content-area.component';
import { EtlLayoutComponent } from './etl-layout.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

// import {BreadcrumbsModule} from 'ng2-breadcrumbs';
/*----------- Third parties modules ----------------*/
//            Angular Material Design
import {MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatTabsModule} from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { ModalConfigComponent } from './home/modals/modal-config/modal-config.component';
import { LastRerunsComponent } from './home/content/last-reruns/last-reruns.component';
import { LastRemovedComponent } from './home/content/last-removed/last-removed.component';
import { FilesListComponent } from '../etl-shared/files-list/files-list.component';
// tslint:disable-next-line:max-line-length
import { PendingAcceptanceWizardComponent } from '../etl-shared/pending-acceptance-wizard/pending-acceptance-wizard.component';
import { ModalStatusComponent } from '../etl-shared/modal/modal-status/modal-status.component';
import { LastAcntsAddedGridComponent } from './home/content/last-added/lastAcntsAddedGrid.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MessageAreaComponent } from './message-area/message-area.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MessagesComponent } from './notifications/messages/messages.component';
import { OperationsComponent } from './notifications/operations/operations.component';
import { TodosComponent } from './notifications/todos/todos.component';
import { DowntimeOverlayComponent } from './downtime-overlay/downtime-overlay.component';
import { HomeDucmComponent } from './home/home-ducm/home-ducm.component';


import { HomeComponent } from './home/home.component';
import { RerunDcumModalSuccessComponent } from './home/home-ducm/modal/rerun-dcum-modal-success.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeMerchantComponent,
    HomeDucmComponent,
    HeaderComponent,
    SideBarPanelComponent,
    WelcomeComponent,
    NavigationComponent,
    // MenuItemComponent,
    // SideBarNavigationComponent,
    LogoComponent,
    TopNavigationComponent,
    DataTypeNavigationComponent,
    CurrentLocationTitleComponent,
    ContentAreaComponent,
    EtlLayoutComponent,
    LastRerunsComponent,
    LastRemovedComponent,
    LastAcntsAddedGridComponent,
    MessageAreaComponent,
    NotificationsComponent,
    MessagesComponent,
    OperationsComponent,
    TodosComponent,
    DowntimeOverlayComponent,
    RerunDcumModalSuccessComponent,
    LastAcntsLoadedGridComponent
    ],
  imports: [
    CommonModule,
    EtlSharedModule,
    EtlLayoutRoutingModule,
    AngularFontAwesomeModule,
    NgbModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    NgxDatatableModule
  ],

providers: []


})
export class EtlLayoutModule { }
