import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class ReminderService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {}

  getReminders(params = {}) {
    return this.http.get(`${this.baseUrl}reminders`, { params });
  }

  postReminders(payload) {
    return this.http.post(`${this.baseUrl}reminders`, payload);
  }

  putReminders(id, payload = {}) {
    return this.http.put(`${this.baseUrl}reminders/${id}`, payload);
  }

  doneReminders(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}reminders/${id}/done_reminder`,
      payload
    );
  }
}
