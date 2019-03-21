import { DownloadToExcelService } from './../../services/download-to-excel.service';
import { ReactiveFormsModule } from '@angular/forms';
// we must not declare components, directive or pipes in more than one module,
// we can import a module in more than one module,
// we can provide a service in more than one service
// but we must not duplicate or declarations.
// ===> this is the reason why we are using the sharedModule

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';

import { ModalConfigComponent } from './../etl-shared/modal/modal-config/modal-config.component';

import { SuperFilterComponent } from './super-filter/super-filter.component';
import { SecondLevelFilterComponent } from './second-level-filter/second-level-filter.component';
import { ChoosePopulationComponent } from './choose-population/choose-population.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { CustomDateTimePipe } from '../../pipes/custom-date-time.pipe';
import { MatCheckboxModule, MatPaginatorModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { SvgFailedComponent } from './svg-failed/svg-failed.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HeaderAreaComponent } from './header-area/header-area.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadiobuttonComponent } from './radiobutton/radiobutton.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TruncateModule } from 'ng2-truncate';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { JsonLikeViewComponent } from './json-like-view/json-like-view.component';
import { ChooseDatesComponent } from './choose-dates/choose-dates.component';
import { CaseInsensitivePipe } from '../../pipes/case-insensitive.pipe';
import { HamburgerComponent } from './hamburger/hamburger.component';
import { ChooseRecordTypeComponent } from './choose-record-type/choose-record-type.component';
import { ModalStatusComponent } from './modal/modal-status/modal-status.component';
import { FilesListComponent } from './files-list/files-list.component';
import { PendingAcceptanceWizardComponent } from './pending-acceptance-wizard/pending-acceptance-wizard.component';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { ImportFilesComponent } from '../etl-shared/import-files/import-files.component'
import { WpEtlInputModule } from '../../lib/wp-etl-input/wp-etl-input.module';
import { InlineEditComponent } from './inline-edit/inline-edit.component';







@NgModule({
  imports: [
  CommonModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    NgxDatatableModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    AngularSvgIconModule,
    TruncateModule,
    UiSwitchModule,
    NgJsonEditorModule,
    RouterModule,
    AngularFileUploaderModule,
    ReactiveFormsModule,
    WpEtlInputModule
  ],
  declarations: [
    CustomDatePipe,
    CustomDateTimePipe,
    CaseInsensitivePipe,
    ModalComponent,
    ModalConfigComponent,
    SuperFilterComponent,
    SecondLevelFilterComponent,
    ChoosePopulationComponent,
    ErrorMessageComponent,
    ExpansionPanelComponent,
    SvgFailedComponent,
    HeaderAreaComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    JsonLikeViewComponent,
    ChooseDatesComponent,
    HamburgerComponent,
    ChooseRecordTypeComponent,
    ModalStatusComponent,
    ImportFilesComponent,
    FilesListComponent,
    PendingAcceptanceWizardComponent,
    SvgIconComponent,
    InlineEditComponent
  ],
  // By exporting all the declared components,
  // we make them available to the others module.
  // ==> this is the particularity of the outer Shared Module
  exports: [
    CustomDatePipe,
    CustomDateTimePipe,
    CaseInsensitivePipe,
    FormsModule,
    NgSelectModule,
    ModalComponent,
    ModalConfigComponent,
    SuperFilterComponent,
    SecondLevelFilterComponent,
    ChoosePopulationComponent,
    ErrorMessageComponent,
    ExpansionPanelComponent,
    SvgFailedComponent,
    HttpClientModule,
    AngularSvgIconModule,
    NgxDatatableModule,
    HeaderAreaComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    TruncateModule,
    MatProgressBarModule,
    UiSwitchModule,
    NgJsonEditorModule,
    JsonLikeViewComponent,
    ChooseDatesComponent,
    HamburgerComponent,
    ChooseRecordTypeComponent,
    ModalStatusComponent,
    FilesListComponent,
    PendingAcceptanceWizardComponent,
    ImportFilesComponent,
    AngularFileUploaderModule,
    ReactiveFormsModule,
    SvgIconComponent,
    InlineEditComponent
],
providers: [
  CustomDatePipe,
  CustomDateTimePipe,
  CaseInsensitivePipe,
  DownloadToExcelService
]


})
export class EtlSharedModule { }
