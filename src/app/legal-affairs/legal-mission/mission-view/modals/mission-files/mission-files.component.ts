import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalMissionsService } from "../../../../services/legal-missions.service";

@Component({
  selector: "app-mission-files",
  templateUrl: "./mission-files.component.html",
  styleUrls: ["./mission-files.component.css"],
})
export class MissionFilesComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;
  @ViewChild("fileInput") fileInput;

  mission_data;
  filesToUpload = [];

  refetchData = false;
  constructor(private legalMissionsService: LegalMissionsService) {}

  ngOnInit() {}

  public open(mission_data) {
    this.loadMission(mission_data);
    this.modalRef.open();
  }

  fetchMission() {
    this.refetchData = true;
    this.legalMissionsService
      .getMission(this.mission_data.id)
      .subscribe((res) => {
        this.loadMission(res);
      });
  }

  loadMission(mission_data) {
    mission_data.files.forEach((file) => {
      file.name = file.url.split("/").pop();
    });

    this.mission_data = mission_data;
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
    this.legalMissionsService.deleteMissionFile(id).subscribe((res) => {
      this.fetchMission();
    });
  }

  uploadFiles() {
    this.legalMissionsService
      .uploadMissionFiles(this.mission_data.id, {
        files: this.filesToUpload,
      })
      .subscribe((res) => {
        this.fetchMission();

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
