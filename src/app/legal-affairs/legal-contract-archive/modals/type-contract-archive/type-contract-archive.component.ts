import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalContractArchivesService } from "../../../services/legal-contract-archives.service";

@Component({
  selector: "app-type-contract-archive",
  templateUrl: "./type-contract-archive.component.html",
  styleUrls: ["./type-contract-archive.component.css"],
})
export class TypeContractArchiveComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  id = null;
  formData;

  constructor(
    private legalContractArchivesService: LegalContractArchivesService
  ) {}

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
      request = this.legalContractArchivesService.updateContractArchiveType(
        this.id,
        this.formData
      );
    } else {
      request = this.legalContractArchivesService.postContractArchiveType(
        this.formData
      );
    }
    request.subscribe((res) => {
      this.onSave.emit();
      this.modalRef.close();
    });
  }
}
