import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { environment } from "../../../environments/environment";

// lead service

@Injectable()
export class LeadCampaignsService {
  baseUrl: string = environment.api_base_url;

  constructor(private http: HttpClient) {}

  getCampaignsList(params = {}) {
    return this.http.get(`${this.baseUrl}campaigns`, {
      params,
    });
  }

  createCampaign(data) {
    return this.http.post(`${this.baseUrl}campaigns`, data);
  }
  updateCampaign(id, data) {
    return this.http.put(`${this.baseUrl}campaigns/${id}`, data);
  }
  deleteCampaign(id) {
    return this.http.delete(`${this.baseUrl}campaigns/${id}`);
  }
}
