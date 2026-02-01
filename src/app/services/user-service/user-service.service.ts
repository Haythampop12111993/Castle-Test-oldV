import { environment } from "./../../../environments/environment";
import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { removeNullishFieldsParams } from "../../shared/object_helpers";

// user service

@Injectable()
export class UserServiceService {
  baseUrl: string = environment.api_base_url;

  version: any = "2.12.4";

  constructor(public http: HttpClient, public cookieService: CookieService) {}

  login(userData) {
    return this.http.post(`${this.baseUrl}login`, JSON.stringify(userData));
  }

  logout() {
    return new Promise<void>((resolve, reject) => {
      window.localStorage.clear();
      resolve();
    });
  }

  changePassword(data) {
    return this.http.post(
      `${this.baseUrl}accounts/change_password`,
      JSON.stringify(data)
    );
  }

  getCurrentReservationStatus() {
    return this.http.get(`${this.baseUrl}remote/config/reservation`);
  }

  changeReservationStatus(status) {
    return this.http.get(`${this.baseUrl}remote/config/reservation/${status}`);
  }

  getCurrentLeadCycle() {
    return this.http.get(`${this.baseUrl}remote/config/lead_cycle`);
  }

  changeLeadCycleStatus(status) {
    return this.http.get(`${this.baseUrl}remote/config/lead_cycle/${status}`);
  }

  private handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server   error";
    return Observable.throw(errMsg);
  }

  getAllActivites() {
    return this.http.get(`${this.baseUrl}leads/activities`);
  }

  getAllActivitesForLeadsFilter() {
    return this.http.get(`${this.baseUrl}leads/activities_for_filter`);
  }

  addActionToActivity(data) {
    return this.http.post(
      `${this.baseUrl}leads/activities/store`,
      JSON.stringify(data)
    );
  }

  editActionToAcitivity(id, payload) {
    return this.http.put(
      `${this.baseUrl}leads/activities/${id}/update`,
      JSON.stringify(payload)
    );
  }

  deleteAction(id) {
    return this.http.get(`${this.baseUrl}leads/activities/${id}/delete`);
  }

  exportUsers() {
    return this.http.get(`${this.baseUrl}users/export`);
  }

  addAmbasdor(data) {
    return this.http.post(
      `${this.baseUrl}ambassadors/store`,
      JSON.stringify(data)
    );
  }

  getAmbasdors(params?: any) {
    // paginate = false, keyword?
   params && (params = removeNullishFieldsParams(params));
    return this.http.get(`${this.baseUrl}ambassadors`, params);
  }

  editAmbassadors(id, data) {
    return this.http.put(
      `${this.baseUrl}ambassadors/${id}/update`,
      JSON.stringify(data)
    );
  }

  uploadAmbassadorDocument(
    ambassadorId,
    payload: {
      document_value: string;
      document_name: string;
      name: string;
    }
  ) {
    return this.http.post(
      `${this.baseUrl}ambassadors/${ambassadorId}/document`,
      JSON.stringify(payload)
    );
  }

  getAmbassadorCommissions(ambassadorId) {
    return this.http.get(
      `${this.baseUrl}ambassadors/${ambassadorId}/commission`
    );
  }

  updateAmbassadorCommissions(ambassadorId, payload) {
    return this.http.post(
      `${this.baseUrl}ambassadors/${ambassadorId}/commission`,
      payload
    );
  }

  deleteAmbassadorCommissions(ambassadorId, commissionId) {
    return this.http.delete(
      `${this.baseUrl}ambassadors/${ambassadorId}/commission/${commissionId}`
    );
  }

  getAmbassadorDocuments(ambassadorId) {
    return this.http.get(`${this.baseUrl}ambassadors/${ambassadorId}/document`);
  }

  deleteAmbassadorDocument(ambassadorId, document_id) {
    return this.http.delete(
      `${this.baseUrl}ambassadors/${ambassadorId}/document/${document_id}`
    );
  }

  addBroker(data) {
    return this.http.post(`${this.baseUrl}broker/store`, JSON.stringify(data));
  }

  uploadBrokerDocument(
    brokerId,
    payload: {
      document_value: string;
      document_name: string;
      name: string;
    }
  ) {
    return this.http.post(
      `${this.baseUrl}brokers/${brokerId}/document`,
      JSON.stringify(payload)
    );
  }

  getBrokerCommissions(brokerId) {
    return this.http.get(`${this.baseUrl}brokers/${brokerId}/commission`);
  }

  updateBrokerCommissions(brokerId, payload) {
    return this.http.post(
      `${this.baseUrl}brokers/${brokerId}/commission`,
      payload
    );
  }

  deleteBrokerCommissions(brokerId, commissionId) {
    return this.http.delete(
      `${this.baseUrl}brokers/${brokerId}/commission/${commissionId}`
    );
  }

  getBrokerDocuments(brokerId) {
    return this.http.get(`${this.baseUrl}brokers/${brokerId}/document`);
  }

  getBorkers(params = {}) {
    return this.http.get(`${this.baseUrl}broker`, { params });
  }

  deleteBrokerDocument(broker, document_id) {
    return this.http.delete(
      `${this.baseUrl}brokers/${broker}/document/${document_id}`
    );
  }

  getBrokersPaginated(params = {}) {
    return this.http.get(`${this.baseUrl}broker?paginate=1`, { params });
  }

  getBrokerById(id) {
    return this.http.get(`${this.baseUrl}brokers/${id}`);
  }

  addBrokerActiviry(id, payload = {}) {
    return this.http.post(`${this.baseUrl}brokers/${id}/activity`, payload);
  }

  editBroker(id, data) {
    return this.http.put(
      `${this.baseUrl}broker/${id}/update`,
      JSON.stringify(data)
    );
  }

  activeBroker(id, isActive) {
    return this.http.put(
      `${this.baseUrl}brokers/${id}/status/${isActive}`,
      null
    );
  }

  getBrokerIncentives(payload) {
    return this.http.get(`${this.baseUrl}broker_incentives`, {
      params: payload,
    });
  }

  addBrokerIncentive(payload) {
    return this.http.post(`${this.baseUrl}broker_incentives`, payload);
  }

  editBrokerIncentive(id, payload) {
    return this.http.put(`${this.baseUrl}broker_incentives/${id}`, payload);
  }

  deleteBrokerIncentive(id) {
    return this.http.delete(`${this.baseUrl}broker_incentives/${id}`);
  }

  get_incentive_users(broker_id) {
    return this.http.get(
      `${this.baseUrl}brokers/${broker_id}/get_incentive_users`
    );
  }

  assign_broker_incentive(reervation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${reervation_id}/assign_broker_incentive`,
      payload
    );
  }

  getPincode() {
    return this.http.get(`${this.baseUrl}remote/config/fetch/pin/cfo`);
  }

  changePinCode(data) {
    return this.http.post(
      `${this.baseUrl}remote/config/change/pin/cfo`,
      JSON.stringify(data)
    );
  }

  changeAvatar(data) {
    return this.http.put(
      `${this.baseUrl}profile/change_pic`,
      JSON.stringify(data)
    );
  }

  updateProfile(data) {
    return this.http.put(`${this.baseUrl}profile/update`, JSON.stringify(data));
  }

  getAllPaymentTerms(page?) {
    return this.http.get(
      `${this.baseUrl}payments?paginate=${true}&page=${page || 1}`
    );
  }

  filterPaymentTerms(data, page?) {
    console.log(data);
    const params = new HttpParams()
      .set("finishing_type_id", data.finishing_type_id.join())
      .set("phase_id", data.phase_id.join())
      .set("project_id", data.project_id)
      .set("status", data.status);
    return this.http.get(
      `${this.baseUrl}payments/filter?paginate=${true}&page=${page}`,
      { params }
    );
  }

  getPhases(params: any = {}) {
    return this.http.get(`${this.baseUrl}phase`, { params });
  }

  getPaymentTermsByProject(projectID) {
    return this.http.get(
      `${this.baseUrl}projects/get_payment_terms?project_id=${projectID}`
    );
  }

  getProjectPaymentTerms(payload) {
    return this.http.get(
      `${this.baseUrl}projects/get_payment_terms?project_id=${payload.project_id}&phase_id=${payload.phase_id}&finishing_type_id=${payload.finishing_type_id}`
    );
  }

  togglePaymentTerm(data) {
    return this.http.post(
      `${this.baseUrl}payments/change`,
      JSON.stringify(data)
    );
  }

  reportsStatus(data) {
    return this.http.post(
      `${this.baseUrl}reports/fill_status`,
      JSON.stringify(data)
    );
  }

  generateReport(data) {
    return this.http.post(
      `${this.baseUrl}reports/generate`,
      JSON.stringify(data)
    );
  }

  paginateReport(data, number) {
    return this.http.post(
      `${this.baseUrl}reports/generate?page=${number}`,
      JSON.stringify(data)
    );
  }

  getUserFingerPrint() {
    return this.http.get(`http://www.devpowerapi.com/fingerprint`);
  }

  getWallet() {
    return this.http.get(`${this.baseUrl}wallets`);
  }

  payWallet(wallet_id) {
    return this.http.put(`${this.baseUrl}wallets/collect_commission`, {
      wallet_id,
    });
  }

  getUsersWallets() {
    return this.http.get(`${this.baseUrl}users/wallets`);
  }

  getCurrentBalance() {
    return this.http.get(`${this.baseUrl}wallets/balance`);
  }

  filterWallet(data) {
    return this.http.get(`${this.baseUrl}wallets`, {
      params: data,
    });
  }

  editCommission(payload) {
    return this.http.put(
      `${this.baseUrl}wallets/edit_commission`,
      JSON.stringify(payload)
    );
  }

  infinit(url, params = {}) {
    return this.http.get(`${url}`, { params });
  }

  addReminder(payload) {
    return this.http.post(`${this.baseUrl}reminder_actions`, payload);
  }

  editReminder(id, payload) {
    return this.http.put(`${this.baseUrl}reminder_actions/${id}`, payload);
  }

  getAllReminders() {
    return this.http.get(`${this.baseUrl}reminder_actions`);
  }

  deleteReminder(id) {
    return this.http.delete(`${this.baseUrl}reminder_actions/${id}`);
  }

  // save version
  saveVersion(data) {
    return this.http.post(
      `${this.baseUrl}setting/version`,
      JSON.stringify(data)
    );
  }

  getVersion() {
    return this.http.get(`${this.baseUrl}setting/version`);
  }

  getDevelopers() {
    return this.http.get(`${this.baseUrl}developers`);
  }

  editDeveloper(id, data) {
    return this.http.put(
      `${this.baseUrl}developers/${id}`,
      JSON.stringify(data)
    );
  }

  addDeveloper(data) {
    return this.http.post(`${this.baseUrl}developers`, JSON.stringify(data));
  }

  getBanks() {
    return this.http.get(`${this.baseUrl}store_banks`);
  }

  addBank(data) {
    return this.http.post(`${this.baseUrl}store_banks`, JSON.stringify(data));
  }

  editBank(id, data) {
    return this.http.put(
      `${this.baseUrl}store_banks/${id}`,
      JSON.stringify(data)
    );
  }

  getAllCountries() {
    return this.http.get("https://countriesnow.space/api/v0.1/countries");
  }
}
