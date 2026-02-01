import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalCasesService } from "../../../../services/legal-cases.service";

@Component({
  selector: "app-case-note-form",
  templateUrl: "./case-note-form.component.html",
  styleUrls: ["./case-note-form.component.css"],
})
export class CaseNoteFormComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  case_id = null;
  formData;

  constructor(private legalCasesService: LegalCasesService) {}

  ngOnInit() {}

  public open(case_id) {
    this.case_id = case_id;

    this.formData = {
      make_reminder: true,
      datetime: "",
      details: "",
      files: [],
    };

    this.modalRef.open();
  }

  handleUploadFiles(event) {
    this.formData.files = [];
    if (event.target.files && event.target.files.length) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.formData.files.push({
            file_name: file.name,
            file_type: file.type,
            file_value: (reader.result as any).split(",")[1],
          });
        };
      }
    }
  }

  save() {
    if (!this.formData.make_reminder) {
      delete this.formData.datetime;
    }
    this.legalCasesService
      .addNoteToCase(this.case_id, this.formData)
      .subscribe((res) => {
        this.onSave.emit();
        this.modalRef.close();
      });
  }
}
