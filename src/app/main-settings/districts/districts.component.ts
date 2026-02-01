import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ProjectsService } from "../../services/projects/projects.service";

@Component({
  selector: "app-districts",
  templateUrl: "./districts.component.html",
  styleUrls: ["./districts.component.css"],
})
export class DistrictsComponent implements OnInit {
  districts_list: any;
  cities_list: any;

  current_district: any;

  dataForm = {
    name: "",
    city_id: null,
  };

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.getDistricts();
    this.getCities();
  }

  getDistricts() {
    this.slimLoadingBarService.start();
    this.projectsService.getDistricts().subscribe(
      (res: any) => {
        this.districts_list = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
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

  deleteDistrict(question) {
    swal({
      title: "Are you sure?",
      text: "You will Delete this District!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectsService.deleteDistrict(question.id).subscribe(
          (res: any) => {
            this.getDistricts();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  openDistrictModal(modal, district?) {
    if (district) {
      this.current_district = district;

      this.dataForm.name = district.name;
      this.dataForm.city_id = district.city_id;
    } else {
      this.current_district = null;

      this.dataForm = {
        name: "",
        city_id: null,
      };
    }
    modal.open();
  }

  sendDistrictModalSubmit(modal) {
    let request;
    if (this.current_district) {
      request = this.projectsService.updateDistrict(
        this.current_district.id,
        this.dataForm
      );
    } else {
      request = this.projectsService.addDistrict(this.dataForm);
    }

    this.slimLoadingBarService.start();
    request.subscribe(
      (res: any) => {
        modal.close();
        this.getDistricts();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
}
