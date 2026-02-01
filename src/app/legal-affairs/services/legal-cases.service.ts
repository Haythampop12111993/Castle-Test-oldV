import { removeNullishFieldsParams } from "../../shared/object_helpers";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { of } from "rxjs/observable/of";

@Injectable()
export class LegalCasesService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {}

  // Case Categories
  getCaseCategories(params = {}) {
    return this.http.get(`${this.baseUrl}caseCategories`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getCaseCategory(id, params = {}) {
    return this.http.get(`${this.baseUrl}caseCategories/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postCaseCategory(payload = {}) {
    return this.http.post(
      `${this.baseUrl}caseCategories`,
      removeNullishFieldsParams(payload)
    );
  }

  updateCaseCategory(id, payload) {
    return this.http.put(
      `${this.baseUrl}caseCategories/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteCaseCategory(id) {
    return this.http.delete(`${this.baseUrl}caseCategories/${id}`);
  }

  // Case Statuses
  getCaseStatuses(params = {}) {
    return this.http.get(`${this.baseUrl}caseStatuses`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getCaseStatus(id, params = {}) {
    return this.http.get(`${this.baseUrl}caseStatuses/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postCaseStatus(payload = {}) {
    return this.http.post(
      `${this.baseUrl}caseStatuses`,
      removeNullishFieldsParams(payload)
    );
  }

  updateCaseStatus(id, payload) {
    return this.http.put(
      `${this.baseUrl}caseStatuses/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteCaseStatus(id) {
    return this.http.delete(`${this.baseUrl}caseStatuses/${id}`);
  }

  // Courts
  getCourts(params = {}) {
    return this.http.get(`${this.baseUrl}courts`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getCourt(id, params = {}) {
    return this.http.get(`${this.baseUrl}courts/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postCourt(payload = {}) {
    return this.http.post(
      `${this.baseUrl}courts`,
      removeNullishFieldsParams(payload)
    );
  }

  updateCourt(id, payload) {
    return this.http.put(
      `${this.baseUrl}courts/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteCourt(id) {
    return this.http.delete(`${this.baseUrl}courts/${id}`);
  }

  // Cases
  getCases(params = {}) {
    return this.http.get(`${this.baseUrl}cases`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getCase(id, params = {}) {
    return this.http.get(`${this.baseUrl}cases/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postCase(payload = {}) {
    return this.http.post(
      `${this.baseUrl}cases`,
      removeNullishFieldsParams(payload)
    );
  }

  updateCase(id, payload) {
    return this.http.put(
      `${this.baseUrl}cases/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteCase(id) {
    return this.http.delete(`${this.baseUrl}cases/${id}`);
  }

  deleteCaseFile(file_id) {
    return this.http.delete(`${this.baseUrl}cases/${file_id}/delete_file`);
  }

  uploadCaseFiles(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}cases/${id}/add_files`,
      removeNullishFieldsParams(payload)
    );
  }

  addActivityToCase(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}cases/${id}/add_activity`,
      removeNullishFieldsParams(payload)
    );
  }

  addNoteToCase(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}cases/${id}/add_note`,
      removeNullishFieldsParams(payload)
    );
  }

  changeCaseStatus(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}cases/${id}/change_status`,
      removeNullishFieldsParams(payload)
    );
  }
}
