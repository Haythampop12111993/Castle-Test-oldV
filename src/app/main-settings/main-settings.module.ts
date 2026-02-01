import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatCardModule,
  MatDividerModule,
  MatListModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
} from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DropdownModule } from "ngx-dropdown";
import { ModalModule } from "ngx-modal";
import { NgxToggleModule } from "ngx-toggle";
import { UiSwitchModule } from "ngx-toggle-switch";
import { DropdownModule as PrimeDropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { PanelMenuModule } from "primeng/panelmenu";
import { ToggleButtonModule } from "primeng/togglebutton";
import { AddDeveloperComponent } from "./add-developer/add-developer.component";
import { DevelopersComponent } from "./developers/developers.component";
import { LegalCaseCategoriesComponent } from "./legal-case-categories/legal-case-categories.component";
import { LegalDocumentsTypesComponent } from "./legal-documents-types/legal-documents-types.component";

import { OnlyNumbersDirective } from "../directives/only-numbers.directive";
import { PercentagePipe } from "../pipes/percentage.pipe";
import { AccountsComponent } from "./accounts/accounts.component";
import { AddAccountComponent } from "./accounts/add-account/add-account.component";
import { ActivityOptionsComponent } from "./activity-options/activity-options.component";
import { AddAmbassadorComponent } from "./ambassadors/add-ambassador/add-ambassador.component";
import { AmbassadorsComponent } from "./ambassadors/ambassadors.component";
import { AddBranchComponent } from "./branches/add-branch/add-branch.component";
import { BranchesComponent } from "./branches/branches.component";
import { AddBrokerComponent } from "./brokers/add-broker/add-broker.component";
import { BrokersComponent } from "./brokers/brokers.component";
import { CfoPinComponent } from "./cfo-pin/cfo-pin.component";
import { ChannelsOptionsComponent } from "./channels-options/channels-options.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { MainSettingsRoutingModule } from "./main-settings-routing.module";
import { MainSettingsComponent } from "./main-settings/main-settings.component";
import { PaymentTermsComponent } from "./payment-terms/payment-terms.component";
import { SetupPaymentPlansComponent } from "./setup-payment-plans/setup-payment-plans/setup-payment-plans.component";
import { AddTargetComponent } from "./target-settings/add-target/add-target.component";
import { TargetSettingsComponent } from "./target-settings/target-settings.component";
import { AddTeamComponent } from "./teams/add-team/add-team.component";
import { TeamsComponent } from "./teams/teams.component";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgSelectModule } from "@ng-select/ng-select";
import { EventsExpeditionService } from "./../services/settings-service/events-expedition.service";
import { AddDepartmentTicketsComponent } from "./add-department-tickets/add-department-tickets.component";
import { AddOccasionComponent } from "./add-occasion/add-occasion.component";
import { AddTicketSettingsComponent } from "./add-ticket-settings/add-ticket-settings.component";
import { ColdCallsStatusesComponent } from "./cold-calls-statuses/cold-calls-statuses.component";
import { AddContractComponent } from "./contracts/add-contract/add-contract.component";
import { ContractsComponent } from "./contracts/contracts.component";
import { CustomOccasionsComponent } from "./custom-occasions/custom-occasions.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { EventsExpeditionComponent } from "./events-expedition/events-expedition.component";
import { FeedbackQuestionsComponent } from "./feedback-questions/feedback-questions.component";
import { LegalCaseStatusesComponent } from "./legal-case-statuses/legal-case-statuses.component";
import { LegalCourtsComponent } from "./legal-courts/legal-courts.component";
import { LegalMissionCategoriesComponent } from "./legal-mission-categories/legal-mission-categories.component";
import { LegalMissionSidesComponent } from "./legal-mission-sides/legal-mission-sides.component";
import { LegalMissionStatusesComponent } from "./legal-mission-statuses/legal-mission-statuses.component";
import { OccasionsComponent } from "./occasions/occasions.component";
import { QualifiedFeedbackQuestionsComponent } from "./qualified-feedback-questions/qualified-feedback-questions.component";
import { ReminderOptionsComponent } from "./reminder-options/reminder-options.component";
import { AddMetaComponent } from "./roles/add-role/add-meta/add-meta.component";
import { AddPermissionComponent } from "./roles/add-role/add-permission/add-permission.component";
import { AddRoleComponent } from "./roles/add-role/add-role.component";
import { RolesComponent } from "./roles/roles.component";
import { SystemVersionComponent } from "./system-version/system-version.component";
import { LeadCampaignComponent } from "./lead-campaign/lead-campaign.component";
import { LeadTicketTypeComponent } from "./lead-ticket-type/lead-ticket-type.component";
import { CallCenterScriptsComponent } from "./call-center-scripts/call-center-scripts.component";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { StoreBanksComponent } from "./store-banks/store-banks.component";
import { AddStoreBankComponent } from "./add-store-bank/add-store-bank.component";
import { DistrictsComponent } from "./districts/districts.component";
import { CitiesComponent } from "./cities/cities.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelMenuModule,
    MultiSelectModule,
    NgbModule.forRoot(),
    NgxToggleModule,
    DropdownModule,
    PrimeDropdownModule,
    ModalModule,
    ToggleButtonModule,
    MatCardModule,
    AngularMultiSelectModule,
    CurrencyMaskModule,
    MainSettingsRoutingModule,
    UiSwitchModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2AutoCompleteModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    NgSelectModule,
    EditorModule,
  ],
  declarations: [
    MainSettingsComponent,
    TargetSettingsComponent,
    GeneralSettingsComponent,
    ActivityOptionsComponent,
    ChannelsOptionsComponent,
    PaymentTermsComponent,
    CfoPinComponent,
    AddTargetComponent,
    BrokersComponent,
    AddBrokerComponent,
    AmbassadorsComponent,
    AddAmbassadorComponent,
    BranchesComponent,
    AddBranchComponent,
    TeamsComponent,
    AddTeamComponent,
    AccountsComponent,
    AddAccountComponent,
    SetupPaymentPlansComponent,
    OnlyNumbersDirective,
    PercentagePipe,
    ContractsComponent,
    AddContractComponent,
    AddTicketSettingsComponent,
    AddDepartmentTicketsComponent,
    DepartmentsComponent,
    ReminderOptionsComponent,
    OccasionsComponent,
    AddOccasionComponent,
    CustomOccasionsComponent,
    SystemVersionComponent,
    RolesComponent,
    AddRoleComponent,
    AddPermissionComponent,
    AddMetaComponent,
    EventsExpeditionComponent,
    DevelopersComponent,
    AddDeveloperComponent,
    LegalDocumentsTypesComponent,
    LegalCaseCategoriesComponent,
    LegalCaseStatusesComponent,
    LegalCourtsComponent,
    LegalMissionCategoriesComponent,
    LegalMissionStatusesComponent,
    LegalMissionSidesComponent,
    FeedbackQuestionsComponent,
    QualifiedFeedbackQuestionsComponent,
    ColdCallsStatusesComponent,
    LeadCampaignComponent,
    LeadTicketTypeComponent,
    CallCenterScriptsComponent,
    StoreBanksComponent,
    AddStoreBankComponent,
    DistrictsComponent,
    CitiesComponent,
  ],
  providers: [
    EventsExpeditionService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.js" },
  ],
})
export class MainSettingsModule {}
