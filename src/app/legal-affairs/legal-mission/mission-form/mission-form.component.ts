import { LeadsService } from "../../../services/lead-service/lead-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LegalMissionsService } from "../../services/legal-missions.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-mission-form",
  templateUrl: "./mission-form.component.html",
  styleUrls: ["./mission-form.component.css"],
})
export class MissionFormComponent implements OnInit {
  company_name = environment.statics.projectName;
  // flags
  submitted = false;
  is_submitting: boolean = false;

  // data
  mission_id;

  // form
  form_data: any = {
    name: "",

    category_id: null,
    status_id: null,
    side_id: null,

    date: "",
    description: "",

    files: [],
  };

  // selects
  categoriesArray = [];
  StatusesArray = [];
  SidesArray = [];

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
    private legalMissionsService: LegalMissionsService,
    private leadsService: LeadsService,
    private router: Router,
    private route: ActivatedRoute,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlingservice: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.mission_id = params["id"];
      if (this.mission_id) {
        this.getMission();
      }
    });
    this.loadSelectsData();
  }

  getMission() {
    this.slimLoadingBarService.start();
    this.legalMissionsService
      .getMission(this.mission_id)
      .subscribe(
        (res: any) => {
          this.mission_id = res.id;
          const { name, category_id, status_id, side_id, date, description } =
            res;
          this.form_data = {
            name,
            category_id,
            status_id,
            side_id,
            date: date ? date.split(" ")[0] : "",
            description,
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

  loadSelectsData() {
    this.getCategories();
    this.getStatuses();
    this.getSides();
  }

  getCategories() {
    this.legalMissionsService.getMissionCategories().subscribe((res: any) => {
      this.categoriesArray = res;
    });
  }

  getStatuses() {
    this.legalMissionsService.getMissionStatuses().subscribe((res: any) => {
      this.StatusesArray = res;
    });
  }

  getSides() {
    this.legalMissionsService.getMissionSides().subscribe((res: any) => {
      this.SidesArray = res;
    });
  }

  // inputs handlers
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

    if (this.mission_id) {
      request = this.legalMissionsService.updateMission(
        this.mission_id,
        this.form_data
      );
    } else {
      request = this.legalMissionsService.postMission(this.form_data);
    }
    this.is_submitting = true;
    request
      .subscribe(
        (res) => {
          if (res.errors) {
            this.errors = res.errors;
          } else {
            this.router.navigate(["/", "pages", "legal-affairs", "missions"]);
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
