import { ErrorHandlerService } from './../../services/shared/error-handler.service';
import { Department } from './../../models/department';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HelpdeskService } from './../../services/helpdesk/helpdesk.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { ProjectsService } from '../../services/projects/projects.service';

@Component({
  selector: 'app-add-department-tickets',
  templateUrl: './add-department-tickets.component.html',
  styleUrls: ['./add-department-tickets.component.css']
})
export class AddDepartmentTicketsComponent implements OnInit {

  addDepartmentForm: FormGroup;
  users: any;
  selectFromUsers: any = [];
  isEdit:boolean = false;
  editableDepartment:Department;
  dropdownSettings: any = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  projects: any;
  projectsDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  }
  headUsers: any;

  constructor(
    private fromBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private helpdeskService: HelpdeskService,
    private projectService: ProjectsService,
    private route:ActivatedRoute,
    private router:Router,
    private errorHandler:ErrorHandlerService

  ) {
  }

  ngOnInit() {
    this.createAddDepartmentForm();
    this.route.params.subscribe((params)=>{
      const id = params['id'];
      if(id)
      {
        this.isEdit = true;
        this.helpdeskService.getDepartment(id).subscribe(
          dep=>{
            this.editableDepartment=dep,
            this.getUsers(id);
            this.getHeadUsers(id);

            this.getAllProjects();
            this.patchDepartmentFormForEdit();
          },
          err=>this.errorHandler.handleErorr(err)
          );
      }else
      {
        this.getHeadUsers();
        this.getUsers();
        this.getAllProjects();
      }
    });
  }

  createAddDepartmentForm() {
    this.addDepartmentForm = this.fromBuilder.group({
      name: ['', Validators.required],
      head_user_id: [null, Validators.required],
      users: [[]],
    });
  }

  patchDepartmentFormForEdit()
  {
    this.addDepartmentForm.patchValue({
      name: this.editableDepartment.name,
      head_user_id: this.editableDepartment.head_user_id,
      users: this.editableDepartment.users || [],
    });
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();
        this.errorHandler.handleErorr(err);
      }
    );
  }

  getUsers(id? :any) {
    this.slimLoadingBarService.start();

    this.helpdeskService.getUserDepartments(id)
      .subscribe((res: any) => {
        this.users = res;
        res.forEach((user) => {
          this.selectFromUsers.push({
            id: user.id,
            name: user.name
          });
        });
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorHandler.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  getHeadUsers(id? :any){
    this.slimLoadingBarService.start();

    this.helpdeskService.getUserDepartments(id,true)
      .subscribe((res: any) => {
        this.headUsers = res;
        res.forEach((user) => {
          this.selectFromUsers.push({
            id: user.id,
            name: user.name
          });
        });
        this.slimLoadingBarService.complete();
      }, err => {
        this.errorHandler.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  addDepartment() {
    let formVal = this.addDepartmentForm.value;
    let users = formVal.users.map((user) => user.id);
    console.log(users);
    let payload = {
      name: formVal.name,
      head_user_id: formVal.head_user_id,
      users: users
    };
    if(!payload.name){
      swal('Please enter department name', '', 'error');
      return;
    }
    if(!payload.head_user_id){
      swal('Please select head of department', '', 'error');
      return;
    }
    if(!payload.users){
      swal('Please select users', '', 'error');
      return;
    }
    this.slimLoadingBarService.start();
    this.helpdeskService.addDepartment(payload)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.addDepartmentForm.reset();
        this.router.navigateByUrl('pages/settings/departments');
        swal('Success', 'added department successfully', 'success');
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandler.handleErorr(err);
      });
  }

  editDepartment() {
    let formVal = this.addDepartmentForm.value;
    let users = formVal.users.map((user) => user.id);
    console.log(users);
    let payload = {
      name: formVal.name,
      head_user_id: formVal.head_user_id,
      users: users
    };
    if(!payload.name){
      swal('Please enter department name', '', 'error');
      return;
    }
    if(!payload.head_user_id){
      swal('Please select head of department', '', 'error');
      return;
    }
    if(!payload.users){
      swal('Please select users', '', 'error');
      return;
    }
    this.slimLoadingBarService.start();
    this.helpdeskService.editDepartment(this.editableDepartment.id,payload)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.addDepartmentForm.reset();
        swal('Success', `Updated department ${this.editableDepartment.name} successfully`, 'success');
        this.router.navigateByUrl('pages/settings/departments');
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandler.handleErorr(err);
      });
  }

  submitForm()
  {
    if(this.isEdit){
      this.editDepartment();
    }
    else{
      this.addDepartment();
    }
  }

  cancel()
  {
    this.router.navigateByUrl('/pages/settings/departments');
  }
}
