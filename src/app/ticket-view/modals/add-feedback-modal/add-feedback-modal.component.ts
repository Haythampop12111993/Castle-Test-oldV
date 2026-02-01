import { Ticket } from './../../../models/ticket';
import  swal  from 'sweetalert2';
import { EmbededModal } from './../../../interfaces/embededModal';
import { ErrorHandlerService } from './../../../services/shared/error-handler.service';
import { HelpdeskService } from './../../../services/helpdesk/helpdesk.service';
import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Modal } from 'ngx-modal';


@Component({
  selector: 'app-add-feedback-modal',
  templateUrl: './add-feedback-modal.component.html',
  styleUrls: ['./add-feedback-modal.component.css']
})
export class AddFeedbackModalComponent implements OnInit,EmbededModal {

  @ViewChild('modal') modal:Modal;
  @ViewChild('addFeedbackFileInput') private addFeedbackFileInput:ElementRef;
  @Output() onSubmit:EventEmitter<any> = new EventEmitter<any>();
  ticket: Ticket;
  addFeedback: any = {
    description: "",
    attachments: [],
  };
  constructor(

    private slimLoadingBarService: SlimLoadingBarService,
    private helpDeskService: HelpdeskService,
    private errorHandlerService: ErrorHandlerService,
  ) { }

  ngOnInit() {
  }

  open(ticket)
  {
    this.modal.open();
    this.ticket = ticket;
  }

  submitAddFeedBackModal(modal) {
    if(!this.isFormValid())
    {
      swal("Form incomplete", "Please fill required fields", "info");
      return;
    }
    this.slimLoadingBarService.start();
    this.helpDeskService
      .addFeedbackToTicket(this.ticket.id, this.addFeedback)
      .subscribe(
        (res: any) => {
          this.onSubmit.emit(true);
          swal("Success", "Added Feedback Successfully", "success");
          this.slimLoadingBarService.complete();
          this.resetFields();
          modal.close();
        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
          this.onSubmit.emit(false);

        }
      );
  }

  async onAssignAddFeedbackFilesChange(event) {
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
        await this.addFeedback.attachments.push(attach);
      };
    }
  }

  private resetFields()
  {
    this.addFeedbackFileInput.nativeElement.value = "";
    this.addFeedback = {
      description: "",
      attachments: [],
    };
  }

  isFormValid() : boolean
  {
    const fb = this.addFeedback;
    return fb.description;
  }
}
