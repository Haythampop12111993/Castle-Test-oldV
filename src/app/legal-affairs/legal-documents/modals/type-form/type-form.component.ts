import { LegalDocumentsService } from "./../../../services/legal-documents.service";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-type-form",
  templateUrl: "./type-form.component.html",
  styleUrls: ["./type-form.component.css"],
})
export class TypeFormComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  id = null;
  formData;

  constructor(private legalDocumentsService: LegalDocumentsService) {}

  ngOnInit() {}

  public open(parent_id = null, type?) {
    if (type) {
      let { id, name } = type;

      this.id = id;
      this.formData = {
        name,
        parent_id,
      };
    } else {
      this.id = null;
      this.formData = {
        name: "",
        parent_id,
      };
    }
    this.modalRef.open();
  }

  save() {
    let request;
    if (this.id) {
      request = this.legalDocumentsService.updateDocumentType(
        this.id,
        this.formData
      );
    } else {
      request = this.legalDocumentsService.postDocumentType(this.formData);
    }
    request.subscribe((res) => {
      this.onSave.emit();
      this.modalRef.close();
    });
  }
}
