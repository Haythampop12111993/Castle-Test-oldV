import { Ticket } from './../../../models/ticket';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from './../../../services/shared/error-handler.service';
import { HelpdeskService } from './../../../services/helpdesk/helpdesk.service';
import { EmbededModal } from './../../../interfaces/embededModal';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import swal from "sweetalert2";
import { Modal } from 'ngx-modal';

@Component({
  selector: 'app-change-status-modal',
  templateUrl: './change-status-modal.component.html',
  styleUrls: ['./change-status-modal.component.css']
})
export class ChangeStatusModalComponent implements OnInit,EmbededModal {
  @ViewChild('modal') modal:Modal;
  @Output() onSubmit:EventEmitter<any> = new EventEmitter<any>();

  statuses: any;
  ticket:Ticket;
  changeStatus = {
    status_id: ""
  }
  constructor(
    private helpDeskService: HelpdeskService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    ) { }

  ngOnInit() {
    this.getTicketStatus();
  }

  open(ticket)
  {
    this.modal.open();
    this.ticket = ticket;
  }

  submitChangeStatusModal(modal) {
    modal.close();
    this.slimLoadingBarService.start();
    this.helpDeskService
      .changeTicketStatus(this.ticket.id, this.changeStatus)
      .subscribe(
        (res: any) => {
          swal("Success", "Changed Status Successfully", "success");
          this.slimLoadingBarService.complete();
          this.changeStatus = {
            status_id: ""
          };
          this.onSubmit.emit(true);
        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
          this.onSubmit.emit(false);

        }
      );
  }

  getTicketStatus() {
    this.helpDeskService.getTicketStatus().subscribe(
      (res: any) => {
        this.statuses = res;
      },
      (err) => {}
    );
  }
}
