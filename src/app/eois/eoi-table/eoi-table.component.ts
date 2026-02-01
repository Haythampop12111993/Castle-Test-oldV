import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import swal from "sweetalert2";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { EoiService } from "../../services/eoi/eoi.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ReservationService } from "../../services/reservation-service/reservation.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-eoi-table",
  templateUrl: "./eoi-table.component.html",
  styleUrls: ["./eoi-table.component.css"],
})
export class EoiTableComponent implements OnInit {
  pagination: any;
  next_page_url: any;
  prev_page_url: any;
  current_page: any;
  eoiData_single: any;

  eoisData: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  export_eoi: any;

  eois_raw_data: any;
  pageTest: any = 0;
  base_url_for_pagination: any;
  last_page_url: any;

  uploadExcel: FormGroup;

  filterForm: FormGroup;

  projects: any;

  eoi_statuses: any;

  agents: any;
  searcedAgents: any;

  filterActive: boolean = false;

  filterData: any = {};

  constructor(
    public leadsService: LeadsService,
    public router: Router,
    private eoisService: EoiService,
    private slimLoadingBarService: SlimLoadingBarService,
    public fb: FormBuilder,
    public errorHandlerService: ErrorHandlerService,
    private reservationService: ReservationService
  ) {
    this.createEOIFilter();
    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getEois();
    this.getProjects();
    this.getEoiStatuses();
    this.getAgents();
    this.export_eoi = `${
      environment.api_base_url
    }eois/export?token=${window.localStorage.getItem("token")}`;
  }

  getEoiStatuses() {
    this.eoisService.getEoiStatuses().subscribe((res: any) => {
      this.eoi_statuses = res;
    });
  }

  getAgents() {
    this.leadsService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
        this.searcedAgents = data;
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

  eoiModalActionOnOpen() {}

  eoiModalActionOnClose() {}

  getEois() {
    this.leadsService.getEois().subscribe(
      (data: any) => {
        console.log(data);
        this.pagination = [];
        this.next_page_url = data.next_page_url;
        this.current_page = 1;
        this.eois_raw_data = data;
        this.eoisData = data.data;
        console.log(this.eoisData);
        this.base_url_for_pagination = data.last_page_url.split("?")[0];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  createEOIFilter() {
    this.filterForm = this.fb.group({
      serial: [""],
      user_id: [null],
      status: [null],
      project_id: [null],
      lead_search: [""],
      eoi_number: [""],
    });
  }

  filterEois() {
    console.log("filter eois");
    this.pageTest = 1;
    const formModel = Object.assign({}, this.filterForm.value);
    if (
      this.userProfile.role != "Admin" &&
      this.userProfile.role != "Super Development"
    ) {
      formModel.status = "Available";
    }
    formModel.is_export = 0;
    this.slimLoadingBarService.start();
    this.filterActive = true;
    this.filterData = formModel;
    // if (this.filterForm.value.user_id)
    //   formModel.user_id = this.filterForm.value.user_id.id;
    // this.is_refreshing = true;
    this.eoisService.filterEoi(formModel).subscribe((data: any) => {
      this.pagination = [];
      this.next_page_url = data.next_page_url;
      this.current_page = 1;
      this.eois_raw_data = data;
      this.eoisData = data.data;
      console.log(this.eoisData);
      this.base_url_for_pagination = data.last_page_url.split("?")[0];
      this.last_page_url = data.last_page_url;
      this.current_page = 1;
      this.slimLoadingBarService.complete();
    }),
      (err) => {
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
    this.createEOIFilter();
    this.getEois();
  }

  exportTable() {
    let formModel = this.filterForm.value;
    // if (!this.filterForm.value.user_id) formModel.user_id = "";
    formModel.is_export = 1;
    this.slimLoadingBarService.start();
    this.leadsService.exportTable(formModel).subscribe((res: any) => {
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
    this.router.navigate(["pages/eoi", id]);
  }

  infinite(url, event) {
    if (url && url != "undefined") {
      if (Object.keys(this.filterData).length > 0 || event)
        this.filterData.page = event;
      let _url =
        this.eoisService.helperService.getUrlWithQueryParametersFromFormPayload(
          this.filterData,
          url
        );
      this.leadsService.infinit(_url).subscribe(
        (res: any) => {
          this.eois_raw_data = res;
          this.eoisData = res.data;
          this.last_page_url = res.last_page_url;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
    }
  }

  goToEOIView(id) {
    this.router.navigate([`/pages/eoi-view/${id}`]);
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
      this.eoisService.importEoi(data).subscribe(
        (data) => {
          console.log(data);
          modal.close();
          this.getEois();
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

  exportEoi() {
    this.slimLoadingBarService.start();
    this.eoisService.exportEoi().subscribe(
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

  searchBroker(val: string) {
    this.searcedAgents = this.agents.filter((el: any)=>{
      return el.name.trim().toLowerCase().includes(val.trim().toLowerCase())
    })
  }
}
