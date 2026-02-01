import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { ErrorHandlerService } from '../../../services/shared/error-handler.service';
import { LeadsService } from '../../../services/lead-service/lead-service.service';

@Component({
  selector: 'app-add-ambassador',
  templateUrl: './add-ambassador.component.html',
  styleUrls: ['./add-ambassador.component.css']
})
export class AddAmbassadorComponent implements OnInit {
  ambassador_export_url: any;

  add_ambassador: any = {
    name: '',
    contact_phone: '',
    contact_address: '',
    contact_person: ''
  };

  agents: any;

  uploadExcel: FormGroup;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private leadService: LeadsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ambassador_export_url = `${
      environment.api_base_url
    }ambassadors/export?token=${window.localStorage.getItem('token')}`;

    this.getAgents();
    this.uploadExcel = this.fb.group({
      file: [null, Validators.required]
    });
  }

  getAgents() {
    this.leadService.getPropertyConsultant().subscribe((res: any) => {
      this.agents = res;
    });
  }

  addAmbassador() {
    this.slimLoadingBarService.start();
    this.userService.addAmbasdor(this.add_ambassador).subscribe(
      data => {
        swal('Added an ambassador', '', 'success');
        this.add_ambassador = {
          name: '',
          contact_phone: '',
          contact_address: '',
          contact_person: ''
        };
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  importAmbassadorsModalOpen() {}

  importAmbassadorsModalClose() {
    // this.createFilesUpload();
    // let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    // inputValue = '';
  }

  handleUploadExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadExcel.get('file').setValue({
          file_name: file.name,
          file_value: (reader.result as any).split(',')[1]
        });
      };
    }
  }

  uploadExcelMethod(modal) {
    const formValue = this.uploadExcel.value;
    const data = {
      file_name: formValue.file.file_name,
      file: formValue.file.file_value
    };
    this.slimLoadingBarService.start();
    this.leadService.importAmbassadors(data).subscribe(
      reso => {
        this.uploadExcel.reset();
        let inputValue = (<HTMLInputElement>document.getElementById('file'))
          .value;
        inputValue = '';
        modal.close();
        swal('Ambassadors imported successfully', '', 'success');
        this.slimLoadingBarService.complete();
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  exportAmbassadors() {
    this.slimLoadingBarService.start();
    this.leadService.exportAmbassadors().subscribe((res: any) => {
      window.open(res);
      this.slimLoadingBarService.complete();
    });
  }
}
