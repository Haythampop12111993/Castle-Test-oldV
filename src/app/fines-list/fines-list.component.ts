import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ReservationService } from "../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";

import { Router } from "@angular/router";
import swal from "sweetalert2";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ProjectsService } from "../services/projects/projects.service";
import { UserServiceService } from "../services/user-service/user-service.service";

@Component({
  selector: "app-fines-list",
  templateUrl: "./fines-list.component.html",
  styleUrls: ["./fines-list.component.css"],
})
export class FinesListComponent implements OnInit {
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  pagination_meta = {
    page: 1,
    totalPages: 0,
  };
  fines_list: any;

  is_refreshing = false;
  filterForm: FormGroup;
  filterActive = false;
  filterData: any;

  projects;

  pagination: any = [];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService,
    private leadsService: LeadsService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    this.createFilter();
    this.getProjects();
    this.getFines();
  }

  getFines(reset = false, is_export = false) {
    if (reset) {
      this.pagination_meta.page = 1;
    }
    const payload = {
      ...this.filterForm.value,
      page: this.pagination_meta.page,
    };
    this.slimLoadingBarService.start();
    this.reservationService.getReservationFines(payload).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.fines_list = res.data;
        this.pagination_meta.totalPages = res.last_page;
      },
      (err) => {
        this.slimLoadingBarService.reset();
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

  createFilter() {
    this.filterForm = this.fb.group({
      filter_project_id: [""], // done
      // filter_status: [""], // done
      filter_lead: [""], // done
      filter_reservation: [""], // done
      filter_unit: [""], // done
      // filter_bank_id: [""], // done
      // types: [""],
      filter_cheque_number: [""], // done
      filter_date_from: [""], // done
      filter_date_to: [""], // done
      // filter_store_bank_id: [""],
      // filter_is_with_treasury: [""],
    });
  }

  resetFilters() {
    this.createFilter();
    this.getFines(true);
  }

  exportTable() {
    let formModel = Object.assign({}, this.filterForm.value);
    formModel.is_export = 1;
    this.slimLoadingBarService.start();
    this.reservationService
      .getReservationFines(formModel)
      .subscribe((data: any) => {
        window.open(data.url);
        this.slimLoadingBarService.complete();
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      };
  }

  pageChange(event) {
    this.pagination_meta.page = event;
    this.getFines();
  }

  // actions
  collect_fine: any;
  collect_form = {
    ids: [],
    collection_date: "",
    status: "",
    lead_id: "",
    partially_method: "",
    amount_received: "",
    partially_data: "",
  };

  openCollectFine(fine, modal) {
    this.collect_fine = fine;
    this.collect_form = {
      ids: [fine.id],
      collection_date: "",
      status: "",
      lead_id: "",
      partially_method: "",
      amount_received: "",
      partially_data: "",
    };
    modal.open();
  }

  collectFinesModalSubmitting = false;
  submitCollectFine(modal) {
    if (this.collectFinesModalSubmitting) return;
    let payload = Object.assign({}, this.collect_form);

    if (this.collect_form.status == "partially-collected") {
      if (payload.partially_method != "3") {
        delete payload.partially_data;
      }
    } else {
      delete payload.amount_received;
    }

    this.collectFinesModalSubmitting = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .collectChequeFine(this.collect_fine.reservation.id, payload)
      .subscribe(
        (res: any) => {
          swal("Woohoo!", "Collected!", "success");
          modal.close();
          this.getFines();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.collectFinesModalSubmitting = false;
      });
  }

  deleteFine(fine) {
    swal({
      title: "Are you sure?",
      text: "You will delete this fine!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        let payload = {
          ids: [fine.id],
        };
        this.slimLoadingBarService.start();
        this.reservationService
          .deleteReservationFine(this.collect_fine.reservation.id, payload)
          .subscribe(
            (res: any) => {
              swal("Success", "Deleted Fine successfully", "success");
              this.slimLoadingBarService.complete();
              this.getFines();
            },
            (err) => {
              this.slimLoadingBarService.reset();
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  /**
   * Start of import reservation modal
   */
  uploadExcelFile;

  importFinesModalOpen() {
    this.uploadExcelFile = null;
  }

  importFinesModalClose() {
    this.uploadExcelFile = null;
  }

  uploadExcelMethod(modal) {
    if (!this.uploadExcelFile) return;

    let data = {
      file_name: this.uploadExcelFile.file_name,
      file_value: this.uploadExcelFile.file_value,
    };

    this.slimLoadingBarService.start();
    this.reservationService.importFines(data).subscribe(
      (data) => {
        this.getFines();
        let inputValue = (<HTMLInputElement>document.getElementById("file"))
          .value;
        inputValue = "";
        modal.close();
        swal("Fines imported successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  handleUploadExcel(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadExcelFile = {
          file_name: file.name,
          file_value: (reader.result as any).split(",")[1],
        };
      };
    }
  }
}
