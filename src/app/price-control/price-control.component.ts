import { Observable } from "rxjs/Observable";
import { ReservationService } from "./../services/reservation-service/reservation.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ProjectsService } from "./../services/projects/projects.service";
import { Component, OnInit } from "@angular/core";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import swal from "sweetalert2";

@Component({
  selector: "app-price-control",
  templateUrl: "./price-control.component.html",
  styleUrls: ["./price-control.component.css"],
})
export class PriceControlComponent implements OnInit {
  price_control_form: FormGroup;
  projects: any;
  arrSearch: any;
  dataFromSearch: any;
  chosen_unit: any;
  types: any;
  current_project: any = [];
  phases: any;
  floors: any;
  designTypes: any;
  finishing_types: any;
  units_count: number = 0;
  allStatus: any = [
    "All",
    "Available",
    "Not Available",
    "Blocked",
    "Temp Blocked",
    "Reserved",
    "Blocked By Me",
    "Pending Finance Action",
    "Development Hold",
  ];
  price_types: any[] = ["Percentage", "Fixed"];

  constructor(
    private projectService: ProjectsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private http: HttpClient
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getProjects();
    this.getAllFinishingTypes();
  }
  createForm() {
    this.price_control_form = this.fb.group({
      project_id: new FormControl(null, Validators.required),
      type: [null],
      floor: [null],
      phase_id: [null],
      status: [null],
      block_num: [null],
      bed_rooms: [null],
      area_from: [null],
      area_to: [null],
      finishing_type_id: [null, Validators.required],
      price_type: ["Percentage", Validators.required],
      price_value: [null, Validators.required],
      comment: [null],
    });
    this.price_control_form.get("project_id").valueChanges.subscribe((val) => {
      if (val != "All") {
        this.price_control_form.addControl("unit_id", new FormControl(""));
      }
    });
  }

  getUnitsCount() {
    let params = this.price_control_form.value;
    params.get_count = 1;
    this.projectService.filterUnits(params.project_id, params).subscribe(
      (res: number) => {
        this.units_count = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    )
  }

  getAllFinishingTypes() {
    this.slimLoadingBarService.complete();
    this.projectService.getAllFinishingTypes().subscribe(
      (res: any) => {
        this.finishing_types = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  observableSource = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let project_id: any = this.price_control_form.get("project_id").value;
    let data = {
      unit_serial: keyword,
    };
    if (keyword) {
      return this.http
        .post(`${baseUrl}units/${project_id}/search`, JSON.stringify(data))
        .map((res: any) => {
          console.log(res.length);
          if (res.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res;
            res.forEach((e) => {
              this.arrSearch.push(e.serial);
            });
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  getProjects() {
    this.reservationService.getProjects({ is_select_form: true }).subscribe(
      (res: any) => {
        this.projects = res;
      },
      (err) => console.log(err)
    );
  }

  selectUnit(unit_serial) {
    console.log(unit_serial);
    this.dataFromSearch.forEach((e) => {
      if (e.serial == unit_serial) {
        this.price_control_form.get("unit_id").patchValue(e.id);
      }
    });
    console.log(this.price_control_form.get("unit_id").value);
  }


  checkproject(project_id) {
    this.getcurrentproject(project_id);
    this.projects.forEach((element) => {
      if (element.id == project_id) {
        this.phases = element.phases;
      }
    });
    this.getUnitTypes(project_id);
    if (project_id > 0) {
      this.getAllFloors(project_id);
    } else {
      this.getAllFloors();
    }
  }

  getcurrentproject(project_id) {
    this.slimLoadingBarService.start();
    this.projectService.getcurrentproject(project_id).subscribe(
      (data) => {
        this.current_project = data;
        this.phases =
          this.current_project && this.current_project.phases
            ? this.current_project.phases.filter((phase) => phase.serial)
            : [];
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getUnitTypes(project_id) {
    this.slimLoadingBarService.start();
    this.projectService.getUnitTypes(project_id).subscribe(
      (data) => {
        this.types = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getAllFloors(projectId?) {
    this.slimLoadingBarService.start();
    let params: any = {};
    if (projectId) {
      params.project_id = projectId;
    }
    this.projectService.getFloors(params).subscribe(
      (res: any) => {
        this.floors = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  submit() {
    let payload = this.price_control_form.value;
    payload.project_id = +payload.project_id;
    console.log(payload);
    this.slimLoadingBarService.start();
    this.projectService.requestUnitPriceChange(payload).subscribe(
      (res: any) => {
        this.createForm();
        swal(res, "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
}
