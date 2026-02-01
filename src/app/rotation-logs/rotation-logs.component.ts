import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ProjectsService } from '../services/projects/projects.service';
import { ErrorHandlerService } from '../services/shared/error-handler.service';
import { LeadsComponent } from '../lead/dashboard/lead.component';
import { LeadsService } from '../services/lead-service/lead-service.service';

@Component({
  selector: 'app-rotation-logs',
  templateUrl: './rotation-logs.component.html',
  styleUrls: ['./rotation-logs.component.css']
})
export class RotationLogsComponent implements OnInit {

  rotationLogs;
  page: any = 1;
  lg: string = 'lg';
  rotationLogsRawData: any;
  last_page_url: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService, 
    private projectsService: ProjectsService,
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService) { }

  ngOnInit() {
    this.getRotationLogs();
  }

  getRotationLogs() {
    this.slimLoadingBarService.start();
    this.projectsService.getRotationLogs()
      .subscribe((res: any) => {
        this.rotationLogsRawData = res;
        this.last_page_url = res.last_page_url;
        this.rotationLogs = res.data;
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
        console.log(err);
      });
  }

  pageChange(event) {
    console.log(event);
    console.log(this.last_page_url);
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe((res: any) => {
      this.rotationLogsRawData = res;
      this.last_page_url = res.last_page_url;
      this.rotationLogs = this.rotationLogs.concat(res.data);
    }, err => this.errorHandlerService.handleErorr(err));
  }

  onScroll() {
    this.infinite(this.last_page_url, 'ev');
  }

}
