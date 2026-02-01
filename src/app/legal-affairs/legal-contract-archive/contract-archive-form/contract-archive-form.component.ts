import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { environment } from "../../../../environments/environment";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { LegalContractArchivesService } from "../../services/legal-contract-archives.service";

@Component({
  selector: "app-contract-archive-form",
  templateUrl: "./contract-archive-form.component.html",
  styleUrls: ["./contract-archive-form.component.css"],
})
export class ContractArchiveFormComponent implements OnInit {
  // flags
  submitted = false;
  is_submitting: boolean = false;

  folder_id;
  contract_archive_id;

  // form
  form_data: any = {
    name: "",
    desc: "",
    type_id: "",

    files: [],
  };

  errors = {};

  editorConfig = {
    skin: false,
    inline_styles: false,
    base_url: `${environment.baseHREF}tinymce`,
    suffix: ".min",
    height: 300,
    directionality: "rtl",
    toolbar: `fullscreen | code |preview | formatselect | a11ycheck ltr rtl | alignleft aligncenter alignright alignjustify | undo redo | bold italic underline | outdent indent |  numlist bullist checklist | casechange permanentpen formatpainter removeformat | fullscreen  preview print | media pageembed link`,
    menubar: "custom",
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private legalContractArchivesService: LegalContractArchivesService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlingservice: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.contract_archive_id = params["id"];
      if (this.contract_archive_id) {
        this.getContractArchive();
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.folder_id = params["folder_id"];
      if (!this.folder_id) {
        this.router.navigate([
          "/",
          "pages",
          "legal-affairs",
          "contract-archives",
        ]);
      }
      this.form_data.type_id = this.folder_id;
    });
  }

  getContractArchive() {
    this.slimLoadingBarService.start();
    this.legalContractArchivesService
      .getContractArchive(this.contract_archive_id)
      .subscribe(
        (res: any) => {
          this.contract_archive_id = res.id;
          const { name, desc } = res;
          this.form_data = {
            name,
            desc,
            type_id: this.folder_id,
          };
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

  handleUploadFiles(event) {
    this.form_data.files = [];
    if (event.target.files && event.target.files.length) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form_data.files.push({
            file_name: file.name,
            file_type: file.type,
            file_value: (reader.result as any).split(",")[1],
          });
        };
      }
    }
  }

  save() {
    this.submitted = true;

    let request;
    if (this.contract_archive_id) {
      request = this.legalContractArchivesService.updateContractArchive(
        this.contract_archive_id,
        this.form_data
      );
    } else {
      request = this.legalContractArchivesService.postContractArchive(
        this.form_data
      );
    }
    this.is_submitting = true;
    request
      .subscribe(
        (res) => {
          if (res && res.errors) {
            this.errors = res.errors;
          } else {
            this.router.navigate([
              "/",
              "pages",
              "legal-affairs",
              "contract-archives",
              this.folder_id,
            ]);
          }
        },
        (err) => {
          if (err.error.error) {
            this.errorHandlingservice.handleErorr(err);
          }
        }
      )
      .add(() => {
        this.is_submitting = false;
      });
  }
}
