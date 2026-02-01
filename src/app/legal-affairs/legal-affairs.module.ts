import { MissionActivityFormComponent } from "./legal-mission/mission-view/modals/mission-activity-form/mission-activity-form.component";
import { NgxSelectV1Module } from "@ngx-select-v1/ngx-select-v1";
import { ColumnsFilterModule } from "./../shared/columns-filter/columns-filter.module";
import { ModalModule } from "ngx-modal";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LegalAffairsRoutingModule } from "./legal-affairs-routing.module";
import { LegalDocumentsComponent } from "./legal-documents/legal-documents.component";
import { FilesTableComponent } from "./legal-documents/sections/files-table/files-table.component";
import { ViewDocumentComponent } from "./legal-documents/modals/view-document/view-document.component";
import { DocumentFormComponent } from "./legal-documents/document-form/document-form.component";
import { TypeFormComponent } from "./legal-documents/modals/type-form/type-form.component";
import { FormsModule } from "@angular/forms";
import { CasesListComponent } from "./legal-cases/cases-list/cases-list.component";
import { CaseFormComponent } from "./legal-cases/case-form/case-form.component";
import { CaseViewComponent } from "./legal-cases/case-view/case-view.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { ChangeCaseStatusComponent } from "./legal-cases/case-view/modals/change-case-status/change-case-status.component";
import { CaseActivityFormComponent } from "./legal-cases/case-view/modals/case-activity-form/case-activity-form.component";
import { CaseFilesComponent } from "./legal-cases/case-view/modals/case-files/case-files.component";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { CaseNoteFormComponent } from "./legal-cases/case-view/modals/case-note-form/case-note-form.component";
import { MissionsListComponent } from "./legal-mission/missions-list/missions-list.component";
import { MissionFormComponent } from "./legal-mission/mission-form/mission-form.component";
import { MissionNoteFormComponent } from "./legal-mission/mission-view/modals/mission-note-form/mission-note-form.component";
import { MissionFilesComponent } from "./legal-mission/mission-view/modals/mission-files/mission-files.component";
import { ChangeMissionStatusComponent } from "./legal-mission/mission-view/modals/change-mission-status/change-mission-status.component";
import { MissionViewComponent } from "./legal-mission/mission-view/mission-view.component";
import { LegalContractArchiveComponent } from "./legal-contract-archive/legal-contract-archive.component";
import { ViewContractArchiveComponent } from "./legal-contract-archive/modals/view-contract-archive/view-contract-archive.component";
import { TypeContractArchiveComponent } from "./legal-contract-archive/modals/type-contract-archive/type-contract-archive.component";
import { ContractArchiveFormComponent } from "./legal-contract-archive/contract-archive-form/contract-archive-form.component";
import { ContractArchiveFilesTableComponent } from "./legal-contract-archive/sections/contract-archive-files-table/contract-archive-files-table.component";

@NgModule({
  imports: [
    CommonModule,
    LegalAffairsRoutingModule,
    ModalModule,
    FormsModule,
    NgbPaginationModule,
    ColumnsFilterModule,
    NgxSelectV1Module,
    EditorModule,
  ],
  declarations: [
    LegalDocumentsComponent,
    FilesTableComponent,
    ViewDocumentComponent,
    DocumentFormComponent,
    TypeFormComponent,
    CasesListComponent,
    CaseFormComponent,
    CaseViewComponent,
    ChangeCaseStatusComponent,
    CaseActivityFormComponent,
    CaseFilesComponent,
    CaseNoteFormComponent,
    MissionsListComponent,
    MissionFormComponent,
    MissionViewComponent,
    MissionNoteFormComponent,
    MissionFilesComponent,
    MissionActivityFormComponent,
    ChangeMissionStatusComponent,
    LegalContractArchiveComponent,
    ContractArchiveFilesTableComponent,
    ViewContractArchiveComponent,
    TypeContractArchiveComponent,
    ContractArchiveFormComponent,
  ],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.js" }],
})
export class LegalAffairsModule {}
