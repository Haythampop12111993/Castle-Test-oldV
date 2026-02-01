import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { environment } from "../../../environments/environment";

// lead service

@Injectable()
export class QualifiedFeedbackQuestionsService {
  baseUrl: string = environment.api_base_url;

  constructor(private http: HttpClient) {}

  getQuestionsList() {
    return this.http.get(`${this.baseUrl}qualifiedFeedbackQuestions`);
  }

  createQuestion(data) {
    return this.http.post(`${this.baseUrl}qualifiedFeedbackQuestions`, data);
  }
  updateQuestion(id, data) {
    return this.http.put(
      `${this.baseUrl}qualifiedFeedbackQuestions/${id}`,
      data
    );
  }
  deleteQuestion(id) {
    return this.http.delete(`${this.baseUrl}qualifiedFeedbackQuestions/${id}`);
  }

  deleteQuestionAnswer(answer_id) {
    return this.http.post(
      `${this.baseUrl}qualifiedFeedbackQuestions/answer/${answer_id}/delete
    `,
      {}
    );
  }

  postLeadFeedBack(lead_id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}qualifiedFeedbackQuestions/lead/${lead_id}/add`,
      payload
    );
  }
}
