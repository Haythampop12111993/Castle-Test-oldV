import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalDocumentsService } from "../../../services/legal-documents.service";

@Component({
  selector: "app-view-document",
  templateUrl: "./view-document.component.html",
  styleUrls: ["./view-document.component.css"],
})
export class ViewDocumentComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;
  @ViewChild("fileInput") fileInput;

  document;
  filesToUpload = [];

  refetchData = false;
  constructor(private legalDocumentsService: LegalDocumentsService) {}

  ngOnInit() {}

  public open(document) {
    this.loadDocument(document);
    this.modalRef.open();
  }

  fetchDocument() {
    this.refetchData = true;
    this.legalDocumentsService
      .getDocument(this.document.id)
      .subscribe((res) => {
        this.loadDocument(res);
      });
  }

  loadDocument(document) {
    document.files.forEach((file) => {
      file.name = file.url.split("/").pop();
    });

    this.document = document;
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
    this.legalDocumentsService.deleteDocumentFile(id).subscribe((res) => {
      this.fetchDocument();
    });
  }

  uploadFiles() {
    this.legalDocumentsService
      .uploadDocumentFiles(this.document.id, {
        files: this.filesToUpload,
      })
      .subscribe((res) => {
        this.fetchDocument();

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
