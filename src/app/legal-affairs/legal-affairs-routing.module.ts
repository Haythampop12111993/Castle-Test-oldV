import { CaseFormComponent } from "./legal-cases/case-form/case-form.component";
import { LegalDocumentsComponent } from "./legal-documents/legal-documents.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CasesListComponent } from "./legal-cases/cases-list/cases-list.component";
import { CaseViewComponent } from "./legal-cases/case-view/case-view.component";
import { DocumentFormComponent } from "./legal-documents/document-form/document-form.component";
import { MissionsListComponent } from "./legal-mission/missions-list/missions-list.component";
import { MissionFormComponent } from "./legal-mission/mission-form/mission-form.component";
import { MissionViewComponent } from "./legal-mission/mission-view/mission-view.component";
import { LegalContractArchiveComponent } from "./legal-contract-archive/legal-contract-archive.component";
import { ContractArchiveFormComponent } from "./legal-contract-archive/contract-archive-form/contract-archive-form.component";

const routes: Routes = [
  {
    path: "documents",
    children: [
      {
        path: "",
        component: LegalDocumentsComponent,
      },
      {
        path: "add",
        component: DocumentFormComponent,
      },
      {
        path: "edit/:id",
        component: DocumentFormComponent,
      },
      {
        path: ":type_id",
        component: LegalDocumentsComponent,
      },
      {
        path: "**",
        redirectTo: "",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "contract-archives",
    children: [
      {
        path: "",
        component: LegalContractArchiveComponent,
      },
      {
        path: "add",
        component: ContractArchiveFormComponent,
      },
      {
        path: "edit/:id",
        component: ContractArchiveFormComponent,
      },
      {
        path: ":type_id",
        component: LegalContractArchiveComponent,
      },
      {
        path: "**",
        redirectTo: "",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "cases",
    children: [
      {
        path: "",
        component: CasesListComponent,
      },
      {
        path: "add",
        component: CaseFormComponent,
      },
      {
        path: "edit/:id",
        component: CaseFormComponent,
      },
      {
        path: "view/:id",
        component: CaseViewComponent,
      },
      {
        path: "**",
        redirectTo: "",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "missions",
    children: [
      {
        path: "",
        component: MissionsListComponent,
      },
      {
        path: "add",
        component: MissionFormComponent,
      },
      {
        path: "edit/:id",
        component: MissionFormComponent,
      },
      {
        path: "view/:id",
        component: MissionViewComponent,
      },
      {
        path: "**",
        redirectTo: "",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalAffairsRoutingModule {}
