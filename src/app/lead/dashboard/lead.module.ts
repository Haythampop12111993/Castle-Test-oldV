import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { ModalGalleryModule } from "angular-modal-gallery";
import { MomentModule } from "angular2-moment/moment.module";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { SlimLoadingBarModule } from "ng2-slim-loading-bar";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ModalModule } from "ngx-modal";
import { NgInfiniteScrollModule } from "ngx-sentinel-infinite-scroll/ng-infinite-scroll.module";
import { NgUploaderModule } from "ngx-uploader";
import { ButtonModule } from "primeng/button";
import { DropdownModule as PrimeDropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { LeadsComponent } from "../dashboard/lead.component";
import { DateAgoPipe } from "./../../services/shared/date-ago.pipe";
import { FeedbackModalComponent } from "./modals/feedback-modal/feedback-modal.component";
import { QualificationModalComponent } from "./modals/qualification-modal/qualification-modal.component";
import { ViewQualificationModalComponent } from "./modals/view-qualification-modal/view-qualification-modal.component";
@NgModule({
  declarations: [
    LeadsComponent,
    DateAgoPipe,
    FeedbackModalComponent,
    QualificationModalComponent,
    ViewQualificationModalComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgInfiniteScrollModule,
    PrimeDropdownModule,
    ButtonModule,
    InfiniteScrollModule,
    NgUploaderModule,
    SlimLoadingBarModule.forRoot(),
    SweetAlert2Module,
    RouterModule,
    MomentModule,
    ModalModule,
    ModalGalleryModule,
    Ng2AutoCompleteModule,
    NguiAutoCompleteModule,
    MatCheckboxModule,
    MultiSelectModule,
  ],
  providers: [HttpClientModule, FormBuilder],
  bootstrap: [LeadsComponent],
  exports: [LeadsComponent, SlimLoadingBarModule],
})
export class LeadsModule {}
