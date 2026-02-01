import { QualifiedFeedbackQuestionsService } from "../../../../services/lead-service/qualified-feedback-questions-service.service";
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
  selector: "app-qualification-modal",
  templateUrl: "./qualification-modal.component.html",
  styleUrls: ["./qualification-modal.component.css"],
})
export class QualificationModalComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  lead_id = null;
  formData;

  questions_list = [];

  submitting = false;
  constructor(
    private qualifiedFeedbackQuestionsService: QualifiedFeedbackQuestionsService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.qualifiedFeedbackQuestionsService
      .getQuestionsList()
      .subscribe((res: any) => {
        this.questions_list = res;
      });
  }

  public open(lead_id = null) {
    this.lead_id = lead_id;
    this.formData = {
      status: null,
      feedbacks: {},
      comment: "",
    };

    this.modalRef.open();
  }

  save() {
    const payload = {
      status: this.formData.status,
      feedbacks: Object.entries(this.formData.feedbacks).map(
        ([key, value]) => ({
          question_id: key,
          answer_id: value,
        })
      ),
      comment: this.formData.comment,
    };

    this.submitting = true;
    this.qualifiedFeedbackQuestionsService
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
