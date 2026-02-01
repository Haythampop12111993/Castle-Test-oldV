import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { MarketingService } from './../services/marketing/marketing.service';
import { environment } from './../../environments/environment';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent implements OnInit {

  createForm: FormGroup;
  file_name: any;
  lists_raw_data: any;
  lists: any;
  emailForm: any;
  smsForm: any;

  constructor(private errorHandlerService: ErrorHandlerService, private fb: FormBuilder, private marketingService: MarketingService, private slimLoadingService: SlimLoadingBarService) {
    this.createListForm();
    this.createEmailBulkForm();
    this.createSmSBulkForm();
  }

  ngOnInit() {
    this.getList();
  }

  createListForm() {
    this.createForm = this.fb.group({
      list_name: ['', Validators.required],
      file_name: ['', Validators.required],
      type: ['', Validators.required],
      file: ['', Validators.required]
    })
  }

  handleCreationListFile(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.createForm.get('file_name').setValue(file.name);
        this.createForm.get('file').setValue((reader.result as any).split(',')[1]);
      };
    }
  }

  getList() {
    this.slimLoadingService.start();
    this.marketingService.getMarketingList().subscribe((res: any) => {
      this.lists_raw_data = res;
      this.lists = res.data;
    }, err => this.errorHandlerService.handleErorr(err)
    , () => this.slimLoadingService.complete());
  }

  downloadEmailExample() {
    window.open(`${environment.api_base_url}uploads/documents/leads/import_list_email.xlsx`);
  }

  downloadSmSExample() {
    window.open(`${environment.api_base_url}uploads/documents/leads/import_list_phone.xlsx`);
  }

  addList() {

  }

  createListModelOnOpen() {

  }

  createListModelOnClose() {
    this.createListForm();
  }

  createListModelOnSubmit(modal) {
    let form = this.createForm.value;
    if(this.createForm.valid){
      console.log(form);
      this.slimLoadingService.start();
      this.marketingService.createMarketList(form).subscribe((res: any) => {
        modal.close();
        swal('Created the list Successfullt', '', 'success');
        this.getList();
      }, err => this.errorHandlerService.handleErorr(err)
      ,  () => this.slimLoadingService.complete());
    } else {
      swal('All fields are required', '', 'error');
    }
  }

  openModalEditMode(modal, list){
    console.log(list);
    this.createForm.patchValue({
      list_name: list.list_name,
      type: 'Email',
    })
    modal.open();
  }

  openSmMModal(list, modal){
    this.createSmSBulkForm();
    this.smsForm.patchValue({
      list_id: list.id
    });
    modal.open();
  }

  openEmailModal(list, modal){
    this.createEmailBulkForm();
    this.emailForm.patchValue({
      list_id: list.id
    });
    modal.open();
  }

  createEmailBulkForm(){
    this.emailForm = this.fb.group({
      list_id: ['', Validators.required],
      subject: ['', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  createSmSBulkForm(){
    this.smsForm = this.fb.group({
      list_id: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  sendEmailBulk(modal){
    let payload = this.emailForm.value;
    console.log(payload);
    if(!this.emailForm.valid) swal('All Fields are required', '', 'error');
    else {
      this.slimLoadingService.start();
      this.marketingService.sendEmails(payload).subscribe((res: any) => {
        modal.close();
        swal('Email sent successfully', '', 'success');
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingService.complete());
    }
  }

  sendSmSBulk(modal){
    let payload = this.smsForm.value;
    console.log(payload);
    if(!this.smsForm.valid) swal('All Fields are required', '', 'error');
    else {
      this.slimLoadingService.start();
      this.marketingService.sendSmS(payload).subscribe((res: any) => {
        modal.close();
        swal('SMS sent successfully', '', 'success');
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingService.complete());
    }
  }

  smsModalOnClose(){
    this.smsForm = this.fb.group({
      list_id: [''],
      message: ['', Validators.required]
    })
  }

  emailModalOnClose(){
    this.createEmailBulkForm();
  }
  exportList(id,type) {
    console.log(id ,type);
    this.slimLoadingService.start();
    this.marketingService.exportList(id,type).subscribe((data: any) => {
      window.open(data);
      swal('Cool!', 'List has been exported succesfully!', 'success');
    }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingService.complete());
  }

}
