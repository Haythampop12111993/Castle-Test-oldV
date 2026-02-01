import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';

import { ErrorHandlerService } from '../../../services/shared/error-handler.service';
import { ProjectsService } from '../../../services/projects/projects.service';

@Component({
  selector: 'app-add-target',
  templateUrl: './add-target.component.html',
  styleUrls: ['./add-target.component.css']
})
export class AddTargetComponent implements OnInit {
  
  targetForm: FormGroup;
  target_years: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('target available years');
    this.createTargetForm();
    this.getAvailableTargetYears();
  }

  getAvailableTargetYears() {
    this.slimLoadingBarService.start();
    this.projectsService.getAvailableTargetYears()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.target_years = res;
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  createTargetForm() {
    this.targetForm = this.fb.group({
      start: ['', Validators.required]
    });
  }

  createTarget() {
    const payload: any = this.targetForm.value;
    console.log(payload);
    this.slimLoadingBarService.start();
    this.projectsService.createTargetYear(payload).subscribe(
      (res: any) => {
        this.createTargetForm();
        swal('created a target year successfully', '', 'success');
        this.router.navigateByUrl('/pages/settings/targets');
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }
}
