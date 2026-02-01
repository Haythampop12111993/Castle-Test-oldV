import { removeNullishFieldsParams } from "../../shared/object_helpers";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { of } from "rxjs/observable/of";

@Injectable()
export class LegalContractArchivesService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {}

  // Contract Archive types
  getContractArchiveTypes(params = {}) {
    return this.http.get(`${this.baseUrl}contractArchiveTypes`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getContractArchiveType(id, params = {}) {
    return this.http.get(`${this.baseUrl}contractArchiveTypes/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postContractArchiveType(payload = {}) {
    return this.http.post(
      `${this.baseUrl}contractArchiveTypes`,
      removeNullishFieldsParams(payload)
    );
  }

  updateContractArchiveType(id, payload) {
    return this.http.put(
      `${this.baseUrl}contractArchiveTypes/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteContractArchiveType(id) {
    return this.http.delete(`${this.baseUrl}contractArchiveTypes/${id}`);
  }

  // Contract Archives
  getContractArchives(params = {}) {
    return this.http.get(`${this.baseUrl}contractArchives`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getContractArchive(id, params = {}) {
    return this.http.get(`${this.baseUrl}contractArchives/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postContractArchive(payload = {}) {
    return this.http.post(
      `${this.baseUrl}contractArchives`,
      removeNullishFieldsParams(payload)
    );
  }

  updateContractArchive(id, payload) {
    return this.http.put(
      `${this.baseUrl}contractArchives/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteContractArchive(id) {
    return this.http.delete(`${this.baseUrl}contractArchives/${id}`);
  }

  uploadContractArchiveFiles(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}contractArchives/${id}/add_files`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteContractArchiveFile(file_id) {
    return this.http.delete(
      `${this.baseUrl}contractArchives/${file_id}/delete_file`
    );
  }
}
