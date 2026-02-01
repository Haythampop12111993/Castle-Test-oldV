import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { HelperService } from "../shared/helper.service";

@Injectable()
export class EoiService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient, public helperService: HelperService) {}

  addEoi(payload) {
    return this.http.post(`${this.baseUrl}eois`, payload);
  }

  getEoi(id) {
    return this.http.get(`${this.baseUrl}eois/${id}`);
  }

  refundEOI(id, payload) {
    return this.http.put(
      `${this.baseUrl}eois/${id}/change_status/refund`,
      payload
    );
  }

  approveEoi(id) {
    return this.http.put(`${this.baseUrl}eois/${id}/change_status/approve`, {});
  }

  cancelEoi(id) {
    return this.http.put(`${this.baseUrl}eois/${id}/change_status/cancel`, {});
  }

  uploadEoiExcel(data) {
    return this.http.post(`${this.baseUrl}eois/import`, JSON.stringify(data));
  }

  private handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.satusText}`
      : "Server   error";
    return Observable.throw(errMsg);
  }

  exportEoi() {
    return this.http.get(`${this.baseUrl}eois/export`);
  }

  importEoi(payload) {
    return this.http.post(`${this.baseUrl}eois/import`, payload);
  }

  deleteEoi(id): Observable<any> {
    return this.http.get(`${this.baseUrl}eois/delete/${id}`);
  }

  downloadEoiDocument(id): Observable<any> {
    return this.http.post(
      `${this.baseUrl}eois/${id}/generate_eoi_file`, {})
  }

  changeConfirmationDate(id, data): Observable<any> {
    return this.http.post(
      `${this.baseUrl}eois/${id}/update_confirmation_date`,
      JSON.stringify(data)
    );
  }

  reAssignToLead(data): Observable<any> {
    return this.http.post(
      `${this.baseUrl}assign/lead/eoi`,
      JSON.stringify(data)
    );
  }

  editLeadInEoi(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}eois/update_lead_info/${id}`,
      JSON.stringify(payload)
    );
  }

  changeChannelSource(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}eois/${id}/change_channel_source`,
      payload
    );
  }

  reactivateEoi(id): Observable<any> {
    return this.http.put(`${this.baseUrl}eois/${id}/reactivate_eoi`, {});
  }

  changeDealType(payload): Observable<any> {
    return this.http.post(
      `${this.baseUrl}eois/change_division`,
      JSON.stringify(payload)
    );
  }

  changeAgentInCharge(eoi_id, payload): Observable<any> {
    return this.http.post(
      `${this.baseUrl}eois/${eoi_id}/change_agent_in_charge`,
      JSON.stringify(payload)
    );
  }

  changeOverseas(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}eois/${id}/change_overseas`,
      JSON.stringify(payload)
    );
  }

  changeSellingDate(id, payload): Observable<any> {
    return this.http.post(
      `${this.baseUrl}eois/${id}/change_selling_date`,
      JSON.stringify(payload)
    );
  }

  editSellingPrice(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}eois/${id}/change_selling_price`,
      JSON.stringify(payload)
    );
  }

  changePaymentType(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}eois/${id}/change_payment_type`,
      JSON.stringify(payload)
    );
  }

  cheque_recieved(eoi_id): Observable<any> {
    return this.http.get(`${this.baseUrl}eois/${eoi_id}/chequeRecieved`);
  }

  addEoiComment(eoi_id, comment): Observable<any> {
    return this.http.post(
      `${this.baseUrl}eois/${eoi_id}/comment`,
      JSON.stringify({ comment: comment })
    );
  }

  assignToLead(eoi_id, assign_user): Observable<any> {
    return this.http.get(
      `${this.baseUrl}assign/eoi/${eoi_id}/to/${assign_user}`
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

  getEoiStatuses() {
    return this.http.get(`${this.baseUrl}eois/get_statuses`);
  }

  filterEoi(data) {
    let qParam = this.helperService.removeNullQParams(data);

    return this.helperService.get(`eois`, qParam);
  }

  changeProject(eoi_id, payload) {
    return this.http.put(
      `${this.baseUrl}eois/${eoi_id}/change_project`,
      payload
    );
  }

  changeLinkedReservationEOI(eoi_id, payload) {
    return this.http.put(
      `${this.baseUrl}eois/${eoi_id}/change_linked_reservation`,
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

  editEoiInfo(id, payload): Observable<any> {
    return this.http.put(
      `${this.baseUrl}eois/update_eoi_info/${id}`,
      JSON.stringify(payload)
    );
  }
}
