import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LegalMissionsService } from "../../../../services/legal-missions.service";

@Component({
  selector: "app-change-mission-status",
  templateUrl: "./change-mission-status.component.html",
  styleUrls: ["./change-mission-status.component.css"],
})
export class ChangeMissionStatusComponent implements OnInit {
  @Output() onSave = new EventEmitter();

  @ViewChild("modalRef") modalRef;

  mission_id = null;
  currunt_status_id = null;

  formData;

  // selects
  StatusesArray = [];

  constructor(private legalMissionsService: LegalMissionsService) {}

  ngOnInit() {
    this.getStatuses();
  }

  getStatuses() {
    this.legalMissionsService.getMissionStatuses().subscribe((res: any) => {
      this.StatusesArray = res;
    });
  }

  public open(mission_id, status_id) {
    this.mission_id = mission_id;
    this.currunt_status_id = status_id;

    this.formData = {
      make_reminder: true,
      datetime: "",
      status_id: this.currunt_status_id,
      details: "",
    };

    this.modalRef.open();
  }

  save() {
    if (!this.formData.make_reminder) {
      delete this.formData.datetime;
    }
    this.legalMissionsService
      .changeMissionStatus(this.mission_id, this.formData)
      .subscribe((res) => {
        this.onSave.emit();
        this.modalRef.close();
      });
  }
}
