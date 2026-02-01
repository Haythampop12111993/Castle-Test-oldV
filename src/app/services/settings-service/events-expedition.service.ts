import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventsExpeditionService {

  baseUrl: string = environment.api_base_url;


  constructor(public http: HttpClient) { }
  getAllActivitesForLeadsFilter() {
    return this.http.get(`${this.baseUrl}leads/activities_for_filter`);
  }

  addEvent(data) {
    return this.http.post(
      `${this.baseUrl}leads/events`,
      JSON.stringify(data)
    );
  }

  editEvent(id, payload) {
    return this.http.put(
      `${this.baseUrl}leads/events/${id}`,
      JSON.stringify(payload)
    );
  }

  deleteEvent(id) {
    return this.http.delete(`${this.baseUrl}leads/events/${id}`);
  }
  getAllEvents() {
    return this.http.get(`${this.baseUrl}leads/events`);
  }
}
