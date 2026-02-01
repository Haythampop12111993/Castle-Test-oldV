import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AddLeadComponent } from './addlead.component';
//import { LeadsService } from '../../services/lead-service/lead-service.service';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { Http, Response } from '@angular/http';
import { FormsModule} from '@angular/forms';
import { FormBuilder, NgForm, NgModel, Validators, ValidatorFn } from '@angular/forms'

import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownModule as primeDropdown } from 'primeng/dropdown';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';


@NgModule({
  declarations: [
    AddLeadComponent
  ],
  imports: [
    BrowserModule,FormsModule,SlimLoadingBarModule.forRoot(),SweetAlert2Module, NgSelectModule, primeDropdown, NguiAutoCompleteModule

  ],
  providers: [Http,FormBuilder],
  bootstrap: [AddLeadComponent],
  exports: [AddLeadComponent,SlimLoadingBarModule],
})
export class AddLeadModule { }