import { environment } from './../../../../environments/environment';
import { Injectable, Injector  } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AccountsService {

  private _getaccounts = '/api/accounts';
  baseUrl: string = environment.api_base_url;
  // baseUrl: string = 'http://192.168.8.100:8000/api/';

  constructor(private http: HttpClient) { }

  getAccounts(): any {
    return this.http.get(`${this.baseUrl}accounts`);
  }
  getAccount(id): any {
    return this.http.get(`${this.baseUrl}accounts/${id}`);
  }

  createaccount (data) {
    return this.http.post(`${this.baseUrl}accounts`, JSON.stringify(data));
  }

  editaccount(account_id, data) {
    return this.http.put(`${this.baseUrl}accounts/${account_id}`, JSON.stringify(data));
  }

  importUsers(data){
    return this.http.post(`${this.baseUrl}users/import`, JSON.stringify(data));
  }

  disableUser(userId){
    return this.http.put(`${this.baseUrl}user/${userId}/disable`, JSON.stringify({}));
  }

  enableUser(userId){
    return this.http.put(`${this.baseUrl}user/${userId}/enable`, JSON.stringify({}));
  }

  searchUser(keyword){
    return this.http.get(`${this.baseUrl}accounts/search?keyword=${keyword}`);
  }

  paginationWithFilter(url, keyword){
    return this.http.get(`${url}&keyword=${keyword}`);
  }

  getBrokers () {
    return this.http.get(`${this.baseUrl}brokers`);
  }
}
