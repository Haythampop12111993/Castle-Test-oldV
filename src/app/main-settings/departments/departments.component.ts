import { ErrorHandlerService } from './../../services/shared/error-handler.service';
import { Department } from './../../models/department';
import { HelpdeskService } from './../../services/helpdesk/helpdesk.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  departments: Department[];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private helpdeskService: HelpdeskService,
    private errorService: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.slimLoadingBarService.start();
    this.helpdeskService.getDepartments()
      .subscribe((res: any) =>{
        this.slimLoadingBarService.complete();
        this.departments = res;
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorService.handleErorr(err);
      });
  }

  editDepartment(id)
  {
    this.router.navigate(['./pages/settings/edit-department', id]);
  }
}
