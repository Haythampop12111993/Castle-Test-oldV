import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ProjectsService } from './../services/projects/projects.service';
import { Component } from '@angular/core';
import { FormBuilder, NgForm, NgModel, Validators, FormGroup, ValidatorFn } from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import swal from 'sweetalert2';

@Component({
  templateUrl: './import-units.component.html',
  styleUrls: [
    './import-units.component.css'
  ]
})
export class ImportUnitsComponent{

  projects: any;
  project: any = {
    projectIndex: '',
    phase: ''
  }
  file_name: string;
  documentForm: FormGroup;
  enablePhase: boolean = false;
  enableImportFile: boolean = false;

  constructor(private projectsService: ProjectsService, private fb: FormBuilder, private cookieService: CookieService, private slimLoadingBarService: SlimLoadingBarService, private errorHandlerService: ErrorHandlerService){
    this.createForm();
  }

  ngOnInit(){
    this.getProjects();
  }

  formSelected(event){
    this.enablePhase = true;
  }

  phaseSelected(event){
    this.enableImportFile = true;
  }

  getProjects() {
    this.projectsService.getProjects().subscribe((data: any) => {
      this.projects = data;
      console.log(this.projects);
    }, err => this.errorHandlerService.handleErorr(err));
  }

  createForm(){
    this.documentForm = this.fb.group({
      projectIndex: ['', Validators.requiredTrue],
      phaseId: ['', Validators.requiredTrue],
      excel: null
    });
  }

  onFileChange(event){
    console.log(event);
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.documentForm.get('excel').setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any).split(',')[1]
        })
      };
    }
  }

  onDocumentSubmit(){
    const formModel = this.documentForm.value;
    this.slimLoadingBarService.start(() => {
      console.log('Loading complete');
    });
    console.log(formModel);
    if (!formModel.phaseId) {
      swal('Oops...', 'Phase can not be empty', 'error');
    } else if (!formModel.excel.value){
      swal('Oops...', 'Import unit can not be empty', 'error');
    } else {
      let data = {
        project_id: '',
        phase_id: formModel.phaseId,
        excel: formModel.excel.value,
      }
      this.projects.forEach((e, i) => {
        if(i == formModel.projectIndex){
          console.log('matched');
          data.project_id = e.id;
        }
      });
      console.log(data);
    }
    // let data = {
    //   image: formModel.image.value,
    //   type: formModel.type,
    //   value: formModel.value,
    //   value_date: formModel.value_date,
    //   file_name: this.file_name
    // };
    // console.log(data);
    // this.leadsService.postDocument(data, this.leadId).subscribe(data => {
    //   this.slimLoadingBarService.complete();
    //   console.log(data);
    //   swal('Woohoo!', 'Document updated succesfully!', 'success');
    //   this.getLeadDetails(this.leadId);
    // }, err => {
    //   console.log(err)
    //   this.slimLoadingBarService.complete();
    //   swal('Oops...', 'Something went wrong!', 'error')

    // } );
  }
}
