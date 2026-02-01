import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { HelperService } from '../services/shared/helper.service';
import { environment } from "./../../environments/environment";

@Injectable()
export class HoldService {

  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient, public helperService: HelperService) {}

  addHold(payload) {
    return this.http.post(`${this.baseUrl}hold`, payload);
  }

  getAllUnints() {
    return this.http.get(`${this.baseUrl}units`);
  }
  
  getUnintDetails(id) {
    return this.http.get(`${this.baseUrl}units/${id}`);
  }

  getHold(id) {
    return this.http.get(`${this.baseUrl}hold/${id}`);
  }
  getAllHold() {
    return this.http.get(`${this.baseUrl}hold`);
  }

  getUnitsByProjectId(project_id){
    return this.http.get(`${this.baseUrl}units/availableUnits/${project_id}`)
  }
  
  getAllProjects() {
    return this.http.get(`${this.baseUrl}projects`);
  }
  
  cashCollected(id) {
    return this.http.put(`${this.baseUrl}hold/${id}/change_status/approve`, {});
  }

  cancelHold(id) {
    return this.http.put(`${this.baseUrl}hold/${id}/change_status/cancel`, {});
  }

  reserveHold(id) {
    return this.http.post(`${this.baseUrl}hold/${id}/reserve`, {});
  }


  uploadHoldExcel(data) {
    return this.http.post(`${this.baseUrl}hold/import`, JSON.stringify(data));
  }

  private handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.satusText}`
      : "Server   error";
    return Observable.throw(errMsg);
  }

  exportHold() {
    return this.http.get(`${this.baseUrl}hold/export`);
  }

  importHold(payload) {
    return this.http.post(`${this.baseUrl}hold/import`, payload);
  }

  deleteHold(id): Observable<any> {
    return this.http.get(`${this.baseUrl}hold/delete/${id}`);
  }

  downloadHoldDocument(id): Observable<any> {
    return this.http.post(
      `${this.baseUrl}hold/${id}/generate_hold_file`, {})

  }

  changeExpirationDate(id, data): Observable<any> {
    return this.http.post(
      `${this.baseUrl}hold/${id}/change_expiration_date`,
      JSON.stringify(data)
    );
  }

  reAssignToLead(data): Observable<any> {
    return this.http.post(
      `${this.baseUrl}assign/lead/hold`,
      JSON.stringify(data)
    );
  }

  editLeadInHold(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}hold/update_lead_info/${id}`,
      JSON.stringify(payload)
    );
  }

  changeChannelSource(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}hold/${id}/change_channel_source`,
      payload
    );
  }

  reactivateHold(id): Observable<any> {
    return this.http.put(`${this.baseUrl}hold/${id}/reactivate_hold`, {});
  }

  changeDealType(payload): Observable<any> {
    return this.http.post(
      `${this.baseUrl}hold/change_division`,
      JSON.stringify(payload)
    );
  }

  changeAgentInCharge(hold_id, payload): Observable<any> {
    return this.http.post(
      `${this.baseUrl}hold/${hold_id}/change_agent_in_charge`,
      JSON.stringify(payload)
    );
  }

  changeOverseas(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}hold/${id}/change_overseas`,
      JSON.stringify(payload)
    );
  }

  editSellingPrice(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}hold/${id}/change_selling_price`,
      JSON.stringify(payload)
    );
  }

  changePaymentType(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}hold/${id}/change_payment_type`,
      JSON.stringify(payload)
    );
  }


  addHoldComment(hold_id, comment): Observable<any> {
    return this.http.post(
      `${this.baseUrl}hold/${hold_id}/comment`,
      JSON.stringify({ comment: comment })
    );
  }

  assignToAgent(hold_id, assign_user): Observable<any> {
    return this.http.get(
      `${this.baseUrl}assign/hold/${hold_id}/to/${assign_user}`
    );
  }

  addPaymentType(payload) {
    return this.http.post(
      `${this.baseUrl}settings/add_payment_type/eoi`,
      payload
    );
  }

  getPaymentTypes() {
    return this.http.get(`${this.baseUrl}settings/get_payment_types/eoi`);
  }

  getHoldStatuses() {
    return this.http.get(`${this.baseUrl}hold/get_statuses`);
  }

  filterHold(data) {
    let qParam = this.helperService.removeNullQParams(data);

    return this.helperService.get(`hold`, qParam);
  }

  changeUnit(hold_id, payload) {
    return this.http.put(
      `${this.baseUrl}hold/${hold_id}/change_unit`,
      payload
    );
  }

  changeLinkedReservationHold(hold_id, payload) {
    return this.http.put(
      `${this.baseUrl}hold/${hold_id}/change_linked_reservation`,
      payload
    );
  }

  deletePaymentType(payment_id) {
    return this.http.delete(
      `${this.baseUrl}settings/payment_types/${payment_id}`
    );
  }

  editPaymentType(payment_id, payload) {
    return this.http.put(
      `${this.baseUrl}settings/payment_types/${payment_id}`,
      payload
    );
  }

  editHoldInfo(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}hold/update_hold_info/${id}`,
      JSON.stringify(payload)
    );
  }

}
