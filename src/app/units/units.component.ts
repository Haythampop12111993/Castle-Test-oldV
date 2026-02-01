import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { CookieService } from "ngx-cookie-service";
import swal from "sweetalert2";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ProjectsService } from "./../services/projects/projects.service";
import { ReservationService } from "./../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";

import * as wNumb from "wnumb";

@Component({
  selector: "app-units",
  templateUrl: "./units.component.html",
  styleUrls: ["./units.component.css"],
})
export class UnitsComponent implements OnInit {
  //#region  Definitions
  pagination: any;
  project_id: any;
  projects: any;
  phases: any;
  unit_type_id: any;
  private sub: any;
  projectUnits: any = [];
  current_project: any = [];
  userInfo: any;
  blockForm: FormGroup;
  times: any;
  reasons: any;
  last_page_url: any;
  prev_page_url: any;
  current_page: any = 1;
  page: any = 1;
  filterForm: FormGroup;
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
  borkerStatus: any = [
    "Available",
  ];
  // floors: any = ['0', '1', '2', '3', '4', '5', '6', '7'];
  floors: any = [];
  area: any = ["area 1", "area 2", "area 3", "area 4", "area 5"];
  types: any;
  interval: any;
  filterActive: boolean = false;
  filterData: any;
  stopReservation: any = false;
  reason: any;
  blockReasonData: any;
  units_reservation_modal_data: any;
  is_refreshing: boolean = false;
  unitComment: any;
  per_page: any;
  total: any;
  units_raw_data: any;
  lg: string = "lg";
  someRange2config: any = {
    start: [40, 60],
    behaviour: "drag",
    connect: true,
    step: 0.5,
    range: {
      min: 1,
      max: 50,
    },
  };
  someRange2: any = [1, 20];
  view_masterplan: any;

  can_view_masterplan: boolean = true;

  /* masterplan prop */
  paths: any;
  readyToRender: boolean = false;
  img: any;
  stage: string;
  district_path: any;
  masterplanCanView: any;
  role: any = window.localStorage.getItem("role");
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));

  current_unit_id: any;
  comment: any;

  check_all = false;

  dropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  phasesDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "serial",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  fihishingTypeDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  value: any;

  price = [];

  min_price: any;
  max_price: any;

  finishing_types: any;

  priceRangeSlider: any = {
    tooltips: [
      wNumb({
        decimals: 2,
        thousand: ",",
      }),
      wNumb({ decimals: 2, thousand: "," }),
    ],
    // tooltips: [true, true]
  };
  unit_index: any;

  filter_collapsed = true;

  sortValues = ["", "asc", "desc"];
  sort = {
    sort_field: "price",
    sort_type: 0,
  };
  agents = [];
  isUnitsProject: boolean = false;
  //#endregion

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    public cookieService: CookieService,
    public router: Router,
    private reservationService: ReservationService,
    public slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    public errorHandlerService: ErrorHandlerService,
    public leadsService: LeadsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getAllFinishingTypes();
    this.getAllProjects();
    this.getPriceChange();
    this.getBlockSettings();
    this.createForm();
    this.dealWithLocalstorage();
    this.filterStatus();
    this.getParams();
    this.getQParams();
  }

  filterStatus() {
    if (
      this.userInfo.role == "Admin" ||
      this.userInfo.role == "Super Development"
    )
      this.allStatus = [...this.allStatus, "Nuca", "Partner"];
  }

  getQParams() {
    let params = this.route.snapshot.queryParams;

    if (params.masterplan == "true") {
      this.masterplanCanView = true;
      // this.view_masterplan = true;
    } else {
      this.masterplanCanView = false;
      // this.view_masterplan = true;
    }
    if (params.mode == "masterplan") {
      this.masterplanCanView = true;
      this.view_masterplan = true;
    }
    if (this.project_id || this.project_id > 0)
      this.getDistricts(this.project_id);
  }

  getParams() {
    const getFilteredUnits = [
      "area_from",
      "area_to",
      "bed_rooms",
      "block_num",
      "serial",
      "status",
      "type",
      "finishing_type_id",
      "floors",
      "floor",
      "phase_id",
      "price_start",
      "price_end",
    ].some((f) => this.route.snapshot.queryParams[f]);
    let params = this.route.snapshot.params;
    this.project_id = +params["id"];
    console.log(this.project_id, this.role, getFilteredUnits);

    if (this.project_id && this.project_id > 0) {
      if (
        this.project_id == 20 &&
        this.role != "Admin" &&
        this.role != "Super Development"
      ) {
        this.can_view_masterplan = false;
      }
      if (!getFilteredUnits) {
        this.getcurrentproject(this.project_id);
        if (this.project_id > 0 && !this.unit_type_id) {
          this.getAllProjectUnits(this.project_id);
        } else if (this.unit_type_id) {
          this.getProjectUnitsbytype(this.project_id, this.unit_type_id);
        }
      }

      // select current project
      this.filterForm.patchValue({
        project: this.project_id,
      });
      this.getAllFloors(this.project_id);
    } else {
      console.log(+params["id"]);
      if (!getFilteredUnits) {
        // this.getallunits();
      }
      this.getAllFloors();
    }

    if (+params["id"] === 0) {
      this.isUnitsProject = false;
    } else {
      this.isUnitsProject = true;
    }

    this.getUnitTypes(this.project_id);
    if (getFilteredUnits) {
      if(this.filterForm.get("type").value){
        this.filterForm.get("type").setValue(+this.filterForm.get("type").value);
      }
      this.filterUnits(false, false);
    }

    this.router.events.pairwise().subscribe((e) => {
      window.localStorage.removeItem("unit_type_id");
    });
  }

  changeSort() {
    this.sort.sort_type = (this.sort.sort_type + 1) % 3;
    this.filterUnits();
  }

  dealWithLocalstorage() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userProfile"));
    this.unit_type_id = window.localStorage.getItem("unit_type_id");
  }

  //#region Get Functions
  getBlockSettings() {
    this.projectService.getBlockSettings().subscribe((res: any) => {
      this.times = res.times;
      this.reasons = res.reasons;
      this.agents = res.users;
    });
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

  getAllProjectUnits(project_id) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    let payload: any = {
      page: this.current_page,
    };
    if (this.sort.sort_type > 0) {
      payload.sort_field = this.sort.sort_field;
      payload.sort_type = this.sortValues[this.sort.sort_type];
    }

    this.projectService.getAllProjectUnits(project_id, payload).subscribe(
      (data: any) => {
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.units_raw_data = data;
        this.current_page = data.current_page;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.projectUnits = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      }
    );
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

  getProjectUnitsbytype(project_id, unit_type_id) {
    this.pagination = [];
    this.current_page = 1;
    this.slimLoadingBarService.start();
    this.projectService
      .getProjectUnitsbytype(project_id, unit_type_id)
      .subscribe(
        (data: any) => {
          this.pagination = [];
          this.units_raw_data = data;
          let selected = true;
          for (var i = 1; i <= data.last_page; i++) {
            if (i > 1) selected = false;
            this.pagination.push({ number: i, selected: selected });
          }
          this.projectUnits = data.data;
          this.last_page_url = data.last_page_url;
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }

  unitOnOpen(pu) {
    this.projectService.getUnitDetails(pu.id).subscribe(
      (data) => {
        this.units_reservation_modal_data = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getallunits() {
    this.projectService
      .getAllUnits({ page: this.current_page })
      .subscribe((data: any) => {
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.units_raw_data = data;
        this.current_page = data.current_page;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.projectUnits = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      };
  }

  getDistricts(id) {
    this.projectService.getMasterPlanDistrict(id).subscribe(
      (res: any) => {
        this.paths = res.pathes;
        this.img = res.img;
        this.stage = "districts";
      },
      (err) => console.log(err)
    );
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
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
  getAllPhases() {
    this.phases = [];
    this.projects.forEach((project) => {
      this.phases = [...this.phases, ...project.phases];
    });
  }

  getAllFinishingTypes() {
    this.slimLoadingBarService.complete();
    this.projectsService.getAllFinishingTypes().subscribe(
      (res: any) => {
        this.finishing_types = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }
  //#endregion

  ngAfterViewInit() {
    // this.refresehUnits();
  }

  ngOnDestory() {
    // clearInterval(this.interval);
  }

  refresehUnits() {
    if (this.filterActive) {
      this.filterUnits(false, true);
    } else {
      if (this.current_page == 1) {
        if (this.project_id && this.project_id > 0) {
          this.getAllProjectUnits(this.project_id);
        } else {
          this.getallunits();
        }
      } else {
        this.filterUnits(undefined, undefined, this.current_page);
      }
    }
  }

  checkproject(data) {
    const project_id = data;
    this.project_id = data;
    this.getcurrentproject(project_id);

    this.projects.forEach((element) => {
      if (element.id == project_id) {
        this.phases = element.phases;
      }
    });
    this.getUnitTypes(data);
    this.onClearAllItems("floor");
    if (this.project_id > 0) {
      this.getAllFloors(this.project_id);
    } else {
      this.getAllFloors();
    }
  }

  createForm() {
    this.createBlockForm();
    this.createFilterForm();
  }

  createBlockForm() {
    this.blockForm = this.formBuilder.group({
      time: ["", Validators.required],
      reason: ["", Validators.required],
      user_id: [""],
      reason_comment: [""],
    });
  }

  parseArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    else return [data];
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      project: [this.project_id || "0"],
      type: [this.route.snapshot.queryParams.type || null],
      status: [this.route.snapshot.queryParams.status || null],
      floor: [this.parseArray(this.route.snapshot.queryParams.floor)],
      area_from: [this.route.snapshot.queryParams.area_from || null],
      bed_rooms: [this.route.snapshot.queryParams.bed_rooms || null],
      area_to: [this.route.snapshot.queryParams.area_to || null],
      block_num: [this.route.snapshot.queryParams.block_num || null],
      serial: [this.route.snapshot.queryParams.serial || null],
      phase_id: [this.parseArray(this.route.snapshot.queryParams.phase_id)],
      someRange2: [[1, 50]],
      finishing_type_id: [
        this.parseArray(this.route.snapshot.queryParams.finishing_type_id),
      ],
    });

    if (
      this.route.snapshot.queryParams.price_start &&
      this.route.snapshot.queryParams.price_end
    ) {
      this.price[0] = this.route.snapshot.queryParams.price_start;
      this.price[1] = this.route.snapshot.queryParams.price_end;
    }
  }

  resetFormFilter() {
    this.filterForm.patchValue({
      project: [this.project_id || "0"],
      type: [""],
      status: [""],
      floor: [[]],
      area_from: [""],
      bed_rooms: [""],
      area_to: [""],
      block_num: [""],
      serial: [""],
      phase_id: [""],
      someRange2: [[1, 50]],
      finishing_type_id: [""],
    });

    this.filterForm.get("floor").setValue("");
    this.filterForm.get("finishing_type_id").setValue("");
    this.filterForm.get("phase_id").setValue("");
  }

  pageChange(page) {
    console.log("page", this.page);
    if(page == this.page) return
    console.log("page change", this.page);
    this.page = page;
    if (this.filterActive) {
      this.filterUnits(false, true, this.current_page);
    } else {
      if (this.project_id && this.project_id > 0) {
        this.getAllProjectUnits(this.project_id);
      } else {
        this.getallunits();
      }
    }
  }

  filterUnits(is_export = false, cache = true, page?) {
    if (!page) {
      this.current_page = 1;
    }
    const formModel = this.filterForm.value;
    let data: any = {
      type: formModel.type,
      status: formModel.status,
      floor: formModel.floor,
      area_from: formModel.area_from,
      bed_rooms: formModel.bed_rooms,
      area_to: formModel.area_to,
      block_num: formModel.block_num,
      serial: formModel.serial,
      phase_id: formModel.phase_id,
      finishing_type_id: formModel.finishing_type_id,
      page: this.current_page,
      price: this.price.join(","),
      // price: `${formModel.someRange2[0]}-${formModel.someRange2[1]}`
    };
    if (is_export) {
      data.is_export = 1;
    }

    if (this.sort.sort_type > 0) {
      data.sort_field = this.sort.sort_field;
      data.sort_type = this.sortValues[this.sort.sort_type];
    }
    // if (this.userProfile.role != "Admin" || this.userProfile.role != "Moderator") {
    //   data.status = "Available";
    // }
    if (cache) this.setQueryParams(data);

    this.slimLoadingBarService.start();
    this.filterActive = true;
    this.filterData = data;
    this.is_refreshing = true;
    this.projectService
      .filterUnits(
        isNaN(this.project_id) || !this.project_id ? 0 : this.project_id,
        data,
        this.current_page
      )
      .subscribe((data: any) => {
        if (is_export) {
          window.open(data.url);
        } else {
          this.pagination = [];
          this.last_page_url = data.last_page_url;
          this.units_raw_data = data;
          this.current_page = data.current_page;
          this.per_page = data.to;
          this.total = data.total;
          let selected = true;
          for (var i = 1; i <= data.last_page; i++) {
            if (i > 1) selected = false;
            this.pagination.push({ number: i, selected: selected });
          }
          this.projectUnits = data.data;
        }
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      };
  }

  resetFilters() {
    this.filterActive = false;
    this.filterData = null;
    this.current_page = 1;
    this.resetQueryParams();
    this.resetFormFilter();
    this.getallunits();
  }

  requestBlockUnit(unitId, modal) {
    const formModel = this.blockForm.value;
    if (!formModel.reason) {
      swal("Oops...", "Reason can not be empty!", "error");
    } else if (!formModel.time) {
      swal("Oops...", "Time can not be empty!", "error");
    } else {
      modal.close();
      formModel.id = unitId;
      this.slimLoadingBarService.start();
      this.projectService.requestBlockUnit(formModel).subscribe(
        (data) => {
          if (this.userInfo.role == "Sales Manager")
            swal("Woohoo!", "Blocked request sent successfully!", "success");
          else {
            swal("Woohoo!", "Blocked successfully!", "success");
            if (this.project_id && this.project_id > 0) {
              this.getAllProjectUnits(this.project_id);
            } else {
              this.getallunits();
            }
          }

          this.filterUnits();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  actionOnClose() {}

  resrveUnit(unitId, unitStatus) {
    if (this.userInfo.id == unitId && unitStatus == "Temp Blocked") {
      this.router.navigate(["pages/reservations/add/", unitId]);
    } else {
      swal({
        title: "Are you sure?",
        text: "You will reserve the unit!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reserve it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          this.stopReservation = true;
          this.reservationService.blockUnitAtReservation(unitId).subscribe(
            (data) => {
              this.router.navigate(["pages/reservations/add/", unitId]);
              this.slimLoadingBarService.complete();
              this.stopReservation = false;
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.complete();
              this.stopReservation = false;
            }
          );
        } else if (result.dismiss) {
          swal("Cancelled", "", "error");
        }
      });
    }
  }

  actionOnOpen(id) {}

  unitModalOnClose() {}

  unitModalOnSubmit(modal) {
    modal.close();
  }

  unBlockUnit(unit_id) {
    this.slimLoadingBarService.start();
    this.projectService.adminUnBlockUnit(unit_id).subscribe(
      (data) => {
        swal("Woohoo!", "Un-blocked unit successfully!", "success");
        if (this.current_page == 1) {
          if (this.project_id && this.project_id > 0) {
            this.getAllProjectUnits(this.project_id);
          } else {
            this.getallunits();
          }
        } else {
          this.filterUnits(undefined, undefined, this.current_page);
        }
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  makeUnitAvailable(unit_id) {}

  makeUnitNotAvailable(unit_id, index) {
    this.unit_index = index;
    swal({
      title: "Are you sure?",
      text: "You will make the unit un-available",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make it un-available!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectService.makeUnitNotAvailable(unit_id).subscribe(
          (data) => {
            this.projectUnits[this.unit_index] = data;
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  makeUnitHayaa(unit_id, index) {
    this.unit_index = index;
    swal({
      title: "Are you sure?",
      text: "You will make the unit hayaa",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make it hayaa!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectService.makeUnitHayaa(unit_id).subscribe(
          (data) => {
            this.projectUnits[this.unit_index] = data;
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  makeUnitGameya(unit_id, index) {
    this.unit_index = index;
    swal({
      title: "Are you sure?",
      text: "You will make the unit gameya",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make it gameya!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectService.makeUnitGameya(unit_id).subscribe(
          (data) => {
            this.projectUnits[this.unit_index] = data;
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  makeUnitDevelopmentHold(unit_id, index) {
    this.unit_index = index;
    swal({
      title: "Are you sure?",
      text: "You will make the unit development hold",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make it development hold!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectService.makeUnitHoldDevelopment(unit_id).subscribe(
          (data) => {
            this.projectUnits[this.unit_index] = data;
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  reasonModalOpen(id) {
    this.slimLoadingBarService.start();
    this.projectService.getBlockReason(id).subscribe(
      (data) => {
        this.blockReasonData = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  swalBlock(unit_id) {
    swal({
      title: "Are you sure?",
      text: "You will unblock this unit!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unblock it!",
      cancelButtonText: "No, keep it blocked",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectService.adminUnBlockUnit(unit_id).subscribe(
          (data) => {
            swal("Woohoo!", "Un-blocked unit successfully!", "success");
            if (this.current_page == 1) {
              if (this.project_id && this.project_id > 0) {
                this.getAllProjectUnits(this.project_id);
              } else {
                this.getallunits();
              }
            } else {
              this.filterUnits(undefined, undefined, this.current_page);
            }
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }
  /**
   * Start of Comment Modal
   * */
  openCommentModal(reservation) {}

  submitCommentModal(reservation_id, modal) {
    if (!this.unitComment) swal("Error", "Comment can not be empty", "error");
    else {
      this.slimLoadingBarService.start();
      this.projectService
        .addUnitComment(reservation_id, this.unitComment)
        .subscribe(
          (data) => {
            modal.close();
            if (this.project_id && this.project_id > 0) {
              this.getAllProjectUnits(this.project_id);
            } else {
              this.getallunits();
            }
            swal("Woohoo!", "Comment have added succesfully!", "success");
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  closeCommentModal() {}

  openViewCommentModal(reservation) {}

  closeViewCommentModal() {}

  /**
   * End of Comment Modal
   */

  /**
   * Start of manage table modal
   */

  /**
   * End of manage table modal
   */

  layoutViewChange(event) {
    this.view_masterplan = !this.view_masterplan;
  }

  pathClicked(path_data, path_id) {
    this.district_path = path_id;
    let payload = {
      path_id: path_id,
      project_id: this.project_id,
    };
    if (this.userProfile.role == "Admin") {
      this.slimLoadingBarService.start();
      this.projectService.getMasterPlanUnits(payload).subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          console.log(res);
          this.img = res.img;
          this.paths = res.pathes;
          this.stage = "units";
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
    } else {
      if (path_data.units.block_status == "Available") {
        this.slimLoadingBarService.start();
        this.projectService.getMasterPlanUnits(payload).subscribe(
          (res: any) => {
            this.slimLoadingBarService.complete();
            this.img = res.img;
            this.paths = res.pathes;
            this.stage = "units";
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      } else if (path_data.units.block_status == "Non Available") {
      }
    }
  }

  goToUnitView(unit, unit_id) {
    console.log(unit);
    if (this.role == "Admin" || this.role == "Super Development") {
      if (unit.unit) {
        this.router.navigate(["/pages/projects/view-unit"], {
          queryParams: {
            project_id: this.project_id,
            unit_id: unit_id,
            mode: "masterplan",
          },
        });
      }
    } else {
      if (unit.unit) {
        if (
          unit.unit_details.status == "Available" ||
          unit.temp_block_by == this.userProfile.id
        ) {
          this.router.navigate(["/pages/projects/view-unit"], {
            queryParams: {
              project_id: this.project_id,
              unit_id: unit_id,
              mode: "masterplan",
            },
          });
        }
      }
    }
  }

  close() {
    if (this.view_masterplan) {
      if (this.stage == "districts") {
        this.router.navigateByUrl("/pages/projects");
      } else if (this.stage == "units") {
        this.getDistricts(this.project_id);
      }
    } else {
      this.router.navigateByUrl("/pages/projects");
    }
  }

  delete(id, index) {
    swal({
      title: "Are you sure?",
      text: "You will delete this unit!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        if (
          this.userProfile.role === "Admin" ||
          this.userProfile.role === "Super Development"
        ) {
          this.projectService.deleteUnit(id).subscribe(
            (data) => {
              this.slimLoadingBarService.complete();
              this.projectUnits.splice(index, 1);
              // this.getAllRequests();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.complete();
            }
          );
        }
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  generatePayment(unit) {
    this.router.navigate(["/pages/payment-generator"], {
      queryParams: { unit_id: unit.id },
    });
  }

  generateCustomPayment(unit) {
    console.log(unit);
    this.router.navigate(["/pages/custom-payment-generator"], {
      queryParams: { unit_id: unit.id },
    });
  }

  makeUnitAvailableOpenModal(id, modal, index) {
    this.unit_index = index;
    this.current_unit_id = id;
    modal.open();
  }

  openMakeUnitAvailableModal() {}

  closeMakeUnitAvailableModal() {}

  submitMakeUnitAvailableModal(modal) {
    let payload = {
      comment: this.comment,
    };
    this.slimLoadingBarService.start();
    this.projectService
      .makeUnitAvailable(this.current_unit_id, payload)
      .subscribe(
        (data) => {
          // to do make it decalrative
          this.projectUnits[this.unit_index] = data;
          swal({ title: "unit is now avabilable", type: "success" });
          modal.close();
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }

  onFilterChange(ev) {
    this.projectUnits.forEach((e) => {
      if (this.check_all) {
        e.checked = true;
      } else {
        e.checked = false;
      }
    });
  }

  deleteSelectedUnits() {
    let selectedUnits = [];
    this.projectUnits.forEach((unit) => {
      if (unit.checked) selectedUnits.push(unit.id);
    });
    console.log(selectedUnits);
    if (selectedUnits.length == 0) return;
    swal({
      title: "Are you sure?",
      text: "You will delete the selected units!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        let paylod = {
          deleteIds: selectedUnits,
        };
        this.slimLoadingBarService.start();
        this.projectService.deleteSelectedUnits(paylod).subscribe(
          (data) => {
            this.check_all = false;
            this.slimLoadingBarService.complete();
            if (this.project_id && this.project_id > 0) {
              this.getAllProjectUnits(this.project_id);
            } else {
              this.getallunits();
            }
            swal(
              "Woohoo!",
              "Deleted the selected Units successfully!",
              "success"
            );
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSelectAllItems(field: string, items: any, key = "id") {
    if (key === null) {
      this.filterForm.controls[field].setValue(items);
    } else {
      this.filterForm.controls[field].setValue(items.map((f) => "" + f[key]));
    }
  }

  onClearAllItems(field: string) {
    this.filterForm.controls[field].setValue([]);
  }

  change() {}

  getPriceChange() {
    this.projectService.getPriceRange().subscribe((res: any) => {
      this.price[0] =
        this.route.snapshot.queryParams.price_start || res.min_price;
      this.price[1] =
        this.route.snapshot.queryParams.price_end || res.max_price;
      this.min_price = res.min_price;
      this.max_price = res.max_price;
    });
  }

  test() {
    let format = wNumb({ prefix: "$ ", decimals: 3, thousand: "," });
  }

  ngOnDestroy() {
    window.localStorage.removeItem("unit_type_id");
  }

  // cache table
  columns = [
    { key: "project_name", name: "Project Name" },
    { key: "unit_id", name: "Unit Id" },
    { key: "unit_type", name: "Unit Type" },
    { key: "delivery_date", name: "Delivery Date" },
    { key: "floor_number", name: "Floor Number" },
    { key: "number", name: "Number" },
    { key: "num_rooms", name: "Num Rooms" },
    { key: "build_area", name: "Build Area" },
    { key: "outdoor_area", name: "Outdoor Area" },
    { key: "building_num", name: "Building Num" },
    { key: "garden_area", name: "Garden Area" },
    { key: "basement_area", name: "Basement Area" },
    { key: "land_area", name: "Land Area" },
    { key: "roof_area", name: "Roof Area" },
    { key: "price", name: "Price" },
    { key: "indoor_price", name: "Indoor Meter Price" },
    { key: "outdoor_price", name: "Outdoor Meter Price" },
    { key: "maintenance_fees", name: "Maintenance Fees" },
    { key: "status", name: "Status" },
    { key: "block_reason", name: "Block Reason" },
  ];

  manageTable = {};

  onSelectColumns(columns) {
    this.manageTable = columns;
  }

  // cache filters
  setQueryParams(params = {}) {
    let data: any = {};

    [
      "area_from",
      "area_to",
      "bed_rooms",
      "block_num",
      "serial",
      "status",
      "type",
    ].map((f) => {
      if (params[f]) {
        data[f] = params[f];
      }
    });

    ["finishing_type_id", "floor", "phase_id"].map((f) => {
      if (params[f] && params[f].length > 0) {
        data[f] = params[f];
      }
    });

    if (params["price"] && params["price"].length === 2) {
      data.price_start = params["price"][0];
      data.price_end = params["price"][1];
    }
    console.log(data);
    if(this.filterForm.value.project){
      this.project_id = this.filterForm.value.project
    }
    this.router.navigate(["..", this.project_id], {
      relativeTo: this.route,
      queryParams: data,
      queryParamsHandling: "merge",
      preserveFragment: true,
      replaceUrl: true,
    });
  }

  resetQueryParams() {
    this.router.navigate(["..", 0], {
      relativeTo: this.route,
      queryParams: {},
      preserveFragment: true,
      replaceUrl: true,
    });
  }
}
