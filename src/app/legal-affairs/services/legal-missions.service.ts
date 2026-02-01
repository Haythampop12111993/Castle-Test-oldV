import { removeNullishFieldsParams } from "../../shared/object_helpers";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { of } from "rxjs/observable/of";

@Injectable()
export class LegalMissionsService {
  baseUrl: string = environment.api_base_url;

  constructor(public http: HttpClient) {}

  // Mission Categories
  getMissionCategories(params = {}) {
    return this.http.get(`${this.baseUrl}missionCategories`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getMissionCategory(id, params = {}) {
    return this.http.get(`${this.baseUrl}missionCategories/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postMissionCategory(payload = {}) {
    return this.http.post(
      `${this.baseUrl}missionCategories`,
      removeNullishFieldsParams(payload)
    );
  }

  updateMissionCategory(id, payload) {
    return this.http.put(
      `${this.baseUrl}missionCategories/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteMissionCategory(id) {
    return this.http.delete(`${this.baseUrl}missionCategories/${id}`);
  }

  // Mission Statuses
  getMissionStatuses(params = {}) {
    return this.http.get(`${this.baseUrl}missionStatuses`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getMissionStatus(id, params = {}) {
    return this.http.get(`${this.baseUrl}missionStatuses/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postMissionStatus(payload = {}) {
    return this.http.post(
      `${this.baseUrl}missionStatuses`,
      removeNullishFieldsParams(payload)
    );
  }

  updateMissionStatus(id, payload) {
    return this.http.put(
      `${this.baseUrl}missionStatuses/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteMissionStatus(id) {
    return this.http.delete(`${this.baseUrl}missionStatuses/${id}`);
  }

  // MissionSides
  getMissionSides(params = {}) {
    return this.http.get(`${this.baseUrl}missionSides`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getMissionSide(id, params = {}) {
    return this.http.get(`${this.baseUrl}missionSides/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postMissionSide(payload = {}) {
    return this.http.post(
      `${this.baseUrl}missionSides`,
      removeNullishFieldsParams(payload)
    );
  }

  updateMissionSide(id, payload) {
    return this.http.put(
      `${this.baseUrl}missionSides/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteMissionSide(id) {
    return this.http.delete(`${this.baseUrl}missionSides/${id}`);
  }

  // Missions
  getMissions(params = {}) {
    return this.http.get(`${this.baseUrl}missions`, {
      params: removeNullishFieldsParams(params),
    });
  }

  getMission(id, params = {}) {
    return this.http.get(`${this.baseUrl}missions/${id}`, {
      params: removeNullishFieldsParams(params),
    });
  }

  postMission(payload = {}) {
    return this.http.post(
      `${this.baseUrl}missions`,
      removeNullishFieldsParams(payload)
    );
  }

  updateMission(id, payload) {
    return this.http.put(
      `${this.baseUrl}missions/${id}`,
      removeNullishFieldsParams(payload)
    );
  }

  deleteMission(id) {
    return this.http.delete(`${this.baseUrl}missions/${id}`);
  }

  deleteMissionFile(file_id) {
    return this.http.delete(`${this.baseUrl}missions/${file_id}/delete_file`);
  }

  uploadMissionFiles(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}missions/${id}/add_files`,
      removeNullishFieldsParams(payload)
    );
  }

  addActivityToMission(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}missions/${id}/add_activity`,
      removeNullishFieldsParams(payload)
    );
  }

  addNoteToMission(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}missions/${id}/add_note`,
      removeNullishFieldsParams(payload)
    );
  }

  changeMissionStatus(id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}missions/${id}/change_status`,
      removeNullishFieldsParams(payload)
    );
  }
}
