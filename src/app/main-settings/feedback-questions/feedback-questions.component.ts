import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { FeedQuestionsService } from "../../services/lead-service/feed-questions-service.service";

@Component({
  selector: "app-feedback-questions",
  templateUrl: "./feedback-questions.component.html",
  styleUrls: ["./feedback-questions.component.css"],
})
export class FeedbackQuestionsComponent implements OnInit {
  questions_list: any;

  current_question: any;

  dataForm = {
    question: "",
    answers: [],
  };

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private feedQuestionsService: FeedQuestionsService
  ) {}

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    this.slimLoadingBarService.start();
    this.feedQuestionsService.getQuestionsList().subscribe(
      (res: any) => {
        this.questions_list = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deleteFeedQuestion(question) {
    swal({
      title: "Are you sure?",
      text: "You will Delete this Question!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.feedQuestionsService.deleteQuestion(question.id).subscribe(
          (res: any) => {
            this.getQuestions();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  openFeedQuestionModal(modal, question?) {
    if (question) {
      this.current_question = question;

      this.dataForm.question = question.question;
      this.dataForm.answers = question.answers;
    } else {
      this.current_question = null;

      this.dataForm = {
        question: "",
        answers: [],
      };
    }
    modal.open();
  }

  sendFeedQuestionModalSubmit(modal) {
    let request;
    if (this.current_question) {
      request = this.feedQuestionsService.updateQuestion(
        this.current_question.id,
        this.dataForm
      );
    } else {
      request = this.feedQuestionsService.createQuestion(this.dataForm);
    }

    this.slimLoadingBarService.start();
    request.subscribe(
      (res: any) => {
        modal.close();
        this.getQuestions();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  addAnswer() {
    this.dataForm.answers.push({ answer: "", id: null });
  }

  deleteAnswer(index) {
    if (this.dataForm.answers[index].id) {
      this.feedQuestionsService
        .deleteQuestionAnswer(this.dataForm.answers[index].id)
        .subscribe(
          (res: any) => {
            this.dataForm.answers.splice(index, 1);
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    } else {
      this.dataForm.answers.splice(index, 1);
    }
  }
}
