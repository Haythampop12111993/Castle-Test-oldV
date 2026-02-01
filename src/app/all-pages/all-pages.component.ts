import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { MarketingService } from '../services/marketing/marketing.service';
import { ErrorHandlerService } from '../services/shared/error-handler.service';

@Component({
  selector: 'app-all-pages',
  templateUrl: './all-pages.component.html',
  styleUrls: ['./all-pages.component.css']
})
export class AllPagesComponent implements OnInit {
  pages: any;
  pageForm: FormGroup;
  disableAddPage: boolean = false;
  is_edit_mode: boolean = false;
  currnet_page_id: any;

  constructor(
    private marketingService: MarketingService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createPageForm();
    this.getPages();
  }

  createPageForm(data?) {
    if (data) {
      this.pageForm = this.formBuilder.group({
        external_page_id: [data.external_page_id || '', Validators.required],
      });
    } else {
      this.pageForm = this.formBuilder.group({
        external_page_id: ['', Validators.required],
      });
    }
  }

  getPages() {
    this.slimLoadingBarService.start();
    this.marketingService.getPages().subscribe((res: any) => {
      this.slimLoadingBarService.complete();
      this.pages = res;
    }, err => {
      this.slimLoadingBarService.reset();
    });
  }

  editPage(data, modal) {
    this.is_edit_mode = true;
    this.currnet_page_id = data.id;
    this.createPageForm(data);
    modal.open();
  }

  addPageModalOnClose() {
    this.is_edit_mode = false;
    this.currnet_page_id = null;
    this.pageForm.reset();
  }


  addPageSubmit(modal) {
    let payload = this.pageForm.value;
    this.disableAddPage = true;
    if (this.is_edit_mode) { 
      this.slimLoadingBarService.start();
      this.marketingService.editPage(this.currnet_page_id, payload).subscribe(
        (res: any) => {
          swal("Woohoo!", "Updated Page succesfully!", "success");
          modal.close();
          this.disableAddPage = false;
          this.getPages();
          this.is_edit_mode = false;
          this.currnet_page_id = null;
          this.pageForm.reset();
        },
        err => {
          this.errorHandlerService.handleErorr(err);
          this.disableAddPage = false;
        }
      );
    } else {
      this.slimLoadingBarService.start();
      this.marketingService.addPage(payload).subscribe((res: any) => {
      this.getPages();
      swal('Woohoo!', 'Created Campaign succesfully!', 'success');
      modal.close();
      this.disableAddPage = false;
      this.getPages();
      this.pageForm.reset();
    }, (err) => {
      swal(err.error.error, '', 'error');
      this.disableAddPage = false;
    });
    }
  }

  showPage(page: any) {
    
  }

  deletePage(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this page!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.marketingService.deletePage(id).subscribe(
          (res: any) => {
            this.getPages();
            swal("success", "Deleted page successfully!", "success");
          },
          err => {
            swal(err.error.message, "" , "error");
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    })
  }
}
