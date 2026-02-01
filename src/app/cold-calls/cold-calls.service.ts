import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable()
export class ColdCallsService {
  baseUrl: string = environment.api_base_url;

  constructor(private http: HttpClient) {}

  getAllContacts(params = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}contactData`, {
      params,
    });
  }

  getAllContactData(name = "", page?): Observable<any> {
    return this.http.get(`${this.baseUrl}contactData/cards`, {
      params: {
        name,
        page: page || "1",
      },
    });
  }

  importFile(payload) {
    return this.http.post(`${this.baseUrl}contactData/import`, payload);
  }

  deleteContactDataCard(id) {
    return this.http.delete(`${this.baseUrl}contactData/cards/${id}`);
  }

  downloadFileExample() {
    return this.http.get(`${this.baseUrl}contactData/example`);
  }

  assingContactData(cardId, payload) {
    return this.http.put(
      `${this.baseUrl}contactData/assign/${cardId}`,
      payload
    );
  }

  getSingleAgentData(agentId, keyword = "", page = "1"): Observable<any> {
    return this.http.get(`${this.baseUrl}contactData/getAgentCard`, {
      params: {
        user_id: `${agentId}`,
        search_text: keyword,
        page,
      },
    });
  }

  getSingleContactData(card_id, keyword = "", page = "1"): Observable<any> {
    return this.http.get(`${this.baseUrl}contactData/cards/${card_id}`, {
      params: {
        card_id: `${card_id}`,
        search_text: keyword,
        page: page,
      },
    });
  }

  convertToStatus(id, status_id) {
    return this.http.put(`${this.baseUrl}contactData/changeStatus/${id}`, {
      status: status_id,
    });
  }

  getContact(id) {
    return this.http.get(`${this.baseUrl}contactData/${id}`);
  }

  deleteContact(id) {
    return this.http.delete(`${this.baseUrl}contactData/delete/${id}`);
  }

  bulkDelete(payload) {
    return this.http.put(`${this.baseUrl}contactData/bulkDelete`, payload);
  }

  checkBeforeConvertToInterest(id, payload = {}) {
    return this.http.put(
      `${this.baseUrl}contactData/checkBeforeConvert/${id}`,
      payload,
      {
        observe: "response",
      }
    );
  }

  convertToInterested(id, payload) {
    return this.http.put(
      `${this.baseUrl}contactData/convertToInterested/${id}`,
      payload
    );
  }

  getAgentCard(keyword = "", page = "1"): Observable<any> {
    return this.http.get(`${this.baseUrl}contactData/getAgentCard`, {
      params: {
        search_text: keyword,
        page: page,
      },
    });
  }

  getAgentsCardsData(keyword = "", page = "1"): Observable<any> {
    return this.http.get(`${this.baseUrl}contactData/getAgentCards`, {
      params: {
        name: keyword,
        page: page,
      },
    });
  }

  exportExcel(params = {}) {
    return this.http.get(`${this.baseUrl}contactData/export`, { params });
  }

  reAssign(payload) {
    return this.http.put(`${this.baseUrl}contactData/reassign`, payload);
  }

  getStatusesCards() {
    return this.http.get(`${this.baseUrl}contactData/getStatusCard`);
  }
}
