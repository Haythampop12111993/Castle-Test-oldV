import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalContractArchivesService } from "../../../services/legal-contract-archives.service";

@Component({
  selector: "app-view-contract-archive",
  templateUrl: "./view-contract-archive.component.html",
  styleUrls: ["./view-contract-archive.component.css"],
})
export class ViewContractArchiveComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;
  @ViewChild("fileInput") fileInput;

  contractArchive;
  filesToUpload = [];

  refetchData = false;
  constructor(
    private legalContractArchivesService: LegalContractArchivesService
  ) {}

  ngOnInit() {}

  public open(contractArchive) {
    this.loadContractArchive(contractArchive);
    this.modalRef.open();
  }

  fetchContractArchive() {
    this.refetchData = true;
    this.legalContractArchivesService
      .getContractArchive(this.contractArchive.id)
      .subscribe((res) => {
        this.loadContractArchive(res);
      });
  }

  loadContractArchive(contractArchive) {
    contractArchive.files.forEach((file) => {
      file.name = file.url.split("/").pop();
    });

    this.contractArchive = contractArchive;
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
    this.legalContractArchivesService
      .deleteContractArchiveFile(id)
      .subscribe((res) => {
        this.fetchContractArchive();
      });
  }

  uploadFiles() {
    this.legalContractArchivesService
      .uploadContractArchiveFiles(this.contractArchive.id, {
        files: this.filesToUpload,
      })
      .subscribe((res) => {
        this.fetchContractArchive();

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
