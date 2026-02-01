import { Router } from "@angular/router";
import { ErrorHandlerService } from "./../../../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ActivatedRoute } from "@angular/router";
import { LegalCasesService } from "./../../services/legal-cases.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-case-view",
  templateUrl: "./case-view.component.html",
  styleUrls: ["./case-view.component.css"],
})
export class CaseViewComponent implements OnInit {
  company_name = environment.statics.projectName;

  @ViewChild("fileInput") fileInput;

  // data
  case_id;
  case;
  typeMapping = {
    CRED: this.company_name,
    Lead: "عميل",
    Company: "شركة / شخص",
  };

  filesToUpload = [];

  userData: any = JSON.parse(localStorage.getItem("userProfile"));

  constructor(
    private legalCasesService: LegalCasesService,
    private router: Router,
    private route: ActivatedRoute,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlingservice: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.case_id = params["id"];
      if (this.case_id) {
        this.getCase();
      } else {
        this.router.navigate(["/", "pages", "legal-affairs", "cases"]);
      }
    });
  }

  getCase() {
    this.slimLoadingBarService.start();
    this.legalCasesService
      .getCase(this.case_id)
      .subscribe(
        (res: any) => {
          this.loadCase(res);
        },
        (err) => {
          if (err.error.error) {
            this.errorHandlingservice.handleErorr(err);
          }
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }

  loadCase(case_document) {
    case_document.files.forEach((file) => {
      file.name = file.url.split("/").pop();
    });

    case_document.logs.forEach((log) => {
      log.files.forEach((file) => {
        file.name = file.url.split("/").pop();
      });
    });

    this.case = case_document;
  }

  // file Management

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

  uploadFiles() {
    this.legalCasesService
      .uploadCaseFiles(this.case.id, {
        files: this.filesToUpload,
      })
      .subscribe((res) => {
        this.getCase();

        this.filesToUpload = [];
        this.fileInput.nativeElement.value = "";
      });
  }

  deleteFile(id) {
    this.legalCasesService.deleteCaseFile(id).subscribe((res) => {
      this.getCase();
    });
  }

  openFile(url) {
    window.open(url);
  }
}
