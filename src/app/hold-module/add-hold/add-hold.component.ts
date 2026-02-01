import { EoiService } from "../../services/eoi/eoi.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { CookieService } from "ngx-cookie-service";
import { Router, ActivatedRoute } from "@angular/router";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { Component, OnInit, Renderer2 } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ProjectsService } from "../../services/projects/projects.service";
import { UserServiceService } from "../../services/user-service/user-service.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

import * as moment from "moment";
import { HoldService } from "../hold.service";
import { Search } from "angular2-multiselect-dropdown/menu-item";

@Component({
  selector: "app-add-hold",
  templateUrl: "./add-hold.component.html",
  styleUrls: ["./add-hold.component.css"],
})
export class AddHoldComponent implements OnInit {
  isLeadSelected = false;
  documentForm: FormGroup;
  showError: boolean;
  messages: any;
  leadphonenumber: string;
  sub: any;
  unitId: any;
  leads: any;
  leadsArrayString: any = [];
  chosenLead: any;
  chosenUnit: any;
  loadingData: boolean = false;
  arrSearch: any = [];
  dataFromSearch: any;
  dataFromSearchingUnits: any;
  unit_serial: any;
  blockTimer: any;
  disabledSubmitWhileSending: boolean = false;
  deal_types: any = ["Direct", "In-Direct"];
  direct_option: any = ["Individual", "Ambassador"];
  ambassadors: any;
  brokers: any;
  deal_type: any;
  garage_price: any;
  double_garage_price: any;
  unit_garage_price: any;
  methods: any;
  commercial_methods: any;
  installment_years: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  project_type: any;
  rent_types: any;
  sale_types: any;
  payment_type: any;
  is_overseas: any;
  type: any;

  ready_to_add_contract_sale: boolean = true;
  ready_to_add_contract_rent: boolean = false;
  rent_mode: any;
  sale_mode: any;

  units: any;
  projects;
  eois: any;

  payment_types: any;

  edit_payment_modal_data: any;

  projectId;

  todayDate = new Date();

  choosenUnit;
  unitFinishingTypes;
  unitGaragePrice;

  agents: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private leadsService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    public route: ActivatedRoute,
    public projectService: ProjectsService,
    public holdService: HoldService,
    public errorHandlerService: ErrorHandlerService,
    public renderer2: Renderer2,
    public http: HttpClient,
    private userService: UserServiceService
  ) {
    this.getUnits();
    this.createForm();
    this.deal_type_change();
    this.getAmbassadors();
    this.getBrokers();
    this.getprojects();
    if (
      this.userProfile.role == "Admin" ||
      this.userProfile.role == "Super Development" ||
      this.userProfile.role == "Moderator" ||
      this.userProfile.role == "Super Moderator"
    )
      this.getAgents();
  }

  dateFormat() {
    $(document).ready(function () {
      ($("#lead_birthday") as any).datepicker({
        format: "yyyy-mm-dd",
      });
    });
  }

  getLeads() {
    // this.getAllLeads();
  }

  getUnits() {
    this.holdService.getAllUnints().subscribe((res: any) => {
      this.units = res.data;
      console.log("units", res);
    });
  }

  getprojects() {
    this.holdService.getAllProjects().subscribe((res: any) => {
      this.projects = res.data;
    });
  }
  getPaymentTermsByProjectId(unit_id) {
    console.log(unit_id);
    this.userService.getProjectPaymentTerms(unit_id).subscribe(
      (res) => {
        let arr: any = res;
        this.methods = arr;
        console.log(this.methods);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  observableSource = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .get(`${baseUrl}leads?keyword=${keyword}`)
        .map((res: any) => {
          console.log(res.data.length);
          if (res.data.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res.data;
            res.data.forEach((e) => {
              this.arrSearch.push(`${e.name} / ${e.id}`);
            });
            console.log(
              "1- searching found these data (this.dataFromSearch)",
              this.dataFromSearch
            );
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  changeUnitValue() {
    this.choosenUnit = this.documentForm.get("unitValue").value;
    let actualValue = this.choosenUnit.substr(
      this.choosenUnit.indexOf("/") + 2
    );
    this.documentForm.patchValue({
      unit_id: parseInt(actualValue),
    });
    this.getUnitDetails(actualValue);
  }

  observableSourceUnits = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .get(
          `${baseUrl}units/availableUnits/${this.projectId}?unit_serial=${keyword}`
        )
        .map((res: any) => {
          console.log("search Response", res);

          console.log(res.length);
          if (res.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.dataFromSearchingUnits = res;
            console.log("data after Search", this.dataFromSearchingUnits);
            let element;
            res.forEach((e) => {
              this.arrSearch.push(`${e.serial} / ${e.id}`);
              element = e;
            });
            console.log("element", element);

            this.unitId = element.id;

            console.log(this.unitId, "-----------");

            console.log("form", this.documentForm);

            console.log("", this.arrSearch);

            console.log(
              "1- searching found these data (this.dataFromSearch)",
              this.dataFromSearch
            );

            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  getAllLeads() {
    this.leadsService.getLeads().subscribe(
      (data) => {
        console.log(data);
        this.convertLeads(data);
        return this.leadsArrayString;
      },
      (err) => console.log(err)
    );
  }

  convertLeads(data) {
    this.leadsArrayString = [];
    this.leads = data.data;
    this.leads.forEach((element) => {
      this.leadsArrayString.push(element.name);
    });
  }

  getLeadDetails(): any {
    if (!this.chosenLead) {
      swal("Lead name can not be empty!");
    } else {
      if (this.dataFromSearch.length == 0) {
        swal("No Lead with that name.");
      } else {
        console.log("Choosen lead", this.chosenLead);

        let found = false;
        this.isLeadSelected = false;
        this.dataFromSearch.forEach((element) => {
          const nameArr = this.chosenLead.replace(/\s/g, "").split("/");
          const leadId = nameArr[nameArr.length - 1];
          if (element.id == leadId) {
            console.log(this.chosenLead);

            // this.eois = element.project.eois;
            this.documentForm.patchValue({
              lead_id: element.id,
              lead_name: element.name,
              lead_address: element.address,
              lead_home_phone: element.phone_2,
              lead_phone: element.phone,
              lead_birthday: element.date_of_birth,
              lead_issue_date: element.national_issue_date,
              lead_marital_status: element.martial_status,
              lead_email: element.email,
              lead_job_title: element.job_title,
              lead_workplace: element.workpalce,
              lead_work_address: element.work_address,
              lead_fax_number: element.fax_num,
              lead_national_id: element.national_num,
            });
            found = true;
            this.isLeadSelected = true;
          }
        });
        if (!found) swal("No Lead with that name.");
      }

      this.leadsService.filterLeadByName(this.chosenLead).subscribe(
        (data) => {
          console.log(data);
          this.convertLeads(data);
          console.log(this.leadsArrayString);
        },
        (err) => console.log(err)
      );
    }
  }

  getUnitDetails(id): any {
    this.holdService.getUnintDetails(id).subscribe((res: any) => {
      this.unitFinishingTypes = res.finishing_types;
      this.unitGaragePrice = res.garage_price;
    });
  }

  ngOnInit() {
    this.getLeads();
    this.dateFormat();
    this.getPaymentTypes();
    this.todayDate;
  }

  valueChanged(ev) {
    this.chosenLead = ev;
    // this.searchForInputs(ev);
  }

  createForm() {
    this.documentForm = this.fb.group({
      lead_id: [0, Validators.required],
      lead_name: ["", Validators.required],
      lead_address: ["", Validators.required],
      lead_home_phone: [""],
      lead_phone: ["", Validators.required],
      lead_other_phone: [""],
      lead_nationality: ["", Validators.required],
      lead_birthday: ["01-01-1980", Validators.required],
      lead_national_id: ["", Validators.required],
      lead_issue_date: [""],
      lead_district: ["", Validators.required],
      lead_marital_status: [""],
      lead_email: [""],
      lead_job_title: [""],
      lead_workplace: [""],
      lead_work_address: [""],
      lead_fax_number: [""],
      project_id: ["", Validators.required],
      unitValue: [""],
      unit_id: ["", Validators.required],
      hold_value: ["", Validators.required],
      serial: ["", Validators.required],
      payment_type: [""],
      is_overseas: ["", Validators.required],
      deal_type: ["", Validators.required],
      // interested_type: [""],
      // interested_area_from: [""],
      // interested_area_to: [""],
      lead_arabic_name: [""],
      job_title: [""],
      national_issue_date: [""],
      workplace: [""],
      phase: [""],
      expiration_date: ["", Validators.required],
      finishing_type_id: ["", Validators.required],
      unit_garage_price: ["", Validators.required],
    });
    if (
      this.userProfile.role == "Admin" ||
      this.userProfile.role == "Super Development" ||
      this.userProfile.role == "Moderator" ||
      this.userProfile.role == "Super Moderator"
    ) {
      this.documentForm.addControl("user_id", new FormControl(""));
    }
    this.documentForm.valueChanges.subscribe((event) =>
      console.log(
        "Invalid controls are",
        this.findInvalidControls(this.documentForm)
      )
    );
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

  findInvalidControls(form: FormGroup) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log("invalid controls are", invalid);
    return invalid;
  }

  division_type_change() {
    console.log("division_type_change changed");
    this.documentForm.get("deal_category").valueChanges.subscribe((val) => {
      if (val == "Ambassador") {
        console.log("Ambassador");
        this.documentForm.addControl(
          "ambassador_id",
          new FormControl("", Validators.required)
        );
      } else if (val == "Individual") {
        console.log("Individual");
      }
    });
  }

  deal_type_change() {
    this.documentForm.get("deal_type").valueChanges.subscribe((val) => {
      if (val == "Direct") {
        if (this.documentForm.get("broker_id"))
          this.documentForm.removeControl("broker_id");
        this.documentForm.addControl(
          "deal_category",
          new FormControl("", Validators.required)
        );
        this.division_type_change();
        console.log(this.documentForm.value);
      } else if (val == "In-Direct") {
        console.log(val);
        if (this.documentForm.get("deal_category"))
          this.documentForm.removeControl("deal_category");
        if (this.documentForm.get("ambassador_id"))
          this.documentForm.removeControl("ambassador_id");
        this.documentForm.addControl(
          "broker_id",
          new FormControl("", Validators.required)
        );
      }
    });
  }

  onProjectChange(event) {
    console.log(event);
    this.projectId = this.documentForm.get("project_id").value;
    console.log(this.projectId);
  }

  getAmbassadors() {
    this.slimLoadingBarService.start();
    this.userService.getAmbasdors().subscribe(
      (data: any) => {
        this.ambassadors = data;
        console.log(this.ambassadors);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getBrokers() {
    this.slimLoadingBarService.start();
    this.userService.getBorkers().subscribe(
      (data: any) => {
        this.brokers = data;
        console.log(this.brokers);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  submit() {
    this.documentForm.controls["unitValue"].disable();
    let formModel = Object.assign({}, this.documentForm.value);
    console.log(this.documentForm.value);
    if (formModel.lead_id == 0) {
      swal("Please assign lead to eoi.", "", "warning");
    } else {
      if (!formModel.lead_name) {
        swal(
          "Get Lead Info!",
          "Make sure assigning lead to eoi by getting its info!",
          "warning"
        );
      } else {
        this.slimLoadingBarService.start(() => {
          console.log("Loading complete");
        });

        // ambassadors and brokers
        if (this.documentForm.value.ambassador_id)
          formModel.ambassador_id = this.documentForm.value.ambassador_id.id;
        if (this.documentForm.value.broker_id)
          formModel.broker_id = this.documentForm.value.broker_id.id;
        this.disabledSubmitWhileSending = true;
        this.holdService.addHold(formModel).subscribe(
          (data) => {
            console.log(data);
            swal(
              "Cool!",
              "Hold is added successfully, pending accountant approve!",
              "success"
            );
            this.router.navigate(["/pages/hold-list"]);
            this.slimLoadingBarService.complete();
            this.disabledSubmitWhileSending = false;
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
            this.disabledSubmitWhileSending = false;
            this.documentForm.controls["unitValue"].enable();
          }
        );
      }
    }
  }

  addPaymentTypeModalSubmit(modal) {
    let payload = {
      name: this.payment_type,
    };
    console.log(payload);
    this.slimLoadingBarService.start();
    this.holdService.addPaymentType(payload).subscribe(
      (res: any) => {
        console.log(res);
        this.getPaymentTypes();
        this.payment_type = null;
        modal.close();
        swal("Success", "Added Payment Type successfully", "success");
        this.slimLoadingBarService.complete();
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  getPaymentTypes() {
    this.slimLoadingBarService.start();
    this.holdService.getPaymentTypes().subscribe(
      (res: any) => {
        this.payment_types = res;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  deletePayment(id) {
    this.slimLoadingBarService.start();
    this.holdService.deletePaymentType(id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.getPaymentTypes();
        swal("Success", "Deleted Payment Type Successfully", "success");
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  editPayment(modal, payment) {
    this.edit_payment_modal_data = JSON.parse(JSON.stringify(payment));
    modal.open();
  }

  editPaymentTypeModalSubmit(modal) {
    this.slimLoadingBarService.start();
    let payload = {
      name: this.edit_payment_modal_data.name,
    };
    this.holdService
      .editPaymentType(this.edit_payment_modal_data.id, payload)
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          modal.close();
          swal("Success", "Edited Payment Type Successfully", "success");
          this.getPaymentTypes();
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }
}
