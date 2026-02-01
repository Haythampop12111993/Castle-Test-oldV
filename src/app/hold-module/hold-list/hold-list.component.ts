import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Params, Router } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import swal from "sweetalert2";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ReservationService } from "../../services/reservation-service/reservation.service";
import { environment } from "../../../environments/environment";
import { HoldService } from "../hold.service";

@Component({
  selector: "app-hold-list",
  templateUrl: "./hold-list.component.html",
  styleUrls: ["./hold-list.component.css"],
})
export class HoldListComponent implements OnInit {
  pagination: any;
  next_page_url: any;
  prev_page_url: any;
  current_page: any;
  // eoiData_single: any;

  holdData: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  export_hold: any;

  hold_raw_data: any;
  pageTest: any = 0;
  base_url_for_pagination: any;
  last_page_url: any;

  uploadExcel: FormGroup;

  filterForm: FormGroup;

  projects: any;

  hold_statuses: any;

  agents: any;

  filterActive: boolean = false;

  filterData: any = {};

  units;
  isLoading = false;

  constructor(
    public leadsService: LeadsService,
    public router: Router,
    private holdService: HoldService,
    private slimLoadingBarService: SlimLoadingBarService,
    public fb: FormBuilder,
    public errorHandlerService: ErrorHandlerService,
    private reservationService: ReservationService
  ) {
    this.createHoldFilter();
    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getHold();
    this.getProjects();
    this.getHoldStatuses();
    this.getAgents();
    // this.getAllUnits();
    this.export_hold = `${
      environment.api_base_url
    }hold/export?token=${window.localStorage.getItem("token")}`;
  }

  getAllUnits() {
    this.holdService.getAllUnints().subscribe((res: any) => {
      this.units = res.data;
    });
  }

  getHoldStatuses() {
    this.holdService.getHoldStatuses().subscribe((res: any) => {
      this.hold_statuses = res;
    });
  }

  getAgents() {
    this.leadsService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getProjects() {
    this.reservationService.getProjects().subscribe(
      (res: any) => {
        this.projects = res;
      },
      (err) => console.log(err)
    );
  }

  getHold() {
    this.isLoading = true;
    this.holdService.getAllHold().subscribe(
      (data: any) => {
        this.isLoading = false;
        console.log(data);
        this.pagination = [];
        this.next_page_url = data.next_page_url;
        this.current_page = 1;
        this.hold_raw_data = data;
        this.holdData = data.data;
        console.log(this.holdData);
        this.base_url_for_pagination = data.last_page_url.split("?")[0];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.isLoading = false;
      }
    );
  }

  createHoldFilter() {
    this.filterForm = this.fb.group({
      // serial: [""],
      user_id: [undefined],
      status: [""],
      project_id: [""],
      unit_id: [""],
      lead_search: [""],
      hold_number: [""],
    });
    this.listenOnProjectChange();
  }

  listenOnProjectChange() {
    this.filterForm.get("project_id").valueChanges.subscribe((change) => {
      this.units = [];
      this.getUnitByProject(change);
    });
  }

  getUnitByProject(project_id) {
    console.log(project_id);
    this.reservationService.getUnitsByProject(project_id).subscribe((res) => {
      this.units = res;
    });
  }

  filterHold() {
    this.isLoading = true;
    console.log("filter hold");
    this.pageTest = 1;
    const formModel = Object.assign({}, this.filterForm.value);
    if (
      this.userProfile.role != "Admin" &&
      this.userProfile.role != "Super Moderator"
    ) {
      formModel.status = "Available";
    }
    formModel.is_export = 0;
    this.slimLoadingBarService.start();
    this.filterActive = true;
    this.filterData = formModel;
    if (this.filterForm.value.user_id)
      formModel.user_id = this.filterForm.value.user_id.id;
    // this.is_refreshing = true;
    this.holdService.filterHold(formModel).subscribe((data: any) => {
      this.isLoading = false;
      this.pagination = [];
      this.next_page_url = data.next_page_url;
      this.current_page = 1;
      this.hold_raw_data = data;
      this.holdData = data.data;
      console.log(this.holdData);
      this.base_url_for_pagination = data.last_page_url.split("?")[0];
      this.last_page_url = data.last_page_url;
      this.current_page = 1;
      this.slimLoadingBarService.complete();
    }),
      (err) => {
        this.isLoading = false;
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      },
      () => {};
    console.log(formModel);
  }

  resetFilters() {
    console.log("reseting filters");
    this.filterActive = false;
    this.filterData = {};
    this.createHoldFilter();
    this.getHold();
  }

  exportTable() {
    let formModel = Object.assign({}, this.filterForm.value);
    if (!this.filterForm.value.user_id) formModel.user_id = "";
    formModel.is_export = 1;
    console.log(formModel, "----------------------------------");

    this.slimLoadingBarService.start();
    this.leadsService.exportHoldTable(formModel).subscribe((res: any) => {
      window.open(res.url);
      this.slimLoadingBarService.complete();
    }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      };
  }

  pageChange(ev) {
    const selectedUrl = `${this.base_url_for_pagination}`;
    this.infinite(selectedUrl, ev);
  }

  goToEdit(id) {
    console.log(id);
    this.router.navigate(["pages/add-hold", id]);
  }

  infinite(url, event) {
    if (url && url != "undefined") {
      if (Object.keys(this.filterData).length > 0 || event)
        this.filterData.page = event;
      let _url =
        this.holdService.helperService.getUrlWithQueryParametersFromFormPayload(
          this.filterData,
          url
        );
      this.leadsService.infinit(_url).subscribe(
        (res: any) => {
          this.hold_raw_data = res;
          this.holdData = res.data;
          this.last_page_url = res.last_page_url;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
    }
  }

  goToHoldView(id) {
    this.router.navigate([`/pages/hold-details/${id}`]);
  }

  handleUploadExcel(event) {
    console.log(event);
    console.log(event.target.files);
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.uploadExcel.get("file").setValue({
          filename: file.name,
          value: reader.result.toString().split(",")[1],
        });
      };
    }
  }

  uploadExcelMethod(modal) {
    const formModel = Object.assign({}, this.uploadExcel.value);
    console.log(formModel);
    if (!formModel.file) {
      swal("Oops...", "Files can not be empty!", "error");
    } else {
      let data = {
        file: formModel.file.value,
        file_name: formModel.file.filename,
      };
      this.slimLoadingBarService.start(() => {
        console.log("Loading complete");
      });
      console.log(data);
      this.holdService.importHold(data).subscribe(
        (data) => {
          console.log(data);
          modal.close();
          this.getHold();
          this.slimLoadingBarService.complete();
          swal("Woohoo!", "Files uploaded succesfully!", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
    }
  }

  exportHold() {
    this.slimLoadingBarService.start();
    this.holdService.exportHold().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  redirectToLeadDetails(leadId) {
    if (!isNaN(leadId)) {
      this.router.navigate([`/pages/leads/${leadId}`]);
    }
    return;
  }

  reserveHold(id) {
    // this.router.navigate([`pages/reservations/add/`, id, {hold : true}]);
    const queryParams: Params = { hold: true };

    this.router.navigate([`pages/reservations/add/${id}`], {
      queryParams: queryParams,
      // queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  cancelHold(id) {
    this.holdService.cancelHold(id).subscribe(
      (res: any) => {
        this.getHold();
        swal("Woohoo!", "Cancelled succesfully!", "success");
      },
      (err) => {
        swal("Oops...", "Fail to cancel!", "error");
      }
    );
  }

  cashCollected(id) {
    this.holdService.cashCollected(id).subscribe(
      (res: any) => {
        this.getHold();
        swal("Woohoo!", "Cash collected succesfully!", "success");
      },
      (err) => {
        swal("Oops...", "Fail Cash collecting!", "error");
      }
    );
  }

  deleteHold(id) {
    this.holdService.deleteHold(id).subscribe(
      (res: any) => {
        this.getHold();
        swal("Woohoo!", "deleted succesfully!", "success");
      },
      (err) => {
        swal("Oops...", "Fail to delete!", "error");
      }
    );
  }
}
