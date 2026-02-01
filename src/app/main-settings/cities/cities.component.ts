import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ProjectsService } from "../../services/projects/projects.service";

@Component({
  selector: "app-cities",
  templateUrl: "./cities.component.html",
  styleUrls: ["./cities.component.css"],
})
export class CitiesComponent implements OnInit {
  cities_list: any;

  current_district: any;

  dataForm = {
    name: "",
  };

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.getCities();
  }

  getCities() {
    this.slimLoadingBarService.start();
    this.projectsService.getCities().subscribe(
      (res: any) => {
        this.cities_list = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deleteCity(question) {
    swal({
      title: "Are you sure?",
      text: "You will Delete this City!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectsService.deleteCity(question.id).subscribe(
          (res: any) => {
            this.getCities();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  openCityModal(modal, district?) {
    if (district) {
      this.current_district = district;

      this.dataForm.name = district.name;
    } else {
      this.current_district = null;

      this.dataForm = {
        name: "",
      };
    }
    modal.open();
  }

  sendCityModalSubmit(modal) {
    let request;
    if (this.current_district) {
      request = this.projectsService.updateCity(
        this.current_district.id,
        this.dataForm
      );
    } else {
      request = this.projectsService.addCity(this.dataForm);
    }

    this.slimLoadingBarService.start();
    request.subscribe(
      (res: any) => {
        modal.close();
        this.getCities();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
}
