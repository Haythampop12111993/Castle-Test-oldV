import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


@Injectable()
export class CilService {
  baseUrl: string;
  constructor(private http: HttpClient) { 
    this.baseUrl = environment.api_base_url;
  }
  
  getAllCils() {
    return this.http.get(this.baseUrl + 'cils');
  }
  // cilStatus(cil, status) {
  //   return this.http.patch(this.baseUrl+ 'cils/' + cil.id, status);
  // }

  cilDecline(cil) {
    return this.http.get(`${this.baseUrl}cils/${cil.id}/decline`)
  }
  cilApprove(cil) {
    return this.http.get(`${this.baseUrl}cils/${cil.id}/accept`)
  }
  filterCils(f) {
    return this.http.post(`${this.baseUrl}cils/filter`, JSON.stringify(f));
  }
  infinit(url) {
    return this.http.get(url);
  }
 
  
}
