import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { removeNullishFieldsParams } from "../../shared/object_helpers";

@Injectable()
export class ColdCallsStatusesService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {}

  getContactStatuses(params = {}) {
    return this.http.get(`${this.baseUrl}contactDataStatuses`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getContactStatus(id, params = {}) {
    return this.http.get(`${this.baseUrl}contactDataStatuses/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postContactStatus(payload = {}) {
    return this.http.post(
      `${this.baseUrl}contactDataStatuses`,
      removeNullishFieldsParams(payload)
    );
  }

  updateContactStatus(id, payload) {
    return this.http.put(
      `${this.baseUrl}contactDataStatuses/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteContactStatus(id) {
    return this.http.delete(`${this.baseUrl}contactDataStatuses/${id}`);
  }
}
