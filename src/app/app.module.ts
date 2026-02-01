import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AccountantDashboardComponent } from "./dashboard/accountant-dashboard/accountant-dashboard.component";
import { HelpdeskDashboardComponent } from "./dashboard/helpdesk-dashboard/helpdesk-dashboard.component";
import { MarketingDashboardComponent } from "./dashboard/marketing-dashboard/marketing-dashboard.component";
import { LegalCasesService } from "./legal-affairs/services/legal-cases.service";
import { LegalDocumentsService } from "./legal-affairs/services/legal-documents.service";
import { ReminderFormComponent } from "./reminder/reminder-form/reminder-form.component";
import { HelpdeskService } from "./services/helpdesk/helpdesk.service";
import { ColumnsFilterModule } from "./shared/columns-filter/columns-filter.module";
import { ImageZoomComponent } from "./shared/image-zoom/image-zoom.component";
import { ImageZoomService } from "./shared/image-zoom/image-zoom.service";
// import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatTooltipModule,
} from "@angular/material";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { ModalGalleryModule } from "angular-modal-gallery";
import { MomentModule } from "angular2-moment/moment.module";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { ChartsModule } from "ng2-charts";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NouisliderModule } from "ng2-nouislider";
import { Ng2PageScrollModule } from "ng2-page-scroll";
import { ScrollToModule } from "ng2-scroll-to-el";
import { SlimLoadingBarModule } from "ng2-slim-loading-bar";
import { AutoCompleteModule } from "ng5-auto-complete";
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { CookieService } from "ngx-cookie-service";
import { CountdownTimerModule } from "ngx-countdown-timer";
import { DropdownModule } from "ngx-dropdown";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ModalModule } from "ngx-modal";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxToggleModule } from "ngx-toggle";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressBarModule } from "primeng/progressbar";
import { ToggleButtonModule } from "primeng/togglebutton";

import "hammerjs";
import "mousetrap";

import { TargetsGuard } from "./guards/targets.guard";
import { WalletGuard } from "./guards/wallet.guard";
import { MarketingService } from "./services/marketing/marketing.service";
import { NotificationsService } from "./services/notifications/notifications.service";
// import { ChatService } from "./services/chat/chat.service";
import { DropdownModule as primeDropdown } from "primeng/dropdown";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BlockRequestsListComponent } from "./block-requests-list/block-requests-list.component";
import { AddLeadGuard } from "./guards/addLead.guard";
import { AddProjectGuard } from "./guards/addProject.guard";
import { AuthInterceptor } from "./guards/auth-interceptor";
import { AuthGuard } from "./guards/authguard.guard";
import { BlockRequestListGuard } from "./guards/blockRequestList.guard";
import { EoisGuard } from "./guards/eois.guard";
import { LeadsGuard } from "./guards/leads.guard";
import { LoginGuard } from "./guards/login.guard";
import { PaymentGeneratorGuard } from "./guards/paymentGenerator.guard";
import { ReservationsGuard } from "./guards/reservations.guard";
import { SettingTabGuard } from "./guards/settingsTab.guard";
import { BreadcrumbModule } from "./layout/breadcrumb/breadcrumb.module";
import { HeaderModule } from "./layout/header/header.module";
import { NavModule } from "./layout/navbar/navbar.module";
import { LeadsModule } from "./lead/dashboard/lead.module";
import { LoginComponent } from "./login/login.component";
import { MainComponent } from "./main/main.component";
import { KeysPipe } from "./pipes/keys.pipe";
import { ProjectsComponent } from "./projects/projects.component";
import { AddreservationComponent } from "./reservation/addreservation/addreservation.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { BranchService } from "./services/branch/branch.service";
import { EoiService } from "./services/eoi/eoi.service";
import { UserProfileService } from "./services/event-bus/user-profile.service";
import { FinanceService } from "./services/finance/finance.service";
import { LeadsService } from "./services/lead-service/lead-service.service";
import { PaymentService } from "./services/payment/payment.service";
import { ProjectsService } from "./services/projects/projects.service";
import { ReservationService } from "./services/reservation-service/reservation.service";
import { TeamService } from "./services/settings-service/team/team.service";
import { ErrorHandlerService } from "./services/shared/error-handler.service";
import { UserServiceService } from "./services/user-service/user-service.service";
// import {AddLeadModule} from './lead/addlead/addlead.module'
import { MockApi } from "././dtos/mockapi";
import { AdminDashboardComponent } from "./dashboard/admin-dashboard/admin-dashboard.component";
import { ImportUnitsComponent } from "./import-units/import-units.component";
import { AddLeadModule } from "./lead/addLead/addlead.module";

import { AddProjectComponent } from "./add-project/add-project.component";
import { CilService } from "./cil.service";
import { CliComponent } from "./cli/cli.component";
import { ContractGenerateComponent } from "./contract-generate/contract-generate.component";
import { FinanceAccountsComponent } from "./finance-accounts/finance-accounts.component";
import { FinanceAddAccountComponent } from "./finance-add-account/finance-add-account.component";
import { FinanceAddTransactionComponent } from "./finance-add-transaction/finance-add-transaction.component";
import { FinanceBalanceSheetComponent } from "./finance-balance-sheet/finance-balance-sheet.component";
import { FinanceTransactionComponent } from "./finance-transaction/finance-transaction.component";
import { CanEnterProjectsTab } from "./guards/projects.guard";
import { LayoutComponent } from "./layout/layout.component";
import { MarketingComponent } from "./marketing/marketing.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { PaymentGeneratorComponent } from "./payment-generator/payment-generator.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReportsComponent } from "./reports/reports.component";
import { ReservationViewComponent } from "./reservation-view/reservation-view.component";
import { HashwordsProvider } from "./services/libs.providers";
import { UnitViewComponent } from "./unit-view/unit-view.component";
import { UnitsComponent } from "./units/units.component";
import { UploadLayoutComponent } from "./upload-layout/upload-layout.component";

import { AllUnitViewComponent } from "./all-unit-view/all-unit-view.component";
import { AvailabilityRequestComponent } from "./availability-request/availability-request.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UserDashboardComponent } from "./dashboard/user-dashboard/user-dashboard.component";
import { MasterPlanComponent } from "./master-plan/master-plan.component";
import { PriceControlComponent } from "./price-control/price-control.component";
import { PriceControllerRequestsComponent } from "./price-controller-requests/price-controller-requests.component";
import { WalletComponent } from "./reports/wallet/wallet.component";
import { AccountsService } from "./services/settings-service/accounts/accounts.service";

import { NgxImageZoomModule } from "ngx-image-zoom";

// import { GalleryModule } from 'ng-gallery';

// import { NgxImageGalleryModule } from 'ngx-image-gallery';

import { LightboxModule } from "ngx-lightbox";
import { AnnouncementComponent } from "./announcement/announcement.component";

// import { UiSwitchModule } from 'ngx-toggle-switch';

import { NgxDropzoneModule } from "ngx-dropzone";
// import {IvyCarouselModule} from 'angular-responsive-carousel';

import { HttpModule } from "@angular/http";
import { DndListModule } from "ngx-drag-and-drop-lists";
import { CampaignsComponent } from "./campaigns/campaigns.component";
import { LogsComponent } from "./logs/logs.component";
import { MarketingReportsComponent } from "./marketing-reports/marketing-reports.component";
import { ReminderComponent } from "./reminder/reminder.component";
import { RotationLogsComponent } from "./rotation-logs/rotation-logs.component";
import { RotationComponent } from "./rotation/rotation.component";
import { ReminderService } from "./services/reminder/reminder.service";
import { UpcomingSceneComponent } from "./upcoming-scene/upcoming-scene.component";

import { PinchZoomModule } from "ngx-pinch-zoom";
import { DuplicatedLeadsComponent } from "./duplicated-leads/duplicated-leads.component";
import { PaymentCollectionsComponent } from "./payment-collections/payment-collections.component";

import { NgxPrintModule } from "ngx-print";
import { DailyReportComponent } from "./daily-report/daily-report.component";
import { TrashLeadsComponent } from "./trash-leads/trash-leads.component";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { registerLocaleData } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { SidebarModule } from "primeng/sidebar";
import { environment } from "../environments/environment";
import { AddRotationComponent } from "./add-rotation/add-rotation.component";
import { AddTicketComponent } from "./add-ticket/add-ticket.component";
import { BankChequeListingComponent } from "./bank-cheque-listing/bank-cheque-listing.component";
import { AddEoiComponent } from "./eois/add-eoi/add-eoi.component";
import { EoiTableComponent } from "./eois/eoi-table/eoi-table.component";
import { EoiViewComponent } from "./eois/eoi-view/eoi-view.component";
import { EoiComponent } from "./eois/eoi/eoi.component";
import { AddHoldComponent } from "./hold-module/add-hold/add-hold.component";
import { HoldDetailsComponent } from "./hold-module/hold-details/hold-details.component";
import { HoldListComponent } from "./hold-module/hold-list/hold-list.component";
import { HoldService } from "./hold-module/hold.service";
import { ListingLeadsByRemindersComponent } from "./listing-leads-by-reminders/listing-leads-by-reminders.component";
import { MailBuilderComponent } from "./mail-builder/mail-builder.component";
import { RolesService } from "./main-settings/roles/roles.service";
import { PrintChequeComponent } from "./print-cheque/print-cheque.component";
import { RotationsListComponent } from "./rotations-list/rotations-list.component";
import { GlobalNotificationsService } from "./services/global-notifications/global-notifications.service";
import { PermissionsService } from "./services/permissions/permissions.service";
import { HelperService } from "./services/shared/helper.service";
import { AddFeedbackModalComponent } from "./ticket-view/modals/add-feedback-modal/add-feedback-modal.component";
import { AssignTicketModalComponent } from "./ticket-view/modals/assign-ticket-modal/assign-ticket-modal.component";
import { ChangeStatusModalComponent } from "./ticket-view/modals/change-status-modal/change-status-modal.component";
import { RequestApprovalModalComponent } from "./ticket-view/modals/request-approval-modal/request-approval-modal.component";
import { ResolveApprovalRequestModalComponent } from "./ticket-view/modals/resolve-approval-request-modal/resolve-approval-request-modal.component";
import { SearchTicketComponent } from "./ticket-view/modals/search-ticket/search-ticket.component";
import { TicketViewComponent } from "./ticket-view/ticket-view.component";
import { TicketsComponent } from "./tickets/tickets.component";

import locale_ar_EG from "@angular/common/locales/ar-EG";
import { AgentsContactsComponent } from "./cold-calls/agents-contacts/agents-contacts.component";
import { AgentsComponent } from "./cold-calls/agents/agents.component";
import { AllDataComponent } from "./cold-calls/all-data/all-data.component";
import { ColdCallsViewComponent } from "./cold-calls/cold-calls-view/cold-calls-view.component";
import { ColdCallsComponent } from "./cold-calls/cold-calls.component";
import { ColdCallsService } from "./cold-calls/cold-calls.service";
import { ViewColdCallsStatusComponent } from "./cold-calls/view-cold-calls-status/view-cold-calls-status.component";
import { ConsturctionUpdatesComponent } from "./consturction-updates/consturction-updates.component";
import { CustomPaymentGeneratorComponent } from "./custom-payment-generator/custom-payment-generator.component";
import { LegalMissionsService } from "./legal-affairs/services/legal-missions.service";
import { ListCustomPaymentsComponent } from "./list-custom-payments/list-custom-payments.component";
import { ColdCallsStatusesService } from "./services/cold-calls/cold-calls-statuses.service";
import { FeedQuestionsService } from "./services/lead-service/feed-questions-service.service";
import { QualifiedFeedbackQuestionsService } from "./services/lead-service/qualified-feedback-questions-service.service";
import { TimerComponent } from "./shared/components/timer.component";
import { DraggableContentComponent } from "./shared/draggable-content/draggable-content.component";
import { LeadCampaignsService } from "./services/lead-service/lead-campaigns.service";
import { LeadTicketTypesService } from "./services/lead-service/lead-ticket-types.service";
import { LegalContractArchivesService } from "./legal-affairs/services/legal-contract-archives.service";
import { BrokersListComponent } from "./brokers-list/brokers-list.component";
import { BrokerViewComponent } from "./broker-view/broker-view.component";
import { AddBrokerActivityModalComponent } from "./broker-view/add-broker-activity-modal/add-broker-activity-modal.component";
import { PaymentCollectionViewComponent } from "./payment-collection-view/payment-collection-view.component";
import { FinesListComponent } from "./fines-list/fines-list.component";
import { ClientStatementsComponent } from "./client-statements/client-statements.component";
import { ViewClientStatementsComponent } from "./view-client-statements/view-client-statements.component";
import { FinancialReportComponent } from "./financial-report/financial-report.component";
import { FinancialReportsService } from "./services/financial-reports/financial-reports.service";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { BlocklistComponent } from "./blocklist/blocklist.component";
import { ManageBlocklistComponent } from "./manage-blocklist/manage-blocklist.component";
import { SalesManagerDashboardComponent } from "./dashboard/sales-manager-dashboard/sales-manager-dashboard.component";
import { BrokersIncentivesComponent } from "./brokers-incentives/brokers-incentives.component";
import { BrokersIncentivesManageComponent } from "./brokers-incentives-manage/brokers-incentives-manage.component";
import { BrokerIncentiveGuard } from "./guards/broker-incentive.guard";
import { BrokerRestrictionGuard } from "./guards/broker-restriction.guard";
import { BrokerGuard } from "./guards/broker.guard";
import { BrokerAccessGuard } from "./guards/broker-access.guard";
import { BuildingSlotsComponent } from './building-slots/building-slots.component';
import { UploadProjectOfferImagesComponent } from './upload-project-offer-images/upload-project-offer-images.component';
import { AllPagesComponent } from "./all-pages/all-pages.component";
import { MarketingReportComponent } from "./marketing-report/marketing-report.component";
registerLocaleData(locale_ar_EG);

declare const firebase: any;
try {
  firebase.initializeApp(environment.firebase);
} catch (e) {
  console.log(e);
}

@NgModule({
  declarations: [
    TimerComponent,
    AppComponent,
    LoginComponent,
    MainComponent,
    ProjectsComponent,
    AdminDashboardComponent,
    MarketingDashboardComponent,
    EoiComponent,
    EoiTableComponent,
    AddEoiComponent,
    EoiViewComponent,
    ImportUnitsComponent,
    AddreservationComponent,
    ReservationComponent,
    AddProjectComponent,
    UnitsComponent,
    BlockRequestsListComponent,
    PaymentGeneratorComponent,
    KeysPipe,
    ContractGenerateComponent,
    UnitViewComponent,
    LayoutComponent,
    UploadLayoutComponent,
    ReservationViewComponent,
    ProfileComponent,
    FinanceAccountsComponent,
    FinanceAddAccountComponent,
    FinanceBalanceSheetComponent,
    FinanceTransactionComponent,
    FinanceAddTransactionComponent,
    NotificationsComponent,
    MarketingComponent,
    ReportsComponent,
    CliComponent,
    AvailabilityRequestComponent,
    PriceControlComponent,
    PriceControllerRequestsComponent,
    MasterPlanComponent,
    AllUnitViewComponent,
    WalletComponent,
    DashboardComponent,
    UserDashboardComponent,
    SalesManagerDashboardComponent,
    AccountantDashboardComponent,
    HelpdeskDashboardComponent,
    AnnouncementComponent,
    RotationComponent,
    CampaignsComponent,
    RotationLogsComponent,
    LogsComponent,
    MarketingReportsComponent,
    ReminderComponent,
    ReminderFormComponent,
    UpcomingSceneComponent,
    PaymentCollectionsComponent,
    DuplicatedLeadsComponent,
    TrashLeadsComponent,
    DailyReportComponent,
    MarketingReportComponent,
    AddRotationComponent,
    RotationsListComponent,
    PrintChequeComponent,
    ListingLeadsByRemindersComponent,
    BankChequeListingComponent,
    MailBuilderComponent,
    AddTicketComponent,
    TicketsComponent,
    TicketViewComponent,
    AssignTicketModalComponent,
    AddFeedbackModalComponent,
    RequestApprovalModalComponent,
    ChangeStatusModalComponent,
    ResolveApprovalRequestModalComponent,
    SearchTicketComponent,
    HoldListComponent,
    AddHoldComponent,
    HoldDetailsComponent,
    ImageZoomComponent,
    CustomPaymentGeneratorComponent,
    ListCustomPaymentsComponent,
    DraggableContentComponent,
    ConsturctionUpdatesComponent,
    ColdCallsComponent,
    AllDataComponent,
    ColdCallsViewComponent,
    AgentsComponent,
    AgentsContactsComponent,
    ViewColdCallsStatusComponent,
    BrokersListComponent,
    BrokerViewComponent,
    AddBrokerActivityModalComponent,
    PaymentCollectionViewComponent,
    FinesListComponent,
    ClientStatementsComponent,
    ViewClientStatementsComponent,
    FinancialReportComponent,
    BlocklistComponent,
    ManageBlocklistComponent,
    BrokersIncentivesComponent,
    BrokersIncentivesManageComponent,
    BuildingSlotsComponent,
    UploadProjectOfferImagesComponent,
    AllPagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxImageZoomModule,
    NgxToggleModule,
    DropdownModule,
    NavModule,
    HeaderModule,
    LeadsModule,
    BreadcrumbModule,
    AppRoutingModule,
    AddLeadModule,
    ModalModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    ChartsModule,
    SlimLoadingBarModule.forRoot(),
    SweetAlert2Module.forRoot(),
    ModalGalleryModule.forRoot(),
    MomentModule,
    NguiAutoCompleteModule,
    Ng2AutoCompleteModule,
    CountdownTimerModule.forRoot(),
    CalendarModule,
    NgbModule.forRoot(),
    primeDropdown,
    AutoCompleteModule,
    MultiSelectModule,
    AutoCompleteModule,
    ProgressBarModule,
    AngularMultiSelectModule,
    ToggleButtonModule,
    ScrollToModule.forRoot(),
    Ng2PageScrollModule,
    NgxAutoScrollModule,
    InfiniteScrollModule,
    NouisliderModule,
    CurrencyMaskModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,
    NgxImageZoomModule.forRoot(),
    LightboxModule,
    DndListModule,
    HttpModule,
    NgxDropzoneModule,
    PinchZoomModule,
    NgxPrintModule,
    NgMultiSelectDropDownModule,
    NgSelectModule,
    NgxUiLoaderModule,
    MatExpansionModule,
    SidebarModule,
    ColumnsFilterModule,
    EditorModule,
    HeaderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    MockApi,
    UserServiceService,
    CookieService,
    AuthGuard,
    LeadsService,
    RolesService,
    PermissionsService,
    ProjectsService,
    EoiService,
    ReservationService,
    ErrorHandlerService,
    HashwordsProvider,
    PaymentService,
    { provide: "Hashwords", useValue: window["hashwords"]() },
    CanEnterProjectsTab,
    AddProjectGuard,
    BlockRequestListGuard,
    LeadsGuard,
    EoisGuard,
    ReservationsGuard,
    PaymentGeneratorGuard,
    LoginGuard,
    AddLeadGuard,
    BrokerIncentiveGuard,
    BrokerRestrictionGuard,
    BrokerGuard,
    BrokerAccessGuard,
    SettingTabGuard,
    TargetsGuard,
    UserProfileService,
    BranchService,
    TeamService,
    AccountsService,
    FinanceService,
    GlobalNotificationsService,
    NotificationsService,
    MarketingService,
    CilService,
    ReminderService,
    HelpdeskService,
    { provide: "Hashwords", useValue: window["hashwords"]() },
    WalletGuard,
    HelperService,
    HoldService,
    ImageZoomService,
    LegalDocumentsService,
    LegalContractArchivesService,
    LegalCasesService,
    LegalMissionsService,
    FeedQuestionsService,
    QualifiedFeedbackQuestionsService,
    ColdCallsService,
    ColdCallsStatusesService,
    LeadCampaignsService,
    LeadTicketTypesService,
    FinancialReportsService,

    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.js" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
