import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { LeadActivity } from "../../dtos/leadActivity.viewmodel";
import { MockApi } from "../../dtos/mockapi";
import { environment } from "./../../../environments/environment";
import { removeNullishFieldsParams } from "../../shared/object_helpers";

// lead service

@Injectable()
export class LeadsService {
  private _addLeadUrl = "/api/leads/add";
  private _addLeadActivityUrl = "api/lead/leadActivity";
  private _changeStatusUrl = "api/lead/changeStatus";
  private _getLeadsUrl = "api/lead/getLeads";
  private _deleteLeadsUrl = "api/leads/";
  private _updateLeadUrl = "/api/leads/add";
  private _leadFilterUrl = "/api/leads/filter";
  private _leadSearchUrl = "/api/leads/search";
  baseUrl: string = environment.api_base_url;
  // baseUrl: string = 'http://192.168.8.100:8000/api/';

  constructor(private http: HttpClient, private mockapi: MockApi) {}

  add(lead, token): any {
    var error = "";
    let _options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer" + token,
      }),
    };
  }

  leadSource(): any {
    const _leadSourceData = [
      { value: "1", text: "Self Generate" },
      { value: "1", text: "Call Center" },
      { value: "1", text: "Office Walk-in" },
      { value: "1", text: "CIL" },
      { value: "1", text: "Facebook" },
      { value: "2", text: "Newspaper" },
      { value: "3", text: "Billboard" },
      { value: "4", text: "TV AD" },
      { value: "5", text: "ADWords" },
      { value: "6", text: "Youtube" },
      { value: "7", text: "Refferal" },
      { value: "8", text: "Expo booth" },
      { value: "9", text: "Event" },
      { value: "10", text: "Outdoor campaign" },
    ];
    return _leadSourceData;
  }

  agents(): any {
    const _agentData = [
      { value: "1", text: "Assign to an agent" },
      { value: "2", text: "Agent1" },
      { value: "3", text: "Agent2" },
      { value: "4", text: "Agent3" },
    ];
    return _agentData;
  }

  brokers(): any {
    const _brokerData = [
      { value: "1", text: "Select Broker" },
      { value: "2", text: "Broker1" },
      { value: "3", text: "Broker2" },
      { value: "4", text: "Broker3" },
    ];
    return _brokerData;
  }

  leadActivity(activity: LeadActivity): any {
    // return this.httpclient.post(`${this.baseUrl}leads/` + activity.leadId + `/add_activity`, JSON.stringify(activity), _options);
    //return this.http.post(this._addLeadActivityUrl, activity);
  }

  lstLeadActivity(): any {
    //return this.mockapi.getLeadActivityData();
  }

  status(): any {
    const _statusData = [
      { text: "All" },
      { text: "New" },
      { text: "Follow Up" },
      { text: "Closed" },
      { text: "Disqualified" },
    ];
    return _statusData;
  }

  getLeads(params?) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}leads`, { params });
  }

  uploadLeadsExcel(data): any {
    return this.http.post(`${this.baseUrl}leads/import`, JSON.stringify(data));
  }

  filterLeadByName(name) {
    const data = {
      keyword: name,
    };
    return this.http.get(`${this.baseUrl}leads?keyword=${name}`);
  }

  getLeadDetails(id) {
    return this.http.get(`${this.baseUrl}leads/${id}`);
  }

  addLeadActivity(lead_id, data) {
    return this.http.post(
      `${this.baseUrl}leads/${lead_id}/add_activity`,
      JSON.stringify(data)
    );
  }

  changeLeadStatus(lead_id, data) {
    return this.http.put(
      `${this.baseUrl}leads/${lead_id}/status`,
      JSON.stringify(data)
    );
  }

  assignALead(leadId, data) {
    return this.http.put(
      `${this.baseUrl}leads/${leadId}/assign`,
      JSON.stringify(data)
    );
  }

  editALead(leadId, data) {
    return this.http.put(
      `${this.baseUrl}leads/${leadId}`,
      JSON.stringify(data)
    );
  }

  addLeadComment(lead_id: number, payload: any) {
    return this.http.post(`${this.baseUrl}leads/${lead_id}/add_comment`, payload);
  }

  editLeadComment(lead_id: number, payload: any) {
    return this.http.put(`${this.baseUrl}leads/${lead_id}/edit_comment`, payload);
  }

  deleteLeadComment(lead_id: number, comment_id: number) {
    return this.http.delete(`${this.baseUrl}leads/${lead_id}/comments/${comment_id}`);
  }

  getNextLeads(): any {
    var data = this.mockapi.getNextLeads();
    return data;
  }
  postDocument(data, leadId): any {
    return this.http.put(
      `${this.baseUrl}leads/${leadId}/document`,
      JSON.stringify(data)
    );
  }

  infinit(url, params = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(url, { params });
  }

  infinteWithPaginated(url) {
    return this.http.get(`${url}&paginate=1`);
  }

  getEois() {
    return this.http.get(`${this.baseUrl}eois`);
  }

  getEoisDetails(eoiId) {
    return this.http.get(`${this.baseUrl}eois/${eoiId}`);
  }

  postEoi(data) {
    return this.http.post(`${this.baseUrl}eois`, JSON.stringify(data));
  }

  editEoi(id, data) {
    return this.http.put(`${this.baseUrl}eois/${id}`, JSON.stringify(data));
  }

  delete(id) {
    return this.http.delete(`${this.baseUrl}leads/${id}`);
  }

  forceDelete(id) {
    return this.http.post(`${this.baseUrl}leads/${id}/forceDelete`, {});
  }
  getGenders(): any {
    const _gender = [{ text: "Male" }, { text: "Female" }];
    return _gender;
  }

  update(lead) {
    return this.http.post(
      `${this.baseUrl}leads/` + lead.id,
      JSON.stringify(lead)
    );
  }

  createLead(lead) {
    return this.http.post(`${this.baseUrl}leads`, JSON.stringify(lead));
  }

  getAgents(params = {}) {
    return this.http.get(`${this.baseUrl}users/get_agents`, { params });
  }

  getPropertyConsultant() {
    return this.http.get(`${this.baseUrl}users/get_pc`);
  }

  getLoggedInUserRole(): any {
    var data = this.mockapi.getRole().find((item) => item.roleId == 3);
    return data;
  }

  getAgentsByRoleId(): any {
    return this.mockapi.getAgentsByRoleId();
  }

  getDocumnetTypes(): any {
    const _documnetType = [{ text: "passport" }, { text: "national" }];
    return _documnetType;
  }

  geLeadDocuments(id): any {
    return this.mockapi.getLeadDocumnets();
  }

  getLeadsByStatus(status): any {
    return this.http.get(`${this.baseUrl}leads/filter/` + status);
  }

  getLeadsBySearchString(keyword): any {
    return this.http.get(`${this.baseUrl}leads/search/` + keyword);
  }

  exportTable(params: any) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}eois/export`, { params } );
  }

  exportHoldTable(data) {
    let params = new HttpParams()
      .set("user_id", data.user_id)
      .set("status", data.status)
      .set("project_id", data.project_id)
      .set("lead_search", data.lead_search)
      .set("hold_number", data.hold_number)
      .set("is_export", "1");
    return this.http.get(`${this.baseUrl}hold/export`, { params });
  }

  exportAmbassadors() {
    return this.http.get(`${this.baseUrl}ambassadors/export`);
  }

  importAmbassadors(payload) {
    return this.http.post(
      `${this.baseUrl}ambassadors/import`,
      JSON.stringify(payload)
    );
  }

  searchAmbassador(keyword) {
    return this.http.get(
      `${this.baseUrl}ambassadors/search?keyword=${keyword}`
    );
  }

  importBrokers(payload) {
    return this.http.post(
      `${this.baseUrl}brokers/import`,
      JSON.stringify(payload)
    );
  }

  searchBroker(keyword) {
    return this.http.get(`${this.baseUrl}brokers/search?keyword=${keyword}`);
  }

  searchLeads(keyword) {
    return this.http.get(`${this.baseUrl}lead?keyword=${keyword}`);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server error";
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  filterLeadByAgent(agent_id) {
    return this.http.get(`${this.baseUrl}leads/filter/agent/${agent_id}`);
  }

  updateLeadBroker(payload) {
    return this.http.put(
      `${this.baseUrl}leads/change_broker`,
      JSON.stringify(payload)
    );
  }
  updateLeadTicketType(id, payload) {
    return this.http.put(`${this.baseUrl}leads/${id}/ticket_type`, payload);
  }
  exportLeads(params = {}) {
    // return this.http.get(`${this.baseUrl}leads/export`)
    return this.http.get(`${this.baseUrl}leads?is_export=1`, {
      params,
    });
  }

  changeAgentInCharge(id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${id}/change_agent_in_charge`,
      JSON.stringify(payload)
    );
  }

  getImportFiles() {
    return this.http.get(`${this.baseUrl}get_import_files`);
  }

  getImportFilesDetails(id) {
    return this.http.get(`${this.baseUrl}get_import_files/${id}`);
  }

  getImportFileDuplicates(id) {
    return this.http.get(`${this.baseUrl}get_import_files/${id}`);
  }

  getDuplicatedLeads(params?: any) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}duplicateLeads`, { params });
  }
  
  deleteDuplicatedLead(id) {
    return this.http.delete(`${this.baseUrl}duplicateLeads/${id}`);
  }

  getTrashedLeads() {
    return this.http.get(`${this.baseUrl}trashLeads`);
  }

  restoreTrashLead(id, payload) {
    return this.http.put(`${this.baseUrl}trashLeads/${id}`, payload);
  }

  indoorMeeting(id) {
    return this.http.put(`${this.baseUrl}leads/${id}/add_indoor_meeting`, {});
  }

  getLeadsByTodayActivities() {
    return this.http.get(`${this.baseUrl}leads/get_leads_need_activity/today`);
  }

  getLeadByPastActivities() {
    return this.http.get(`${this.baseUrl}leads/get_leads_need_activity/past`);
  }

  uploadContactsSheet(payload) {
    return this.http.post(`${this.baseUrl}cold_calls`, payload);
  }

  uploadComissionPerProject(project_id, payload) {
    return this.http.post(
      `${this.baseUrl}projects/${project_id}/commissions/import`,
      payload
    );
  }

  downloadComissionPerProject(project_id) {
    return this.http.get(
      `${this.baseUrl}projects/${project_id}/commissions/export`
    );
  }

  uploadComissionSettings(payload) {
    return this.http.post(`${this.baseUrl}commissions/import`, payload);
  }

  downloadComissionSettings() {
    return this.http.get(`${this.baseUrl}commissions/export`);
  }

  importTarget(year, payload) {
    return this.http.post(
      `${this.baseUrl}targets/years/${year}/import`,
      JSON.stringify(payload)
    );
  }

  getLeadReminder(id) {
    return this.http.get(`${this.baseUrl}leads/${id}/get_reminders`);
  }

  addLeadReminder(id, payload) {
    return this.http.post(`${this.baseUrl}leads/${id}/add_reminder`, payload);
  }

  toggleReminderRead(id) {
    return this.http.put(`${this.baseUrl}reminders/${id}/change_status`, {});
  }

  reassignAllLeads(payload) {
    if (payload.rotation_id) payload.rotation_id = Number(payload.rotation_id);
    return this.http.post(`${this.baseUrl}leads/reassign_leads`, payload);
  }

  deleteBulkLeads(payload) {
    return this.http.post(`${this.baseUrl}leads/bulk_delete`, payload);
  }

  getLeadStatuses(selectedChannel?, rangeDates?, selectedProject?) {
    let qP = `?`;
    qP += selectedChannel ? `channel_id=${selectedChannel.id}` : `channel_id=`;
    qP += rangeDates
      ? `&date_picker=${JSON.stringify(rangeDates)}`
      : "&date_picker=";
    qP += selectedProject
      ? `&project_id=${selectedProject.id}`
      : `&project_id=`;

    return this.http.get(`${environment.api_base_url}dashboard/stats${qP}`);
  }

  getTeams() {
    return this.http.get(`${environment.api_base_url}teams/get_my_teams`);
  }

  callLead(payload) {
    return this.http.post(
      `${environment.api_base_url}callCenter-makeCall`,
      payload
    );
  }

  getCallCenterScript() {
    return this.http.get(`${this.baseUrl}get_call_center_script`);
  }

  setCallCenterScript(payload = {}) {
    return this.http.post(`${this.baseUrl}set_call_center_script`, payload);
  }

  getClientStatements(id: number, is_export: number = null) {
    let url = `${this.baseUrl}clients/account_statement/${id}`;
    if (is_export) url += `?is_export=1`;
    return this.http.get(url);
  }

  addNewBlockList(payload) {
    return this.http.post(`${this.baseUrl}blockLists`, payload);
  }

  getBlockList() {
    return this.http.get(`${this.baseUrl}blockLists`);
  }

  editBlockList(id, payload) {
    return this.http.put(`${this.baseUrl}blockLists/${id}`, payload);
  }

  deleteBlockList(id) {
    return this.http.delete(`${this.baseUrl}blockLists/${id}`);
  }

  addLeadToBlockList(id) {
    return this.http.put(`${this.baseUrl}add_lead_to_block_list/${id}`, {});
  }

  removeLeadFromBlockList(id) {
    return this.http.put(`${this.baseUrl}remove_lead_block_list/${id}`, {});
  }

  mergeDuplicateLeads(payload): Observable<any> {
    return this.http.post(`${this.baseUrl}merge-duplicateLeads`, payload);
  }

  reAssignDuplicateLeads(payload): Observable<any> {
    payload = removeNullishFieldsParams(payload);
    return this.http.post(`${this.baseUrl}reAssign-duplicateLeads`, payload);
  }

  deleteDuplicateLeads(payload): Observable<any> {
    return this.http.post(`${this.baseUrl}delete-duplicateLeads`, payload);
  }

  getManagers() {
    return this.http.get(`${this.baseUrl}users/get_managers`);
  }
}
