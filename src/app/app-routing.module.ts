import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddProjectComponent } from "./add-project/add-project.component";
import { AddRotationComponent } from "./add-rotation/add-rotation.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { AvailabilityRequestComponent } from "./availability-request/availability-request.component";
import { BlockRequestsListComponent } from "./block-requests-list/block-requests-list.component";
import { CampaignsComponent } from "./campaigns/campaigns.component";
import { CliComponent } from "./cli/cli.component";
import { ContractGenerateComponent } from "./contract-generate/contract-generate.component";
import { DailyReportComponent } from "./daily-report/daily-report.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DuplicatedLeadsComponent } from "./duplicated-leads/duplicated-leads.component";
import { EoiTableComponent } from "./eois/eoi-table/eoi-table.component";
import { EoiComponent } from "./eois/eoi/eoi.component";
import { FinanceAccountsComponent } from "./finance-accounts/finance-accounts.component";
import { FinanceAddAccountComponent } from "./finance-add-account/finance-add-account.component";
import { FinanceAddTransactionComponent } from "./finance-add-transaction/finance-add-transaction.component";
import { FinanceBalanceSheetComponent } from "./finance-balance-sheet/finance-balance-sheet.component";
import { FinanceTransactionComponent } from "./finance-transaction/finance-transaction.component";
import { AddLeadGuard } from "./guards/addLead.guard";
import { AddProjectGuard } from "./guards/addProject.guard";
import { AuthGuard } from "./guards/authguard.guard";
import { EoisGuard } from "./guards/eois.guard";
import { LeadsGuard } from "./guards/leads.guard";
import { LoginGuard } from "./guards/login.guard";
import { PaymentGeneratorGuard } from "./guards/paymentGenerator.guard";
import { CanEnterProjectsTab } from "./guards/projects.guard";
import { ReservationsGuard } from "./guards/reservations.guard";
import { SettingTabGuard } from "./guards/settingsTab.guard";
import { WalletGuard } from "./guards/wallet.guard";
import { ImportUnitsComponent } from "./import-units/import-units.component";
import { AddLeadComponent } from "./lead/addLead/addlead.component";
import { LeadsComponent } from "./lead/dashboard/lead.component";
import { LoginComponent } from "./login/login.component";
import { LogsComponent } from "./logs/logs.component";
import { MainComponent } from "./main/main.component";
import { MarketingReportsComponent } from "./marketing-reports/marketing-reports.component";
import { MarketingComponent } from "./marketing/marketing.component";
import { MasterPlanComponent } from "./master-plan/master-plan.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { PaymentCollectionsComponent } from "./payment-collections/payment-collections.component";
import { PaymentGeneratorComponent } from "./payment-generator/payment-generator.component";
import { PriceControlComponent } from "./price-control/price-control.component";
import { PriceControllerRequestsComponent } from "./price-controller-requests/price-controller-requests.component";
import { ProfileComponent } from "./profile/profile.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ReminderComponent } from "./reminder/reminder.component";
import { ReportsComponent } from "./reports/reports.component";
import { WalletComponent } from "./reports/wallet/wallet.component";
import { ReservationViewComponent } from "./reservation-view/reservation-view.component";
import { AddreservationComponent } from "./reservation/addreservation/addreservation.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { RotationLogsComponent } from "./rotation-logs/rotation-logs.component";
import { RotationComponent } from "./rotation/rotation.component";
import { TrashLeadsComponent } from "./trash-leads/trash-leads.component";
import { UnitViewComponent } from "./unit-view/unit-view.component";
import { UnitsComponent } from "./units/units.component";
import { UploadLayoutComponent } from "./upload-layout/upload-layout.component";

import { AddTicketComponent } from "./add-ticket/add-ticket.component";
import { BankChequeListingComponent } from "./bank-cheque-listing/bank-cheque-listing.component";
import { AgentsContactsComponent } from "./cold-calls/agents-contacts/agents-contacts.component";
import { AgentsComponent } from "./cold-calls/agents/agents.component";
import { AllDataComponent } from "./cold-calls/all-data/all-data.component";
import { ColdCallsViewComponent } from "./cold-calls/cold-calls-view/cold-calls-view.component";
import { ColdCallsComponent } from "./cold-calls/cold-calls.component";
import { ViewColdCallsStatusComponent } from "./cold-calls/view-cold-calls-status/view-cold-calls-status.component";
import { ConsturctionUpdatesComponent } from "./consturction-updates/consturction-updates.component";
import { CustomPaymentGeneratorComponent } from "./custom-payment-generator/custom-payment-generator.component";
import { AddEoiComponent } from "./eois/add-eoi/add-eoi.component";
import { EoiViewComponent } from "./eois/eoi-view/eoi-view.component";
import { AddHoldComponent } from "./hold-module/add-hold/add-hold.component";
import { HoldDetailsComponent } from "./hold-module/hold-details/hold-details.component";
import { HoldListComponent } from "./hold-module/hold-list/hold-list.component";
import { ListCustomPaymentsComponent } from "./list-custom-payments/list-custom-payments.component";
import { ListingLeadsByRemindersComponent } from "./listing-leads-by-reminders/listing-leads-by-reminders.component";
import { MailBuilderComponent } from "./mail-builder/mail-builder.component";
import { PrintChequeComponent } from "./print-cheque/print-cheque.component";
import { RotationsListComponent } from "./rotations-list/rotations-list.component";
import { TicketViewComponent } from "./ticket-view/ticket-view.component";
import { TicketsComponent } from "./tickets/tickets.component";
import { BrokersListComponent } from "./brokers-list/brokers-list.component";
import { BrokerViewComponent } from "./broker-view/broker-view.component";
import { PaymentCollectionViewComponent } from "./payment-collection-view/payment-collection-view.component";
import { FinesListComponent } from "./fines-list/fines-list.component";
import { ClientStatementsComponent } from "./client-statements/client-statements.component";
import { ViewClientStatementsComponent } from "./view-client-statements/view-client-statements.component";
import { FinancialReportComponent } from "./financial-report/financial-report.component";
import { BlocklistComponent } from "./blocklist/blocklist.component";
import { ManageBlocklistComponent } from "./manage-blocklist/manage-blocklist.component";
import { BrokersIncentivesComponent } from "./brokers-incentives/brokers-incentives.component";
import { BrokersIncentivesManageComponent } from "./brokers-incentives-manage/brokers-incentives-manage.component";
import { BrokerIncentiveGuard } from "./guards/broker-incentive.guard";
import { BrokerGuard } from "./guards/broker.guard";
import { BrokerAccessGuard } from "./guards/broker-access.guard";
import { BrokerRestrictionGuard } from "./guards/broker-restriction.guard";
import { BuildingSlotsComponent } from "./building-slots/building-slots.component";
import { UploadProjectOfferImagesComponent } from "./upload-project-offer-images/upload-project-offer-images.component";
import { AllPagesComponent } from "./all-pages/all-pages.component";
import { MarketingReportComponent } from "./marketing-report/marketing-report.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "pages",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "pages",
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "leads",
        component: LeadsComponent,
        canActivate: [LeadsGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "leads/:id",
        component: LeadsComponent,
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "clients-statements",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ClientStatementsComponent,
      },
      {
        path: "clients-statements/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ViewClientStatementsComponent,
      },
      {
        path: "leads-listing-reminders",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ListingLeadsByRemindersComponent,
      },
      {
        path: "duplicated-leads",
        component: DuplicatedLeadsComponent,
        canActivate: [LeadsGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "trash-leads",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: TrashLeadsComponent,
      },
      {
        path: "eoi/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: EoiComponent,
      },
      {
        path: "eoi-table",
        component: EoiTableComponent,
        canActivate: [EoisGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "eoi-view/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: EoiViewComponent,
      },
      {
        path: "add-hold/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AddHoldComponent,
      },
      {
        path: "hold-list",
        component: HoldListComponent,
        canActivate: [EoisGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "hold-details/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: HoldDetailsComponent,
      },
      {
        path: "addLead/:id",
        component: AddLeadComponent,
        canActivate: [AddLeadGuard, BrokerRestrictionGuard],
      },
      {
        path: "projects",
        component: ProjectsComponent,
        canActivate: [CanEnterProjectsTab, BrokerIncentiveGuard],
      },
      {
        path: "building-slots/:id",
        component: BuildingSlotsComponent,
        canActivate: [CanEnterProjectsTab, BrokerIncentiveGuard],
      },
      {
        path: "projects/import-units",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ImportUnitsComponent,
      },
      {
        path: "projects/units/:id",
        component: UnitsComponent,
        canActivate: [CanEnterProjectsTab, BrokerIncentiveGuard],
      },
      {
        path: "projects/:id/construction-updates",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ConsturctionUpdatesComponent,
      },
      {
        path: "projects/view-all-units",
        component: UnitsComponent,
        canActivate: [CanEnterProjectsTab, BrokerIncentiveGuard],
      },
      // {
      //   path: 'projects/view-all-units',
      //   component: AllUnitViewComponent,
      //   canActivate: [CanEnterProjectsTab]
      // },
      {
        path: "projects/block-requests-list",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: BlockRequestsListComponent,
      },
      {
        path: "projects/upload-offer-images",
        component: UploadProjectOfferImagesComponent,
      },
      {
        path: "settings",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        loadChildren: "./main-settings/main-settings.module#MainSettingsModule",
        ///using this syntax due to error TS1323. check this for refrence
        //https://stackoverflow.com/questions/56375703/angular-8-lazy-loading-modules-error-ts1323-dynamic-import-is-only-supporte
      },
      {
        path: "reservations",
        component: ReservationComponent,
        canActivate: [ReservationsGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "reservations/add/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AddreservationComponent,
      },
      {
        path: "projects/add/:id",
        component: AddProjectComponent,
        canActivate: [
          CanEnterProjectsTab,
          AddProjectGuard,
          BrokerIncentiveGuard,
          BrokerRestrictionGuard,
        ],
      },
      {
        path: "payment-generator",
        component: PaymentGeneratorComponent,
        canActivate: [PaymentGeneratorGuard, BrokerIncentiveGuard],
      },
      {
        path: "custom-payment-generator",
        component: CustomPaymentGeneratorComponent,
        canActivate: [PaymentGeneratorGuard, BrokerIncentiveGuard],
      },
      {
        path: "list-custom-payments",
        canActivate: [BrokerIncentiveGuard],
        component: ListCustomPaymentsComponent,
      },
      {
        path: "payment-collections",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: PaymentCollectionsComponent,
      },
      {
        path: "payment-collections/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: PaymentCollectionViewComponent,
      },
      {
        path: "fines-list",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinesListComponent,
      },
      {
        path: "projects/conrtact-generate",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ContractGenerateComponent,
      },
      {
        path: "projects/view-unit",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: UnitViewComponent,
      },
      {
        path: "upload-layout",
        component: UploadLayoutComponent,
        canActivate: [SettingTabGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "project/view-reservation",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ReservationViewComponent,
      },
      {
        path: "project/view-reservation/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ReservationViewComponent,
      },
      {
        path: "profile",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ProfileComponent,
      },
      {
        path: "finance/accounts",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinanceAccountsComponent,
      },
      {
        path: "finance/accounts/add/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinanceAddAccountComponent,
      },
      {
        path: "finance/balance-sheet",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinanceBalanceSheetComponent,
      },
      {
        path: "finance/transaction",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinanceTransactionComponent,
      },
      {
        path: "finance/transaction/add",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinanceAddTransactionComponent,
      },
      {
        path: "notifications",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: NotificationsComponent,
      },
      {
        path: "marketing",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: MarketingComponent,
      },
      {
        path: "reports",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ReportsComponent,
      },
      {
        path: "cils",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: CliComponent,
      },
      {
        path: "availability-request",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AvailabilityRequestComponent,
      },
      {
        path: "price-control",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: PriceControlComponent,
      },
      {
        path: "price-control/requests",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: PriceControllerRequestsComponent,
      },
      {
        path: "master-plan",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: MasterPlanComponent,
      },
      {
        path: "wallet",
        component: WalletComponent,
        canActivate: [WalletGuard, BrokerIncentiveGuard, BrokerRestrictionGuard],
      },
      {
        path: "announcement",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AnnouncementComponent,
      },
      {
        path: "rotation",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: RotationComponent,
      },
      {
        path: "campaigns",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: CampaignsComponent,
      },
      {
        path: "all-pages",
        component: AllPagesComponent
      },
      {
        path: "rotation-logs",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: RotationLogsComponent,
      },
      {
        path: "logs",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: LogsComponent,
      },
      {
        path: "marketing-reports",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: MarketingReportsComponent,
      },
      {
        path: "reminder",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ReminderComponent,
      },
      {
        path: "daily-report",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: DailyReportComponent,
      },
      {
        path: "marketing-report",
        component: MarketingReportComponent,
      },
      {
        path: "financial-report",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: FinancialReportComponent,
      },
      {
        path: "rotation/add",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AddRotationComponent,
      },
      {
        path: "rotations",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: RotationsListComponent,
      },
      {
        path: "bank-cheque-listing",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: BankChequeListingComponent,
      },
      {
        path: "print-cheque",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: PrintChequeComponent,
      },
      {
        path: "mail-builder",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: MailBuilderComponent,
      },
      {
        path: "add-eoi",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AddEoiComponent,
      },
      {
        path: "add-ticket",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        // loadChildren: './main-settings/main-settings.module#MainSettingsModule'
        component: AddTicketComponent,
      },
      {
        path: "edit-ticket/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: AddTicketComponent,
      },
      {
        path: "tickets",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: TicketsComponent,
      },
      {
        path: "view-ticket/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        // loadChildren: './tickets/tickets.module#TicketsModule',
        component: TicketViewComponent,
      },
      {
        path: "legal-affairs",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        loadChildren: "./legal-affairs/legal-affairs.module#LegalAffairsModule",
      },
      {
        path: "brokers",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        children: [
          {
            path: "list",
            component: BrokersListComponent,
          },
          {
            path: "view/:id",
            component: BrokerViewComponent,
          },
          {
            path: "incentives",
            component: BrokersIncentivesComponent,
          },
          {
            path: "incentives/add",
            component: BrokersIncentivesManageComponent,
          },
          {
            path: "incentives/add/:id",
            component: BrokersIncentivesManageComponent,
          },
          {
            path: "",
            redirectTo: "list",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "cold-calls",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ColdCallsComponent,
        children: [
          {
            path: "all",
            component: AllDataComponent,
          },
          {
            path: "details/:id/:screen",
            component: ColdCallsViewComponent,
          },
          {
            path: "view-status/:id",
            component: ViewColdCallsStatusComponent,
          },
          {
            path: "agents",
            component: AgentsComponent,
          },
          {
            path: "my-contacts",
            component: AgentsContactsComponent,
          },
          {
            path: "",
            redirectTo: "all",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "blocklist",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: BlocklistComponent,
      },
      {
        path: "blocklist/manage/:id",
        canActivate: [BrokerIncentiveGuard, BrokerRestrictionGuard],
        component: ManageBlocklistComponent,
      },
    ],
  },
  {
    path: "**",
    redirectTo: "pages",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
