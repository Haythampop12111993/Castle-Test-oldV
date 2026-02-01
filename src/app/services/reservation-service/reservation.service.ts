import { HttpParams } from "@angular/common/http";
import { Lead } from "./../../dtos/lead.viewmodel";
import { environment } from "./../../../environments/environment";
import { Injectable, Injector } from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { removeNullishFieldsParams } from "../../shared/object_helpers";

@Injectable()
export class ReservationService {
  baseUrl: string = environment.api_base_url;
  // baseUrl: string = 'http://192.168.8.100:8000/api/';

  constructor(private http: HttpClient) {}

  getReservations(): any {
    return this.http.get(`${this.baseUrl}reservations`);
  }

  getTotalUnitPrice(params = {}) {
    return this.http.get(`${this.baseUrl}get_reservations_price`, { params });
  }

  getFilteredTotalUnitPrice(params) {
    return this.http.get(`${this.baseUrl}get_reservations_price`, {
      params: params,
    });
  }

  postReservation(data) {
    return this.http.post(`${this.baseUrl}reservations`, JSON.stringify(data));
  }

  filterLeadByName(name, token) {
    let data = {
      keyword: name,
    };
    console.log(data);
    return this.http.post(
      `${this.baseUrl}reservations/search`,
      JSON.stringify(data)
    );
  }

  blockUnitAtReservation(id) {
    return this.http.put(`${this.baseUrl}blocks/${id}/temp_block`, {});
  }

  // accountantAcceptReservation(id){
  //   return this.http.put(`${this.baseUrl}reservations/request/${id}/accept`, {});
  // }

  accountDeclineReservation(id) {
    return this.http.put(
      `${this.baseUrl}reservations/request/accountant/${id}/decline`,
      {}
    );
  }

  adminDeclineReservations(id) {
    return this.http.put(
      `${this.baseUrl}reservations/request/${id}/decline`,
      {}
    );
  }

  getAllContractsTempaltes() {
    return this.http.get(`${this.baseUrl}contracts_templates`);
  }

  getContractsTemplates(project_id?) {
    if (project_id) {
      return this.http.get(
        `${this.baseUrl}contracts_templates?parentsOnly=true&project_id=${project_id}`
      );
    } else {
      return this.http.get(
        `${this.baseUrl}contracts_templates?parentsOnly=true`
      );
    }
  }

  addContractTemplate(payload) {
    return this.http.post(`${this.baseUrl}contracts_templates`, payload);
  }

  getContractData(id) {
    return this.http.get(`${this.baseUrl}contracts_templates/${id}`);
  }

  updateContractdata(id, payload) {
    return this.http.put(`${this.baseUrl}contracts_templates/${id}`, payload);
  }

  deleteContract(id) {
    return this.http.delete(`${this.baseUrl}contracts_templates/${id}`);
  }

  contractorApproved(data) {
    return this.http.post(
      `${this.baseUrl}reservations/request/contractor/accept`,
      JSON.stringify(data)
    );
  }

  unblock(unit_id) {
    return this.http.get(`${this.baseUrl}unblock/unit/${unit_id}`);
  }

  adminDecline(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/request/${reservation_id}/decline`,
      payload
    );
  }

  filterReservations(params) {
    return this.http.get(`${this.baseUrl}reservations/filter/unit`, { params });
  }

  filterReservationsByLeadId(lead_id) {
    return this.http.get(
      `${this.baseUrl}reservations/lead_reservaions/${lead_id}`
    );
  }

  exportTable(data) {
    data.agents? (data.agents = data.agents.join()) : null;
    data.brokers? (data.brokers = data.brokers.join()) : null;
    data.overseas? (data.overseas = data.overseas.join()) : null;
    data.event_ids? (data.event_ids = data.event_ids.join()) : null;
    data.cheques? (data.cheques = data.cheques.join()) : null;
    data['is_export'] = '1';
    let params = removeNullishFieldsParams(data);
    return this.http.get(`${this.baseUrl}reservations/filter/unit`, { params });
  }

  exportPaymentCollectionsTable(data) {
    let params = new HttpParams();

    if (data.filter_project_id)
      params = params.set("filter_project_id", data.filter_project_id);
    if (data.filter_status)
      params = params.set("filter_status", data.filter_status);
    if (data.filter_lead) params = params.set("filter_lead", data.filter_lead);
    if (data.filter_reservation)
      params = params.set("filter_reservation", data.filter_reservation);
    if (data.filter_unit) params = params.set("filter_unit", data.filter_unit);
    if (data.filter_bank_id)
      params = params.set("filter_bank_id", data.filter_bank_id);
    if (data.filter_cheque_number)
      params = params.set("filter_cheque_number", data.filter_cheque_number);
    if (data.filter_date_from) {
      params = params.set("filter_date_from", data.filter_date_from);
    }
    if (data.filter_date_to) {
      params = params.set("filter_date_to", data.filter_date_to);
    }
    params = params.set("is_export", "1");
    return this.http.get(`${this.baseUrl}paymentCollections`, {
      params: params,
    });
  }
  exportAllPaymentCollectionsTable() {
    return this.http.get(`${this.baseUrl}paymentCollections/export/all`);
  }

  infinitWithPagination(url, params) {
    return this.http.get(`${url}`, { params });
  }

  assignToLead(res_id, assign_user) {
    return this.http.get(
      `${this.baseUrl}assign/reservation/${res_id}/to/${assign_user}`
    );
  }

  deleteReservation(res_id) {
    return this.http.get(`${this.baseUrl}reservations/delete/${res_id}`);
  }

  installmentPdf(data) {
    return this.http.post(
      `${this.baseUrl}generate/reservation/installments/pdf`,
      JSON.stringify(data)
    );
  }

  getContract(reservation_id) {
    return this.http.get(
      `${this.baseUrl}contracts/${reservation_id}/show_contract`
    );
  }
  generateContract(data) {
    return this.http.post(
      `${this.baseUrl}contracts/generate_contract`,
      JSON.stringify(data)
    );
  }

  contract_sign_by_client(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/request/contract/${reservation_id}`,
      JSON.stringify(payload)
    );
  }

  contract_approve(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/request/contract/${reservation_id}/approve`,
      JSON.stringify(payload)
    );
  }

  contract_delivered(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/request/contract/${reservation_id}/delivered`,
      JSON.stringify(payload)
    );
  }

  cheque_recieved(reservation_id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/request/contract/${reservation_id}/chequeRecieved`,
      data
    );
  }

  cancel_cheque_recieved(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/cancel_cheque_recieved`,
      {}
    );
  }

  addReservationComment(reservation_id, comment) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/comment`,
      JSON.stringify({ comment: comment })
    );
  }

  changeSignatureDate(id, date) {
    return this.http.post(
      `${this.baseUrl}reservations/request/contract/${id}/change`,
      JSON.stringify(date)
    );
  }

  editSellingPrice(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_selling_price`,
      JSON.stringify(data)
    );
  }

  changeSellingDate(id, data) {
    return this.http.post(
      `${this.baseUrl}reservations/request/contract/${id}/change_selling_date`,
      JSON.stringify(data)
    );
  }

  changeSellingPrice(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_unit_price`,
      data
    );
  }

  changeConfirmationDate(id, data) {
    return this.http.post(
      `${this.baseUrl}reservations/${id}/update_confirmation_date`,
      JSON.stringify(data)
    );
  }

  accountantApprove(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/request/${id}/accept`,
      JSON.stringify(data)
    );
  }

  // bank transfer
  getBankTransfer(id) {
    return this.http.get(
      `${this.baseUrl}reservations/${id}/get_bank_transfers`
    );
  }

  addBankTransfer(id, data) {
    return this.http.post(
      `${this.baseUrl}reservations/${id}/add_bank_transfer`,
      data
    );
  }

  importReservation(data) {
    return this.http.post(
      `${this.baseUrl}reservation/import`,
      JSON.stringify(data)
    );
  }

  reAssignToLead(data) {
    return this.http.post(
      `${this.baseUrl}assign/lead/reservation`,
      JSON.stringify(data)
    );
  }

  getSingleReservation(id) {
    return this.http.get(`${this.baseUrl}reservations/${id}`);
  }

  changeDealType(data) {
    return this.http.post(
      `${this.baseUrl}reservations/change_division`,
      JSON.stringify(data)
    );
  }

  changeEvent(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_event`,
      data
    );
  }

  makeCommission(id, date) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/commission`,
      JSON.stringify(date)
    );
  }

  makeClaim(id, payload) {
    return this.http.put(`${this.baseUrl}reservations/${id}/claim`, payload);
  }

  getProjects(params?: any) {
    return this.http.get(`${this.baseUrl}list_projects`,{params});
  }

  assign_payment_term(data): any {
    return this.http.put(
      `${this.baseUrl}projects/assign_payment_term`,
      JSON.stringify(data)
    );
  }

  changeGarageSlots(data) {
    return this.http.post(
      `${this.baseUrl}change_garage/slots`,
      JSON.stringify(data)
    );
  }

  changeExtraGarageSlots(data) {
    return this.http.post(
      `${this.baseUrl}change_extra_garage/slots`,
      JSON.stringify(data)
    );
  }

  changeStorageSlots(data) {
    return this.http.post(
      `${this.baseUrl}change_storage/slots`,
      JSON.stringify(data)
    );
  }

  addContractLog(data) {
    return this.http.post(
      `${this.baseUrl}contracts/save_log`,
      JSON.stringify(data)
    );
  }

  changeOverseas(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_overseas`,
      JSON.stringify(data)
    );
  }

  changePaymentType(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_payment_type`,
      JSON.stringify(data)
    );
  }
  changePaymentTerm(id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_payment_term`,
      JSON.stringify(data)
    );
  }

  generateReservationForAgent() {
    return this.http.get(`${this.baseUrl}generate/reservations/pdf`);
  }

  getGeneralSettings() {
    return this.http.get(`${this.baseUrl}remote/config/general_settings`);
  }

  updateGeneralSettings(payload) {
    return this.http.put(
      `${this.baseUrl}remote/config/general_settings`,
      JSON.stringify(payload)
    );
  }

  editLeadInReservation(id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/update_lead_info/${id}`,
      JSON.stringify(payload)
    );
  }

  cancelReservationReasonDate(id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/cancel_reason_date/${id}`,
      JSON.stringify(payload)
    );
  }

  reactivateReservation(id) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/reactivate_reservation`,
      {}
    );
  }

  changeContractType(id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/change_contract`,
      payload
    );
  }

  getSharedComissions(id) {
    return this.http.get(`${this.baseUrl}reservations/${id}/sharedCommission`);
  }

  addShareComission(id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${id}/sharedCommission`,
      payload
    );
  }

  sentOverSeaContract(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/send_contract/${reservation_id}`,
      payload
    );
  }

  getAllPaymentCollections() {
    return this.http.get(`${this.baseUrl}paymentCollections`);
  }

  getSinglePaymentCollection(id) {
    return this.http.get(`${this.baseUrl}paymentCollections/showPayment/${id}`);
  }

  getPaymentCollectionForAReservation(reservation_id) {
    return this.http.get(`${this.baseUrl}paymentCollections/${reservation_id}`);
  }

  getReservationFines(params = {}) {
    return this.http.get(`${this.baseUrl}fines`, {
      params: removeNullishFieldsParams(params),
    });
  }

  updatePaymentCollectionStatus(collection_id, status) {
    return this.http.put(
      `${this.baseUrl}paymentCollections/${collection_id}`,
      status
    );
  }

  completeDownPayment(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/complete_down_payment`,
      payload
    );
  }

  addDocument(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/document`,
      payload
    );
  }

  getReservationDocuments(reservation_id) {
    return this.http.get(
      `${this.baseUrl}reservations/${reservation_id}/document`
    );
  }

  deleteReservationDocument(reservation_id, id) {
    return this.http.delete(
      `${this.baseUrl}reservations/${reservation_id}/document/${id}`
    );
  }

  cancelSendOverseasContract(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/cancel_send_overseas_contract`,
      {}
    );
  }

  cancelContractReview(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/cancel_contract_review`,
      {}
    );
  }

  cancelContractSignedByClient(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/cancel_contract_signed_by_client`,
      {}
    );
  }

  cancelContractApprove(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/cancel_contract_approve`,
      {}
    );
  }

  cancelContractDelivered(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/cancel_contract_delivered`,
      {}
    );
  }

  contractToBeDelivered(reservation_id) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/contract_to_be_delivered`,
      {}
    );
  }

  downloadReservation(reservation_id) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/generate_reservation_file`,
      {}
    );
  }

  exportFinalPaymentPlan(reservation_id) {
    return this.http.get(
      `${this.baseUrl}paymentCollections/${reservation_id}/export`,
      {
        responseType: "text",
      }
    );
  }

  importFinalPaymentPlan(
    reservation_id,
    fileObj: { file_name: string; file: string }
  ) {
    return this.http.put(
      `${this.baseUrl}paymentCollections/${reservation_id}/import`,
      fileObj
    );
  }

  cancelComissions(id) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/cancel_commission`,
      {}
    );
  }

  cancelExtraDiscount(id) {
    return this.http.put(
      `${this.baseUrl}reservations/${id}/cancel_extra_discount`,
      {}
    );
  }

  printFinalPaymentPlan(id) {
    return this.http.get(`${this.baseUrl}paymentCollections/${id}/print_final`);
  }

  variablesContracts() {
    return this.http.get(`${this.baseUrl}contracts_templates/get_variables`);
  }

  deleteFinalPaymentPlanCollection(id) {
    return this.http.delete(`${this.baseUrl}paymentCollections/${id}`);
  }
  addLead(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/add_lead`,
      payload
    );
  }
  deleteLead(reservation_id, lead_id) {
    return this.http.delete(
      `${this.baseUrl}reservations/${reservation_id}/delete_lead/${lead_id}`
    );
  }

  // events apis

  getAllActivitesForLeadsFilter() {
    return this.http.get(`${this.baseUrl}leads/activities_for_filter`);
  }

  addEvent(data) {
    return this.http.post(`${this.baseUrl}leads/events`, JSON.stringify(data));
  }

  editEvent(id, payload) {
    return this.http.put(
      `${this.baseUrl}leads/events/${id}`,
      JSON.stringify(payload)
    );
  }

  deleteEvent(id) {
    return this.http.delete(`${this.baseUrl}leads/events/${id}`);
  }
  getAllEventsPaginated(page?) {
    return this.http.get(
      `${this.baseUrl}leads/events?paginate=${true}&page=${page || 1}`
    );
  }
  getAllEvents() {
    return this.http.get(`${this.baseUrl}leads/events`);
  }

  getUnitsByProject(project_id): Observable<any> {
    return this.http.get(
      `${this.baseUrl}units/availableUnitsByProject/${project_id}`
    );
  }

  // cheques book
  printCheques(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/print_cheques`,
      payload
    );
  }

  enableOrDisableReminderCheque(id, payload) {
    return this.http.put(
      `${this.baseUrl}paymentCollections/${id}/change_reminder_status`,
      payload
    );
  }

  uploadScannedCheque(id, payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/${id}/upload_scanned_cheques`,
      payload
    );
  }

  hideOrShowCheque(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}paymentCollections/${reservation_id}/change_print_status`,
      payload
    );
  }
  // payment-collections

  getbanks() {
    return this.http.get(`${this.baseUrl}banks`);
  }

  filterPaymentCollections(params = {}) {
    return this.http.get(`${this.baseUrl}paymentCollections`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getPaymentCollectionStats(params) {
    return this.http.get(`${this.baseUrl}paymentCollections/cards/get_stats`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getReservationTickets(reservation_id) {
    return this.http.get(
      `${this.baseUrl}reservations/tickets/${reservation_id}`
    );
  }

  getAllRejectReasons() {
    return this.http.get(`${this.baseUrl}settings/paymentRejectReasons`);
  }

  infiniPaymentsWithPagination(url, data) {
    let params = new HttpParams();

    if (data.filter_project_id)
      params = params.set("filter_project_id", data.filter_project_id);
    if (data.filter_status)
      params = params.set("filter_status", data.filter_status);
    if (data.filter_lead) params = params.set("filter_lead", data.filter_lead);
    if (data.filter_reservation)
      params = params.set("filter_reservation", data.filter_reservation);
    if (data.filter_unit) params = params.set("filter_unit", data.filter_unit);
    if (data.filter_bank_id)
      params = params.set("filter_bank_id", data.filter_bank_id);
    if (data.filter_cheque_number)
      params = params.set("filter_cheque_number", data.filter_cheque_number);
    if (data.filter_date_from) {
      params = params.set("filter_date_from", data.filter_date_from);
    }
    if (data.filter_date_to) {
      params = params.set("filter_date_to", data.filter_date_to);
    }
    return this.http.get(`${url}`, { params });
  }

  importPayment(data) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/import/bulk`,
      JSON.stringify(data)
    );
  }

  importFines(data) {
    return this.http.post(
      `${this.baseUrl}fines/import/bulk`,
      JSON.stringify(data)
    );
  }

  collectCheque(id, payload, filter_data = null) {
    if (filter_data) {
      // let params = new HttpParams();

      // if(filter_data.filter_project_id)
      //   params = params.set('filter_project_id', filter_data.filter_project_id);
      // if(filter_data.filter_status)
      //   params = params.set('filter_status', filter_data.filter_status)
      // if(filter_data.filter_lead)
      //   params = params.set('filter_lead', filter_data.filter_lead)
      // if(filter_data.filter_reservation)
      //   params = params.set('filter_reservation', filter_data.filter_reservation)
      // if(filter_data.filter_unit)
      //   params = params.set('filter_unit', filter_data.filter_unit)
      // if(filter_data.filter_bank_id)
      //   params = params.set('filter_bank_id', data.filter_bank_id)
      // if(filter_data.filter_cheque_number)
      //   params = params.set('filter_cheque_number', filter_data.filter_cheque_number)
      // if(filter_data.filter_date_from) {
      //   params = params.set('filter_date_from', filter_data.filter_date_from);
      // }
      // if(filter_data.filter_date_to) {
      //   params = params.set('filter_date_to', filter_data.filter_date_to);
      // }
      return this.http.post(`${this.baseUrl}paymentCollections/${id}/collect`, {
        ...payload,
        ...filter_data,
      });
    } else {
      return this.http.post(
        `${this.baseUrl}paymentCollections/${id}/collect`,
        payload
      );
    }
  }

  submitAcknowledgmentForm(url, id, payload) {
    return this.http.post(`${this.baseUrl}forms/${id}/${url}`, payload);
  }

  uploadScannedFiles(reservation_id, document_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/document/${document_id}/scan`,
      payload
    );
  }

  applyScanned(reservation_id: number, document_id: number) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/document/${document_id}/apply_scan`,
      {}
    );
  }

  updateBulkPaymentCollections(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/bulkChange`,
      payload
    );
  }

  BulkSendToTreasuryPaymentCollections(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/send_to_treasury`,
      payload
    );
  }

  ApproveTreasuryPaymentCollections(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/treasury_approve`,
      payload
    );
  }

  collectChequeFine(id, payload, filter_data = null) {
    if (filter_data) {
      return this.http.post(`${this.baseUrl}fines/${id}/collect`, {
        ...payload,
        ...filter_data,
      });
    } else {
      return this.http.post(`${this.baseUrl}fines/${id}/collect`, payload);
    }
  }

  addCDB(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/${reservation_id}/add_cdb_amount`,
      payload
    );
  }

  addDelayFine(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}fines/${reservation_id}/store_delay_fine`,
      payload
    );
  }

  deleteReservationFine(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}fines/${reservation_id}/delete`,
      payload
    );
  }

  deleteCheque(payload) {
    return this.http.post(`${this.baseUrl}paymentCollections/delete`, payload);
  }

  addCheque(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/${reservation_id}/add_cheque`,
      payload
    );
  }

  resetAccountantApprove(reservation_id) {
    return this.http.post(
      `${this.baseUrl}reservations/request/${reservation_id}/reset_accountant_approve`,
      {}
    );
  }

  addOldCustomer(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${reservation_id}/assign_lead`,
      payload
    );
  }

  deleteOldCustomer(reservation_id, id) {
    return this.http.delete(
      `${this.baseUrl}reservations/${reservation_id}/delete_old_lead/${id}`
    );
  }

  updateOldCustomer(reserevation_id, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${reserevation_id}/update_old_lead_info/${data.id}`,
      JSON.stringify(data)
    );
  }

  changeBasement(data) {
    return this.http.post(
      `${this.baseUrl}reservations/change_basement`,
      JSON.stringify(data)
    );
  }

  addLegalAction(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/update_last_legal_info/${reservation_id}`,
      payload
    );
  }

  makePaymentRequests(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/payment_request`,
      payload
    );
  }

  getAllCurrencies() {
    return this.http.get(`${this.baseUrl}paymentCollections/currencies/get`);
  }

  getERPLogs(params = {}) {
    return this.http.get(`${this.baseUrl}failed-erp-request`, {
      params: removeNullishFieldsParams(params),
    });
  }

  sendFailedERPRequest(id) {
    return this.http.put(`${this.baseUrl}failed-erp-request/${id}`, {});
  }

  changeBulkStatus(payload, params = {}) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/bulkChangeStatus`,
      payload,
      { params }
    );
  }

  addOwnerShip(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservation/${reservation_id}/ownership_transfer_requests`,
      payload
    );
  }

  getOwnershipTransfers(reservation_id) {
    return this.http.get(
      `${this.baseUrl}ownership_transfers/${reservation_id}`
    );
  }

  getOwnershipTransfersRequests(reservation_id) {
    return this.http.get(
      `${this.baseUrl}reservation/${reservation_id}/ownership_transfer_requests`
    );
  }

  reactivateOwnerTransferRequest(transfer_request_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfer_requests/reactive_request/${transfer_request_id}`,
      payload
    );
  }

  approvePaymentOwnerTransferRequest(transfer_request_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfer_requests/approve_payments/${transfer_request_id}`,
      payload
    );
  }

  approveCustomerOwnerTransferRequest(transfer_request_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfer_requests/approve_customer/${transfer_request_id}`,
      payload
    );
  }

  deleteOwnershipTransferRequest(reservation_id, transfer_request_id) {
    return this.http.delete(
      `${this.baseUrl}reservation/${reservation_id}/ownership_transfer_requests/${transfer_request_id}`
    );
  }

  rejectOwnershipTransferRequest(reservation_id, transfer_request_id) {
    return this.http.post(
      `${this.baseUrl}ownership_transfer_requests/reject_request/${transfer_request_id}`,
      {}
    );
  }

  OwnershipContractReview(ownership_id, data) {
    return this.http.post(
      `${this.baseUrl}ownership_transfers/contractor/accept/${ownership_id}`,
      JSON.stringify(data)
    );
  }

  ownerShipCancelContractReview(ownership_id) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/cancel_contract_review/${ownership_id}`,
      {}
    );
  }

  ownerContractSignedByClient(ownership_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfers/client_signature/${ownership_id}`,
      JSON.stringify(payload)
    );
  }

  ownershipReservationFormSignedSubmit(ownership_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfers/reservation_form_signed/${ownership_id}`,
      JSON.stringify(payload)
    );
  }

  ownershipCancelContractSignedByClient(ownership_id) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/cancel_contract_signed_by_client/${ownership_id}`,
      {}
    );
  }

  ownershipContractApprove(ownership_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfers/approve/${ownership_id}`,
      JSON.stringify(payload)
    );
  }

  ownershipCancelContractApprove(ownership_id) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/cancel_contract_approve/${ownership_id}`,
      {}
    );
  }

  ownershipContractDilevered(ownership_id, payload) {
    return this.http.post(
      `${this.baseUrl}ownership_transfers/delivered/${ownership_id}`,
      JSON.stringify(payload)
    );
  }

  ownershipCancelContractDelivered(ownership_id) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/cancel_contract_delivered/${ownership_id}`,
      {}
    );
  }

  ownershipSendCourierDate(ownership_id, payload) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/send_by_courier/${ownership_id}`,
      payload
    );
  }

  ownershipReceviedFromCourier(ownership_id, payload) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/received_from_courier/${ownership_id}`,
      payload
    );
  }

  ownershipPrintPaymentPlan(ownership_id) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/print_payment_plan/${ownership_id}`,
      {}
    );
  }

  ownershipActionChequeRecieved(ownership_id, data) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/cheque_received/${ownership_id}`,
      data
    );
  }

  ownershipCancelChequeRecieved(ownership_id) {
    return this.http.put(
      `${this.baseUrl}ownership_transfers/cancel_cheque_received/${ownership_id}`,
      {}
    );
  }

  makePaymkentUnderCollection(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/make_under_collection`,
      payload
    );
  }

  approvePendingCollected(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/approve_pending_collected`,
      payload
    );
  }

  rejectPendingCollected(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/reject_pending_collected`,
      payload
    );
  }

  reservation_form_signed(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/request/reservation_form_signed/${reservation_id}`,
      JSON.stringify(payload)
    );
  }

  changeGrantCommission(reservation, data) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation}/change_grant_commission`,
      JSON.stringify(data)
    );
  }

  changeSlots(data) {
    return this.http.post(
      `${this.baseUrl}change_service_room/slots`,
      JSON.stringify(data)
    );
  }

  changeContractDate(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/change_contract_date`,
      payload
    );
  }

  changeDeliveryDate(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/change_delivery_date`,
      payload
    );
  }

  sendCourierDate(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/send_by_courier`,
      payload
    );
  }

  receviedFromCourier(reservation_id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/${reservation_id}/received_from_courier`,
      payload
    );
  }

  // fines
  collectFine(payload) {
    return this.http.post(`${this.baseUrl}fines/collect`, payload);
  }

  deleteFine(payload) {
    return this.http.post(`${this.baseUrl}fines/delete`, payload);
  }

  approvePaymentRequest(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/approve_payment_request`,
      payload
    );
  }

  rejectPaymentRequest(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/reject_payment_request`,
      payload
    );
  }

  linkEOIToReservation(id, payload) {
    return this.http.put(
      `${this.baseUrl}reservations/request/${id}/link_eoi`,
      payload
    );
  }

  finalChequeRecieved(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/final_cheque_received`,
      payload
    );
  }

  deliveredToCustomer(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/delivered_to_customer`,
      payload
    );
  }

  addBulkCheque(payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/total_bulk_cheques`,
      payload
    );
  }

  addHandoverAction(reservation_id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/update_handover/${reservation_id}`,
      payload
    );
  }

  getHandoverLogs(reservation_id) {
    return this.http.get(
      `${this.baseUrl}reservations/handover-log/${reservation_id}`
    );
  }

  getAllBuildings() {
    return this.http.get(`${this.baseUrl}all-buildings`);
  }
}
