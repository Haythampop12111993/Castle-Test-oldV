import { removeNullishFieldsParams } from "./../../shared/object_helpers";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { of } from "rxjs/observable/of";

@Injectable()
export class LegalDocumentsService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {}

  // document types
  getDocumentTypes(params = {}) {
    return this.http.get(`${this.baseUrl}legalDocumentTypes`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getDocumentType(id, params = {}) {
    return this.http.get(`${this.baseUrl}legalDocumentTypes/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postDocumentType(payload = {}) {
    return this.http.post(
      `${this.baseUrl}legalDocumentTypes`,
      removeNullishFieldsParams(payload)
    );
  }

  updateDocumentType(id, payload) {
    return this.http.put(
      `${this.baseUrl}legalDocumentTypes/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteDocumentType(id) {
    return this.http.delete(`${this.baseUrl}legalDocumentTypes/${id}`);
  }

  // documents
  getDocuments(params = {}) {
    return this.http.get(`${this.baseUrl}legalDocuments`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getDocument(id, params = {}) {
    return this.http.get(`${this.baseUrl}legalDocuments/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postDocument(payload = {}) {
    return this.http.post(
      `${this.baseUrl}legalDocuments`,
      removeNullishFieldsParams(payload)
    );
  }

  updateDocument(id, payload) {
    return this.http.put(
      `${this.baseUrl}legalDocuments/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteDocument(id) {
    return this.http.delete(`${this.baseUrl}legalDocuments/${id}`);
  }

  uploadDocumentFiles(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}legalDocuments/${id}/add_files`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteDocumentFile(file_id) {
    return this.http.delete(
      `${this.baseUrl}legalDocuments/${file_id}/delete_file`
    );
  }
}
