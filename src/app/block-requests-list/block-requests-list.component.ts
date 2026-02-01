import { LeadsService } from './../services/lead-service/lead-service.service';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ProjectsService } from './../services/projects/projects.service';
import { CookieService } from 'ngx-cookie-service';
import { element } from 'protractor';
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import swal from 'sweetalert2';


@Component({
  selector: 'block-requests-list',
  templateUrl: './block-requests-list.component.html',
  styleUrls: ['./block-requests-list.component.css']
})
export class BlockRequestsListComponent {

  userInfo: any;
  blockList: any;
  lg: any = 'lg';
  last_page_url: any;
  pageTest: any = 1;

  coming_soon: boolean = false;

  constructor(private router: Router, public cookieService: CookieService, public projectsService: ProjectsService, public slimLoadingBarService: SlimLoadingBarService, public errorHandlingService: ErrorHandlerService, private leadsService: LeadsService) {
    this.userInfo = JSON.parse(window.localStorage.getItem('userProfile'));
    console.log(this.userInfo);
  }

  ngOnInit(){
    this.getBlockList();
  }

  approveUnit(requestId){
    this.slimLoadingBarService.start();
    this.projectsService.acceptBlockUnit(requestId).subscribe(data => {
      console.log(data);
      this.getBlockList();
      swal('Woohoo!', 'Accepted block Unit succesfully!', 'success');
    }, err => {
      this.errorHandlingService.handleErorr(err);
    }, () => {
      this.slimLoadingBarService.complete();
    });
  }

  declinelUnit(requestId){
    console.log('decline block');
    this.slimLoadingBarService.start();
    this.projectsService.declineBlockUnit(requestId).subscribe(data => {
      console.log(data);
      this.getBlockList();
      swal('Woohoo!', 'Declined block Unit succesfully!', 'success');
    }, err => {
      this.errorHandlingService.handleErorr(err);
    }, () => {
      this.slimLoadingBarService.complete();
    });
  }

  getBlockList(is_export =false){
    this.slimLoadingBarService.start();
    this.projectsService.getBlockList({ is_export }).subscribe((data: any) => {
      if (is_export) {
        window.open(data.url)
      } else {
        console.log(data);
        this.blockList = data;
        if(data && data.last_page_url)
          this.last_page_url = data.last_page_url;
      }
    }, err => {
      this.errorHandlingService.handleErorr(err);
    }, () => {
      this.slimLoadingBarService.complete();
    });
  }

  pageChange(event) {
    console.log(event);
    // this.paginate(event);
    console.log(this.last_page_url);
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe((res: any) => {
      this.blockList = res;
      this.last_page_url = res.last_page_url;
    }, err => this.errorHandlingService.handleErorr(err));
  }
}


