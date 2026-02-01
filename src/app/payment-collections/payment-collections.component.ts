import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ReservationService } from "../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";

import { ActivatedRoute, Router } from "@angular/router";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ProjectsService } from "../services/projects/projects.service";
import { UserServiceService } from "../services/user-service/user-service.service";
import { removeNullishFieldsParams } from "../shared/object_helpers";

@Component({
  selector: "app-payment-collections",
  templateUrl: "./payment-collections.component.html",
  styleUrls: ["./payment-collections.component.css"],
})
export class PaymentCollectionsComponent implements OnInit {
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  payment_collections: any;
  current_page: any;
  per_page: any;
  total: any;
  totalRec: any;
  pageTest: any = 1;
  lg = "lg";
  editMode = false;
  isSaving = false;
  payment_collections_raw_data: any;
  last_page_url: any;

  reject_reasons: any = [];
  reject_reason: any;
  bounce_date: any;
  payment_collection_id: any;
  payment_collection_index: any;
  chequeCollectCustomer: any;

  uploadExcel: FormGroup;

  active_tab: any = "filter";

  stats;

  is_refreshing = false;
  filterForm: FormGroup;
  filterActive = false;
  filterData: any;

  projects;

  pagination: any = [];
  banks;

  check_all = false;

  current_active_cheque: number;
  current_active_full_cheque: any;

  cheque_amount: any;

  chequeCollectType: any;

  collect_type = "fully-collected";

  collection_date = "";

  partially_method: any;

  chequeRejectType: any;

  partially_data: any;

  currency_code: any = "EGP";
  location: any;

  reject_comment: string;

  check_all_rows: boolean;

  allPhases: any;
  allStatuses = [
    { id: "bounced", value: "bounced" },
    { id: "fully-collected", value: "fully-collected" },
    { id: "under-collection", value: "under-collection" },
    { id: "cancelled", value: "cancelled" },
    { id: "recall", value: "recall" },
    { id: "pending-redeposit", value: "pending-redeposit" },
    { id: "pending-recall", value: "pending-recall" },
    { id: "pending-cancelled", value: "pending-cancelled" },
    { id: "recall-cancelled", value: "recall-cancelled" },
    { id: "bounced-cancelled", value: "bounced-cancelled" },
    { id: "redeposit", value: "redeposit" },
    { id: "recall-request", value: "recall-request" },
    { id: "pending-collected", value: "pending-collected" },
    { id: "null", value: "Blank" },
  ];
  allCollectTypes = [
    { id: "1", value: "Cash" },
    { id: "2", value: "Visa" },
    { id: "3", value: "Bank Transfer" },
    { id: "4", value: "Cheque" },
    { id: "5", value: "Commission Settlement" },
    { id: "6", value: "Share Holder Settlement" },
    { id: "7", value: "Vendor Settlement" },
    { id: "8", value: "Cash instead of cheque" },
    { id: "null", value: "Blank" },
  ];
  allPaymentTypes = [
    { id: "1", value: "Down Payment" },
    { id: "2", value: "Installment" },
    { id: "3", value: "Extra" },
    { id: "4", value: "Visa Instance" },
    { id: "5", value: "CDB" },
    { id: "6", value: "Recall Fees" },
    { id: "7", value: "EOI" },
    { id: "8", value: "Fine" },
  ];
  store_banks: any[];

  partially_methods = [
    "Cash",
    "Visa",
    "Transfer",
    "Cheque",
    "Commission Settlement",
    "Share Holder Settlement",
    "Vendor Settlement",
  ];
  exchange_rate: any;

  currencies_list = [];

  redeposit_date = "";

  store_status;

  location_bounce;
  bounce_reason;

  request_reason: string;
  request_date: string;
  request_type: string;
  request_ids: number[];
  delivered_to_customer_date: string;

  transaction_number;
  vendor_code;
  vendor_developer_id;
  slip_type;
  developers;
  @ViewChild("topScroll") topScroll: ElementRef;
  @ViewChild("tableScroll") tableScroll: ElementRef;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private projectsService: ProjectsService,
    private leadsService: LeadsService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
    this.createFilter();
    if (
      [
        "filter_collect_date_from",
        "filter_collect_date_to",
        "status",
        "filter_bounce_date_from",
        "filter_bounce_date_to",
        "filter_date_from",
        "filter_date_to",
        "types",
        "filter_payment_type",
      ].some((f) => this.route.snapshot.queryParams[f])
    ) {
      this.filterForm.patchValue({
        "filter_status[]": this.route.snapshot.queryParams["status"],
        filter_collect_date_from:
          this.route.snapshot.queryParams["filter_collect_date_from"],
        filter_collect_date_to:
          this.route.snapshot.queryParams["filter_collect_date_to"],
        filter_bounce_date_from:
          this.route.snapshot.queryParams["filter_bounce_date_from"],
        filter_bounce_date_to:
          this.route.snapshot.queryParams["filter_bounce_date_to"],
        filter_date_from: this.route.snapshot.queryParams["filter_date_from"],
        filter_date_to: this.route.snapshot.queryParams["filter_date_to"],
        "types[]": this.route.snapshot.queryParams["types"],
        "filter_payment_type[]":
          this.route.snapshot.queryParams["filter_payment_type"],
      });
    }
    if (this.route.snapshot.queryParams["status"]) {
      this.filterForm.patchValue({
        "filter_status[]": [this.route.snapshot.queryParams["status"]],
      });
    }
    if (this.route.snapshot.queryParams["types"]) {
      this.filterForm.patchValue({
        "types[]": [this.route.snapshot.queryParams["types"]],
      });
    }
    if (this.route.snapshot.queryParams["filter_payment_type"]) {
      this.filterForm.patchValue({
        "filter_payment_type[]": [
          this.route.snapshot.queryParams["filter_payment_type"],
        ],
      });
    }
    if (this.route.snapshot.queryParams["status"]) {
      this.filterForm.patchValue({
        "filter_status[]": [this.route.snapshot.queryParams["status"]],
      });
    }
    if (this.route.snapshot.queryParams["status"]) {
      this.filterForm.patchValue({
        "filter_status[]": [this.route.snapshot.queryParams["status"]],
        "types[]": this.route.snapshot.queryParams["types"],
        "filter_payment_type[]":
          this.route.snapshot.queryParams["filter_payment_type"],
      });
      if (this.route.snapshot.queryParams["status"]) {
        this.filterForm.patchValue({
          "filter_status[]": [this.route.snapshot.queryParams["status"]],
        });
      }
      if (this.route.snapshot.queryParams["types"]) {
        this.filterForm.patchValue({
          "types[]": [this.route.snapshot.queryParams["types"]],
        });
      }
      if (this.route.snapshot.queryParams["filter_payment_type"]) {
        this.filterForm.patchValue({
          "filter_payment_type[]": [
            this.route.snapshot.queryParams["filter_payment_type"],
          ],
        });
      }
    }
    console.log(this.filterForm.value);
    this.getStoreBanks();
    this.getBanks();
    this.getProjects();
    this.getCardStat();
    this.filterPayments();
    this.getAllCurrencies();
    this.getRejectReaasons();
    this.getAllPhases();
    this.getdevelopers();
  }

  getdevelopers() {
    this.slimLoadingBarService.start();
    this.userService.getDevelopers().subscribe(
      (data: any) => {
        this.developers = data;
      },
      (err) => {},
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllPhases() {
    this.slimLoadingBarService.start();
    this.userService.getPhases({ is_select_form: true }).subscribe(
      (res: any) => {
        this.allPhases = res;
        console.log("phases", this.allPhases);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  makeTableScrollable() {
    setTimeout(() => {
      console.log(this.topScroll, this.tableScroll);

      // Synchronize scroll between the top scrollbar and the actual table
      this.topScroll.nativeElement.addEventListener("scroll", () => {
        this.tableScroll.nativeElement.scrollLeft =
          this.topScroll.nativeElement.scrollLeft;
      });

      this.tableScroll.nativeElement.addEventListener("scroll", () => {
        this.topScroll.nativeElement.scrollLeft =
          this.tableScroll.nativeElement.scrollLeft;
      });
    }, 1000);
  }

  getStoreBanks() {
    this.slimLoadingBarService.start();
    this.userService.getBanks().subscribe(
      (data: any) => {
        this.store_banks = [...data, { id: "null", name: "Blank" }];
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllCurrencies() {
    this.slimLoadingBarService.start();
    this.reservationService.getAllCurrencies().subscribe(
      (data: any) => {
        this.currencies_list = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getProjects() {
    this.reservationService.getProjects().subscribe(
      (res: any) => {
        this.projects = [...res, { id: "null", name: "Blank" }];
      },
      (err) => console.log(err)
    );
  }

  onCheckAllToggle(event) {
    this.check_all = event;
    this.payment_collections.forEach((e) => {
      if (this.check_all) {
        e.checked = true;
      } else {
        e.checked = false;
      }
    });
  }

  getBanks() {
    this.reservationService.getbanks().subscribe((res: any) => {
      this.banks = [...res, { id: "null", name: "Blank" }];
    });
  }

  createFilter() {
    this.filterForm = this.fb.group({
      "filter_project_id[]": [[]], // done
      "filter_status[]": [[]], // done
      "phases[]": [[]], // done
      filter_is_bulk: [""],
      filter_is_final: [""],
      filter_reservation_status: ["active"],
      filter_lead: [""], // done
      filter_vendor_code: [""],
      filter_reservation: [""], // done
      filter_unit: [""], // done
      "filter_bank_id[]": [[]], // done
      "types[]": [[]],
      "filter_payment_type[]": [[]],
      filter_cheque_number: [""], // done
      transaction_number: [""], // done
      filter_date_from: [""], // done
      filter_date_to: [""], // done
      filter_bounce_date_from: [""], // done
      filter_receiving_date_from: [""], // done
      filter_receiving_date_to: [""], // done
      filter_bounce_date_to: [""], // done
      filter_sent_to_bank_date_from: [""], // done
      filter_sent_to_bank_date_to: [""], // done
      filter_collect_date_from: [""], // done
      filter_collect_date_to: [""], // done
      filter_recall_date_from: [""], // done
      filter_recall_date_to: [""], // done
      filter_action_date_from: [""], // done
      filter_action_date_to: [""], // done
      delivered_to_customer_date_from: [""], // done
      delivered_to_customer_date_to: [""], // done
      "filter_store_bank_id[]": [[]],
      "filter_previous_store_bank_id[]": [[]],
      filter_is_with_treasury: [""],
    });
  }

  resetFilters() {
    this.filterActive = false;
    this.filterData = null;
    this.createFilter();
    this.filterPayments();
  }

  onSelectAllItems(field: string, items: any, key = "id") {
    this.filterForm.controls[field].setValue(items.map((f) => "" + f[key]));
  }

  onClearAllItems(field: string) {
    this.filterForm.controls[field].setValue([]);
  }

  filterARTabs(type) {
    this.filterForm.controls.filter_is_with_treasury.patchValue(type);
    this.filterPayments();
    this.getCardStat();
  }

  filterPayments() {
    this.pageTest = 1;
    const formModel = Object.assign({}, this.filterForm.value);
    formModel.is_export = 0;
    this.slimLoadingBarService.start();
    this.filterActive = true;
    this.filterData = formModel;
    this.is_refreshing = true;
    if (formModel.filter_is_with_treasury === "filter_pending_request") {
      formModel.filter_pending_request = "yes";
    } else {
      delete formModel.filter_pending_request;
    }
    this.reservationService
      .filterPaymentCollections(formModel)
      .subscribe((res: any) => {
        let selected = true;
        this.payment_collections = res.data.map((c) => {
          if(c.collect_types) {
            c.collect_types = Array.from(
              new Set(c.receipts.map((r) => r.type_string))
            ).join(", ");
          }
          return c;
        });
        this.payment_collections_raw_data = res;
        this.last_page_url = res.last_page_url;
        this.current_page = 1;
        this.totalRec = res.total;
        this.per_page = res.to;
        this.total = res.total;
        for (var i = 1; i <= res.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.is_refreshing = false;
        setTimeout(() => {
          this.makeTableScrollable();
        }, 2000);
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
      },
      () => {};
    console.log(formModel);
  }

  exportTable() {
    let formModel = Object.assign({}, this.filterForm.value);
    formModel.is_export = 1;
    this.slimLoadingBarService.start();
    this.reservationService
      .filterPaymentCollections(formModel)
      .subscribe((data: any) => {
        window.open(data.url);
        this.slimLoadingBarService.complete();
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      };
  }

  sendFilteredToERP() {
    let formModel = Object.assign({}, this.filterForm.value);
    formModel.send_to_erp = 1;
    this.slimLoadingBarService.start();
    this.reservationService
      .filterPaymentCollections(formModel)
      .subscribe((data: any) => {
        swal("success", "", "success");
        this.slimLoadingBarService.complete();
      }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      };
  }

  setFilterActiveTab() {
    if (this.active_tab == "" || this.active_tab == "sales-status") {
      this.active_tab = "filter";
    } else {
      this.active_tab = "";
    }
  }

  setSalesStatusTab() {
    if (this.active_tab == "" || this.active_tab == "filter") {
      this.active_tab = "sales-status";
    } else {
      this.active_tab = "";
    }
  }

  getCardStat() {
    this.slimLoadingBarService.start();
    this.reservationService
      .getPaymentCollectionStats({
        filter_is_with_treasury:
          this.filterForm.controls.filter_is_with_treasury.value,
      })
      .subscribe((res) => {
        this.stats = res;
      });
  }

  getRejectReaasons() {
    this.slimLoadingBarService.start();
    this.reservationService.getAllRejectReasons().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.reject_reasons = res;
        console.log("reasons : ", res);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  printReciptModalSubmit(id) {
    this.slimLoadingBarService.start();
    this.projectsService.printRecipt(id).subscribe(
      (res: any) => {
        console.log(res);
        this.projectsService.printHtml(res);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
        console.log(err);
      }
    );
  }

  getPaymentCollections() {
    this.slimLoadingBarService.start();
    this.reservationService.getAllPaymentCollections().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.payment_collections = res.data.map((c) => {
          c.collect_types = Array.from(
            new Set(c.receipts.map((r) => r.type_string))
          ).join(", ");
          return c;
        });
        this.payment_collections_raw_data = res;
        this.last_page_url = res.last_page_url;
        this.current_page = 1;
        this.per_page = res.to;
        this.total = res.total;
        this.totalRec = res.total;
        setTimeout(() => {
          this.makeTableScrollable();
        }, 2000);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  // rejectPaymentCollection(modal) {
  //   modal.close();
  //   swal({
  //     title: "Are you sure?",
  //     text: "You will reject!",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, reject it!",
  //     cancelButtonText: "No, keep it",
  //   }).then((result) => {
  //     if (result.value) {
  //       let payload = {
  //         status: "rejected",
  //       };
  //       this.slimLoadingBarService.start();
  //       this.reservationService
  //         .updatePaymentCollectionStatus(this.payment_collection_id, payload)
  //         .subscribe(
  //           (res: any) => {
  //             this.slimLoadingBarService.complete();
  //             // this.getPaymentCollections();
  //             this.payment_collections[this.payment_collection_index].status =
  //               "rejected";
  //             swal("success", "Rejected Payment Successfully", "success");
  //           },
  //           (err) => {
  //             this.slimLoadingBarService.reset();
  //             this.errorHandlerService.handleErorr(err);
  //           }
  //         );
  //     } else if (result.dismiss) {
  //       swal("Cancelled", "", "error");
  //     }
  //   });
  // }

  openRejectReasonPaymentCollection(collection_id, index, modal) {
    this.payment_collection_id = collection_id;
    this.payment_collection_index = index;
    modal.open();
  }

  paymentCollect() {}

  pageChange(event) {
    let arr = this.last_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    if (this.filterActive) {
      this.infiniteWithFilter(selectedUrl, event);
    } else {
      this.infinite(selectedUrl, event);
    }
  }

  infiniteWithFilter(url, number) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;

    this.reservationService
      .infiniPaymentsWithPagination(url, this.filterData)
      .subscribe(
        (data: any) => {
          this.payment_collections_raw_data = data;
          this.totalRec = data.total;
          data.data.forEach((row) => {
            row.isStatusOpen = false;
          });
          this.payment_collections = data.data.map((c) => {
            c.collect_types = Array.from(
              new Set(c.receipts.map((r) => r.type_string))
            ).join(", ");
            return c;
          });
          this.current_page = number;
          this.per_page = data.to;
          this.total = data.total;
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        },
        () => (this.is_refreshing = false)
      );
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        this.payment_collections_raw_data = data;
        this.payment_collections = data.data.map((c) => {
          c.collect_types = Array.from(
            new Set(c.receipts.map((r) => r.type_string))
          ).join(", ");
          return c;
        });
        this.totalRec = data.total;
        this.current_page = number;
        this.per_page = data.to;
        this.total = data.total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  /**
   * Start of import reservation modal
   */

  importPaymentCollectionModalOpen() {}

  importPaymentCollectionModalClose() {
    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
    let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    inputValue = "";
  }

  uploadExcelMethod(modal) {
    let formValue = Object.assign({}, this.uploadExcel.value);
    let data = {
      file_name: formValue.file.file_name,
      file_value: formValue.file.file_value,
    };
    this.slimLoadingBarService.start();
    this.reservationService.importPayment(data).subscribe(
      (data) => {
        this.uploadExcel = this.fb.group({
          file: [null, Validators.required],
        });
        this.resetFilters();
        let inputValue = (<HTMLInputElement>document.getElementById("file"))
          .value;
        inputValue = "";
        modal.close();
        swal("Payment collections imported successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
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
          file: file.name,
          file_value: (reader.result as any).split(",")[1],
        });
      };
    }
  }

  onOpenCollectCheque(row, modal, type = "single") {
    if (row) {
      this.current_active_cheque = row.id;
      this.current_active_full_cheque = row;
      this.partially_method = row.partially_method;
      this.collection_date = row.collection_date;
      this.collect_type = row.collect_type;
    }
    if (type) this.chequeCollectType = type;
    else this.chequeCollectType = null;
    console.log(this.chequeCollectType);
    this.collect_type = "fully-collected";
    modal.open();
    console.log(this.current_active_full_cheque);
  }

  collectModalSubmitting = false;

  submitCollectCheque(modal) {
    if (this.currency_code != "EGP" && !this.exchange_rate) {
      swal(
        "error",
        "Exchange Rate is needed if the currency is not EGP",
        "error"
      );
      return;
    }
    if (this.collectModalSubmitting) return;
    let payload;
    if (this.chequeCollectType == "multiple") {
      const selectedCheques = this.payment_collections.filter(
        (list) => list.checked == true
      );
      payload = {
        ids: selectedCheques.map((cheque) => cheque.id),
        status: this.collect_type,
        lead_id: this.chequeCollectCustomer,
        partially_method: this.partially_method,
        collection_date: this.collection_date,
        exchange_rate: this.exchange_rate,
        currency_code: this.currency_code,
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        status: this.collect_type,
        lead_id: this.chequeCollectCustomer,
        partially_method: this.partially_method,
        collection_date: this.collection_date,
        exchange_rate: this.exchange_rate,
        currency_code: this.currency_code,
      };
      if (this.collect_type == "partially-collected") {
        payload.amount_received = this.cheque_amount;
        if (payload.partially_method == "3") {
          payload.partially_data = this.partially_data;
        }
      }
    }
    if (
      this.collect_type === "partially-collected" &&
      this.partially_method != 4
    ) {
      payload.transaction_number = this.transaction_number;
    }
    if (this.partially_method == "7") {
      this.filterForm.get("vendor_code").patchValue(this.vendor_code);
      this.filterForm
        .get("vendor_developer_id")
        .patchValue(this.vendor_developer_id);
    }
    if (this.isDateGreaterThanToday(this.collection_date)) {
      swal("collection date can not be greater than today", "", "error");
      return;
    }
    if (this.slip_type === "2" || this.slip_type === "3") {
      if (!this.transaction_number) {
        swal("error", "Transaction Number is required", "error");
        return;
      }
    }
    this.collectModalSubmitting = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .collectCheque(0, payload, this.filterForm.value)
      .subscribe(
        (res: any) => {
          swal("Woohoo!", "Collected!", "success");
          modal.close();
          this.collect_type = null;
          this.current_active_cheque = null;
          this.cheque_amount = null;
          this.partially_method = null;
          this.partially_data = null;
          this.collection_date = "";
          this.chequeCollectCustomer = "";
          this.filterPayments();
          this.onCheckAllToggle(false);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.collectModalSubmitting = false;
      });
  }

  collectSelectedCheque(modal) {
    let selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (selectedCheques.length == 0) {
      swal("warning", "There is no selected Cheques");
    } else {
      this.collect_type = "fully-collected";
      this.onOpenCollectCheque(null, modal, "multiple");
    }
  }

  onOpenRejectCheque(id, modal, type = "single", location_bounce?) {
    if (location_bounce) this.location_bounce = location_bounce;
    if (id) this.current_active_cheque = id;
    if (type) this.chequeRejectType = type;
    else this.chequeRejectType = null;
    this.store_status = this.store_banks.find(
      (a) => a.name == "Treasury Safe"
    ).id;
    console.log(this.chequeRejectType);
    modal.open();
  }

  submitRejectCheque(modal) {
    if (!this.reject_reason || !this.bounce_date || !this.store_status) {
      swal("Bounce Reason or Bounce Date or Location is empty", "", "error");
      return;
    }
    if (this.isDateGreaterThanToday(this.bounce_date)) {
      swal("bounce date can not be greater than today", "", "error");
      return;
    }
    let payload: any = {
      ids: [this.current_active_cheque],
      status: "bounced",
      reject_reason: this.reject_reason,
      bounce_reason: this.reject_reason,
      reject_comment: this.reject_reason == "other" ? this.reject_comment : "",
    };
    payload.bounce_date = this.bounce_date;
    payload.store_status = this.store_status;

    this.slimLoadingBarService.start();
    this.reservationService
      .collectCheque(0, payload, this.filterForm.value)
      .subscribe(
        (res: any) => {
          this.check_all = false;
          this.check_all_rows = false;
          modal.close();
          this.current_active_cheque = null;
          this.cheque_amount = null;
          this.reject_reason = null;
          this.bounce_date = "";
          this.reject_comment = null;
          this.filterPayments();
          this.onCheckAllToggle(false);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  rejectSelectedCheque(modal) {
    let selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (selectedCheques.length == 0) {
      swal("warning", "There is no selected Cheques");
    } else {
      this.collect_type = "fully-collected";
      this.onOpenRejectCheque(null, modal, "multiple");
    }
  }

  onOpenRedepositeCheque(row, modal, type = "single") {
    if (row) {
      this.current_active_cheque = row.id;
      this.current_active_full_cheque = row;
      this.location_bounce = row.store_bank.id;
    }
    if (type) this.chequeCollectType = type;
    else this.chequeCollectType = null;
    console.log(this.chequeCollectType);
    modal.open();
    console.log(this.current_active_full_cheque);
  }

  submitRedepositeCheque(modal) {
    let payload;
    if (this.chequeCollectType == "multiple") {
      let selectedCheques = this.payment_collections.filter(
        (list) => list.checked == true
      );
      payload = {
        ids:
          this.filterData && this.check_all_rows
            ? [-1]
            : selectedCheques.map((cheque) => cheque.id),
        status: "redeposit",
        redeposit_date: this.redeposit_date,
        store_status: this.location_bounce,
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        status: "redeposit",
        redeposit_date: this.redeposit_date,
        store_status: this.location_bounce,
      };
    }

    this.slimLoadingBarService.start();
    this.reservationService
      .collectCheque(0, payload, this.filterForm.value)
      .subscribe(
        (res: any) => {
          this.check_all = false;
          this.check_all_rows = false;
          modal.close();
          this.redeposit_date = "";
          this.current_active_cheque = null;
          this.filterPayments();
          this.onCheckAllToggle(false);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  cancle_formdata = {
    early_payment_discount: 0,
    cancel_for: "",
    partially_method: "",
    cheque_number: "",
    store_status: null,
    bank_id: null,
    currency_code: "EGP",
    date: "",
    transaction_number: "",
    due_date: "",
  };
  onOpenCancelCheque(id, modal) {
    this.current_active_cheque = id;
    modal.open();
  }

  cancelModalSubmitting = false;
  submitCancelCheque(modal) {
    if (this.cancelModalSubmitting) return;
    if (this.cancle_formdata.currency_code != "EGP" && !this.exchange_rate) {
      swal(
        "error",
        "Exchange Rate is needed if the currency is not EGP",
        "error"
      );
      return;
    }
    let payload;
    if (this.cancle_formdata.cancel_for === "under-collection") {
      payload = {
        ids: [this.current_active_cheque],
        status: "cancelled",
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        status: "cancelled",
        early_payment_discount: this.cancle_formdata.early_payment_discount,
        date: this.cancle_formdata.date,
        partially_method: this.cancle_formdata.partially_method,
        currency_code: this.cancle_formdata.currency_code,
        bank_id: this.cancle_formdata.bank_id,
        store_status: this.cancle_formdata.store_status,
        exchange_rate: this.exchange_rate,
        cheque_number: this.cancle_formdata.cheque_number,
        transaction_number: this.cancle_formdata.transaction_number,
        due_date: this.cancle_formdata.due_date,
      };
    }

    this.collectModalSubmitting = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .collectCheque(0, payload, this.filterForm.value)
      .subscribe(
        (res: any) => {
          this.cancle_formdata = {
            early_payment_discount: 0,
            cancel_for: "",
            date: "",
            partially_method: "",
            cheque_number: "",
            store_status: null,
            bank_id: null,
            currency_code: "EGP",
            transaction_number: "",
            due_date: "",
          };
          this.current_active_cheque = null;
          modal.close();
          this.filterPayments();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.collectModalSubmitting = false;
      });
  }

  onCheckAllRowsToggle(event) {
    this.check_all_rows = event;
    this.payment_collections.forEach((e) => {
      if (this.check_all) {
        e.checked = true;
      } else {
        e.checked = false;
      }
    });
  }

  // edits
  enableEdit() {
    this.editMode = true;
    this.payment_collections = this.payment_collections.map((payment) => {
      if (
        payment.final_cheque_received ||
        payment.delivered_to_customer ||
        payment.status === "fully-collected" ||
        (payment.send_to_treasury &&
          payment.is_treasury_approve &&
          payment.partially_method === "4")
      ) {
        return {
          ...payment,
          can_edit: false,
          can_edit_location: false,
        };
      } else {
        return {
          ...payment,
          can_edit: true,
          can_edit_location: true,
        };
      }
    });
  }

  cancleEdit(saved = false) {
    this.pageChange(this.current_page || 1);
    this.editMode = false;
    this.payment_collections = this.payment_collections.map((payment) => {
      return {
        ...payment,
        can_edit: false,
        can_edit_location: false,
      };
    });
  }

  saveEdits() {
    this.isSaving = true;
    this.slimLoadingBarService.start();
    this.projectsService
      .updateChequeBook(0, this.payment_collections)
      .subscribe(
        (res: any) => {
          this.pageChange(this.current_page || 1);
          this.cancleEdit(true);
          swal("Success", "", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.isSaving = false;
        this.slimLoadingBarService.complete();
      });
  }

  bulk_edit_form = {
    partially_method: "",
    store_status: "",
    status: "",
    receiving_date: "",
    sent_to_bank_date: "",
    recall_date: "",
  };

  bulk_change_status_form = {
    type: "",
    recall_date: "",
    store_status: "",
    request_date: "",
    request_reason: "",
    bank_recall_request_date: "",
    approve_type: "",
  };

  onCloseBulkEdit(modal) {
    this.pageChange(this.current_page || 1);

    this.bulk_edit_form = {
      partially_method: "",
      store_status: "",
      status: "",
      receiving_date: "",
      sent_to_bank_date: "",
      recall_date: "",
    };
    modal.close();
  }

  onCloseChangeBulkStatus(modal) {
    this.pageChange(this.current_page || 1);

    this.bulk_change_status_form = {
      type: "",
      recall_date: "", //recall
      store_status: "", //recall
      request_date: "", //recall_request
      request_reason: "", //recall_request
      bank_recall_request_date: "", //pending_recall
      approve_type: "", //pending_recall
    };
    modal.close();
  }

  saveBulkEdit(field) {
    if (field === "sent_to_bank_date") {
      if (!this.bulk_edit_form.sent_to_bank_date) {
        swal("request date or reason is empty", "", "error");
        return;
      }
      if (this.isDateGreaterThanToday(this.bulk_edit_form.sent_to_bank_date)) {
        swal("request date can not be greater than today", "", "error");
        return;
      }
    }
    let selectedCheques = this.payment_collections.filter((list) => {
      if (list.checked != true) return false;
      if (
        field === "store_status" &&
        this.userProfile.role !== "A.R Accountant" &&
        !list.is_treasury_approve
      )
        return false;
      return true;
    });
    if (!(this.bulk_edit_form[field] || selectedCheques.length)) return;
    const payload = {
      ids: selectedCheques.map((doc) => doc.id),
      [field]: this.bulk_edit_form[field],
    };
    this.isSaving = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .updateBulkPaymentCollections(payload)
      .subscribe(
        (res: any) => {
          swal("Success", "", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.isSaving = false;
        this.slimLoadingBarService.complete();
      });
  }

  submitBulkChangeStatus() {
    let payload = this.bulk_change_status_form;
    if (payload.type === "recall") {
      delete payload.request_date;
      delete payload.request_reason;
      delete payload.bank_recall_request_date;
      delete payload.approve_type;
    }
    if (payload.type === "recall_request") {
      delete payload.recall_date;
      delete payload.store_status;
      delete payload.bank_recall_request_date;
      delete payload.approve_type;
    }
    if (payload.type === "cancel_request") {
      delete payload.recall_date;
      delete payload.store_status;
      delete payload.approve_type;
      delete payload.bank_recall_request_date;
    }
    if (payload.type === "reject_cancel_request") {
      delete payload.recall_date;
      delete payload.request_reason;
      delete payload.store_status;
      delete payload.request_date;
      delete payload.approve_type;
      delete payload.bank_recall_request_date;
    }
    if (payload.type === "approve_cancel_request") {
      delete payload.recall_date;
      delete payload.request_reason;
      delete payload.store_status;
      delete payload.bank_recall_request_date;
    }
    if (payload.type === "pending_recall") {
      delete payload.recall_date;
      delete payload.store_status;
      delete payload.request_date;
      delete payload.request_reason;
      delete payload.approve_type;
    }
    let selectedCheques = this.payment_collections.filter((list) => {
      if (list.checked) return true;
    });
    payload["ids"] = selectedCheques.map((doc) => doc.id);
    const data = this.filterForm.value;
    delete data["is_export"];
    if (payload["ids"].length == 0) {
      payload["ids"] = [-1];
      removeNullishFieldsParams(data);
      if (Object.keys(data).length === 0) {
        swal("Please select at least one record or Filter", "", "error");
        return;
      }
    }
    this.isSaving = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .changeBulkStatus(payload, data)
      .subscribe(
        (res: any) => {
          swal("Success", "", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.isSaving = false;
        this.slimLoadingBarService.complete();
      });
  }

  sendSelectedToTreasury() {
    let selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (!selectedCheques.length) return;
    const payload = {
      ids: selectedCheques.map((doc) => doc.id),
    };

    this.slimLoadingBarService.start();
    this.reservationService
      .BulkSendToTreasuryPaymentCollections(payload)
      .subscribe(
        (res: any) => {
          this.pageChange(this.current_page || 1);
          swal("Success", "", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }

  approveTreasury(id, is_approve) {
    let payload;
    if (id === "bulk") {
      let selectedCheques = this.payment_collections.filter(
        (list) =>
          list.checked == true &&
          list.send_to_treasury &&
          !list.is_treasury_approve
      );
      if (!selectedCheques.length) return;
      payload = {
        ids: selectedCheques.map((doc) => doc.id),
        is_approve,
      };
    } else {
      payload = {
        ids: [id],
        is_approve,
      };
    }

    this.slimLoadingBarService.start();
    this.reservationService
      .ApproveTreasuryPaymentCollections(payload)
      .subscribe(
        (res: any) => {
          this.pageChange(this.current_page || 1);
          swal("Success", "", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }

  add_fineModal = {
    submitting: false,
    reservaton_id: "",
    payload: {
      amount: 0,
      num_days_late: 0,
      collection_cheque_id: null,
      fine_date: "",
    },
  };

  openDelayFineModal(modal, cheque) {
    this.add_fineModal = {
      submitting: false,
      reservaton_id: cheque.reservation_id,
      payload: {
        amount: 0,
        num_days_late: 0,
        collection_cheque_id: cheque.id,
        fine_date: "",
      },
    };
    modal.open();
  }

  addDelayFineToCheque(modal) {
    this.add_fineModal.submitting = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .addDelayFine(
        this.add_fineModal.reservaton_id,
        this.add_fineModal.payload
      )
      .subscribe(
        (res: any) => {
          swal("Success", "", "success");
          this.filterPayments();
          modal.close();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  recallRequestSelected() {
    // let selectedCheques = this.payment_collections
    //   .filter((list) => list.checked)
    //   .map((list) => list.id);
    // console.log(selectedCheques);
    // this.makePaymentRequests("Recall Request", selectedCheques);
  }

  approvePaymentRequestWithExtraData(ids, modal) {
    const payload: any = {
      ids,
      bounce_date: this.bounce_date,
      bounce_reason: this.bounce_reason,
    };
    this.slimLoadingBarService.start();
    this.reservationService.approvePaymentRequest(payload).subscribe(
      (res) => {
        swal("approved successfully", "", "success");
        this.filterPayments();
        modal.close();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  finalChequeRecieved(payment) {
    const payload = {
      ids: [payment.id],
    };
    this.execFinalChequeRecieved(payload);
  }

  execFinalChequeRecieved(payload) {
    this.slimLoadingBarService.start();
    this.reservationService.finalChequeRecieved(payload).subscribe(
      (res) => {
        this.filterPayments();
        swal("Success", "final cheque recieved successfully", "success");
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  deliveredToCustomer(payment, modal) {
    if (payment.bulk_serial) {
      const paymentsWithSamelBulkSerial = this.payment_collections.filter(
        (list) =>
          list.bulk_serial == payment.bulk_serial && payment.id != list.id
      );
      const includedStatueses = [
        "cancelled",
        "bounced-cancelled",
        "recall-cancelled",
      ];
      const paymentWithValidStatus = paymentsWithSamelBulkSerial.filter(
        (list) => includedStatueses.includes(list.status)
      );
      if (
        paymentsWithSamelBulkSerial.length !== paymentWithValidStatus.length
      ) {
        swal(
          "error",
          "You can not deliver this cheque to customer, bulk cheque is not cancelled",
          "error"
        );
        return;
      }
    }
    this.store_status = this.store_banks.find(
      (a) => a.name == "Delivered to Customer"
    ).id;
    const payload = {
      ids: [payment.id],
      delivered_to_customer_date: this.delivered_to_customer_date,
      store_status: this.store_status,
    };
    this.execDeliveredToCustomer(payload, modal);
  }

  submitDeliveredToCustomerModal(modal) {
    if (!this.delivered_to_customer_date) {
      swal("request date is required", "", "error");
      return;
    }
    if (this.current_active_full_cheque.bulk_serial) {
      const paymentsWithSamelBulkSerial = this.payment_collections.filter(
        (list) =>
          list.bulk_serial == this.current_active_full_cheque.bulk_serial &&
          this.current_active_full_cheque.id != list.id
      );
      const includedStatueses = [
        "cancelled",
        "bounced-cancelled",
        "recall-cancelled",
      ];
      const paymentWithValidStatus = paymentsWithSamelBulkSerial.filter(
        (list) => includedStatueses.includes(list.status)
      );
      if (
        paymentsWithSamelBulkSerial.length !== paymentWithValidStatus.length
      ) {
        swal(
          "error",
          "You can not deliver this cheque to customer, bulk cheque is not cancelled",
          "error"
        );
        return;
      }
    }
    this.deliveredToCustomer(this.current_active_full_cheque, modal);
  }

  execDeliveredToCustomer(payload, modal) {
    this.slimLoadingBarService.start();
    this.reservationService.deliveredToCustomer(payload).subscribe(
      (res) => {
        if (modal) modal.close();
        this.filterPayments();
        swal("Success", "Delivered to Customer successfully", "success");
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  makePaymentRequests(type, ids, modal?) {
    if (type === "Recall Request" || type === "Redeposit Request") {
      if (!this.request_date || !this.request_reason) {
        swal("request date or reason is empty", "", "error");
        return;
      }
    }
    if (type === "Redeposit Request") {
      if (this.isDateGreaterThanToday(this.request_date)) {
        swal("request date can not be greater than today", "", "error");
        return;
      }
    }
    if (type === "Cancel Request" || type === "recall") {
      if (!this.request_date || !this.request_reason) {
        swal("request date or reason is empty", "", "error");
        return;
      }
    }
    const payload = {
      ids,
      type: type,
      request_reason: this.request_reason,
      request_date: this.request_date,
    };
    console.log(payload);
    this.slimLoadingBarService.start();
    this.reservationService.makePaymentRequests(payload).subscribe(
      (res) => {
        swal("request made successfully", "", "success");
        this.filterPayments();
        this.slimLoadingBarService.complete();
        if (modal) modal.close();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  openCancelRequest(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    modal.open();
  }

  openRecallRequest(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    modal.open();
  }

  openRedeopsitRequest(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    modal.open();
  }

  openApproveRecallRequest(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    console.log(type);
    modal.open();
  }

  openApproveRequestAsRecallModal(modal, type, ids, list) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    if (list.request_reason === "Early Payment") {
      this.request_reason = "Early Payment";
    }
    modal.open();
  }

  openApproveRequestAsCancelledModal(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    modal.open();
  }

  openApproveRequestAsBounceModal(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    this.store_status = this.store_banks.find(
      (a) => a.name == "Treasury Safe"
    ).id;
    modal.open();
  }

  approvePendingRecall(modal, type, ids) {
    this.request_date = "";
    this.request_reason = "";
    this.request_type = type;
    this.request_ids = ids;
    console.log(type);
    this.store_status = this.store_banks.find(
      (a) => a.name == "Treasury Safe"
    ).id;
    modal.open();
  }

  approvePaymentRequest(ids, type?, modal?) {
    console.log(type);
    let payload: any = {
      ids,
      type: type,
      request_reason: this.request_reason,
      request_date: this.request_date,
    };
    if (type === "recall") {
      if (!this.request_date) {
        swal("request date is required", "", "error");
        return;
      }
      if (!this.request_reason) {
        swal("request reason is required", "", "error");
        return;
      }
    }
    if (type === "cancelled") payload.cancelled_date = this.request_date;
    if (type) payload.type = type;
    if (type === "recall-request") {
      if (!this.request_date) {
        swal("request date is required", "", "error");
        return;
      }
    }
    if (type === "pending-recall" || type === "bounced") {
      if (!this.store_status) {
        swal("location is required", "", "error");
        return;
      }
      if (!this.request_date) {
        swal("request date is required", "", "error");
        return;
      }
      payload.store_status = this.store_status;
    }
    if (type == "pending-cancelled") {
      if (!this.request_reason || !this.request_date || !this.store_status) {
        swal("request date or reason is empty", "", "error");
        return;
      }
      payload.bounce_reason = this.request_reason;
      payload.bounce_date = this.request_date;
      payload.store_status = this.store_status;
    }
    if (type == "bounced") {
      payload.location = this.location_bounce;
      payload.bounce_reason = this.request_reason;
      if (this.isDateGreaterThanToday(this.request_date)) {
        swal("bounce date can not be greater than today", "", "error");
        return;
      }
      payload.store_status = this.store_banks.find(
        (bank) => bank.name === "Treasury Safe"
      ).id;
    }
    console.log(payload);
    this.slimLoadingBarService.start();
    this.reservationService.approvePaymentRequest(payload).subscribe(
      (res) => {
        swal("approved successfully", "", "success");
        this.filterPayments();
        this.slimLoadingBarService.complete();
        if (modal) modal.close();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  approvePaymentRequestForRedposit(list, modal) {
    modal.open();
    this.current_active_full_cheque = list;
  }

  approvePaymentRequestForRedpositModalSubmit(modal) {
    if (!this.store_status || !this.redeposit_date) {
      swal("request date or location is required", "", "error");
      return;
    }
    let payload: any = {
      ids: [this.current_active_full_cheque.id],
      store_status: this.store_status,
      redeposit_date: this.redeposit_date,
    };
    console.log(payload);
    this.slimLoadingBarService.start();
    this.reservationService.approvePaymentRequest(payload).subscribe(
      (res) => {
        modal.close();
        swal("approved successfully", "", "success");
        this.filterPayments();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  rejectPaymentRequest(ids) {
    let payload: any = {
      ids,
    };
    console.log(payload);
    this.slimLoadingBarService.start();
    this.reservationService.rejectPaymentRequest(payload).subscribe(
      (res) => {
        swal("rejected successfully", "", "success");
        this.filterPayments();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  openDeliveredToCustomer(list, modal) {
    modal.open();
    this.current_active_full_cheque = list;
    this.current_active_cheque = list;
  }

  isDateGreaterThanToday(date) {
    const inputDate = new Date(date);
    const today = new Date();

    if (inputDate > today) {
      return true;
    }
    return false;
  }

  makeUnderCollection(payment) {
    swal({
      title: "Are you sure?",
      text: "You will make this payment under collection!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make it under collection!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        const payload = {
          ids: [payment.id],
        };
        this.slimLoadingBarService.start();
        this.reservationService.makePaymkentUnderCollection(payload).subscribe(
          (res: any) => {
            swal(
              "Success",
              "Made Payment under collection successfully!",
              "success"
            );
            this.slimLoadingBarService.complete();
            this.getPaymentCollections();
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

  approvePendingCollect(payment) {
    swal({
      title: "Are you sure?",
      text: "You will approve this payment!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        const payload = {
          ids: [payment.id],
        };
        this.slimLoadingBarService.start();
        this.reservationService.approvePendingCollected(payload).subscribe(
          (res: any) => {
            swal("Success", "Payment Approved Successfully!", "success");
            this.slimLoadingBarService.complete();
            this.getPaymentCollections();
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

  rejectPendingCollect(payment) {
    swal({
      title: "Are you sure?",
      text: "You will reject this payment!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        const payload = {
          ids: [payment.id],
        };
        this.slimLoadingBarService.start();
        this.reservationService.rejectPendingCollected(payload).subscribe(
          (res: any) => {
            swal("Success", "Payment Rejected Successfully!", "success");
            this.slimLoadingBarService.complete();
            this.getPaymentCollections();
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
}
