import { ProjectsService } from "./../services/projects/projects.service";
import { FormBuilder } from "@angular/forms";
import { Ticket } from "./../models/ticket";
import { HelpdeskService } from "./../services/helpdesk/helpdesk.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ReservationService } from "../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { resolve } from "url";
import { Subject } from "rxjs";
import { forkJoin } from "rxjs/observable/forkJoin";
import { environment } from "../../environments/cred/environment";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.scss"],
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  tickets_raw_data: any;
  pageTest: any = 1;
  base_url_for_pagination: any;
  last_page_url: any;
  current_page: any;
  view: any = "tickets";
  isResolved: boolean = false;
  hasQParam: boolean = false;
  role: any = window.localStorage.getItem("role");
  userData = JSON.parse(localStorage.getItem("userProfile"));
  filterObj: any = {};

  searchTicketForm: any;

  ticket_types: any = [];
  ticket_status: any = [];
  ticket_client_requests: any = [];
  ticket_priorities: any = [];
  ticket_sources: any = [];
  allAgents: any = [];
  allProjects: any = [];
  excel = `${
    environment.api_base_url
  }helpdesk/tickets?is_export=1&token=${window.localStorage.getItem("token")}`;
  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private projectService: ProjectsService,
    private helpdeskService: HelpdeskService,
    private leadsService: LeadsService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getQParams();
    if (this.hasQParam) this.getTickets();

    this.loadFiltersData();

    this.getTicketStatus();
    this.getTicketClientRequests();

    this.searchTicketForm = this.formBuilder.group({
      reservations: [null],
      type: [null],
      status: [null],
      priority: [null],
      source: [null],

      unit_serial: [null],
      filter_lead_name: [null],
      filter_lead_phone: [null],
      ticket_id: [null],
      ticket_client_request_id: [null],
      date_from: [null],
      date_to: [null],

      agents: [[]],
      projects: [[]],
    });
  }

  exportTickets(params: any = {}) {
    this.slimLoadingBarService.start();
    params.is_export = 1;
    this.helpdeskService.exportTickets(params).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getTicketStatus() {
    this.helpdeskService.getTicketStatus().subscribe(
      (res: any) => {
        this.ticket_status = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getTicketClientRequests() {
    this.helpdeskService.getTicketClientRequests().subscribe(
      (res: any) => {
        this.ticket_client_requests = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  loadFiltersData() {
    forkJoin([
      this.helpdeskService.getTicketTypes(),
      this.helpdeskService.getTicketPriority(),
      this.helpdeskService.getTicketSource(),
      this.helpdeskService.getsUsersToAssignTicket(),
      this.projectService.getProjects(),
    ]).subscribe(([types, priorities, sources, agents, projects]: any) => {
      this.ticket_types = types;
      this.ticket_priorities = priorities;
      this.ticket_sources = sources;
      this.allAgents = agents;
      this.allProjects = projects.data;
    });
  }

  getQParams() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.action) {
        this.hasQParam = true;
        this.setView(params.action);
      } else this.setView("tickets");
    });
  }

  removeQParams() {
    // Remove query params
    this.router.navigate([], {
      queryParams: {
        action: null,
      },
      queryParamsHandling: "merge",
    });
    this.hasQParam = false;
  }

  getTickets(isResolved?, filter = {}, history = false) {
    this.slimLoadingBarService.start();
    let qParam: any;
    if (history) {
      qParam = {
        history: true,
      };
    } else {
      qParam = {
        is_resolved: isResolved || "",
        ...Object.entries(filter)
          .filter(([key, val]) => val)
          .reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj;
          }, {}),
      };
    }

    this.helpdeskService.getTickets(qParam).subscribe(
      (data: any) => {
        console.log(data);
        this.tickets_raw_data = data;
        this.base_url_for_pagination = data.last_page_url.split("?")[0];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        this.tickets = data.data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  pageChange(ev) {
    const selectedUrl = `${this.base_url_for_pagination}?page=${ev}`;
    this.infinite(selectedUrl, ev);
  }

  infinite(url, event) {
    let params = this.searchTicketForm.value;
    this.leadsService.infinit(url, params).subscribe(
      (res: any) => {
        this.tickets_raw_data = res;
        this.tickets = res.data;
        this.last_page_url = res.last_page_url;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  goToTicketView(id, resolved?: boolean, no_actions: boolean = false) {
    let qParams = {};
    if (resolved) qParams["type"] = "resolved";
    if (no_actions) qParams["no_actions"] = no_actions;
    this.router.navigate([`/pages/view-ticket/${id}`], {
      queryParams: qParams,
    });
  }

  goToEditTicket(id) {
    this.router.navigate([`/pages/edit-ticket/${id}`], {});
  }

  viewLead(leadId) {
    this.helpdeskService.viewLead(leadId);
  }

  viewReservation(reservationId) {
    this.helpdeskService.viewReservation(reservationId);
  }

  getTicketDescription(ticket: Ticket): string {
    const desc = ticket.description || "-";
    return desc.length <= 20 ? desc : `${desc.slice(0, 20)}...`;
  }

  setView(tab: String) {
    this.view = tab;
    this.isResolved = tab == "resolved" ? true : false;
    if (tab == "resolved") {
      this.getTickets(true);
    } else if (tab == "history") {
      this.getTickets(false, this.filterObj, true);
    } else this.getTickets(false);
    this.removeQParams();
  }

  advancedSearch() {
    this.filterObj = this.searchTicketForm.value;
    this.getTickets(this.isResolved, {
      ...this.filterObj,
      is_resolved: this.isResolved,
    });
  }

  reset() {
    this.searchTicketForm.reset();
    this.getTickets(this.isResolved);
  }
}
