import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DropdownModule } from 'ngx-dropdown';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    RouterModule,
    DropdownModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [],
  bootstrap: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavModule { }
