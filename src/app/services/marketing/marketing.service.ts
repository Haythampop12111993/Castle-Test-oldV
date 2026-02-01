import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { removeNullishFieldsParams } from '../../shared/object_helpers';

@Injectable()
export class MarketingService {

  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) { }

  createMarketList(data) {
    return this.http.post(`${this.baseUrl}marketing/lists/create`, JSON.stringify(data));
  }

  getMarketingList() {
    return this.http.get(`${this.baseUrl}marketing/lists`);
  }

  updateList(data) {
    return this.http.post(`${this.baseUrl}marketing/lists/update`, JSON.stringify(data));
  }

  sendEmails(data) {
    return this.http.post(`${this.baseUrl}marketing/email/bulk`, JSON.stringify(data));
  }

  sendSmS(data) {
    return this.http.post(`${this.baseUrl}marketing/sms/bulk`, JSON.stringify(data))
  }
  sendBulkSmSByStatus(data){
    return this.http.post(`${this.baseUrl}marketing/sms_leads_by_status`, JSON.stringify(data));
  }
  sendSingleSmS(data) {
    return this.http.post(`${this.baseUrl}marketing/sms`, JSON.stringify(data));
  }

  sendSingleEmail(data) {
    return this.http.post(`${this.baseUrl}marketing/email`, JSON.stringify(data));
  }

  smsCredentials(data) {
    return this.http.post(`${this.baseUrl}remote/config/change/sms/credentials`, JSON.stringify(data));
  }

  addChannel(data) {
    return this.http.post(`${this.baseUrl}lead_channels`, JSON.stringify(data));
  }

  getChannels() {
    return this.http.get(`${this.baseUrl}lead_channels`);
  }

  getChannelData(id) {
    return this.http.get(`${this.baseUrl}lead_channels/${id}`)
  }

  deleteChannel(id) {
    return this.http.delete(`${this.baseUrl}lead_channels/${id}`)
  }

  editChannel(id, data) {
    return this.http.put(`${this.baseUrl}lead_channels/${id}`, JSON.stringify(data))
  }
  exportList(id,type) {
    return this.http.get(`${this.baseUrl}marketing/export/${id}/${type}`)
  }

  getAllRotations() {
    return this.http.get(`${this.baseUrl}rotations`);
  }

  getPages() {
    return this.http.get(`${this.baseUrl}pages`);
  }

  getPage(id) {
    return this.http.get(`${this.baseUrl}pages/${id}`);
  }

  addPage(data) {
    return this.http.post(`${this.baseUrl}pages`, JSON.stringify(data));
  }

  editPage(id, data) {
    return this.http.put(`${this.baseUrl}pages/${id}`, JSON.stringify(data));
  }

  deletePage(id) {
    return this.http.delete(`${this.baseUrl}pages/${id}`);
  }

  getCampaigns(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}campaigns`, { params });
  }

  getCampaignViewers(params: any = {}) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}users/get_campaign_viewers`, {
      params,
    });
  }

  getCampaign(id) {
    return this.http.get(`${this.baseUrl}campaigns/${id}`);
  }

  addCampaigns(payload) {
    return this.http.post(`${this.baseUrl}campaigns`, JSON.stringify(payload));
  }

  editCampaigns(id, payload) {
    return this.http.put(
      `${this.baseUrl}campaigns/${id}`,
      JSON.stringify(payload)
    );
  }

  deleteCampaigns(id) {
    return this.http.delete(`${this.baseUrl}campaigns/${id}`);
  }

  getCampaignForms(page_id) {
    return this.http.get(`${this.baseUrl}campaigns/get/forms/${page_id}`);
  }

  getLeadStatus(params: any) {
    console.log(params);
    return this.http.get(`${this.baseUrl}campaigns/leads/status/count`, {
      params,
    });
  }

  getLeadsAgents(params: any) {
    params = removeNullishFieldsParams(params);
    return this.http.get(`${this.baseUrl}campaigns/leads/agent/count`, {
      params,
    });
  }

  infinit(url) {
    return this.http.get(url);
  }
}
