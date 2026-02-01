import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ReservationService } from "./../services/reservation-service/reservation.service";
import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectsService } from "./../services/projects/projects.service";
import swal from "sweetalert2";

import * as wNumb from "wnumb";

@Component({
  selector: "app-all-unit-view",
  templateUrl: "./all-unit-view.component.html",
  styleUrls: ["./all-unit-view.component.css"],
})
export class AllUnitViewComponent implements OnInit {
  pagination: any;
  project_id: any;
  unit_type_id: any;
  private sub: any;
  AllUnits: any = [];
  current_project: any = [];
  userInfo: any;
  blockForm: FormGroup;
  projects: any;
  times: any;
  reasons: any;
  next_page_url: any;
  prev_page_url: any;
  current_page: any;
  filterForm: FormGroup;
  allStatus: any = [
    "All",
    "Available",
    "Not Available",
    "Blocked",
    "Temp Blocked",
    "Reserved",
    "Development Hold",
  ];
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
  phases: any;
  manageTable: any = {
    build_area: true,
    block_num: true,
    building_num: true,
    garden_area: true,
    unit_type_name: true,
    floor_number: true,
    num_rooms: true,
    price: true,
    status: true,
  };
  toogleManageTable = {
    build_area: false,
    block_num: false,
    building_num: false,
    garden_area: false,
    unit_type_name: false,
    floor_number: false,
    num_rooms: false,
    price: false,
    status: false,
  };
  toggle_options = {
    onColor: "primary",
    offColor: "danger",
    onText: "Enable",
    offText: "Disable",
    value: "",
    size: "",
  };
  pageTest: any = 1;
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
  comment: any;
  current_unit_id: any;

  unit_index: any;

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

  floors: any = [
    {
      id: 0,
      name: "0",
    },
    {
      id: 1,
      name: "1",
    },
    {
      id: 2,
      name: "2",
    },
    {
      id: 3,
      name: "3",
    },
    {
      id: 4,
      name: "4",
    },
    {
      id: 5,
      name: "5",
    },
    {
      id: 6,
      name: "6",
    },
    {
      id: 7,
      name: "7",
    },
  ];

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

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    public cookieService: CookieService,
    public router: Router,
    private reservationService: ReservationService,
    public slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    public errorHandlerService: ErrorHandlerService,
    public leadsService: LeadsService
  ) {}

  ngOnInit() {
    this.getBlockSettings();
    this.createForm();
    this.userInfo = JSON.parse(window.localStorage.getItem("userProfile"));
    this.getallunits();
    this.getAllProjects();
    this.getPriceChange();
  }

  getPriceChange() {
    this.projectService.getPriceRange().subscribe(
      (res: any) => {
        this.price[0] = res.min_price;
        this.price[1] = res.max_price;
        this.min_price = res.min_price;
        this.max_price = res.max_price;
        console.log(this.price);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getBlockSettings() {
    this.projectService.getBlockSettings().subscribe((res: any) => {
      this.times = res.times;
      this.reasons = res.reasons;
    });
  }

  ngAfterViewInit() {}

  ngOnDestory() {}

  getallunits() {
    this.projectService.getAllUnits().subscribe((data: any) => {
      console.log(data);
      this.pagination = [];
      this.next_page_url = data.next_page_url;
      this.units_raw_data = data;
      this.current_page = 1;
      this.per_page = data.to;
      this.total = data.total;
      let selected = true;
      for (var i = 1; i <= data.last_page; i++) {
        if (i > 1) selected = false;
        this.pagination.push({ number: i, selected: selected });
      }
      this.AllUnits = data.data;
      console.log(this.AllUnits);
      this.slimLoadingBarService.complete();
      this.is_refreshing = false;
    }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      };
  }
  refresehUnits() {
    if (this.filterActive) {
      this.is_refreshing = true;
      const formModel = this.filterForm.value;
      let data = {
        project: formModel.project,
        type: formModel.type,
        status: formModel.status,
        floor: formModel.floor,
        area_from: formModel.area_from,
        area_to: formModel.area_to,
        block_num: formModel.block_number,
        serial: formModel.serial,
        phase_id: formModel.phase_id,
        finishing_type_id: formModel.finishing_type_id,
        price: this.price,
      };
      if (
        this.userInfo.role != "Admin" &&
        this.userInfo.role != "Super Development"
      ) {
        data.status = "Available";
      }
      this.slimLoadingBarService.start();
      this.filterActive = true;
      this.filterData = data;
      this.projectService.filterAllUnits(data).subscribe((data: any) => {
        this.pagination = [];
        this.next_page_url = data.next_page_url;
        this.units_raw_data = data;
        this.current_page = 1;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.AllUnits = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      }),
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
          this.is_refreshing = false;
        };
    } else {
      console.log(this.current_page);
      if (this.current_page == 1) {
        // this.getAllProjectUnits(this.project_id);
        this.getallunits();
      } else {
        let arr = this.next_page_url.split("?");
        let selectedUrl = `${arr[0]}?page=${this.current_page}`;
        this.infinite(selectedUrl, this.current_page);
      }
    }
  }

  getUnitTypes(project_id) {
    this.slimLoadingBarService.start();
    this.projectService.getUnitTypes(project_id).subscribe(
      (data) => {
        this.types = data;
        console.log(this.types);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  ngOnDestroy() {
    console.log("destory unit page");
    window.localStorage.removeItem("unit_type_id");
  }

  createForm() {
    this.blockForm = this.formBuilder.group({
      time: ["", Validators.required],
      reason: ["", Validators.required],
      other: [""],
    });

    this.filterForm = this.formBuilder.group({
      project: [""],
      type: [""],
      status: [""],
      floor: [""],
      area_from: [""],
      area_to: [""],
      block_number: [""],
      serial: [""],
      phase_id: [[]],
      someRange2: [[1, 50]],
      finishing_type_id: [[]],
    });
  }

  filterUnits() {
    const formModel = this.filterForm.value;
    const checker = formModel.project;
    var chk;
    let data: any;
    if (checker == "") {
      data = {
        project: "0",
        type: formModel.type,
        status: formModel.status,
        floor: formModel.floor,
        area_from: formModel.area_from,
        area_to: formModel.area_to,
        block_num: formModel.block_number,
        serial: formModel.serial,
        phase_id: formModel.phase_id,
        finishing_type_id: formModel.finishing_type_id,
        price: this.price,
      };
    } else {
      data = {
        project: formModel.project,
        type: formModel.type,
        status: formModel.status,
        floor: formModel.floor,
        block_num: formModel.block_number,
        serial: formModel.serial,
        phase_id: formModel.phase_id,
        area_from: formModel.area_from,
        area_to: formModel.area_to,
        finishing_type_id: formModel.finishing_type_id,
        price: this.price,
      };
    }
    this.project_id = formModel.project;
    if (!this.project_id) {
      this.project_id = 0;
    }
    console.log(this.project_id, "project iddddddddddddddddddd");
    console.log("el dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data);
    if (
      this.userInfo.role != "Admin" &&
      this.userInfo.role != "Super Development"
    ) {
      data.status = "Available";
    }
    this.slimLoadingBarService.start();
    this.filterActive = true;
    this.filterData = data;
    this.is_refreshing = true;
    this.projectService
      .filterUnits(this.project_id, data)
      .subscribe((data: any) => {
        this.pagination = [];
        this.next_page_url = data.next_page_url;
        this.units_raw_data = data;
        this.current_page = 1;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.AllUnits = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      };
    console.log(data);
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
        this.getAllPhases();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      }
    );
  }

  getAllPhases() {
    this.phases = [];
    this.projects.forEach((project) => {
      this.phases = [...this.phases, ...project.phases];
    });
    console.log(this.phases);
  }

  checkproject(data) {
    const project_id = data;
    this.projects.forEach((element) => {
      if (element.id == project_id) {
        this.phases = element.phases;
      }
    });
    console.log("phasessssssssssssssssssssssss", this.phases);
    this.getUnitTypes(data);
  }

  getAllProjectUnits() {
    console.log("get project units");
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    this.projectService.getAllUnits().subscribe(
      (data: any) => {
        console.log(data);
        this.pagination = [];
        this.next_page_url = data.next_page_url;
        this.units_raw_data = data;
        this.current_page = 1;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.AllUnits = data.data;
        console.log(this.AllUnits);
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
    console.log("get current project");
    this.slimLoadingBarService.start();
    this.projectService.getcurrentproject(project_id).subscribe(
      (data) => {
        console.log(data);
        this.current_project = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getProjectUnitsbytype(project_id, unit_type_id) {
    console.log("get project units by type");
    this.pagination = [];
    this.current_page = 1;
    this.slimLoadingBarService.start();
    this.projectService
      .getProjectUnitsbytype(project_id, unit_type_id)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.pagination = [];
          this.units_raw_data = data;
          let selected = true;
          for (var i = 1; i <= data.last_page; i++) {
            if (i > 1) selected = false;
            this.pagination.push({ number: i, selected: selected });
            console.log(i);
          }
          this.AllUnits = data.data;
          this.next_page_url = data.next_page_url;
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }

  requestBlockUnit(unitId, modal) {
    const formModel = this.blockForm.value;
    if (formModel.reason == "Other") {
      formModel.reason = formModel.other;
    }
    console.log(formModel);
    if (!formModel.reason) {
      swal("Oops...", "Reason can not be empty!", "error");
    } else if (!formModel.time) {
      swal("Oops...", "Time can not be empty!", "error");
    } else {
      formModel.id = unitId;
      this.slimLoadingBarService.start();
      this.projectService.requestBlockUnit(formModel).subscribe(
        (data) => {
          console.log(data);
          modal.close();
          if (this.userInfo.role == "Sales Manager")
            swal("Woohoo!", "Blocked request sent successfully!", "success");
          else {
            swal("Woohoo!", "Blocked successfully!", "success");
            this.getAllProjectUnits();
          }
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  actionOnClose() {}

  resrveUnit(unitId, unitStatus) {
    console.log(unitId);
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
              console.log(data);
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

  actionOnOpen(id) {
    console.log(id);
  }

  unitOnOpen(pu) {
    console.log(pu);
    this.projectService.getUnitDetails(pu.id).subscribe(
      (data) => {
        console.log(data);
        this.units_reservation_modal_data = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  unitModalOnClose() {}

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        this.AllUnits = data.data;
        this.current_page = number;
        this.units_raw_data = data;
        this.per_page = data.to;
        this.total = data.total;
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

  infiniteWithFilter(url, number) {
    this.slimLoadingBarService.start();
    console.log(this.filterData);
    this.is_refreshing = true;
    this.projectService.infinitWithPagination(url, this.filterData).subscribe(
      (data: any) => {
        this.AllUnits = data.data;
        this.current_page = number;
        this.units_raw_data = data;
        this.per_page = data.to;
        this.total = data.total;
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

  paginate(number) {
    this.pagination.forEach((element) => {
      if (element.number == number) {
        element.selected = true;
        let arr = this.next_page_url.split("?");
        if (this.current_page != number) {
          let selectedUrl = `${arr[0]}?page=${number}`;
          console.log(selectedUrl);
          if (this.filterActive) {
            this.infiniteWithFilter(selectedUrl, number);
          } else {
            this.infinite(selectedUrl, number);
          }
        }
      } else element.selected = false;
    });
  }

  unitModalOnSubmit(modal) {
    modal.close();
  }

  unBlockUnit(unit_id) {
    this.slimLoadingBarService.start();
    this.projectService.adminUnBlockUnit(unit_id).subscribe(
      (data) => {
        swal("Woohoo!", "Un-blocked unit successfully!", "success");
        if (this.current_page == 1) {
          this.getAllProjectUnits();
        } else {
          let arr = this.next_page_url.split("?");
          let selectedUrl = `${arr[0]}?page=${this.current_page}`;
          this.infinite(selectedUrl, this.current_page);
        }
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  makeUnitAvailable(unit_id) {
    // swal({
    //   title: 'Are you sure?',
    //   text: 'You will make the unit available',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, make it available!',
    //   cancelButtonText: 'No, keep it'
    // }).then(result => {
    //   if (result.value) {
    //     this.slimLoadingBarService.start();
    //     this.projectService.makeUnitAvailable(unit_id).subscribe(
    //       data => {
    //         if (this.current_page == 1) {
    //           this.getAllProjectUnits(this.project_id);
    //         } else {
    //           let arr = this.next_page_url.split('?');
    //           let selectedUrl = `${arr[0]}?page=${this.current_page}`;
    //           this.infinite(selectedUrl, this.current_page);
    //         }
    //         this.slimLoadingBarService.complete();
    //       },
    //       err => {
    //         this.errorHandlerService.handleErorr(err);
    //         this.slimLoadingBarService.complete();
    //       }
    //     );
    //   } else if (result.dismiss) {
    //     swal('Cancelled', '', 'error');
    //   }
    // });
  }

  makeUnitNotAvailable(unit_id) {
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
            if (this.current_page == 1) {
              this.getAllProjectUnits();
            } else {
              let arr = this.next_page_url.split("?");
              let selectedUrl = `${arr[0]}?page=${this.current_page}`;
              this.infinite(selectedUrl, this.current_page);
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

  makeUnitDevelopmentHold(unit_id) {
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
            if (this.current_page == 1) {
              this.getAllProjectUnits();
            } else {
              let arr = this.next_page_url.split("?");
              let selectedUrl = `${arr[0]}?page=${this.current_page}`;
              this.infinite(selectedUrl, this.current_page);
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

  resetFilters() {
    this.filterActive = false;
    this.filterData = null;
    this.createForm();
    this.getallunits();
  }

  reasonModalOpen(id) {
    this.slimLoadingBarService.start();
    this.projectService.getBlockReason(id).subscribe(
      (data) => {
        console.log(data);
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
        console.log(unit_id);
        this.slimLoadingBarService.start();
        this.projectService.adminUnBlockUnit(unit_id).subscribe(
          (data) => {
            swal("Woohoo!", "Un-blocked unit successfully!", "success");
            if (this.current_page == 1) {
              this.getAllProjectUnits();
            } else {
              let arr = this.next_page_url.split("?");
              let selectedUrl = `${arr[0]}?page=${this.current_page}`;
              this.infinite(selectedUrl, this.current_page);
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
            this.getAllProjectUnits();
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

  openManageModal() {}

  pageChange(event) {
    console.log(event);
    let arr = this.next_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    if (this.filterActive) {
      this.infiniteWithFilter(selectedUrl, event);
    } else {
      this.infinite(selectedUrl, event);
    }
  }

  closeManageModal() {}

  toggleChange($event, type) {
    console.log($event, type);
    this.manageTable[type] = !$event;
  }

  /**
   * End of manage table modal
   */

  deleteUnit(id, index) {
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
          this.userInfo.role === "Admin" ||
          this.userInfo.role === "Super Development"
        ) {
          this.projectService.deleteUnit(id).subscribe(
            (data) => {
              this.slimLoadingBarService.complete();
              this.AllUnits.splice(index, 1);
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
    console.log(unit);
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
          this.AllUnits[this.unit_index] = data;
          swal({ title: "Success", type: "success" });
          modal.close();
          // this.createForm();
          // this.getallunits();
          // this.getAllProjects();
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }
}
