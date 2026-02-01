import { FeedQuestionsService } from "../../../../services/lead-service/feed-questions-service.service";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ErrorHandlerService } from "../../../../services/shared/error-handler.service";

@Component({
  selector: "app-feedback-modal",
  templateUrl: "./feedback-modal.component.html",
  styleUrls: ["./feedback-modal.component.css"],
})
export class FeedbackModalComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  lead_id = null;
  formData;

  questions_list = [];

  submitting = false;
  constructor(
    private feedQuestionsService: FeedQuestionsService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.feedQuestionsService.getQuestionsList().subscribe((res: any) => {
      this.questions_list = res;
    });
  }

  public open(lead_id = null) {
    this.lead_id = lead_id;
    this.formData = {
      feedbacks: {},
      comment: "",
    };

    this.modalRef.open();
  }

  save() {
    const payload = {
      feedbacks: Object.entries(this.formData.feedbacks).map(
        ([key, value]) => ({
          question_id: key,
          answer_id: value,
        })
      ),
      comment: this.formData.comment,
    };
    this.submitting = true;
    this.feedQuestionsService
      .postLeadFeedBack(this.lead_id, payload)
      .subscribe(
        (res) => {
          this.onSave.emit();
          this.modalRef.close();
        },
        (err) => this.errorHandlerService.handleErorr(err)
      )
      .add(() => {
        this.submitting = false;
      });
  }
}
