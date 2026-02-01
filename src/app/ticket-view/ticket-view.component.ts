import { Ticket } from "./../models/ticket";
import { HelpdeskService } from "./../services/helpdesk/helpdesk.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-ticket-view",
  templateUrl: "./ticket-view.component.html",
  styleUrls: ["./ticket-view.component.scss"],
})
export class TicketViewComponent implements OnInit {
  ticket_id: any;
  ticket_details: Ticket;
  ticketActivities: any;
  ticketFeedbacks: any = [];
  isResolved: boolean = false;
  no_actions: any;

  constructor(
    private route: ActivatedRoute,
    private helpDeskService: HelpdeskService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private ngxLoaderService: NgxUiLoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getParams();
    this.getQParams();
  }

  getParams() {
    this.route.params.subscribe((params: any) => {
      this.ticket_id = +params.id;
      if (this.ticket_id) {
        this.initialize(true);
      }
    });
  }

  getQParams() {
    this.route.queryParams.subscribe((qParams: any) => {
      if (qParams.type) {
        this.isResolved = qParams.type == "resolved";
        this.no_actions = qParams.no_actions;
      }
    });
  }

  initialize(result?: any) {
    console.log(result);
    let isObject = Object.keys(result).length > 0;
    if (result || (isObject && result.success)) {
      if (isObject) {
        switch (result.action) {
          case "resolved":
            this.isResolved = true;
            this.router.navigate([`/pages/tickets`], {
              queryParams: { action: result.action },
            });
            break;
          case "tickets":
            this.router.navigate([`/pages/tickets`], {
              queryParams: { action: result.action },
            });
            break;

          default:
            break;
        }
        return;
      }
      this.getTicketDetails(this.ticket_id);
      this.getTicketActivities(this.ticket_id);
      this.getTicketFeedbacks(this.ticket_id);
    }
    this.ngxLoaderService.stop();
  }

  getTicketDetails(id) {
    this.slimLoadingBarService.start();
    this.helpDeskService.getTicketDetails(id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.ticket_details = res;
        console.log("ticket", this.ticket_details);
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getTicketActivities(id) {
    this.helpDeskService.getTicketActivities(id).subscribe(
      (res) => (this.ticketActivities = res),
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getTicketFeedbacks(id) {
    this.helpDeskService.getTicketDetailsFeedbacks(id).subscribe(
      (res: any) => (this.ticketFeedbacks = res.data),
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  markAsResolved() {
    this.slimLoadingBarService.start();
    this.helpDeskService.markTicketAsResolved(this.ticket_id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        swal("Success", "Marked ticket as resolved succcessfully", "success");
        this.initialize({ success: true, action: "resolved" });
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  markAsFinished() {
    this.slimLoadingBarService.start();
    this.helpDeskService.markTicketAsFinished(this.ticket_id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        swal("Success", "Marked ticket as finished succcessfully", "success");
        this.initialize({ success: true, action: "tickets" });
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  reOpenTicket(id) {
    swal({
      title: "Are you sure?",
      text: "You want to reopen ticket?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No.",
    }).then((result) => {
      if (result.value) {
        this.helpDeskService.reopenTicket(id).subscribe(
          (res: any) => {
            swal("Success", "Reopened Successfully", "success"),
              this.router.navigate([`/pages/tickets`]);
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      }
    });
  }

  viewLead() {
    this.helpDeskService.viewLead(this.ticket_details.lead_id);
  }

  viewReservation(id) {
    this.helpDeskService.viewReservation(id);
  }

  deleteTicket() {
    swal({
      title: "Are you sure?",
      text: "You want to delete this ticket?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No.",
    }).then((result) => {
      if (result.value) {
        this.helpDeskService.deleteTicket(this.ticket_id).subscribe(
          (res: any) => {
            swal("Success", "Deleted Successfully", "success"),
              this.router.navigate([`/pages/tickets`]);
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      }
    });
  }
}
