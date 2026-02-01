import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LegalMissionsService } from "../../legal-affairs/services/legal-missions.service";

@Component({
  selector: "app-legal-mission-statuses",
  templateUrl: "./legal-mission-statuses.component.html",
  styleUrls: ["./legal-mission-statuses.component.css"],
})
export class LegalMissionStatusesComponent implements OnInit {
  add_status: any;

  statuses: any[];

  current_selected_status: any;

  constructor(
    private legalMissionsService: LegalMissionsService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllStatuses();
  }

  addStatus() {
    const statusData = {
      name: this.add_status,
    };
    this.legalMissionsService.postMissionStatus(statusData).subscribe(
      (data: any) => {
        this.getAllStatuses();
        this.add_status = "";
        swal("Status added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteStatus(id) {
    this.legalMissionsService.deleteMissionStatus(id).subscribe(
      (data: any) => {
        swal("Status deleted successfully", "", "success");
        this.getAllStatuses();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllStatuses(page?) {
    this.legalMissionsService.getMissionStatuses(page).subscribe(
      (data: any) => {
        this.statuses = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editStatus(status) {
    this.current_selected_status = status;
    this.add_status = this.current_selected_status.name;
  }

  updateStatus() {
    const statusData = {
      name: this.add_status,
    };
    this.legalMissionsService
      .updateMissionStatus(this.current_selected_status.id, statusData)
      .subscribe(
        (res: any) => {
          this.current_selected_status = undefined;
          this.add_status = "";
          this.getAllStatuses();

          swal("Success", "Edited Status successfully", "success");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  cancelUpdate() {
    this.current_selected_status = undefined;
  }
}
