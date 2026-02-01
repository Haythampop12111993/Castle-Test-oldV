import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalMissionsService } from "../../../../services/legal-missions.service";

@Component({
  selector: "app-mission-activity-form",
  templateUrl: "./mission-activity-form.component.html",
  styleUrls: ["./mission-activity-form.component.css"],
})
export class MissionActivityFormComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  mission_id = null;
  formData;

  constructor(private legalMissionsService: LegalMissionsService) {}

  ngOnInit() {}

  public open(mission_id) {
    this.mission_id = mission_id;

    this.formData = {
      make_reminder: true,
      datetime: "",
      details: "",
      files: [],
    };

    this.modalRef.open();
  }

  handleUploadFiles(event) {
    this.formData.files = [];
    if (event.target.files && event.target.files.length) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.formData.files.push({
            file_name: file.name,
            file_type: file.type,
            file_value: (reader.result as any).split(",")[1],
          });
        };
      }
    }
  }

  save() {
    if (!this.formData.make_reminder) {
      delete this.formData.datetime;
    }
    this.legalMissionsService
      .addActivityToMission(this.mission_id, this.formData)
      .subscribe((res) => {
        this.onSave.emit();
        this.modalRef.close();
      });
  }
}
