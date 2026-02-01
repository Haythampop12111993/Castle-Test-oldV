import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";


@Injectable()
export class PaymentService {

  baseUrl: string = environment.api_base_url;
  // baseUrl: string = 'http://192.168.8.100:8000/api/';

  constructor(public http: HttpClient) {

  }

  getInstallments(data): any {
    return this.http.post(`${this.baseUrl}installments/generate`, JSON.stringify(data));
  }

  generateCustomerPaymentPlan(data): any {
    let params = new HttpParams();
    let params_as_string = '';
    for (let key in data) {
      if (data[key] != null && data[key] != undefined) params_as_string += `${key}=${data[key]}&`
    }
    return this.http.get(`${this.baseUrl}payments/generate_custom_payment_plan?${params_as_string}`, {params: params});
  }

  saveCustomPaymentPlan(payload) {
    return this.http.post(`${this.baseUrl}payments/save_custom_payment_plan`, JSON.stringify(payload));
  }

  getCustomPayments() {
    return this.http.get(`${this.baseUrl}payments/get_custom_payment_plans?paginate=true`);
  }

  getGeneratedPaymentPlanPdfOrExcel(id, type) {
    return this.http.get(`${this.baseUrl}payments/generate_custom_payment_plan_file/${id}?generate_type=${type}`);
  }

  getSingleCustomPayment(id) {
    return this.http.get(`${this.baseUrl}payments/${id}`);
  }

  addPaymentComment(id, data) {
    return this.http.post(`${this.baseUrl}payments/addComment/${id}`, JSON.stringify(data));
  }

  changeCustomPaymentPlanStatus(id, payload) {
    return this.http.put(`${this.baseUrl}payments/updatePlanStatus/${id}`, JSON.stringify(payload));
  }

  updateCustomPaymentPlan(id, payload) {
    return this.http.put(`${this.baseUrl}payments/update_custom_payment_plan/${id}`, payload);
  }
  
  getOfferPdf(data): any {
    return this.http.post(
      `${this.baseUrl}projectsOfferImages/generate_file`,
      JSON.stringify(data)
    );
  }
}
