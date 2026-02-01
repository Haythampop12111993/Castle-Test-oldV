import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalCasesService } from "../../../../services/legal-cases.service";

@Component({
  selector: "app-case-files",
  templateUrl: "./case-files.component.html",
  styleUrls: ["./case-files.component.css"],
})
export class CaseFilesComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;
  @ViewChild("fileInput") fileInput;

  case_data;
  filesToUpload = [];

  refetchData = false;
  constructor(private legalCasesService: LegalCasesService) {}

  ngOnInit() {}

  public open(case_data) {
    this.loadCase(case_data);
    this.modalRef.open();
  }

  fetchCase() {
    this.refetchData = true;
    this.legalCasesService.getCase(this.case_data.id).subscribe((res) => {
      this.loadCase(res);
    });
  }

  loadCase(case_data) {
    case_data.files.forEach((file) => {
      file.name = file.url.split("/").pop();
    });

    this.case_data = case_data;
  }

  handleUploadFiles(event) {
    this.filesToUpload = [];
    if (event.target.files && event.target.files.length) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.filesToUpload.push({
            file_name: file.name,
            file_type: file.type,
            file_value: (reader.result as any).split(",")[1],
          });
        };
      }
    }
  }

  // file Management
  openFile(url) {
    window.open(url);
  }

  deleteFile(id) {
    this.legalCasesService.deleteCaseFile(id).subscribe((res) => {
      this.fetchCase();
    });
  }

  uploadFiles() {
    this.legalCasesService
      .uploadCaseFiles(this.case_data.id, {
        files: this.filesToUpload,
      })
      .subscribe((res) => {
        this.fetchCase();

        this.filesToUpload = [];
        this.fileInput.nativeElement.value = "";
      });
  }

  // modal Manage
  onClose() {
    if (this.refetchData) {
      this.onSave.emit();
    }
  }
}
