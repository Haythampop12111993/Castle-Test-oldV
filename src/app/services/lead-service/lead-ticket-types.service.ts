import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { environment } from "../../../environments/environment";

// lead service

@Injectable()
export class LeadTicketTypesService {
  baseUrl: string = environment.api_base_url;

  constructor(private http: HttpClient) {}

  getTicketTypesList(params = {}) {
    return this.http.get(`${this.baseUrl}leadTicketType`, {
      params,
    });
  }

  createTicketType(data) {
    return this.http.post(`${this.baseUrl}leadTicketType`, data);
  }
  updateTicketType(id, data) {
    return this.http.put(`${this.baseUrl}leadTicketType/${id}`, data);
  }
  deleteTicketType(id) {
    return this.http.delete(`${this.baseUrl}leadTicketType/${id}`);
  }
}
