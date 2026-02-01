import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { removeNullishFieldsParams } from "../../shared/object_helpers";

@Injectable()
export class HelpdeskService {
  baseUrl: string = environment.api_base_url;
  constructor(
    private http: HttpClient,
    private ngxLoaderService: NgxUiLoaderService,
    private router: Router
  ) {}

  addTicket(payload) {
    return this.http.post(
      `${this.baseUrl}helpdesk/tickets`,
      JSON.stringify(payload)
    );
  }

  editTicket(payload, ticketId) {
    return this.http.put(
      `${this.baseUrl}helpdesk/tickets/${ticketId}`,
      JSON.stringify(payload)
    );
  }

  getTickets(qParam?: { is_resolved?: "true"; title? }) {
    qParam = removeNullishFieldsParams(qParam);
    return this.http.get(`${this.baseUrl}helpdesk/tickets`, { params: qParam });
  }

  getTicketDetails(id) {
    return this.http.get(`${this.baseUrl}helpdesk/tickets/${id}`);
  }

  getTicketDetailsFeedbacks(id) {
    return this.http.get(`${this.baseUrl}helpdesk/tickets/${id}/feedbacks`);
  }

  exportTickets(params = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}helpdesk/tickets`, {
      params
    })
  }

  assignTicketToAgent(id, payload) {
    this.ngxLoaderService.start();
    return this.http.put(
      `${this.baseUrl}helpdesk/tickets/${id}/assign`,
      payload
    );
  }

  addFeedbackToTicket(id, payload) {
    this.ngxLoaderService.start();

    return this.http.post(
      `${this.baseUrl}helpdesk/tickets/${id}/feedbacks`,
      payload
    );
  }

  requestApprovalForATicket(id, payload) {
    this.ngxLoaderService.start();

    return this.http.post(
      `${this.baseUrl}helpdesk/tickets/${id}/request_approval`,
      payload
    );
  }

  resolveTicketApprovalRequest(ticket_id, req_id, payload) {
    this.ngxLoaderService.start();

    return this.http.put(
      `${this.baseUrl}helpdesk/tickets/${ticket_id}/request_approval/${req_id}`,
      payload
    );
  }

  changeTicketStatus(id, payload) {
    this.ngxLoaderService.start();

    return this.http.put(
      `${this.baseUrl}helpdesk/tickets/${id}/changeStatus`,
      payload
    );
  }

  getsUsersToAssignTicket() {
    return this.http.get(`${this.baseUrl}helpdesk/assignable_users`);
  }

  markTicketAsResolved(id) {
    return this.http.put(
      `${this.baseUrl}helpdesk/tickets/${id}/markAsResolved`,
      {}
    );
  }

  markTicketAsFinished(id) {
    return this.http.put(
      `${this.baseUrl}helpdesk/tickets/${id}/markAsFinished`,
      {}
    );
  }

  getTicketTypes() {
    return this.http.get(`${this.baseUrl}ticketTypes`);
  }

  getTicketSource() {
    return this.http.get(`${this.baseUrl}ticketSources`);
  }

  getTicketPriority() {
    return this.http.get(`${this.baseUrl}ticketPriorities`);
  }

  getTicketStatus() {
    return this.http.get(`${this.baseUrl}ticketStatus`);
  }

  getTicketClientRequests() {
    return this.http.get(`${this.baseUrl}ticket-client-requests`);
  }

  addTicketTypes(payload) {
    return this.http.post(
      `${this.baseUrl}ticketTypes`,
      JSON.stringify(payload)
    );
  }

  addTicketSource(payload) {
    return this.http.post(
      `${this.baseUrl}ticketSources`,
      JSON.stringify(payload)
    );
  }

  addTicketPriority(payload) {
    return this.http.post(
      `${this.baseUrl}ticketPriorities`,
      JSON.stringify(payload)
    );
  }

  addTicketStatus(payload) {
    return this.http.post(
      `${this.baseUrl}ticketStatus`,
      JSON.stringify(payload)
    );
  }

  addTicketClientRequests(payload) {
    return this.http.post(
      `${this.baseUrl}ticket-client-requests`,
      JSON.stringify(payload)
    );
  }

  editTicketTypes(id, payload) {
    return this.http.put(
      `${this.baseUrl}ticketTypes/${id}`,
      JSON.stringify(payload)
    );
  }

  editTicketSource(id, payload) {
    return this.http.put(
      `${this.baseUrl}ticketSources/${id}`,
      JSON.stringify(payload)
    );
  }

  editTicketPriority(id, payload) {
    return this.http.put(
      `${this.baseUrl}ticketPriorities/${id}`,
      JSON.stringify(payload)
    );
  }

  editTicketStatus(id, payload) {
    return this.http.put(
      `${this.baseUrl}ticketStatus/${id}`,
      JSON.stringify(payload)
    );
  }

  editTicketClientRequests(id, payload) {
    return this.http.put(
      `${this.baseUrl}ticket-client-requests/${id}`,
      JSON.stringify(payload)
    );
  }

  deleteTicketTypes(id) {
    return this.http.delete(`${this.baseUrl}ticketTypes/${id}`);
  }

  deleteTicketSource(id) {
    return this.http.delete(`${this.baseUrl}ticketSources/${id}`);
  }

  deleteTicketPriority(id) {
    return this.http.delete(`${this.baseUrl}ticketPriorities/${id}`);
  }

  deleteTicketStatus(id) {
    return this.http.delete(`${this.baseUrl}ticketStatus/${id}`);
  }

  deleteTicketClientRequests(id) {
    return this.http.delete(`${this.baseUrl}ticket-client-requests/${id}`);
  }

  reopenTicket(id) {
    return this.http.put(`${this.baseUrl}helpdesk/tickets/${id}/reopen`, {});
  }

  getTicketActivities(id) {
    return this.http.get(`${this.baseUrl}helpdesk/tickets/${id}/activities`);
  }

  getUserDepartments(id = null, is_for_head_assign = null) {
    return this.http.get(`${this.baseUrl}users/departments`, {
      params: {
        department_id: id || "",
        for_head_assign: is_for_head_assign || "",
      },
    });
  }

  addDepartment(payload) {
    return this.http.post(
      `${this.baseUrl}departments`,
      JSON.stringify(payload)
    );
  }

  getDepartments() {
    return this.http.get(`${this.baseUrl}departments`);
  }

  getApprovalRequestDepartments() {
    return this.http.get(`${this.baseUrl}helpdesk/approval/departments`);
  }

  getDepartment(id) {
    return this.http.get(`${this.baseUrl}departments/${id}`);
  }

  getTicketReservations(id) {
    return this.http.get(`${this.baseUrl}helpdesk/tickets/${id}/edit`);
  }

  editDepartment(id, payload) {
    return this.http.put(
      `${this.baseUrl}departments/${id}`,
      JSON.stringify(payload)
    );
  }

  /**
   * opens lead page
   */
  viewLead(leadId: number, readonly: boolean = true) {
    const ro = readonly ? 1 : 0;
    let url = this.router.serializeUrl(
      this.router.createUrlTree([`/pages/leads/${leadId}`], {
        queryParams: { ro: ro },
      })
    );
    window.open(url, "_blank");
  }

  /**
   * opens reservation page
   */
  viewReservation(reservationId: number, readonly: boolean = true) {
    const ro = readonly ? 1 : 0;
    let url = this.router.serializeUrl(
      this.router.createUrlTree(
        [`/pages/project/view-reservation/${reservationId}`],
        { queryParams: { ro: ro } }
      )
    );
    window.open(url, "_blank");
  }

  searchLeads(keyword, searchBy: "lead" | "rfid" | "unit_serial") {
    return this.http.get(
      `${this.baseUrl}helpdesk/leads/search?keyword=${keyword}`,
      {
        params: {
          search_by: searchBy,
        },
      }
    );
  }

  deleteTicket(id) {
    return this.http.delete(`${this.baseUrl}helpdesk/tickets/${id}`);
  }
}
