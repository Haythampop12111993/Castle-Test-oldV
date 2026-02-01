import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { DropdownModule } from 'ngx-dropdown';
import { ModalModule } from "ngx-modal";
import { PaginationComponent } from '../pagination/pagination.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HeaderComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    SlimLoadingBarModule.forRoot(),
    DropdownModule,
    NgbPaginationModule,
    ModalModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [HeaderComponent],
  exports: [HeaderComponent, PaginationComponent, SlimLoadingBarModule],
})
export class HeaderModule { }
