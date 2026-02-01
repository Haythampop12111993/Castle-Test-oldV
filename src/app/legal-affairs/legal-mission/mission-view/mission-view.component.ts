import { Router } from "@angular/router";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ActivatedRoute } from "@angular/router";
import { LegalMissionsService } from "../../services/legal-missions.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-mission-view",
  templateUrl: "./mission-view.component.html",
  styleUrls: ["./mission-view.component.css"],
})
export class MissionViewComponent implements OnInit {
  company_name = environment.statics.projectName;

  @ViewChild("fileInput") fileInput;

  // data
  mission_id;
  mission;
  typeMapping = {
    CRED: this.company_name,
    Lead: "عميل",
    Company: "شركة / شخص",
  };

  filesToUpload = [];

  userData: any = JSON.parse(localStorage.getItem("userProfile"));

  constructor(
    private legalMissionsService: LegalMissionsService,
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
      } else {
        this.router.navigate(["/", "pages", "legal-affairs", "missions"]);
      }
    });
  }

  getMission() {
    this.slimLoadingBarService.start();
    this.legalMissionsService
      .getMission(this.mission_id)
      .subscribe(
        (res: any) => {
          this.loadMission(res);
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

  loadMission(mission_document) {
    mission_document.files.forEach((file) => {
      file.name = file.url.split("/").pop();
    });

    mission_document.logs.forEach((log) => {
      log.files.forEach((file) => {
        file.name = file.url.split("/").pop();
      });
    });

    this.mission = mission_document;
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
    this.legalMissionsService
      .uploadMissionFiles(this.mission.id, {
        files: this.filesToUpload,
      })
      .subscribe((res) => {
        this.getMission();

        this.filesToUpload = [];
        this.fileInput.nativeElement.value = "";
      });
  }

  deleteFile(id) {
    this.legalMissionsService.deleteMissionFile(id).subscribe((res) => {
      this.getMission();
    });
  }

  openFile(url) {
    window.open(url);
  }
}
