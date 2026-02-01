import { ProjectsService } from "./../services/projects/projects.service";
import { UserServiceService } from "./../services/user-service/user-service.service";
import { environment } from "./../../environments/environment";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Component, OnInit } from "@angular/core";
import { PaymentService } from "../services/payment/payment.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NgForm,
} from "@angular/forms";
import "rxjs/add/observable/of";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "projects",
  templateUrl: "./payment-generator.component.html",
  styleUrls: [
    "../../assets/css/style.css",
    "../../assets/css/custom.css",
    "./payment-generator.component.css",
  ],
  providers: [PaymentService],
})
export class PaymentGeneratorComponent implements OnInit {
  methods: any = [];
  installments: any;
  arr: any;
  current_units_arr: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  // used for fixing select bug onchange
  separated: any;

  unit_details: any;
  unit_id: any;

  phases: any;

  new_paymentForm: any = {
    percentage: "",
    slots: 0,
    type: "",
    unit_serial: "",
    unit_id: "",
    generated_view: "Total",
    status: "",
    has_basement: "",
    starting_date: "",
    finishing_type_id: "",
    phase_id: "",
    price: "",
  };
  constructor(
    private http: HttpClient,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    private userService: UserServiceService,
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.checkUnitIdQueryParameter();
  }

  onFinishTypePriceChange(id) {
    this.unit_details.finishing_types.forEach((type) => {
      if (type.id == id) {
        this.new_paymentForm.price = type.pivot.price;
      }
    });
    this.methods = [];
    this.new_paymentForm.type = "";
    let payload: any = this.getPaymentTermsPaylod();
    console.log(payload);
    if (payload.project_id && payload.finishing_type_id) {
      this.installments = null;
      this.separated = null;
      this.getPaymentTerms(payload);
    }
  }

  changePaymentMethod(event) {
    if (this.new_paymentForm.type != "Down Town Port Said 20 perc DP") {
      this.new_paymentForm.down_payment = "total";
    }
    console.log(event);
    this.methods.forEach((element) => {
      if (element.id == event) {
        this.new_paymentForm.percentage = element.downpayment_percentage;
      }
    });
  }

  observableSource = (keyword: any): any => {
    const data = {
      unit_serial: keyword,
    };
    if (keyword) {
      this.slimLoadingBarService.start(() => {
        console.log("Loading complete");
      });
      return this.http
        .post(
          `${environment.api_base_url}units/search/available_by_serial`,
          JSON.stringify(data)
        )
        .map((res: any) => {
          console.log(res.length);
          this.current_units_arr = res;
          this.slimLoadingBarService.complete();
          if (res.length == 0) {
            return Observable.of([]);
          } else {
            this.arr = [];
            res.forEach((e) => {
              console.log(e);
              this.arr.push(e.serial + " (" + e.project.name + ")");
            });
            console.log(this.arr);
            return this.arr;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  getPaymentTerms(payload) {
    this.userService.getProjectPaymentTerms(payload).subscribe(
      (res) => {
        console.log(this.methods);
        const arr: any = res;
        this.methods = arr;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  valueChanged(ev) {
    console.log(this.current_units_arr);
    this.current_units_arr.forEach((element) => {
      if (element.serial + " (" + element.project.name + ")" == ev) {
        this.new_paymentForm.unit_serial = element.serial;
        this.new_paymentForm.unit_id = element.id;
        console.log("matched");
        console.log(element);
        this.unit_details = element;
        this.new_paymentForm.project_type = element.project.type;
        this.phases = element.project.phases;
        this.new_paymentForm.status = element.status;
        this.new_paymentForm.has_basement = element.has_basement;
        this.new_paymentForm.type = "";
        this.new_paymentForm.phase_id = element.phase_id;
        // this.getPaymentTerms(element.project.id);
        this.new_paymentForm.percentage = "";
        this.new_paymentForm.storage_slots = undefined;
        this.new_paymentForm.extra_outdoor_meters = undefined;
      }
    });
  }

  onPhaseChange(id) {
    this.methods = [];
    this.new_paymentForm.type = "";
    let payload: any = this.getPaymentTermsPaylod();
    if (payload.project_id && payload.finishing_type_id) {
      this.getPaymentTerms(payload);
    }
  }

  getPaymentTermsPaylod() {
    let payload = {
      project_id: this.unit_details.project.id,
      phase_id: this.new_paymentForm.phase_id,
      finishing_type_id: this.new_paymentForm.finishing_type_id,
    };
    return payload;
  }

  pdf() {
    let url = `${environment.api_raw_base_url}installments/pdf/${this.new_paymentForm.unit_id}/${this.new_paymentForm.type}?generated_view=${this.new_paymentForm.generated_view}&slots=${this.new_paymentForm.slots}&finishing_type_id=${this.new_paymentForm.finishing_type_id}`;

    if (
      this.userProfile.role === "Admin" ||
      this.userProfile.role === "Super Development"
    ) {
      url += `&tot_amount_for_unit=${this.new_paymentForm.price}`;
    }
    url += `&starting_date=${this.new_paymentForm.starting_date}`;
    window.open(url);
  }

  excel() {
    let url = `${environment.api_raw_base_url}/installments/excel/${this.new_paymentForm.unit_id}/${this.new_paymentForm.type}?generated_view=${this.new_paymentForm.generated_view}&slots=${this.new_paymentForm.slots}&finishing_type_id=${this.new_paymentForm.finishing_type_id}`;

    if (
      this.userProfile.role === "Admin" ||
      this.userProfile.role === "Super Development"
    ) {
      url += `&tot_amount_for_unit=${this.new_paymentForm.price}`;
    }
    url += `&starting_date=${this.new_paymentForm.starting_date}`;
    window.open(url);
  }

  getInstallments(paymentForm: NgForm) {
    if (paymentForm.invalid) {
      return;
    }

    this.slimLoadingBarService.start(() => {
      console.log("Loading complete");
    });

    let data: any = {
      down_payment: this.new_paymentForm.percentage,
      slots: this.new_paymentForm.slots,
      type: this.new_paymentForm.type,
      unit_id: this.new_paymentForm.unit_id,
      unit_serial: this.new_paymentForm.unit_serial,
      generated_view: this.new_paymentForm.generated_view,
      price: this.new_paymentForm.price,
      starting_date: this.new_paymentForm.starting_date,
      finishing_type_id: this.new_paymentForm.finishing_type_id,
    };
    if (this.new_paymentForm.storage_slots)
      data.storage_slots = this.new_paymentForm.storage_slots;
    if (this.new_paymentForm.extra_outdoor_meters)
      data.extra_outdoor_meters = this.new_paymentForm.extra_outdoor_meters;
    this.paymentService.getInstallments(data).subscribe(
      (data) => {
        console.log(data);
        this.installments = data.main;
        this.separated = data.finishing;
        this.slimLoadingBarService.complete();
        // this.datatableHandle();
        // this.show =true;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getUnitDetails(unit_id) {
    this.projectService.getUnitDetails(unit_id).subscribe(
      (data) => {
        console.log(data);
        this.unit_details = data;
        this.fillTheForm(data);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  checkUnitIdQueryParameter() {
    this.activatedRoute.queryParams
      .filter((params) => params.unit_id)
      .subscribe((params) => {
        console.log(params);
        this.unit_id = params.unit_id;
        this.getUnitDetails(params.unit_id);
      });
  }

  fillTheForm(unit_details) {
    this.new_paymentForm.unit_id = unit_details.id;
    this.new_paymentForm.unit_serial = unit_details.serial;
    this.new_paymentForm.project_type = unit_details.project.type;
    this.new_paymentForm.status = unit_details.status;
    this.new_paymentForm.has_basement = unit_details.has_basement;
    this.new_paymentForm.type = "";
    this.phases = unit_details.project.phases;
    this.unit_details = unit_details;
    // this.getPaymentTerms(unit_details.project.id);
    this.new_paymentForm.percentage = "";
    this.new_paymentForm.phase_id = unit_details.phase_id;
  }

  generating_pdf = false;
  printPdf() {
    this.generating_pdf = true;
    this.slimLoadingBarService.start();
    this.paymentService.getOfferPdf(this.new_paymentForm).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.generating_pdf = false;
        window.open(`https://${res.url}`);
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
        this.generating_pdf = false;
      }
    );
  }

  hasBasementChangeHandler() {
    if (this.new_paymentForm.finishing_type_id) {
      if (this.new_paymentForm.has_basement) {
        this.new_paymentForm.price =
          this.unit_details.finishing_types[0].pivot.price +
          this.unit_details.basement_price;
      } else {
        this.new_paymentForm.price =
          this.unit_details.finishing_types[0].pivot.price;
      }
    } else {
      return;
    }
  }

  validateNumberStorageSlots(event: KeyboardEvent) {
    const val = this.new_paymentForm.storage_slots;
    console.log(val);
    if (+val > this.unit_details.project.available_storage_slots) {
      event.preventDefault();
      this.new_paymentForm.storage_slots =
        this.unit_details.project.available_storage_slots;
    }
  }

  validateExtraOutdoorMeter(event: KeyboardEvent): void {
    const val = this.new_paymentForm.extra_outdoor_meters;
    console.log(val);
    if (+val > this.unit_details.project.available_extra_outdoor_meters) {
      event.preventDefault();
      this.new_paymentForm.extra_outdoor_meters =
        this.unit_details.project.available_extra_outdoor_meters;
    }
  }
}
