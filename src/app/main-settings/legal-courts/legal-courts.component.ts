import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LegalCasesService } from "../../legal-affairs/services/legal-cases.service";

@Component({
  selector: "app-legal-courts",
  templateUrl: "./legal-courts.component.html",
  styleUrls: ["./legal-courts.component.css"],
})
export class LegalCourtsComponent implements OnInit {
  add_court: any;

  courts: any[];

  current_selected_court: any;

  constructor(
    private legalCasesService: LegalCasesService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllCourts();
  }

  addCourt() {
    const courtData = {
      name: this.add_court,
    };
    this.legalCasesService.postCourt(courtData).subscribe(
      (data: any) => {
        this.getAllCourts();
        this.add_court = "";
        swal("Court added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteCourt(id) {
    this.legalCasesService.deleteCourt(id).subscribe(
      (data: any) => {
        swal("Court deleted successfully", "", "success");
        this.getAllCourts();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllCourts(page?) {
    this.legalCasesService.getCourts(page).subscribe(
      (data: any) => {
        this.courts = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editCourt(court) {
    this.current_selected_court = court;
    this.add_court = this.current_selected_court.name;
  }

  updateCourt() {
    const courtData = {
      name: this.add_court,
    };
    this.legalCasesService
      .updateCourt(this.current_selected_court.id, courtData)
      .subscribe(
        (res: any) => {
          this.current_selected_court = undefined;
          this.add_court = "";
          this.getAllCourts();

          swal("Success", "Edited Court successfully", "success");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  cancelUpdate() {
    this.current_selected_court = undefined;
  }
}
