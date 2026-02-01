import { Department } from './../../../models/department';
import { Ticket } from './../../../models/ticket';
import { EmbededModal } from './../../../interfaces/embededModal';
import { HelpdeskService } from './../../../services/helpdesk/helpdesk.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from './../../../services/shared/error-handler.service';
import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import swal from "sweetalert2";
import { Modal } from 'ngx-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-approval-modal',
  templateUrl: './request-approval-modal.component.html',
  styleUrls: ['./request-approval-modal.component.css']
})
export class RequestApprovalModalComponent implements OnInit,EmbededModal {

  @ViewChild('modal') modal:Modal;
  @ViewChild('requestApprovalFileInput') private requestApprovalFileInput:ElementRef;
  @Output() onSubmit:EventEmitter<any> = new EventEmitter<any>();
  requestApproval = {
    time_to_next_action: "",
    department_id: "",
    feedback: {
      description: "",
      attachments: [],
    },
  };
  ticket:Ticket;
  time_to_actions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,];
  departments:Department[];


  constructor(
    private helpDeskService: HelpdeskService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.getDepartments();
  }

  open(ticket)
  {
    this.modal.open();
    this.ticket = ticket;
  }

  submitRequestApprovalModal(modal) {
    if(!this.isFormValid())
    {
      swal("Form incomplete", "Please fill required fields", "info");
      return;
    }
    let payload: any = this.requestApproval;
    payload.time_to_next_action = +payload.time_to_next_action * 24;
    this.slimLoadingBarService.start();
    this.helpDeskService
      .requestApprovalForATicket(this.ticket.id, this.requestApproval)
      .subscribe(
        (res: any) => {
          this.onSubmit.emit({success:true, action:'tickets'});
          swal("Success", "Requested Approval Successfully", "success");
          this.slimLoadingBarService.complete();
          this.resetFields();
          modal.close();
          // this.router.navigate([`/pages/tickets`], { queryParams: {action: 'tickets'}});

        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
          this.onSubmit.emit(false);

        }
      );
  }

  getDepartments() {
    this.slimLoadingBarService.start();
    this.helpDeskService.getApprovalRequestDepartments()
      .subscribe((res: any) =>{
        this.slimLoadingBarService.complete();
        this.departments = res;
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  private resetFields()
  {
    this.requestApprovalFileInput.nativeElement.value = "";
    this.requestApproval = {
      time_to_next_action: "",
      department_id: "",
      feedback: {
        description: "",
        attachments: [],
      },
    };
  }

  async onRequestApprovalFilesChange(event) {
    let selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      let file = selectedFiles[i];
      let reader = new FileReader();
      await reader.readAsDataURL(file);
      reader.onload = async () => {
        let attach = {
          name: file.name,
          type: file.type,
          src: ((reader.result as any) as any).split(",")[1],
        };
        await this.requestApproval.feedback.attachments.push(attach);
      };
      console.log(this.requestApproval.feedback);
    }
  }

  isFormValid() : boolean
  {
    const r = this.requestApproval;
    const fb = r.feedback;
    return (fb.description as any) && (r.department_id as any);
  }
}
