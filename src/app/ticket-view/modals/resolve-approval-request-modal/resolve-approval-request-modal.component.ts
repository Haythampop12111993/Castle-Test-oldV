import { TicketApproval } from './../../../models/ticketApproval';
import { Ticket } from './../../../models/ticket';
import { Modal } from 'ngx-modal';
import { EmbededModal } from './../../../interfaces/embededModal.d';
import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HelpdeskService } from './../../../services/helpdesk/helpdesk.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from './../../../services/shared/error-handler.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-resolve-approval-request-modal',
  templateUrl: './resolve-approval-request-modal.component.html',
  styleUrls: ['./resolve-approval-request-modal.component.css']
})
export class ResolveApprovalRequestModalComponent implements OnInit,EmbededModal {
  @ViewChild('modal') modal:Modal;
  @Output() onSubmit:EventEmitter<any> = new EventEmitter<{success:boolean, action:string}>();
  ticket:Ticket;
  requestResolve: {
    is_approved:  boolean,
    feedback: {
      description: string,
      attachments: any[],
    },
  };

  constructor(
    private helpDeskService: HelpdeskService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
  ) { }

  ngOnInit() {
    this.initializeFields();
  }

  open(ticket:Ticket,)
  {
    this.modal.open();
    this.ticket = ticket;
  }

  submit(isApproved:boolean) {
    this.modal.close();
    this.requestResolve.is_approved = isApproved;
    let payload: any = this.requestResolve;
    payload.time_to_next_action = +payload.time_to_next_action * 24;
    this.slimLoadingBarService.start();
    this.helpDeskService
      .resolveTicketApprovalRequest(this.ticket.id,this.ticket.pending_approval.id,this.requestResolve)
      .subscribe(
        (res: any) => {
          swal("Success", "Resolved request Successfully", "success");
          this.slimLoadingBarService.complete();
          // this.onSubmit.emit({success:true, action:'resolved'});
          this.onSubmit.emit(true);

        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
          // this.onSubmit.emit({success:false, action:'resolved'});
          this.onSubmit.emit(false);

        }
      );
  }

  private initializeFields()
  {
    this.requestResolve = {
      is_approved: null as boolean,
      feedback: {
        description: "",
        attachments: [],
      },
    };
  }

  async onFeedbackFilesChange(event) {
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
        await this.requestResolve.feedback.attachments.push(attach);
      };
      console.log(this.requestResolve.feedback);
    }
  }
}
