import { id } from "date-fns/locale";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalCasesService } from "../../../../services/legal-cases.service";

@Component({
  selector: "app-change-case-status",
  templateUrl: "./change-case-status.component.html",
  styleUrls: ["./change-case-status.component.css"],
})
export class ChangeCaseStatusComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  case_id = null;
  currunt_status_id = null;

  formData;

  // selects
  StatusesArray = [];

  constructor(private legalCasesService: LegalCasesService) {}

  ngOnInit() {
    this.getStatuses();
  }

  getStatuses() {
    this.legalCasesService.getCaseStatuses().subscribe((res: any) => {
      this.StatusesArray = res;
    });
  }

  public open(case_id, status_id) {
    this.case_id = case_id;
    this.currunt_status_id = status_id;

    this.formData = {
      make_reminder: true,
      datetime: "",
      status_id: this.currunt_status_id,
      details: "",
    };

    this.modalRef.open();
  }

  save() {
    if (!this.formData.make_reminder) {
      delete this.formData.datetime;
    }
    this.legalCasesService
      .changeCaseStatus(this.case_id, this.formData)
      .subscribe((res) => {
        this.onSave.emit();
        this.modalRef.close();
      });
  }
}
