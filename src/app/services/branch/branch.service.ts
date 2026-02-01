import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class BranchService {

  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {

   }

   getAllBranches(){
    return this.http.get(`${this.baseUrl}branches`);
  }

  getBranchDetails(id){
    return this.http.get(`${this.baseUrl}branches/${id}`);
  }

  addBranch(data){
    return this.http.post(`${this.baseUrl}branches`, JSON.stringify(data));
  }

  editBranch(id, data){
    return this.http.put(`${this.baseUrl}branches/${id}`, JSON.stringify(data))
  }

}
