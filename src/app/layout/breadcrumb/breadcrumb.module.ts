import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { BreadcrumbComponent } from './breadcrumb.component';


@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
})
export class BreadcrumbModule { }