import { LegalMissionSidesComponent } from "./legal-mission-sides/legal-mission-sides.component";
import { LegalCourtsComponent } from "./legal-courts/legal-courts.component";
import { LegalCaseStatusesComponent } from "./legal-case-statuses/legal-case-statuses.component";
import { LegalCaseCategoriesComponent } from "./legal-case-categories/legal-case-categories.component";
import { LegalDocumentsTypesComponent } from "./legal-documents-types/legal-documents-types.component";
import { AddDeveloperComponent } from "./add-developer/add-developer.component";
import { DevelopersComponent } from "./developers/developers.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MainSettingsComponent } from "./main-settings/main-settings.component";
import { TargetSettingsComponent } from "./target-settings/target-settings.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { ActivityOptionsComponent } from "./activity-options/activity-options.component";
import { ChannelsOptionsComponent } from "./channels-options/channels-options.component";
import { PaymentTermsComponent } from "./payment-terms/payment-terms.component";
import { CfoPinComponent } from "./cfo-pin/cfo-pin.component";
import { TargetsGuard } from "../guards/targets.guard";
import { AddTargetComponent } from "./target-settings/add-target/add-target.component";
import { BrokersComponent } from "./brokers/brokers.component";
import { AddBrokerComponent } from "./brokers/add-broker/add-broker.component";
import { AmbassadorsComponent } from "./ambassadors/ambassadors.component";
import { AddAmbassadorComponent } from "./ambassadors/add-ambassador/add-ambassador.component";
import { BranchesComponent } from "./branches/branches.component";
import { AddBranchComponent } from "./branches/add-branch/add-branch.component";
import { TeamsComponent } from "./teams/teams.component";
import { SettingTabGuard } from "../guards/settingsTab.guard";
import { AddTeamComponent } from "./teams/add-team/add-team.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { AddAccountComponent } from "./accounts/add-account/add-account.component";
import { SetupPaymentPlansComponent } from "./setup-payment-plans/setup-payment-plans/setup-payment-plans.component";
import { ContractsComponent } from "./contracts/contracts.component";
import { AddContractComponent } from "./contracts/add-contract/add-contract.component";
import { AddTicketSettingsComponent } from "./add-ticket-settings/add-ticket-settings.component";
import { AddDepartmentTicketsComponent } from "./add-department-tickets/add-department-tickets.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { ReminderOptionsComponent } from "./reminder-options/reminder-options.component";
import { OccasionsComponent } from "./occasions/occasions.component";
import { AddOccasionComponent } from "./add-occasion/add-occasion.component";
import { CustomOccasionsComponent } from "./custom-occasions/custom-occasions.component";
import { SystemVersionComponent } from "./system-version/system-version.component";
import { AddRoleComponent } from "./roles/add-role/add-role.component";
import { RolesComponent } from "./roles/roles.component";
import { EventsExpeditionComponent } from "./events-expedition/events-expedition.component";
import { LegalMissionCategoriesComponent } from "./legal-mission-categories/legal-mission-categories.component";
import { LegalMissionStatusesComponent } from "./legal-mission-statuses/legal-mission-statuses.component";
import { FeedbackQuestionsComponent } from "./feedback-questions/feedback-questions.component";
import { QualifiedFeedbackQuestionsComponent } from "./qualified-feedback-questions/qualified-feedback-questions.component";
import { ColdCallsStatusesComponent } from "./cold-calls-statuses/cold-calls-statuses.component";
import { LeadCampaignComponent } from "./lead-campaign/lead-campaign.component";
import { LeadTicketTypeComponent } from "./lead-ticket-type/lead-ticket-type.component";
import { CallCenterScriptsComponent } from "./call-center-scripts/call-center-scripts.component";
import { StoreBanksComponent } from "./store-banks/store-banks.component";
import { AddStoreBankComponent } from "./add-store-bank/add-store-bank.component";
import { DistrictsComponent } from "./districts/districts.component";
import { CitiesComponent } from "./cities/cities.component";
import { BrokerIncentiveGuard } from "../guards/broker-incentive.guard";
import { BrokerRestrictionGuard } from "../guards/broker-restriction.guard";

const routes: Routes = [
  {
    path: "",
    component: MainSettingsComponent,
    canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
    children: [
      {
        path: "",
        redirectTo: "general",
      },
      {
        path: "general",
        component: GeneralSettingsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "activity",
        component: ActivityOptionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "cities",
        component: CitiesComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "districts",
        component: DistrictsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "feedback-questions",
        component: FeedbackQuestionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "qualified-feedback-questions",
        component: QualifiedFeedbackQuestionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "events",
        component: EventsExpeditionComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "lead-campaigns",
        component: LeadCampaignComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "lead-ticket-types",
        component: LeadTicketTypeComponent,
        canActivate: [BrokerRestrictionGuard],
      },

      {
        path: "legal-affairs",
        canActivate: [BrokerRestrictionGuard],
        children: [
          {
            path: "document-types",
            component: LegalDocumentsTypesComponent,
          },
          {
            path: "case-categories",
            component: LegalCaseCategoriesComponent,
          },
          {
            path: "case-statuses",
            component: LegalCaseStatusesComponent,
          },
          {
            path: "courts",
            component: LegalCourtsComponent,
          },
        ],
      },
      {
        path: "legal-mission",
        canActivate: [BrokerRestrictionGuard],
        children: [
          {
            path: "mission-categories",
            component: LegalMissionCategoriesComponent,
          },
          {
            path: "mission-statuses",
            component: LegalMissionStatusesComponent,
          },
          {
            path: "missoin-sides",
            component: LegalMissionSidesComponent,
          },
        ],
      },
      {
        path: "contact-statuses",
        component: ColdCallsStatusesComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "reminders-options",
        component: ReminderOptionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "channels",
        component: ChannelsOptionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "payment-terms",
        component: PaymentTermsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "cfo-pin",
        component: CfoPinComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "brokers",
        component: BrokersComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "brokers/add",
        component: AddBrokerComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "ambassadors",
        component: AmbassadorsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "ambassadors/add",
        component: AddAmbassadorComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "targets",
        component: TargetSettingsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "targets/add",
        component: AddTargetComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "branches",
        component: BranchesComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "branches/add/:id",
        component: AddBranchComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "teams",
        component: TeamsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "teams/add/:id",
        component: AddTeamComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "accounts",
        component: AccountsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "accounts/add/:id",
        component: AddAccountComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "setup-payment-plan",
        component: SetupPaymentPlansComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "roles",
        component: RolesComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "roles/edit/:id",
        component: AddRoleComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "roles/clone/:id",
        component: AddRoleComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "roles/add",
        component: AddRoleComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "contracts",
        component: ContractsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "add-contract",
        component: AddContractComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "add-ticket-settings",
        component: AddTicketSettingsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "add-department",
        component: AddDepartmentTicketsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "edit-department/:id",
        component: AddDepartmentTicketsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "departments",
        component: DepartmentsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "occasions",
        component: OccasionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "add-occasion",
        component: AddOccasionComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "custom-occasions",
        component: CustomOccasionsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "system-version",
        component: SystemVersionComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "developers",
        component: DevelopersComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "developers/add",
        component: AddDeveloperComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "developers/edit/:id",
        component: AddDeveloperComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "call-center-scripts",
        component: CallCenterScriptsComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "store_banks",
        component: StoreBanksComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "store_banks/add",
        component: AddStoreBankComponent,
        canActivate: [BrokerRestrictionGuard],
      },
      {
        path: "store_banks/edit/:id",
        component: AddStoreBankComponent,
        canActivate: [BrokerRestrictionGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainSettingsRoutingModule {}
