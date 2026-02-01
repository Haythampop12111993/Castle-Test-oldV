import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "../shared/helper.service";

@Injectable()
export class FinancialReportsService {
  baseUrl: string = environment.api_base_url;
  constructor(public http: HttpClient, private helperService: HelperService) {}

  getBouncedChequesReport(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(`financeReports/bounced_cheques`, qParams);
  }

  getProjectsSalesReport(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(`financeReports/projects_sales`, qParams);
  }

  getPaymentStatusReport(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(`financeReports/payment_status`, qParams);
  }

  getARMatchingReport(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(`financeReports/AR_matching`, qParams);
  }

  getPostDateAnalysisReport(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(`financeReports/post_date_analysis`, qParams);
  }

  getCombinedStatementReport(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(
      `financeReports/combined_statement_account`,
      qParams
    );
  }

  getCombinedStatementCards(params?) {
    let qParams = params ? this.helperService.removeNullQParams(params) : {};
    return this.helperService.get(`financeReports/stats_cards`, qParams);
  }

  downloadReportCombinedStatementAccount(id) {
    return this.helperService.get(
      `financeReports/combined_statement_account/${id}/export`
    );
  }

  getAreaCounter(payload) {
    // return this.http.put(`${this.baseUrl}dailyReports/area_counter`, payload);
    let qParams = payload ? this.helperService.removeNullQParams(payload) : {};
    return this.helperService.get(`dailyReports/area_counter`, qParams);
  }
}
