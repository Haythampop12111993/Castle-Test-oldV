import { ProjectsService } from "./../services/projects/projects.service";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../environments/environment";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReservationService } from "../services/reservation-service/reservation.service";
import swal from "sweetalert2";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { UserServiceService } from "../services/user-service/user-service.service";
import { removeNullishFieldsParams } from "../shared/object_helpers";

@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.css"],
  providers: [ReservationService],
})
export class ReservationComponent implements OnInit {
  page = 1;
  pagination: any = [];
  totalRec: number;
  reservations: Array<any> = [];
  inreservations = null;
  filesForm: FormGroup;
  file_name: any;
  file_name2: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  last_page_url: any;
  prev_page_url: any;
  current_page: any;
  excel: any;
  filterForm: FormGroup;
  filterActive = false;
  filterData: any;
  arrSearch: any = [];
  dataFromSearch: any;
  filterAgentByWordText: any;
  chosenAgent: any;
  units_reservation_modal_data: any;
  installmentForm: FormGroup;
  installmentMethods: any = [
    "7 Years 15% D.P and 85% over 25 ins. WWNC",
    "6 Years 10% D.P and 90% over 22 ins. WWNC",
    "5 Years 5% D.P and 95 % over 19 ins. WWNC",
    "6 years",
    "6 years overseas",
    "7.5 years",
    "7.5 years cityscape",
    "7.5 years overseas",
  ];
  installmentDays: any = [5, 10, 15, 20, 25, 28];
  is_refreshing = false;
  doc_type_installment_modal: any = ["PDF", "Excel"];
  is_installment_modal_loading = false;
  payments_option = ["Quarter", "Semi-annual", "Annual"];
  commentReservation: any;
  signature_date: any;
  selling_price: any;
  per_page: any;
  total: any;
  pageTest: any = 1;
  reservation_raw_data: any;
  reservation = {
    onColor: "primary",
    offColor: "danger",
    onText: "Enable",
    offText: "Disable",
    value: "",
    size: "",
  };
  selling_date: any;
  is_edit_mode_account_approve = false;
  last_price: any;
  cfo_pin: any;
  uploadExcel: FormGroup;
  lg = "lg";
  leadArrSerach: any;
  chosenLead: any;
  chosenLeadID: any;
  chosenLeadName: any;
  chosenLeadReason: any;
  chosenLeadPhone: any;
  allStatus: any = [
    // 'Contractor Approved',
    // conflict
    "Cheque Received",
    "Cancelled",
    "Declined",
  ];
  projects: any;
  agent_excel: any;

  agents: any;
  brokers: any;

  agentsDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  statusesDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  overseasDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  chequesDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  statusesOptions = [
    {
      id: 1,
      name: "Contracted",
    },
    {
      id: 2,
      name: "Not Contracted",
    },
    {
      id: 3,
      name: "New Reservation",
    },
    {
      id: 4,
      name: "Accountant Approved",
    },
    {
      id: 5,
      name: "Pending Finance Action",
    },
    {
      id: 6,
      name: "Cancelled",
    },
    {
      id: 7,
      name: "Declined",
    },
  ];

  overseasOptions = [
    {
      id: 1,
      name: "Yes",
    },
    {
      id: 2,
      name: "No",
    },
  ];

  chequesOptions = [
    {
      id: 1,
      name: "Yes",
    },
    {
      id: 2,
      name: "No",
    },
  ];

  contractOptions = [
    {
      id: 1,
      name: "pending",
    },
    {
      id: 2,
      name: "contract-sent",
    },
    {
      id: 3,
      name: "contract-signed",
    },
    {
      id: 4,
      name: "contract-approved",
    },
    {
      id: 5,
      name: "contract-delivered",
    },
  ];

  BooleanOptions = [
    {
      id: 1,
      name: "yes",
    },
    {
      id: 0,
      name: "no",
    },
  ];

  allEvents = [];
  //     formControlName="contractStatus"
  //     id="contractStatus">
  //     <option value="" disabled="true"
  //         [selected]="true">Contract Status
  //     </option>
  //     <option value="">All</option>
  //     <option value="pending">Contract Pending
  //     </option>
  //     <option value="contract-sent">Contract sent
  //     </option>
  //     <option value="contract-signed">Contract signed</option>
  //     <option value="contract-approved">Contract approved</option>
  //     <option value="contract-delivered">Contract Delivered </option>
  //     <option value="done">Done</option>
  // </select> -->

  filter_collapsed = true;
  legelTypesOptions = [
    {
      name: "None",
      value: "none",
    },
    {
      name: "Legal Action",
      value: "1",
    },
    {
      name: "Under Legal Termination",
      value: "2",
    },
    {
      name: "Unit Terminated",
      value: "3",
    },
    {
      name: "Payment Settled",
      value: "4",
    },
  ];

  selectedAgents: any = [];
  selectedBrokers: any = [];
  selectedStatuses: any = [];
  selectedContractStatuses: any = [];
  selectedLegelTypes: any = [];
  selectedDeposits: any = [];
  selectedBankTransfer: any = [];
  selectedProjects: any = [];
  selectedOverseas: any = [];
  selectedEvent_ids: any = [];
  selectedCheques: any = [];
  selectedOrdered: string;
  orderByOptions = [
    {
      name: "RF Serial",
      value: "rf_serial",
    },
    {
      name: "Last Updated",
      value: "last_updated",
    },
  ];

  total_unit_price: number;
  allBuildings: any;
  finishing_types: any;

  filterLeadObservable = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    if (keyword) {
      return this.http
        .get(`${baseUrl}users/search?keyword=${keyword}`)
        .map((res: any) => {
          console.log(res.length);
          if (res.length == 0) {
            return Observable.of([]);
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res;
            res.forEach((e) => {
              this.arrSearch.push(e.name);
            });
            console.log(this.arrSearch);
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  valueChanged(event) {
    this.dataFromSearch.forEach((e) => {
      if (e.name == event) this.chosenAgent = e;
    });
  }

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    public leadsService: LeadsService,
    private http: HttpClient,
    private userService: UserServiceService,
    public projectService: ProjectsService
  ) {
    console.log(this.userProfile.role);
    this.createForms();
    console.log("--------------reloading", this.route.snapshot.queryParams);
    if (
      [
        "serial",
        "lead_name",
        "project_id",
        "client_signature_date_from",
        "client_signature_date_to",
        "order_by",
        "handover_status",
        "contract_to_be_delivered",
        "area_from",
        "area_to",
        "finishing_type_id",
        "building_num",
        "cancel_date_from",
        "cancel_date_to",
        "Handover_date_from",
        "Handover_date_to",
        "date_from",
        "date_to",
        "selectedAgents",
        "selectedBrokers",
        "selectedStatuses",
        "selectedContractStatuses",
        "selectedLegelTypes",
        "selectedDeposits",
        "selectedBankTransfer",
        "selectedProjects",
        "selectedOverseas",
        "selectedEvent_ids",
        "selectedCheques",
      ].some((f) => this.route.snapshot.queryParams[f])
    ) {
      this.filterReservations(false);
    } else {
      this.getreservations();
    }
    // console.log(this.userProfile);
    this.excel = `${
      environment.api_base_url
    }reservation/export?token=${window.localStorage.getItem("token")}`;
    this.agent_excel = `${
      environment.api_base_url
    }generate/reservations/pdf?token=${window.localStorage.getItem("token")}`;
  }

  ngOnInit() {
    this.createInstallment();
    this.getProjects();
    this.getEvents();
    this.getAgents();
    this.getBrokers();
    this.getAllBuildings();
    this.getAllFinishingTypes()
  }

  getAllBuildings() {
    this.reservationService.getAllBuildings().subscribe(
      (res: any) => {
        this.allBuildings = res.map(element => ({ name: element }));
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
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

  getEvents() {
    this.slimLoadingBarService.start();
    this.reservationService.getAllEvents().subscribe(
      (res: any) => {
        this.allEvents = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAgents() {
    this.leadsService.getAgents().subscribe(
      (data: any) => {
        console.log(data);
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

  getBrokers() {
    this.slimLoadingBarService.start();
    this.userService.getBorkers().subscribe(
      (data: any) => {
        this.brokers = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onSelectAllItems(field: string, items: any, key = "id") {
    this[field] = items.map((f) => "" + f[key]);
  }

  onClearAllItems(field: string) {
    this[field] = [];
  }

  getProjects() {
    this.reservationService.getProjects().subscribe(
      (res: any) => {
        this.projects = res;
      },
      (err) => console.log(err)
    );
  }

  getreservations() {
    console.log("--------*-*-*-sfetch data");
    this.reservations = null;
    this.is_refreshing = true;
    this.reservationService.getReservations().subscribe(
      (data: any) => {
        this.reservation_raw_data = data;
        console.log(this.reservation_raw_data);
        console.log(this.reservation_raw_data.last_page);
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.totalRec = data.total;
        this.reservations = data.data;
        this.getTotalUnitPrice();
        console.log(this.reservations);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => (this.is_refreshing = false)
    );
  }

  getTotalUnitPrice(filters?) {
    if (filters) {
      this.reservationService
        .getFilteredTotalUnitPrice(filters)
        .subscribe((res: any) => {
          this.total_unit_price = res.total_unit_price;
        });
    } else {
      this.reservationService.getTotalUnitPrice().subscribe((res: any) => {
        this.total_unit_price = res.total_unit_price;
      });
    }
  }

  addreservation() {
    this.router.navigate(["./pages/reservations/add/", 0]);
  }

  editreservation(reservationid) {
    this.router.navigate(["./pages/settings/accounts/add/", reservationid]);
  }

  deletereservation(reservationid) {}

  parseArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    else return [data];
  }

  createForms() {
    this.filesForm = this.fb.group({
      receipt: [null, Validators.required],
      signed: [null, Validators.required],
    });
    // conflict solved
    this.filterForm = this.fb.group({
      serial: [this.route.snapshot.queryParams.serial || ""],
      order_by: [this.route.snapshot.queryParams.order_by],
      handover_status: [this.route.snapshot.queryParams.handover_status],
      contract_to_be_delivered: [this.route.snapshot.queryParams.contract_to_be_delivered],
      area_from: [this.route.snapshot.queryParams.area_from],
      area_to: [this.route.snapshot.queryParams.area_to],
      finishing_type_id: [this.route.snapshot.queryParams.finishing_type_id],
      building_num: [this.route.snapshot.queryParams.building_num],
      agents: [[]],
      brokers: [[]],
      lead_name: [this.route.snapshot.queryParams.lead_name || ""],
      contractStatus: [[]],
      last_legal_type: [[]],
      statuses: [[]],
      overseas: [[]],
      event_ids: [[]],
      cheques: [[]],
      project_id: [this.route.snapshot.queryParams.project_id || ""],
      // selling_date: [''],
      is_deposit: [[]],
      is_bank_transfer: [[]],
      client_signature_date_from: [
        this.route.snapshot.queryParams.client_signature_date_from || "",
      ],
      client_signature_date_to: [
        this.route.snapshot.queryParams.client_signature_date_to || "",
      ],
      cancel_date_from: [
        this.route.snapshot.queryParams.cancel_date_from || "",
      ],
      cancel_date_to: [this.route.snapshot.queryParams.cancel_date_to || ""],
      Handover_date_from: [
        this.route.snapshot.queryParams.Handover_date_from || "",
      ],
      Handover_date_to: [
        this.route.snapshot.queryParams.Handover_date_to || "",
      ],
      date_from: [this.route.snapshot.queryParams.date_from || ""],
      date_to: [this.route.snapshot.queryParams.date_to || ""],
    });

    // caching
    this.selectedAgents = this.parseArray(
      this.route.snapshot.queryParams.selectedAgents
    );

    this.selectedBrokers = this.parseArray(
      this.route.snapshot.queryParams.selectedBrokers
    );
    this.selectedStatuses = this.parseArray(
      this.route.snapshot.queryParams.selectedStatuses
    );
    this.selectedContractStatuses = this.parseArray(
      this.route.snapshot.queryParams.selectedContractStatuses
    );
    this.selectedLegelTypes = this.parseArray(
      this.route.snapshot.queryParams.selectedLegelTypes
    );
    this.selectedDeposits = this.parseArray(
      this.route.snapshot.queryParams.selectedDeposits
    );
    this.selectedBankTransfer = this.parseArray(
      this.route.snapshot.queryParams.selectedBankTransfer
    );
    this.selectedProjects = this.parseArray(
      this.route.snapshot.queryParams.selectedProjects
    );
    this.selectedOverseas = this.parseArray(
      this.route.snapshot.queryParams.selectedOverseas
    );
    this.selectedEvent_ids = this.parseArray(
      this.route.snapshot.queryParams.selectedEvent_ids
    );
    this.selectedCheques = this.parseArray(
      this.route.snapshot.queryParams.selectedCheques
    );

    console.log(this.selectedDeposits, this.route.snapshot.queryParams);
    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
  }

  changeBuildingNumber(event) {
    this.filterForm.get("building_num").setValue(event.value.name);
  }

  generateReservationForAgent() {
    this.slimLoadingBarService.start();
    this.reservationService.generateReservationForAgent().subscribe(
      (res: any) => {},
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  filterReservations(cache = true) {
    this.pageTest = 1;
    let formModel = this.filterForm.value;

    if (cache) this.setQueryParams(formModel);

    formModel.agents = this.selectedAgents;
    formModel.brokers = this.selectedBrokers;
    formModel.statuses = this.selectedStatuses.join(",");
    formModel.contractStatus = this.selectedContractStatuses;
    formModel.last_legal_type = this.selectedLegelTypes;
    formModel.is_deposit = this.selectedDeposits;
    formModel.is_bank_transfer = this.selectedBankTransfer;
    formModel.project_id = this.selectedProjects;
    formModel.overseas = this.selectedOverseas;
    formModel.event_ids = this.selectedEvent_ids;
    formModel.cheques = this.selectedCheques;

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
    this.is_refreshing = true;
    formModel = removeNullishFieldsParams(formModel);
    this.reservationService
      .filterReservations(formModel)
      .subscribe((data: any) => {
        console.log(formModel);
        console.log({ data });
        this.getTotalUnitPrice(formModel);
        let selected = true;
        this.reservation_raw_data = data;
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        this.totalRec = data.total;
        this.reservations = data.data;
        this.per_page = data.to;
        this.total = data.total;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.reservations = data.data;
        this.slimLoadingBarService.complete();
        this.is_refreshing = false;
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
    let formModel = this.filterForm.value;

    formModel.agents = this.selectedAgents;
    formModel.brokers = this.selectedBrokers;
    formModel.statuses = this.selectedStatuses.join(",");
    formModel.contractStatus = this.selectedContractStatuses;
    formModel.last_legal_type = this.selectedLegelTypes;
    formModel.is_deposit = this.selectedDeposits;
    formModel.is_bank_transfer = this.selectedBankTransfer;
    formModel.project_id = this.selectedProjects;
    formModel.overseas = this.selectedOverseas;
    formModel.event_ids = this.selectedEvent_ids;
    formModel.cheques = this.selectedCheques;

    formModel.is_export = 1;
    this.slimLoadingBarService.start();
    this.reservationService.exportTable(formModel).subscribe((data: any) => {
      window.open(data, "_blank");
      this.slimLoadingBarService.complete();
    }),
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      };
  }

  resetFilters() {
    this.resetQueryParams();
    this.filterActive = false;
    this.filterData = null;
    // this.createForms();
    this.getreservations();
    // this.filterForm.reset();
    this.filterForm.patchValue({
      serial: [""],
      agents: [[]],
      brokers: [[]],
      lead_name: [""],
      contractStatuses: [[]],
      statuses: [[]],
      overseas: [[]],
      event_ids: [[]],
      cheques: [[]],
      project_id: [""],
      // selling_date: [''],
      is_deposit: [[]],
      client_signature_date_from: [""],
      client_signature_date_to: [""],
      cancel_date_from: [""],
      cancel_date_to: [""],
      Handover_date_from: [""],
      Handover_date_to: [""],
      date_from: [""],
      date_to: [""],
      order_by: [""],
      handover_status: [""],
      contract_to_be_delivered: [""],
      area_from: [""],
      area_to: [""],
      finishing_type_id: [""],
      building_num: [""],
    });
    console.log(this.filterForm.value);
    this.selectedAgents = [];
    this.selectedBrokers = [];
    this.selectedStatuses = [];
    this.selectedContractStatuses = [];
    this.selectedLegelTypes = [];
    this.selectedDeposits = [];
    this.selectedBankTransfer = [];
    this.selectedProjects = [];
    this.selectedOverseas = [];
    this.selectedEvent_ids = [];
    this.selectedCheques = [];
  }

  handleReceiptFile(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.filesForm.get("receipt").setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        this.reservation_raw_data = data;
        this.totalRec = data.total;
        this.reservations = data.data;
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

  paginate(number) {
    // this.pagination.forEach(element => {
    //   if (element.number == number) {
    //     element.selected = true;
    //     let arr = this.last_page_url.split('?');
    //     if (this.current_page != number) {
    //       let selectedUrl = `${arr[0]}?page=${number}`;
    //       console.log(selectedUrl);
    //     }
    //     // console.log(arr);
    //   }
    //   else element.selected = false;
    // });
  }

  handleSignedFile(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name2 = file.name;
      reader.onload = () => {
        this.filesForm.get("signed").setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  actionOnOpen(reservationId) {
    console.log(reservationId);
  }

  actionOnClose() {}

  actionOnSubmit(reservationId, modal) {
    this.slimLoadingBarService.start(() => {
      console.log("Loading complete");
    });
    const formModel = this.filesForm.value;
    console.log(formModel);
    if (!formModel.receipt || !formModel.signed) {
      swal("Oops...", "Files can not be empty!", "error");
    } else {
      let data = {
        receipt: formModel.receipt.value,
        scan_url: formModel.signed.value,
        id: reservationId,
        file_name2: formModel.signed.filename,
        file_name: formModel.receipt.filename,
      };
      console.log(data);
      this.reservationService.contractorApproved(data).subscribe(
        (data) => {
          console.log(data);
          this.slimLoadingBarService.complete();
          modal.close();
          swal("Woohoo!", "Contractor Approved!", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
    }
  }

  infiniteWithFilter(url, number) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    this.reservationService
      .infinitWithPagination(url, this.filterData)
      .subscribe(
        (data: any) => {
          this.reservation_raw_data = data;
          this.totalRec = data.total;
          this.reservations = data.data;
          this.current_page = number;
          this.per_page = data.to;
          this.total = data.total;
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.slimLoadingBarService.complete();
          this.errorHandlerService.handleErorr(err);
        },
        () => (this.is_refreshing = false)
      );
  }

  accountDecline(reservationId) {
    swal({
      title: "Are you sure?",
      text: "You will decline the reservation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, decline it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .accountDeclineReservation(reservationId)
          .subscribe(
            (data) => {
              console.log(data);
              this.getreservations();
              swal("Woohoo!", "Declined succesfully!", "success");
            },
            (err) => this.errorHandlerService.handleErorr(err),
            () => this.slimLoadingBarService.complete()
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  declineReservation(reservationId) {
    this.slimLoadingBarService.start();
    this.reservationService.adminDeclineReservations(reservationId).subscribe(
      (data) => {
        console.log(data);
        this.getreservations();
        swal("Woohoo!", "Approved succesfully!", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  closeAssignModal() {}

  swalDelete(res_id) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this reservation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService.deleteReservation(res_id).subscribe(
          (data) => {
            this.slimLoadingBarService.complete();
            swal("Deleted!", "Reservation has been deleted.", "success");
            this.getreservations();
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

  submitAssignModal(res_id, modal) {
    this.slimLoadingBarService.start();
    this.reservationService.assignToLead(res_id, this.chosenAgent.id).subscribe(
      (data) => {
        console.log(data);
        swal("Woohoo!", "Assigned to user successfully!", "success");
        this.getreservations();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  openAssignModal(unit_id) {}

  unitOnOpen(unit_id) {
    console.log(unit_id);
    this.projectService.getUnitDetails(unit_id).subscribe(
      (data) => {
        console.log(data);
        this.units_reservation_modal_data = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  unitModalOnClose() {}

  /**
   * Start of Installment Modal
   */

  createInstallment() {
    this.installmentForm = this.fb.group({
      percentage: ["", Validators.required],
      slots: ["0", Validators.required],
      type: ["6 years", Validators.required],
      day: ["5", Validators.required],
      doc_type: ["PDF", Validators.required],
      installment_plan: ["Quarter", Validators.required],
    });
  }

  openInstallmentModal(reservation) {}

  closeInstallmentModal(reservation) {}

  submitInstallmentModal(reservation, modal) {
    let data = this.installmentForm.value;
    data.r_serial = reservation.id;
    console.log(data);
    /* call back end point here and dismiss loader in success */
    this.is_installment_modal_loading = true;
    this.reservationService.installmentPdf(data).subscribe(
      (res: any) => {
        modal.close();
        console.log(res.url);
        window.open(res.url);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => (this.is_installment_modal_loading = false)
    );
  }

  /**
   * End of Installment Modal
   */

  // contract_sign_by_client(reservation_id) {
  //   swal({
  //     title: 'Are you sure?',
  //     text: 'client signed contract!',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then(result => {
  //     if (result.value) {
  //       this.slimLoadingBarService.start();
  //       this.reservationService
  //         .contract_sign_by_client(reservation_id)
  //         .subscribe(
  //           data => {
  //             this.getreservations();
  //             swal(
  //               'Woohoo!',
  //               'Contract signed by client succesfully!',
  //               'success'
  //             );
  //           },
  //           err => console.log(err),
  //           () => this.slimLoadingBarService.complete()
  //         );
  //     } else if (result.dismiss) {
  //       swal('Cancelled', '', 'error');
  //     }
  //   });
  // }

  // contract_approve(reservation_id) {
  //   swal({
  //     title: 'Are you sure?',
  //     text: 'Approve the contract!',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then(result => {
  //     if (result.value) {
  //       this.slimLoadingBarService.start();
  //       this.reservationService.contract_approve(reservation_id).subscribe(
  //         data => {
  //           this.getreservations();
  //           swal('Woohoo!', 'Contract approved succesfully!', 'success');
  //         },
  //         err => console.log(err),
  //         () => this.slimLoadingBarService.complete()
  //       );
  //     } else if (result.dismiss) {
  //       swal('Cancelled', '', 'error');
  //     }
  //   });
  // }

  // contract_delivered(reservation_id) {
  //   swal({
  //     title: 'Are you sure?',
  //     text: 'Contract Delivered!',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then(result => {
  //     if (result.value) {
  //       this.slimLoadingBarService.start();
  //       this.reservationService.contract_delivered(reservation_id).subscribe(
  //         data => {
  //           this.getreservations();
  //           swal('Woohoo!', 'Contract delivered succesfully!', 'success');
  //         },
  //         err => console.log(err),
  //         () => this.slimLoadingBarService.complete()
  //       );
  //     } else if (result.dismiss) {
  //       swal('Cancelled', '', 'error');
  //     }
  //   });
  // }

  cheque_recieved(reservation_id) {
    // swal({
    //   title: 'Are you sure?',
    //   text: 'cheque Recieved!',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No'
    // }).then(result => {
    //   if (result.value) {
    //     this.slimLoadingBarService.start();
    //     this.reservationService.cheque_recieved(reservation_id).subscribe(
    //       data => {
    //         this.getreservations();
    //         swal('Woohoo!', 'cheque Recieved succesfully!', 'success');
    //       },
    //       err => console.log(err),
    //       () => this.slimLoadingBarService.complete()
    //     );
    //   } else if (result.dismiss) {
    //     swal('Cancelled', '', 'error');
    //   }
    // });
  }

  /**
   * Start of Comment Modal
   * */
  openCommentModal(reservation) {}

  submitCommentModal(reservation_id, modal) {
    if (!this.commentReservation)
      swal("Error", "Comment can not be empty", "error");
    else {
      this.slimLoadingBarService.start();
      this.reservationService
        .addReservationComment(reservation_id, this.commentReservation)
        .subscribe(
          (data) => {
            modal.close();
            this.getreservations();
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
   * Start of Lead Modal
   */

  leadModalOnOpen(reservation) {}

  leadModalOnClose(reservation) {}

  goToEditLead(reservation, modal) {
    if (
      this.userProfile.role == "Admin" ||
      this.userProfile.role == "Super Development" ||
      reservation.user.id == this.userProfile.id
    ) {
      this.router.navigate(["/pages/addLead/", reservation.lead.id]);
      modal.close();
    } else {
      swal("Access Deined", "", "error");
    }
  }

  redirectToLeadDetails(leadId) {
    if (!isNaN(leadId)) {
      // this.router.navigate([`/pages/leads/${leadId}`]);
      this.router.navigate(["/pages/leads"], {
        queryParams: {
          lead_id: leadId,
        },
      });
    }
    return;
  }

  submitChangeSignatureModal(reservation, modal) {
    if (!this.signature_date) {
      swal("Signature date can not be empty", "", "error");
    } else {
      this.slimLoadingBarService.start();
      this.reservationService
        .changeSignatureDate(reservation.id, this.submitCommentModal)
        .subscribe(
          (data: any) => {
            swal("Signature date Changed successfully", "", "success");
            modal.close();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  /**
   * End of Change Signature Modal
   */

  /**
   * Start of edit selling price modal
   */
  openEditSellingPriceModal(reservation) {}

  closeEditSellingPriceModal() {}

  submiteditSellingPriceModal(reservation, modal) {
    if (!this.selling_price)
      swal("Selling price can not be empty", "", "error");
    else {
      this.slimLoadingBarService.start();
      this.reservationService
        .editSellingPrice(reservation.id, { selling_price: this.selling_price })
        .subscribe(
          (data: any) => {
            swal("Selling price changes successfully", "", "success");
            modal.close();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  pageChange(event) {
    let arr = this.last_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    if (this.filterActive) {
      this.infiniteWithFilter(selectedUrl, event);
    } else {
      this.infinite(selectedUrl, event);
    }
  }

  toggleChange($event, type) {
    console.log($event, type);
    this.manageTable[type] = !$event;
  }

  submitChangeSellingDateModal(reservation, modal) {
    if (!this.selling_date) swal("Selling date can not be empty", "", "error");
    else {
      let data = {
        date: this.selling_date,
      };
      this.slimLoadingBarService.start();
      this.reservationService.changeSellingDate(reservation.id, data).subscribe(
        (data) => {
          modal.close();
          swal("Selling date changed successfully", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  accountantApproveModalOpen(reservation) {}

  accountApprove(reservation, modal) {
    if (this.is_edit_mode_account_approve) {
      if (!this.cfo_pin)
        swal("Finance manager pin can not be empty.", "", "error");
      else {
        // call back end point
        let data = {
          price: reservation.unit_price,
          is_edit_mode: true,
          cfo_pin: this.cfo_pin,
        };
        this.slimLoadingBarService.complete();
        this.reservationService
          .accountantApprove(reservation.id, data)
          .subscribe(
            (data) => {
              swal("Accountant approved successfully", "", "success");
              modal.close();
            },
            (err) => this.errorHandlerService.handleErorr(err),
            () => this.slimLoadingBarService.complete()
          );
      }
    } else {
      // call back end point
      let data = {
        price: reservation.unit_price,
        is_edit_mode: false,
      };
      this.slimLoadingBarService.complete();
      this.reservationService.accountantApprove(reservation.id, data).subscribe(
        (data) => {
          swal("Accountant approved successfully", "", "success");
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  editPrice(last_price) {
    this.last_price = last_price;
    this.is_edit_mode_account_approve = true;
  }

  closeEditPrice(i) {
    console.log(i);
    this.reservations[i].unit_price = this.last_price;
    this.is_edit_mode_account_approve = false;
  }

  /**
   * End of accountant approve modal
   */

  /**
   * Start of import reservation modal
   */

  importReservationModalOpen() {}

  importReservationModalClose() {
    this.createForms();
    let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    inputValue = "";
  }

  uploadExcelMethod(modal) {
    let formValue = this.uploadExcel.value;
    let data = {
      file_name: formValue.file.file_name,
      file_value: formValue.file.file_value,
    };
    this.slimLoadingBarService.start();
    this.reservationService.importReservation(data).subscribe(
      (data) => {
        this.createForms();
        this.getreservations();
        let inputValue = (<HTMLInputElement>document.getElementById("file"))
          .value;
        inputValue = "";
        modal.close();
        swal("Reservations imported successfully", "", "success");
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
          file_name: file.name,
          file_value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  /**
   * End of import reservation modal
   */

  viewReservation(reservation) {
    window.localStorage.setItem(
      "reservationDetails",
      JSON.stringify(reservation)
    );
    const role = this.userProfile.role;
    if (
      role == "Helpdesk Supervisor" ||
      role == "Helpdesk Agent" ||
      role == "Call Center" ||
      role == "Helpdesk Agent"
    ) {
      this.router.navigate(["/pages/project/view-reservation"], {
        queryParams: {
          ro: 1,
        },
      });
    } else {
      this.router.navigate(["/pages/project/view-reservation"]);
    }
  }

  /**
   * start of re-assign client modal
   */

  reAssignClientModalOpen(reservation) {}

  observableSource = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .post(`${baseUrl}leads/search`, JSON.stringify(data))
        .map((res: any) => {
          console.log(res.data.length);
          if (res.data.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.leadArrSerach = [];
            this.dataFromSearch = res.data;
            res.data.forEach((e) => {
              this.leadArrSerach.push(e.name);
            });
            return this.leadArrSerach;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  getLeadDetails(): any {
    console.log(this.chosenLead);
    if (!this.chosenLead) {
      swal("Lead name can not be empty!");
    } else {
      if (this.dataFromSearch.length == 0) {
        swal("No Lead with that name.");
      } else {
        let found = false;
        console.log(this.dataFromSearch);
        this.dataFromSearch.forEach((element) => {
          if (element.name == this.chosenLead) {
            this.chosenLeadID = element.id;
            found = true;
          }
        });
        if (!found) swal("No Lead with that name.");
      }
    }
  }

  searchLeadSelected(event) {
    console.log(event);
  }

  reAssignClientModalClose() {}

  reAssignClientSubmit(reservation, modal) {
    if (!this.chosenLeadID)
      swal(
        "Lead ID can not be empty",
        "click on get info button to get the lead id.",
        "error"
      );
    else if (!this.chosenLeadPhone) swal("Lead Phone can not be empty");
    else if (!this.chosenLeadName)
      swal("Lead Name can not be empty", "", "error");
    else if (!this.chosenLeadReason)
      swal("Reason can not be empty", "", "error");
    else {
      //call the back end point
      let data = {
        lead_id: this.chosenLeadID,
        reservation_id: reservation.id,
        reason: this.chosenLeadReason,
        lead_name: this.chosenLeadName,
        lead_phone: this.chosenLeadPhone,
      };
      this.slimLoadingBarService.start();
      this.reservationService.reAssignToLead(data).subscribe(
        (res) => {
          this.getreservations();
          swal("Re-assign reservation to client successfully", "", "success");
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  /**
   * end of re-assign client modal
   */

  downloadReservation(id) {
    this.slimLoadingBarService.start();
    this.reservationService.downloadReservation(id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  // cache table
  columns = [
    { key: "id", name: "ID" },
    { key: "lead_name", name: "Lead Name" },
    { key: "unit_serial", name: "Unit Serial" },
    { key: "project", name: "Project" },
    { key: "status", name: "Status" },
    { key: "admin_confirmation", name: "Admin Confirmation" },
    { key: "unit_area", name: "Unit Area" },
    { key: "garden_area", name: "Garden Area" },
    { key: "land_area", name: "Land Area" },
    { key: "roof_area", name: "Roof Area" },
    { key: "finishing_type", name: "Finishing Type" },
    { key: "price", name: "Price" },
    { key: "unit_basement_price", name: "Unit Basement Price" },
    { key: "agent", name: "Agent" },
    { key: "event", name: "Event" },
    { key: "date", name: "Date" },
    { key: "selling_date", name: "Selling Date" },
    { key: "contract_generated", name: "Contract Generated" },
    { key: "is_deposit", name: "Is Deposit" },
    { key: "is_bank_transfer", name: "Is Bank Transfer" },
  ];

  manageTable = {};

  onSelectColumns(columns) {
    this.manageTable = columns;
  }

  // cache filters
  setQueryParams(params = {}) {
    let data: any = {};

    [
      "serial",
      "lead_name",
      "project_id",
      "client_signature_date_from",
      "client_signature_date_to",
      "order_by",
      "handover_status",
      "contract_to_be_delivered",
      "area_from",
      "area_to",
      "finishing_type_id",
      "building_num",
      "cancel_date_from",
      "cancel_date_to",
      "Handover_date_from",
      "Handover_date_to",
      "date_from",
      "date_to",
    ].map((f) => {
      if (params[f]) {
        data[f] = params[f];
      }
    });

    if (this.selectedAgents.length > 0) {
      data.selectedAgents = this.selectedAgents;
    }
    if (this.selectedBrokers.length > 0) {
      data.selectedBrokers = this.selectedBrokers;
    }
    if (this.selectedStatuses.length > 0) {
      data.selectedStatuses = this.selectedStatuses.join(",");
    }

    if (this.selectedContractStatuses.length > 0) {
      data.selectedContractStatuses = this.selectedContractStatuses;
    }

    if (this.selectedLegelTypes.length > 0) {
      data.selectedLegelTypes = this.selectedLegelTypes;
    }

    if (this.selectedDeposits.length > 0) {
      data.selectedDeposits = this.selectedDeposits;
    }
    if (this.selectedBankTransfer.length > 0) {
      data.selectedBankTransfer = this.selectedBankTransfer;
    }
    if (this.selectedProjects.length > 0) {
      data.selectedProjects = this.selectedProjects;
    }

    if (this.selectedOverseas.length > 0) {
      data.selectedOverseas = this.selectedOverseas;
    }
    if (this.selectedEvent_ids.length > 0) {
      data.selectedEvent_ids = this.selectedEvent_ids;
    }
    if (this.selectedCheques.length > 0) {
      data.selectedCheques = this.selectedCheques;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
      replaceUrl: true,
    });
  }

  resetQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }
}
