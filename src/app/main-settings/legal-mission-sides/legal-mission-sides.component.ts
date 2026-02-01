import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LegalMissionsService } from "../../legal-affairs/services/legal-missions.service";

@Component({
  selector: "app-legal-mission-sides",
  templateUrl: "./legal-mission-sides.component.html",
  styleUrls: ["./legal-mission-sides.component.css"],
})
export class LegalMissionSidesComponent implements OnInit {
  add_side: any;

  Sides: any[];

  current_selected_side: any;

  constructor(
    private legalMissionsService: LegalMissionsService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllSides();
  }

  addSide() {
    const sideData = {
      name: this.add_side,
    };
    this.legalMissionsService.postMissionSide(sideData).subscribe(
      (data: any) => {
        this.getAllSides();
        this.add_side = "";
        swal("Side added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteSide(id) {
    this.legalMissionsService.deleteMissionSide(id).subscribe(
      (data: any) => {
        swal("Side deleted successfully", "", "success");
        this.getAllSides();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllSides(page?) {
    this.legalMissionsService.getMissionSides(page).subscribe(
      (data: any) => {
        this.Sides = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editSide(side) {
    this.current_selected_side = side;
    this.add_side = this.current_selected_side.name;
  }

  updateSide() {
    const sideData = {
      name: this.add_side,
    };
    this.legalMissionsService
      .updateMissionSide(this.current_selected_side.id, sideData)
      .subscribe(
        (res: any) => {
          this.current_selected_side = undefined;
          this.add_side = "";
          this.getAllSides();

          swal("Success", "Edited Side successfully", "success");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  cancelUpdate() {
    this.current_selected_side = undefined;
  }
}
