import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { LeadsService } from '../../services/lead-service/lead-service.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-add-developer',
  templateUrl: './add-developer.component.html',
  styleUrls: ['./add-developer.component.css']
})
export class AddDeveloperComponent implements OnInit {

  //#region Definitions
  developer_export_url: any;
  title: string = 'Add Developer';
  add_developer: any = {
    name: ''
  };
  developerId: any;
  developerUploadExcel: FormGroup;
  agents: any;
  logo: any;
  isEditState = false;
  developer: any;
  //#region 

  current_developer: any;


  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private userService: UserServiceService,
    private leadService: LeadsService,
    private fb: FormBuilder,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit() {
    this.getAllAgents();
    this.developer_export_url = `${
      environment.api_base_url
      }developer/export?token=${window.localStorage.getItem('token')}`;
    this.developerId = +this.route.snapshot.params['id'];
    if (this.developerId > 0) {
      this.isEditState = true;
      this.title = "Edit Developer";
      this.getdeveloper(this.developerId);
    } 
    this.developerUploadExcel = this.fb.group({
      file: [null, Validators.required]
    });
  }

  getAllAgents() {
    this.leadService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
        this.slimLoadingBarService.complete();
      },
      err => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getdeveloper(id?) {
    this.current_developer = JSON.parse(window.localStorage.getItem('current_developer'));
    if (this.current_developer.agent) {
      this.add_developer = {
        name: this.current_developer.name,
        contact_phone: this.current_developer.contact_phone,
        contact_address: this.current_developer.contact_address,
        contact_person: this.current_developer.contact_person,
        agent_in_charge: this.current_developer.agent.id,
        id: this.current_developer.id
      }
    } else {
      this.add_developer = {
        name: this.current_developer.name,
        contact_phone: this.current_developer.contact_phone,
        contact_address: this.current_developer.contact_address,
        contact_person: this.current_developer.contact_person,
        agent_in_charge: '',
        id: this.current_developer.id
      }
      
    }
  }

  addDeveloper() {
    this.slimLoadingBarService.start();
    let serUrl ;
    if(this.add_developer && this.add_developer.id){
      serUrl = this.userService.editDeveloper(this.add_developer.id,this.add_developer);
    }
    else{
      serUrl = this.userService.addDeveloper(this.add_developer);
    }
    console.log(serUrl);
    serUrl.subscribe(
      data => {
        swal('Added Developer successfully', '', 'success');
        this.add_developer = {
          name: '',
          contact_phone: '',
          contact_address: '',
          contact_person: '',
          agent_in_charge: null
        };
        this.router.navigateByUrl('/pages/settings/developers');
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  onFileChange(event) {
      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        console.log(file);
        reader.onload = () => {
          this.add_developer.logo = {
            name: file.name,
            type: file.type,
            value: (reader.result as any).split(',')[1]
          }
        };
      };
  }

  importdeveloperModalOpen() { }

  importdeveloperModalClose() {
    // this.createFilesUpload();
    // let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    // inputValue = '';
  }

  handledeveloperUploadExcel(event) {
    console.log(event);
    console.log(event.target.files);
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.developerUploadExcel.get('file').setValue({
          file_name: file.name,
          file_value: (reader.result as any).split(',')[1]
        });
      };
    }
  }

  uploadDeveloperExcelMethod(modal) {
    if (this.developerUploadExcel.valid) {
      const formValue = this.developerUploadExcel.value;
      const data = {
        file_name: formValue.file.file_name,
        file: formValue.file.file_value
      };
      this.slimLoadingBarService.start();
      // this.leadService.importdeveloper(data).subscribe(
      //   reso => {
      //     // this.createFilesUpload();
      //     this.developerUploadExcel.reset();
      //     let inputValue = (<HTMLInputElement>(
      //       document.getElementById('brokerExcelFile')
      //     )).value;
      //     inputValue = '';
      //     modal.close();
      //     swal('developer imported successfully', '', 'success');
      //     this.slimLoadingBarService.complete();
      //   },
      //   err => this.errorHandlerService.handleErorr(err),
      //   () => this.slimLoadingBarService.complete()
      // );
    }
  }

  ngOnDestroy() {
    this.current_developer = null;
  }
}
