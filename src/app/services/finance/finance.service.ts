import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class FinanceService {

  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) { }

  getAllFinanceAccounts() {
    return this.http.get(`${this.baseUrl}finance/accounts`);
  }

  getParentsAccounts() {
    return this.http.get(`${this.baseUrl}finance/transactions/get_parents`);
  }

  getFinanceAccountDetails(id) {
    return this.http.get(`${this.baseUrl}finance/accounts/${id}`);
  }

  addFinanceAccount(data) {
    return this.http.post(`${this.baseUrl}finance/accounts`, JSON.stringify(data));
  }

  editFinanceAccount(id, data) {
    return this.http.put(`${this.baseUrl}finance/accounts/${id}`, JSON.stringify(data));
  }

  searchFrom(data) {
    return this.http.post(`${this.baseUrl}finance/transactions/search/from`, JSON.stringify(data));
  }

  searchTo(data) {
    return this.http.post(`${this.baseUrl}finance/transactions/search/to`, JSON.stringify(data));
  }

  addTransaction(data) {
    return this.http.post(`${this.baseUrl}finance/transactions`, JSON.stringify(data));
  }

  getAllTransaction() {
    return this.http.get(`${this.baseUrl}finance/transactions`);
  }

  getBalanceSheet(id) {
    return this.http.get(`${this.baseUrl}finance/accounts/${id}/balance_sheet`);
  }

}
