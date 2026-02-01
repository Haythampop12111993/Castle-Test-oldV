import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';

import { LeadsService } from '../../services/lead-service/lead-service.service';
import { ProjectsService } from '../../services/projects/projects.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';

@Component({
  selector: 'app-target-settings',
  templateUrl: './target-settings.component.html',
  styleUrls: ['./target-settings.component.css']
})
export class TargetSettingsComponent implements OnInit {

  targets: any;
  filesForm: FormGroup;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService,
    private leadsService: LeadsService,
    private formBuilder: FormBuilder
  ) {
    this.filesForm = this.formBuilder.group({
      file_name: [null, Validators.required],
      file: [null, Validators.required],
    });
  }

  ngOnInit() {
    // this.createFilterForm();
    this.getTargetByYears();
    // this.getAgents();
    // this.getProjects();
  }

  getTargetByYears() {
    this.slimLoadingBarService.start();
    this.projectsService.getTargetByYears().subscribe(
      (res: any) => {
        this.targets = res;
        this.slimLoadingBarService.complete();
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  exportTarget(target) {
    this.slimLoadingBarService.start();
    this.projectsService.exportTargetByYear(target)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      });
  }

  submitTargetModal(target, modal) {
    console.log(target);
    console.log(this.filesForm.value);
    let payload = this.filesForm.value;
    modal.close();
    this.slimLoadingBarService.start();
    this.leadsService.importTarget(target, payload)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        swal('success', 'Uploaded target successfully', 'success');
      }, err => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      });
  }

  handleTargetExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.filesForm.get("file_name").setValue(file.name);
        this.filesForm
          .get("file")
          .setValue((reader.result as any).split(",")[1]);
      };
    }
  }
}
