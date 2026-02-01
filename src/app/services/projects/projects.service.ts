import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { environment } from "./../../../environments/environment";
import { removeNullishFieldsParams } from "../../shared/object_helpers";

@Injectable()
export class ProjectsService {
  baseUrl: string = environment.api_base_url;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  // baseUrl: string = 'http://192.168.8.100:8000/api/';

  constructor(public http: HttpClient) {}

  getProjects(params = {}): any {
    return this.http.get(`${this.baseUrl}projects`, { params });
  }

  getFloors(params = {}): any {
    return this.http.get(`${this.baseUrl}projects/get_floors`, {
      params,
    });
  }

  getAgents(): any {
    return this.http.get(`${this.baseUrl}users/get_pc`);
  }

  createTarget(payload): any {
    return this.http.post(`${this.baseUrl}targets`, JSON.stringify(payload));
  }

  getTargets(): any {
    return this.http.get(`${this.baseUrl}targets`);
  }

  deleteTarget(target_id): any {
    return this.http.delete(`${this.baseUrl}targets/${target_id}`);
  }

  filterTarget(payload): any {
    return this.http.get(
      `${this.baseUrl}targets?project_id=${payload.project_id}&user_id=${payload.user_id}&month=${payload.user_id}&year=${payload.year}`
    );
  }

  addProject(data): any {
    return this.http.post(`${this.baseUrl}projects`, JSON.stringify(data));
  }
  searchAvilableUnits(data): any {
    return this.http.post(
      `${this.baseUrl}units/search/available_by_serial`,
      JSON.stringify(data)
    );
  }

  getCurrentUnit(id): any {
    return this.http.get(`${this.baseUrl}units/${id}`);
  }

  UpdateProject(id, data): any {
    return this.http.patch(
      `${this.baseUrl}projects/${id}`,
      JSON.stringify(data)
    );
  }

  getDistricts() {
    return this.http.get(`${this.baseUrl}projects/get_districts`);
  }

  addDistrict(payload) {
    return this.http.post(`${this.baseUrl}districts`, payload);
  }

  updateDistrict(id, payload) {
    return this.http.put(`${this.baseUrl}districts/${id}`, payload);
  }

  deleteDistrict(id) {
    return this.http.delete(`${this.baseUrl}districts/${id}`);
  }

  getCities() {
    return this.http.get(`${this.baseUrl}cities`);
  }

  addCity(payload) {
    return this.http.post(`${this.baseUrl}cities`, payload);
  }

  updateCity(id, payload) {
    return this.http.put(`${this.baseUrl}cities/${id}`, payload);
  }

  deleteCity(id) {
    return this.http.delete(`${this.baseUrl}cities/${id}`);
  }

  getAllProjectUnits(id, qParams = {}) {
    return this.http.get(`${this.baseUrl}projects/${id}/units`, {
      params: qParams,
    });
  }

  getcurrentproject(project_id) {
    return this.http.get(`${this.baseUrl}projects/${project_id}`);
  }

  getProjectUnitsbytype(project_id, unit_type_id) {
    return this.http.get(
      `${this.baseUrl}projects/${project_id}/${unit_type_id}/units`
    );
  }

  requestBlockUnit(data) {
    return this.http.post(
      `${this.baseUrl}blocks/request`,
      JSON.stringify(data)
    );
  }

  acceptBlockUnit(id) {
    return this.http.put(`${this.baseUrl}blocks/request/${id}/accept`, {});
  }

  declineBlockUnit(id) {
    return this.http.put(`${this.baseUrl}blocks/request/${id}/decline`, {});
  }

  getBlockList(params = {}) {
    return this.http.get(`${this.baseUrl}blocks`, { params });
  }

  makeUnitAvailable(id, payload) {
    return this.http.post(`${this.baseUrl}units/status_change/${id}`, payload);
  }
  makeUnitNotAvailable(id) {
    return this.http.post(`${this.baseUrl}units/not_available/${id}`, {});
  }

  makeUnitHoldDevelopment(id) {
    return this.http.post(`${this.baseUrl}units/development_hold/${id}`, {});
  }

  makeUnitHayaa(id) {
    return this.http.post(`${this.baseUrl}units/hayaa/${id}`, {});
  }

  makeUnitGameya(id) {
    return this.http.post(`${this.baseUrl}units/gameya/${id}`, {});
  }

  unBlockUnit(unit_id) {
    return this.http.put(
      `${this.baseUrl}reservations/request/${unit_id}/decline`,
      {}
    );
  }

  adminUnBlockUnit(unit_id) {
    return this.http.get(`${this.baseUrl}unblock/unit/${unit_id}`, {});
  }

  getUnitTypes(project_id?) {
    if (project_id) {
      return this.http.get(`${this.baseUrl}types?project_id=${project_id}`);
    } else {
      return this.http.get(`${this.baseUrl}types`);
    }
  }

  getDesignTypes(project_id?) {
    if (project_id) {
      return this.http.get(
        `${this.baseUrl}units/get_design_types?project_id=${project_id}`
      );
    } else {
      return this.http.get(`${this.baseUrl}units/get_design_types`);
    }
  }

  filterUnits(project_id, data, page = 1) {
    data = removeNullishFieldsParams(data);
    // let floors_name_conacted = "";
    // if (data.floor) {
    //   floors_name_conacted = data.floor.join(",");
    // }

    // let phases = data.phase_id;
    // let phase_id_conacted = "";
    // if (phases) {
    //   phases.forEach((phase) => {
    //     phase_id_conacted += `${phase.id},`;
    //   });
    // }

    // let finishing_type_ids_conactenated = "";
    // if (data.finishing_type_id) {
    //   finishing_type_ids_conactenated = data.finishing_type_id.join(",");
    // }

    // let prices = data.price;
    // let price_concatenated = "";
    // if (prices) {
    //   if (prices.length > 0) {
    //     prices.forEach((price) => {
    //       price_concatenated += `${price},`;
    //     });
    //   }
    // }
    // // if (this.userProfile.role != "Admin" || this.userProfile.role != "Moderator") {
    // //   data.status = "Available";
    // // }

    // let params = {
    //   page: page,
    //   finishing_type_id: finishing_type_ids_conactenated,
    //   area_from: data.area_from || "",
    //   area_to: data.area_to || "",
    //   floor: floors_name_conacted,
    //   status: data.status,
    //   bed_rooms: data.bed_rooms,
    //   type: data.type,
    //   block_num: data.block_num,
    //   serial: data.serial,
    //   phase_id: phase_id_conacted,
    //   price: price_concatenated,
    //   is_export: data.is_export ? 1 : undefined,
    // };

    // ["sort_field", "sort_type"].map((field) => {
    //   if (data[field]) {
    //     params[field] = data[field];
    //   }
    // });
    // if (params.is_export) {
    //   delete params.page;
    //   delete params.price;
    // }
    return this.http.get(`${this.baseUrl}units/filter/${project_id}`, {
      params: data,
      // params: Object.entries(params)
      //   .filter(([key, val]) => val !== undefined && val !== "")
      //   .reduce((obj, [key, val]) => {
      //     obj[key] = val;
      //     return obj;
      //   }, {}),
    });
  }

  filterAllUnits(data) {
    // if (this.userProfile.role != "Admin" || this.userProfile.role != "Moderator") {
    //   data.status = "Available";
    // }
    return this.http.get(
      `${this.baseUrl}units/filter?area=${data.area}&floor=${data.floor}&status=${data.status}&type=${data.type}&block_num=${data.block_num}&serial=${data.serial}&phase_id=${data.phase_id}`
    );
  }

  infinit(url) {
    return this.http.get(url);
  }

  infinitWithPagination(url, data) {
    let floors = data.floor;
    let floors_name_conacted = "";
    floors &&
      floors.forEach((floor) => {
        floors_name_conacted += `${floor.name},`;
      });
    let phases = data.phase_id;
    let phase_id_conacted = "";
    phases &&
      phases.forEach((phase) => {
        phase_id_conacted += `${phase.id},`;
      });
    let finishing_type_ids = data.finishing_type_id;
    let finishing_type_ids_conactenated = "";
    finishing_type_ids &&
      finishing_type_ids.forEach((finish) => {
        finishing_type_ids_conactenated += `${finish.id},`;
      });
    let prices = data.price;
    let price_concatenated = "";
    if (prices.length > 0) {
      prices.forEach((price) => {
        price_concatenated += `${price},`;
      });
    }
    return this.http.get(
      `${url}&finishing_type_id=${finishing_type_ids_conactenated}&
      area_from=${data.area_from}&area_to=${data.area_to}&floor=${floors_name_conacted}
      &status=${data.status}&type=${data.type}&block_num=${data.block_num}&serial=${data.serial}
      &phase_id=${phase_id_conacted}&price=${price_concatenated}`
    );
  }

  getBlockReason(id) {
    return this.http.get(`${this.baseUrl}reason/unit/${id}`);
  }

  getAllUnits(params?) {
    return this.http.get(`${this.baseUrl}units`, { params });
  }

  getUnitDetails(id) {
    return this.http.get(`${this.baseUrl}units/${id}`);
  }

  addUnitComment(unit_id, comment) {
    return this.http.post(
      `${this.baseUrl}units/${unit_id}/comment`,
      JSON.stringify({ comment: comment })
    );
  }

  uploadUnitLayout(data) {
    return this.http.post(`${this.baseUrl}units/layouts`, JSON.stringify(data));
  }

  uploadSingleUnitLayout(id, data) {
    return this.http.post(
      `${this.baseUrl}unit/layout/${id}`,
      JSON.stringify(data)
    );
  }

  private handleError(error: any) {
    const errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server   error";
    return Observable.throw(errMsg);
  }

  getUnitsAvailableRequests() {
    return this.http.get(`${this.baseUrl}units_available_requests`);
  }

  approveUnitAvailableRequests(id, comment) {
    return this.http.put(
      `${this.baseUrl}units_available_requests/${id}/approve`,
      { superadmin_comment: comment }
    );
  }

  declineUnitAvailableRequests(id) {
    return this.http.put(
      `${this.baseUrl}units_available_requests/${id}/decline`,
      {}
    );
  }

  deleteUnitAvailableRequests(id) {
    return this.http.delete(
      `${this.baseUrl}units_available_requests/${id}/delete`
    );
  }

  approveAllUnitAvailableRequests(payload) {
    return this.http.put(
      `${this.baseUrl}units_available_requests/approve_multiple`,
      payload
    );
  }

  declineAllUnitAvailableRequests(payload) {
    return this.http.put(
      `${this.baseUrl}units_available_requests/decline_multiple`,
      payload
    );
  }

  requestUnitPriceChange(payload) {
    return this.http.post(
      `${this.baseUrl}units_prices_requests/store`,
      payload
    );
  }

  listUnitPriceChangeRequests() {
    return this.http.get(`${this.baseUrl}units_prices_requests`);
  }

  accountReviewUnitPriceChange(id) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/${id}/accountant_approve`,
      {}
    );
  }

  accountDeclineUnitPriceChange(id) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/${id}/accountant_decline`,
      {}
    );
  }

  adminApproveUnitPriceChange(id, comment) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/${id}/superadmin_approve`,
      { superadmin_comment: comment }
    );
  }

  adminDeclineUnitPriceChange(id) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/${id}/superadmin_decline`,
      {}
    );
  }

  adminDeleteUnitPriceChange(id) {
    return this.http.delete(
      `${this.baseUrl}units_prices_requests/${id}/superadmin_delete`
    );
  }

  deleteUnit(id) {
    return this.http.delete(`${this.baseUrl}unit/${id}/delete`);
  }

  accountReviewUnitPriceChangeMultiple(payload) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/accountant_approve_multiple`,
      JSON.stringify(payload)
    );
  }

  accountDeclineUnitPriceChangeMultiple(payload) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/accountant_decline_multiple`,
      JSON.stringify(payload)
    );
  }

  adminApproveUnitPriceChangeMultiple(payload) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/superadmin_approve_multiple`,
      JSON.stringify(payload)
    );
  }

  adminDeclineUnitPriceChangeMultiple(payload) {
    return this.http.put(
      `${this.baseUrl}units_prices_requests/superadmin_decline_multiple`,
      JSON.stringify(payload)
    );
  }

  availabilityRequestsHistory() {
    return this.http.get(`${this.baseUrl}units_available_requests/history`);
  }

  controlPriceRequestsHistory() {
    return this.http.get(`${this.baseUrl}units_prices_requests/history`);
  }

  getMasterPlanDistrict(id) {
    return this.http.get(`${this.baseUrl}masterplan/project/${id}`);
  }

  getMasterPlanUnits(payload) {
    return this.http.post(
      `${this.baseUrl}masterplan/district`,
      JSON.stringify(payload)
    );
  }

  assignUnitToPath(payload) {
    return this.http.post(
      `${this.baseUrl}masterplan/district/save`,
      JSON.stringify(payload)
    );
  }

  deleteStaticMasterPlan(id) {
    return this.http.delete(`${this.baseUrl}masterplan/${id}/delete_image`);
  }

  exportAvailbilityReauests() {
    return this.http.get(`${this.baseUrl}units_available_requests?is_export=1`);
  }

  exportAvailbilityReauestsHistory() {
    return this.http.get(
      `${this.baseUrl}units_available_requests/history?is_export=1`
    );
  }

  exportUnitPriceRequest() {
    return this.http.get(`${this.baseUrl}units_prices_requests?is_export=1`);
  }

  exportUnitPriceRequestsHistory() {
    return this.http.get(
      `${this.baseUrl}units_prices_requests/history?is_export=1`
    );
  }

  exportPaymentTerms() {
    return this.http.get(`${this.baseUrl}payments?is_export=1`);
  }

  getCampaigns() {
    return this.http.get(`${this.baseUrl}campaigns`);
  }

  createCampaigns(payload) {
    return this.http.post(`${this.baseUrl}campaigns`, JSON.stringify(payload));
  }

  updateCampaigns(id, payload) {
    return this.http.put(
      `${this.baseUrl}campaigns/${id}`,
      JSON.stringify(payload)
    );
  }

  getRotations(id) {
    return this.http.get(
      `${this.baseUrl}rotations/getRotationForCampaign/${id}`
    );
  }

  getUsersForRotation(id?) {
    if (id) {
      return this.http.get(`${this.baseUrl}rotations/getUsers/${id}`);
    } else {
      return this.http.get(`${this.baseUrl}rotations/getUsers`);
    }
  }

  getAllRotations(options?: { disable_pagination: boolean }) {
    return this.http.get(
      `${this.baseUrl}rotations?${
        options && options.disable_pagination ? "paginate=false" : ""
      }`
    );
  }

  // getAllRotation() {
  //   return this.http.get(`${this.baseUrl}rotations/getRotationForCampaign`);
  // }

  submitChangeToCampain(campagin_id, ids) {
    return this.http.post(
      `${this.baseUrl}rotations/setRotationForCampaign/${campagin_id}`,
      ids
    );
  }

  submitChangeToCampainAll(ids) {
    return this.http.post(
      `${this.baseUrl}rotations/setRotationForCampaign`,
      ids
    );
  }

  getRotationLogs() {
    return this.http.get(`${this.baseUrl}rotations/getLogForCampaign`);
  }

  deleteSelectedUnits(unitIds) {
    return this.http.post(`${this.baseUrl}units/delete_multiple`, unitIds);
  }

  addPaymentPlan(payload) {
    return this.http.post(`${this.baseUrl}payments/storeSetupPlan`, payload);
  }

  deletePayment(id) {
    return this.http.delete(`${this.baseUrl}payments/${id}`);
  }

  changeNamePayment(id, payload) {
    return this.http.post(
      `${this.baseUrl}payments/updatePlanName/${id}`,
      JSON.stringify(payload)
    );
  }

  addLeadRequest(id, payload) {
    return this.http.put(
      `${this.baseUrl}leads/${id}/add_request`,
      JSON.stringify(payload)
    );
  }

  getLeadRequests(id) {
    return this.http.get(`${this.baseUrl}leads/${id}/get_requests`);
  }

  deleteUnitImage(img_id) {
    return this.http.delete(`${this.baseUrl}unit/layout/${img_id}`);
  }

  getAllFinishingTypes() {
    return this.http.get(`${this.baseUrl}settings/get_finishing_types`);
  }

  printImg(src) {
    const printContent = document.getElementById("componentID");
    const WindowPrt = window.open("", "", "");
    WindowPrt.document.write(
      `<img style="width:100%;max-width:100%" src=" ${src} "/>`
    );
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
      console.log(WindowPrt);
    }, 100);
    setTimeout(() => {
      WindowPrt.close();
    }, 500);
  }

  printHtml(url) {
    const WindowPrt = window.open(url, "", "");
    // windowPrt.document.close();
    WindowPrt.focus();
    // setTimeout(() => {
    //   windowPrt.print();
    //   console.log(windowPrt);
    // }, 500);
    // setTimeout(() => {
    //   windowPrt.close();
    // }, 1000);
  }

  getBlockSettings() {
    return this.http.get(`${this.baseUrl}get_block_settings`);
  }

  exportTargets() {
    return this.http.get(`${this.baseUrl}targets/export`);
  }


  getDailyReportyMonthly(params: any = {}) {
    return this.http.get(`${this.baseUrl}dailyReports/meetings_residential`, {
      params: params,
    });
  }

  getBrokersResidential(params: any = {}) {
    return this.http.get(`${this.baseUrl}dailyReports/brokers_residential`, {
      params: params,
    });
  }

  getDailyEvents(project_ids?, from_date?, to_date?, events_ids?) {
    let params = new HttpParams();
    if (events_ids) {
      params = params.append("events_ids", events_ids);
    }
    if (project_ids) {
      params = params.append("projects_ids", project_ids);
    }
    if (from_date) {
      params = params.append("date_from", from_date);
    }
    if (to_date) {
      params = params.append("date_to", to_date);
    }
    return this.http.get(`${this.baseUrl}dailyReports/events`, {
      params: params,
    });
  }

  getMonthlyReport(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/monthly_record`, {
      params: params,
    });
  }

  getMonthlyYearlyReport(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(
      `${this.baseUrl}dailyReports/contracts_stats_per_month`,
      {
        params: params,
      }
    );
  }

  getDailyReportsResidentialReservations(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(
      `${this.baseUrl}dailyReports/residential_reservations`,
      {
        params: params,
      }
    );
  }

  getAgentSalesReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/agent_sales`, {
      params: params,
    });
  }

  getActivitiesAgentsReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/agent_activities`, {
      params: params,
    });
  }

  getContractCycleReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/reservations_reports`, {
      params: params,
    });
  }

  getActivitiesLeadsAgentsReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/agent_activities_leads`, {
      params: params,
    });
  }

  getUnitTypesReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/unit_types`, {
      params: params,
    });
  }

  getManagerSalesReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/managers_sales`, {
      params: params,
    });
  }

  getPCSalesReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/pc_sales`, {
      params: params,
    });
  }

  getPCEoisReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/pc_eois`, {
      params: params,
    });
  }

  getOverSalesReport(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/overseas_sales`, {
      params: params,
    });
  }

  getChannelSalesReport(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/channels_sales`, {
      params: params,
    });
  }

  getProjectsUnitsYearlyReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/project_units_yearly`, {
      params: params,
    });
  }

  getPCTargetReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/pc_target`, {
      params: params,
    });
  }

  getManagersTargetReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/managers_target`, {
      params: params,
    });
  }

  getManagerEoisReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/managers_eois`, {
      params: params,
    });
  }

  getEoisDailyReports(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}dailyReports/eois`, {
      params: params,
    });
  }
  getPriceRange() {
    return this.http.get(`${this.baseUrl}units/get_price_range`);
  }

  getAllEvents() {
    return this.http.get(`${this.baseUrl}leads/events`);
  }

  getAllSources(params?: any) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}settings/sources`, { params });
  }

  addRotation(payload) {
    return this.http.post(`${this.baseUrl}rotations`, payload);
  }

  getRotationData(id) {
    return this.http.get(`${this.baseUrl}rotations/${id}`);
  }

  updateRotation(id, payload) {
    return this.http.put(`${this.baseUrl}rotations/${id}`, payload);
  }

  setUserPeriod(id, payload) {
    return this.http.post(
      `${this.baseUrl}rotations/user_period/${id}`,
      payload
    );
  }

  addBankCheque(payload) {
    return this.http.post(`${this.baseUrl}cheque_templates`, payload);
  }

  getBankCheques() {
    return this.http.get(`${this.baseUrl}cheque_templates`);
  }

  getBanks() {
    return this.http.get(`${this.baseUrl}banks`);
  }

  updateBankCheque(id, payload) {
    return this.http.put(`${this.baseUrl}cheque_templates/${id}`, payload);
  }

  deleteBankChequeTemplate(id) {
    return this.http.delete(`${this.baseUrl}cheque_templates/${id}`);
  }

  printBankCheques(id, payload) {
    return this.http.post(
      `${this.baseUrl}reservations/${id}/print_cheques`,
      payload
    );
  }

  printPaymentsPdf(id) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/${id}/print_payment_pdf`,
      {}
    );
  }

  printRecipt(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}reservations/print_receipt/${id}`,
      payload,
      {
        responseType: "text",
      }
    );
  }
  getAvailableTargetYears() {
    return this.http.get(`${this.baseUrl}targets/available_years`);
  }

  createTargetYear(payload) {
    return this.http.post(`${this.baseUrl}targets/years`, payload);
  }

  getTargetByYears() {
    return this.http.get(`${this.baseUrl}targets/years`);
  }

  exportTargetByYear(target_year) {
    return this.http.get(`${this.baseUrl}targets/years/${target_year}/export`);
  }

  changePaymentPlanFinishingType(id, payload) {
    return this.http.put(
      `${this.baseUrl}payments/updatePlanFinishing/${id}`,
      payload
    );
  }

  changePaymentPlanPhases(id, payload) {
    return this.http.put(
      `${this.baseUrl}payments/updatePlanPhases/${id}`,
      payload
    );
  }

  getPaymentPlanForClone(id, clone_type) {
    return this.http.get(
      `${this.baseUrl}payments/clonePlan/${id}?type=${clone_type}`
    );
  }

  // cheques book
  updateChequeBook(id, payload) {
    return this.http.put(
      `${this.baseUrl}paymentCollections/${id}/update_cheque_book`,
      payload
    );
  }

  printChequBook(id, payload) {
    return this.http.post(
      `${this.baseUrl}paymentCollections/${id}/print_cheque_book`,
      payload
    );
  }

  getDevelopers() {
    return this.http.get(`${this.baseUrl}developers`);
  }

  getUnitDesignTypes() {
    return this.http.get(`${this.baseUrl}dailyReports/get_unit_design_types`);
  }


  addConstructionUpdates(project_id, payload) {
    return this.http.post(
      `${this.baseUrl}projects/${project_id}/completion_updates`,
      payload
    );
  }

  getConstuctionUpdates(project_id) {
    return this.http.get(
      `${this.baseUrl}projects/${project_id}/get_completion_updates`
    );
  }

  getAlbums(project_id) {
    return this.http.get(`${this.baseUrl}albums?project_id=${project_id}`);
  }

  addAlbum(payload) {
    return this.http.post(`${this.baseUrl}albums`, payload);
  }

  getBuildingSlots(id: number, params?: any) {
    return this.http.get(`${this.baseUrl}projects/${id}/get_building_slots`, { params: params });
  }

  saveBuildingSlots(id: number, payload: any) {
    return this.http.post(`${this.baseUrl}projects/${id}/save_building_slots`, payload);
  }
  
  importUnits(id: number, payload: any) {
    return this.http.post(`${this.baseUrl}projects/${id}/import-units`, payload);
  }
  
  getProjectOfferImages(project_id, unit_id?) {
    let url = `projectsOfferImages/${project_id}?`;
    if (unit_id) url += `unit_id=${unit_id}`;
    return this.http.get(`${this.baseUrl}${url}`);
  }

  deleteProjectOfferImage(project_id, image_key) {
    return this.http.delete(
      `${this.baseUrl}projectsOfferImages/${project_id}/${image_key}/deleteImage`
    );
  }

  postProjectOfferImages(project_id, data) {
    return this.http.post(
      `${this.baseUrl}projectsOfferImages/${project_id}/store
    `,
      Object.entries(data)
        .filter(([key, val]) => val !== null)
        .reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {})
    );
  }
}
