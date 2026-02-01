import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { LeadsService } from '../../services/lead-service/lead-service.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

  developer_export_url: any;
  search_developers_keyword: any;

  developers: any;

  broker_last_name: any;

  developersubscribe: Subscription;

  developerUploadExcel: FormGroup;
  agents: any;

  developers_raw_data: any;
  base_url_for_pagination: any;
  last_page_url: any;
  current_page: any;
  pageTest: any = 1;

  developerDocumentForm:FormGroup;
  developerToUploadDocumentId;
  developerDocuments = [];
  @ViewChildren('documentFile') documentFile;

  constructor(
    private userService: UserServiceService,
    private leadService: LeadsService,
    private fb: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService,
    private router: Router
  ) {
    this.developer_export_url = `${
      environment.api_base_url
      }developers/export?token=${window.localStorage.getItem('token')}`;
  }

  ngOnInit() {
    this.getAllAgents();
    this.getdevelopers();
    this.developerUploadExcel = this.fb.group({
      file: [null, Validators.required]
    });
    this.developerDocumentForm = this.fb.group({
      file: [null, Validators.required],
      name:[null,Validators.required]
    });
  }

  getdevelopers() {
    this.slimLoadingBarService.start();
    this.userService.getDevelopers().subscribe(
      (data: any) => {
        // this.developers_raw_data = data;
        // this.base_url_for_pagination = data.last_page_url.split('?')[0];
        // this.last_page_url = data.last_page_url;
        // this.current_page = 1;
        // data.data.forEach(element => {
        //   element.edit_mode = false;
        // });
        this.developers = data;
        console.log(this.developers);
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  edit_developer(id, index) {
    console.log(this.developers);
    window.localStorage.setItem('current_developer', JSON.stringify(this.developers[index]));
    this.router.navigate([`/pages/settings/developers/edit/${id}`]);
  }

  save_broker(index) {
    this.slimLoadingBarService.start();
    const broker_id = this.developers[index].id;
    this.userService.editBroker(broker_id, this.developers[index]).subscribe(
      data => {
        this.developers[index].edit_mode = false;
        swal('Updated successfully', '', 'success');
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deleteBrokerDocument(broker,document_id){
    console.log('broker doc : ', broker, document_id)

    this.userService.deleteBrokerDocument(broker,document_id).subscribe((res:any) => {

      this.developerDocuments = res
        console.log('document deleted : ', res);
    }, err => console.log('error'));
  }

  searchdevelopers(ev) {
    console.log(ev);
    console.log(this.search_developers_keyword);
    if (this.search_developers_keyword) {
      if (this.developersubscribe) {
        this.developersubscribe.unsubscribe();
      }
      this.getBroker();
    } else {
      this.getdevelopers();
    }
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

  getBroker() {
    this.slimLoadingBarService.start();
    this.developersubscribe = this.leadService
      .searchBroker(this.search_developers_keyword)
      .subscribe(
        (data: any) => {
          data.forEach(element => {
            element.edit_mode = false;
            if (!element.agent) {
              element.agent = { name: '', id: '' };
            }
          });
          this.developers = data;
          this.slimLoadingBarService.complete();
        },
        err => this.errorHandlerService.handleErorr(err)
      );
  }

  importdevelopersModalOpen() { }

  importdevelopersModalClose() {
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

  uploadBrokerExcelMethod(modal) {
    if (this.developerUploadExcel.valid) {
      const formValue = Object.assign({},this.developerUploadExcel.value);
      const data = {
        file_name: formValue.file.file_name,
        file: formValue.file.file_value
      };
      this.slimLoadingBarService.start();
      // this.leadService.importdevelopers(data).subscribe(
      //   reso => {
      //     // this.createFilesUpload();
      //     this.developerUploadExcel.reset();
      //     let inputValue = (<HTMLInputElement>(
      //       document.getElementById('brokerExcelFile')
      //     )).value;
      //     inputValue = '';
      //     modal.close();
      //     swal('developers imported successfully', '', 'success');
      //     this.slimLoadingBarService.complete();
      //   },
      //   err => this.errorHandlerService.handleErorr(err),
      //   () => this.slimLoadingBarService.complete()
      // );
    }
  }

  pageChange(ev) {
    const selectedUrl = `${this.base_url_for_pagination}?page=${ev}`;
    this.infinite(selectedUrl, ev);
  }

  infinite(url, event) {
    console.log(url);
    console.log('pagination ');
    this.leadsService.infinteWithPaginated(url).subscribe(
      (data: any) => {
        this.developers_raw_data = data;
        this.base_url_for_pagination = data.last_page_url.split('?')[0];
        this.last_page_url = data.last_page_url;
        data.data.forEach(element => {
          element.edit_mode = false;
        });
        this.developers = data.data;
        this.last_page_url = data.last_page_url;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  viewLog(broker) {
    this.router.navigate(['/pages/single-log'], {
      queryParams: {
        module: 'developers',
        name: broker.name,
        id: broker.id
      }
    });
  }


  /* BROKER DOCUMENT SECTION START */

  uploadBrokerDocumentModalOpen(broker){
    console.log('selected broker: ',broker);
    this.developerToUploadDocumentId = broker.id;
  }

  uploadBrokerDocumentModalClose(){
    this.developerDocumentForm.reset();
    this.documentFile.nativeElement.value = "";
  }

  uploadBrokerDocument(modal)
  {
    let payload = {
      documents: this.developerDocumentForm.get('file').value
    };
    console.log(payload);
    // payload['name'] = this.developerDocumentForm.get('name').value;

    this.userService.uploadBrokerDocument(this.developerToUploadDocumentId,payload as any).subscribe(
      res => {
        swal('Success','Document uploaded successfully','success');
        this.developerDocumentForm.reset();
        modal.close();
      },
      err=> this.errorHandlerService.handleErorr(err)
    );
  }

  handleDocumentUpload(event)
  {

    if (event.target.files && event.target.files.length > 0) {
      let files = this.handleFormatMultiple(event.target.files);
      this.developerDocumentForm.get('file').setValue(files);
    }
  }

  handleFormatMultiple(filesArray) {
    let files = Object.values(filesArray);
    let filesBase46 = [];
    for (let i = 0; i < files.length; i++) {
      let img: any = files[i];
      let reader = new FileReader();
      let x = reader.readAsDataURL(img);
      reader.onload = () => {
        let imgObject = {
          document_name: img.name,
          document_value: (reader.result as any).split(',')[1]
        };
        filesBase46.push(imgObject);
      };
    }
    return filesBase46;
  }

  showdeveloperDocumentsModalOpen(broker){
    // this.userService.getdeveloperDocuments(broker.id).subscribe(
    //   res=>this.developerDocuments = res as any,
    //   err=>this.errorHandlerService.handleErorr(err)

    // );

  }

}
