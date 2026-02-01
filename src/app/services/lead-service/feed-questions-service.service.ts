import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { environment } from "../../../environments/environment";

// lead service

@Injectable()
export class FeedQuestionsService {
  baseUrl: string = environment.api_base_url;

  constructor(private http: HttpClient) {}

  getQuestionsList() {
    return this.http.get(`${this.baseUrl}feedbackQuestions`);
  }

  createQuestion(data) {
    return this.http.post(`${this.baseUrl}feedbackQuestions`, data);
  }
  updateQuestion(id, data) {
    return this.http.post(
      `${this.baseUrl}feedbackQuestions/${id}`,
      JSON.stringify(data)
    );
  }
  deleteQuestion(id) {
    return this.http.delete(`${this.baseUrl}feedbackQuestions/${id}`);
  }

  deleteQuestionAnswer(answer_id) {
    return this.http.post(
      `${this.baseUrl}feedbackQuestions/answer/${answer_id}/delete
    `,
      {}
    );
  }
  postLeadFeedBack(lead_id, payload = {}) {
    return this.http.post(
      `${this.baseUrl}feedbackQuestions/lead/${lead_id}/add_feedback`,
      payload
    );
  }
}
