import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Observable } from "rxjs";
import swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { PaymentService } from "../services/payment/payment.service";
import { ProjectsService } from "../services/projects/projects.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { UserServiceService } from "../services/user-service/user-service.service";

@Component({
  selector: "app-custom-payment-generator",
  templateUrl: "./custom-payment-generator.component.html",
  styleUrls: ["./custom-payment-generator.component.css"],
})
export class CustomPaymentGeneratorComponent implements OnInit {
  down_payment = "[]";
  slots = 0;
  show = false;
  type = "";
  methods: any;
  installments: any;
  unit_serial = "";
  paymentForm: FormGroup;
  unit: any;
  unitsArrayString: any = [];
  unitserials: any = [];
  arr: any;
  unit_price: any;
  delivery_compilation: any;
  current_units_arr: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  project_type: any;
  commercial_methods: any;

  // used for fixing select bug onchange
  unit_serial_select_bug_handler_serial: any;
  separated: any;

  unit_details: any;
  unit_id: any;

  phases: any;

  generatedPrices: any;

  remainingAmount: number;
  unitRemaining: number;
  maintenanceRemaining: number;
  storageRemaining: number;
  garageRemaining: number;
  extraOutDoorRemaining: number;

  payment_types_raw: any = [
    {
      name: "Down Payment",
      value: "down_payment",
    },
    {
      name: "Installments",
      value: "installment",
    },
    {
      name: "Maintenance",
      value: "maintenance",
    },
    {
      name: "Garage",
      value: "garage",
    },
    {
      name: "Storage",
      value: "storage",
    },
    {
      name: "Extra Outdoor Meters",
      value: "extra_outdoor_meters",
    },
    {
      name: "Other",
      value: "other",
    },
  ];
  payment_types: any = [
    {
      name: "Down Payment",
      value: "down_payment",
    },
    {
      name: "Installments",
      value: "installment",
    },
    {
      name: "Maintenance",
      value: "maintenance",
    },
    {
      name: "Garage",
      value: "garage",
    },
    {
      name: "Storage",
      value: "storage",
    },
    {
      name: "Extra Outdoor Meters",
      value: "extra_outdoor_meters",
    },
    {
      name: "Other",
      value: "other",
    },
  ];

  payment_type: any;
  payment_number: number;
  payment_amount: number;

  paymentTable: any[] = [];

  mode;
  payment_id;
  payment_plan_details;

  admin_comment;

  prices_type = ["percentage", "amount", "meter_price"];
  prices_type_for_maintenance = ["percentage", "amount"];

  leadsArrSearch: any = [];
  leadsDataFromSearch: any;

  chosenLead: any;

  lead_id: any;

  completionRate: any = 0;
  payment_type_amount: string = "amount";
  List_edits_amount = false;

  constructor(
    private http: HttpClient,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    private userService: UserServiceService,
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // console.log(params);
      this.mode = params.mode ? params.mode : "add";
      this.payment_id = params.id;
      this.unit_id = params.unit_id;
      if (this.mode == "add") {
        this.configAddMode();
        if (this.unit_id) {
          this.getUnitDetails(this.unit_id);
        }
      } else {
        this.getSinglePaymentData(this.payment_id);
      }
    });
    // console.log(this.mode);
  }

  get unit_outdoor_area() {
    return this.paymentForm.get("outdoor_area") ? this.paymentForm.get("outdoor_area").value : false;
  }

  get maintenance_fees_accessor() {
    return this.paymentForm.get("maintenance_fees") ? this.paymentForm.get("maintenance_fees").value : false;
  }

  get storage_slots_accessor() {
    return this.paymentForm.get("storage_slots") ? this.paymentForm.get("storage_slots").value : false;
  }

  get is_merge_storage_price_accessor(): boolean {
    return this.paymentForm.get("is_merge_storage_price") ? this.paymentForm.get("is_merge_storage_price").value : false;
  }

  get is_merge_garage_price_accessor(): boolean {
    return this.paymentForm.get("is_merge_garage_price") ? this.paymentForm.get("is_merge_garage_price").value : false;
  }

  get is_merge_extra_outdoor_price_accessor(): boolean {
    return this.paymentForm.get("is_merge_extra_outdoor_price") ? this.paymentForm.get("is_merge_extra_outdoor_price").value : false;
  }

  configAddMode() {
    this.paymentForm = this.fb.group({
      slots: [0, Validators.required],
      unit_serial: ["", Validators.required],
      unit_id: [""],
      status: [{ value: "", disabled: true }],
      build_area: [{ value: "", disabled: true }],
      outdoor_area: [{ value: "", disabled: true }],
      indoor_price: [{ value: "", disabled: true }],
      maintenance_fees: [""],
      unit_indoor_meter_discount_type: [""],
      unit_outdoor_meter_discount_type: [""],
      outdoor_price: [{ value: "", disabled: true }],
      unit_indoor_meter_discount: [""],
      unit_outdoor_meter_discount: [""],
      garage_discount_type: [""],
      garage_discount: [""],
      maintenance_discount_type: [""],
      maintenance_discount: [""],
      storage_slots: [""],
      storage_discount_type: [""],
      storage_discount: [""],
      is_merge_storage_price: [false],
      is_merge_garage_price: [false],
      is_merge_extra_outdoor_price: [false],
      extra_outdoor_meters: [""],
      extra_outdoor_meter_discount: [""],
      extra_outdoor_meter_discount_type: [""],
      starting_date: moment(new Date()).format("YYYY-MM-DD"),
      delivery_date: moment(new Date()).format("YYYY-MM-DD"),
      finishing_type_id: ["", Validators.required],
      phase_id: [""],
      lead_id: [""],
      type: [""],
      number: [""],
      total_percent: [""],
      interval: [3],
    });
    // console.log(this.paymentForm.value);
    if (
      this.userProfile.role == "Admin" ||
      this.userProfile.role == "Super Development"
    ) {
      this.paymentForm.addControl("price", new FormControl(""));
    } else {
      this.paymentForm.addControl(
        "price",
        new FormControl({ value: "", disabled: true }, Validators.required)
      );
    }
    this.checkUnitIdQueryParameter();
  }

  resetUnitForm() {
    return new Promise((resolve, reject) => {
      this.paymentForm.patchValue({
        ts: 0,
        unit_serial: "",
        status: "",
        build_area: "",
        outdoor_area: "",
        indoor_price: "",
        maintenance_fees: "",
        unit_indoor_meter_discount_type: "",
        unit_outdoor_meter_discount_type: "",
        outdoor_price: "",
        unit_indoor_meter_discount: "",
        unit_outdoor_meter_discount: "",
        garage_discount_type: "",
        garage_discount: "",
        maintenance_discount_type: "",
        maintenance_discount: "",
        storage_slots: "",
        storage_discount_type: "",
        is_merge_storage_price: false,
        is_merge_garage_price: false,
        is_merge_extra_outdoor_price: false,
        storage_discount: "",
        extra_outdoor_meters: "",
        extra_outdoor_meter_discount: "",
        extra_outdoor_meter_discount_type: "",
        starting_date: moment(new Date()).format("YYYY-MM-DD"),
        delivery_date: moment(new Date()).format("YYYY-MM-DD"),
        finishing_type_id: "",
        phase_id: "",
        lead_id: "",
        type: "",
        number: "",
        total_percent: "",
        interval: 3,
      });
      this.paymentForm.get("finishing_type_id").reset();
      resolve(true);
    });
  }

  getSinglePaymentData(id) {
    this.paymentService.getSingleCustomPayment(id).subscribe(
      (res: any) => {
        this.payment_plan_details = res;
        this.generatedPrices = [
          {
            total: res.total,
            garage_price: res.garage_price,
            maintenance_fees: res.maintenance_fees,
            unit_indoor_meter_price: res.unit_indoor_meter_price,
            unit_outdoor_meter_price: res.unit_outdoor_meter_price,
            unit_price: res.unit_price,
          },
        ];
        this.unit_details = { ...res.unit };
        console.log(this.unit_details);
        this.paymentForm = this.fb.group({
          interval: [3],
          starting_date: [
            res.installments[res.installments.length - 1].static_date,
          ],
        });
        this.paymentTable = res.installments;
        res.extras.forEach((extra) => {
          this.paymentTable.push(extra);
        });
        this.paymentTable.map((payment) => {
          if(payment.type == "Down Payment") {
            payment.payment_value = "down_payment";
          } else if(payment.type == "Installments") {
            payment.payment_value = "installment";
          } else if(payment.type_text == "Garage") {
            payment.payment_value = "garage";
          } else if(payment.type_text == "Maintenance") {
            payment.payment_value = "maintenance";
          } else if(payment.type_text == "Storage") {
            payment.payment_value = "storage";
          }
        })
        this.remainingAmount = 0;
        this.unitRemaining = 0;
        this.maintenanceRemaining = 0;
        this.storageRemaining = 0;
        this.garageRemaining = 0;
        this.extraOutDoorRemaining = 0;
      },
      (err) => {}
    );
  }

  onFinishTypePriceChange(id) {
    if (id == null) {
      this.paymentForm.patchValue({
        price: null,
        indoor_price: null,
        outdoor_price: null,
        maintenance_fees: null,
      });
      return;
    }
    console.log(id);
    console.log(this.unit_details.finishing_types);
    this.unit_details.finishing_types.forEach((type) => {
      if (type.id == id) {
        this.paymentForm.patchValue({
          // unit_price: type.pivot.price
          finishing_type_id: type.id,
          price: type.pivot.price,
          indoor_price: type.pivot.indoor_meter_price,
          outdoor_price: type.pivot.outdoor_meter_price,
          storage_slots: 0,
          maintenance_fees: (
            (this.unit_details.maintenance_fees * type.pivot.price) /
            100
          ).toFixed(2),
        });
        this.unit_price = type.pivot.price;
      }
    });
    this.methods = null;
    let payload: any = this.getPaymentTermsPaylod();
    console.log(this.paymentForm.value);
    if (payload.project_id && payload.finishing_type_id) {
      this.installments = null;
      this.separated = null;
    }
  }

  observableSource = (keyword: any): any => {
    const data = {
      unit_serial: keyword,
    };
    if (keyword) {
      this.slimLoadingBarService.start(() => {
        // console.log('Loading complete');
      });
      return this.http
        .get(
          `${environment.api_base_url}units/filter/0?status=available&serial=${keyword}`
        )
        .map((res: any) => {
          console.log(res);
          this.current_units_arr = res.data;
          this.slimLoadingBarService.complete();
          if (res.data.length == 0) {
            return [];
          } else {
            this.arr = [];
            res.data.forEach((e) => {
              // console.log(e);
              this.arr.push(e.serial + " (" + e.project.name + ")");
            });
            // console.log(this.arr);
            return this.arr;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  leadObservableSource = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .get(`${baseUrl}leads?keyword=${keyword}`)
        .map((res: any) => {
          // console.log(res.data.length);
          if (res.data.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.leadsArrSearch = [];
            this.leadsDataFromSearch = res.data;
            res.data.forEach((e) => {
              this.leadsArrSearch.push(`${e.name} / ${e.id}`);
            });
            // // console.log(arr);
            return this.leadsArrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  leadValueChanged(ev) {
    this.chosenLead = ev;
    // console.log(this.chosenLead);
    // this.searchForInputs(ev);
    if (this.chosenLead) {
      const nameArr = this.chosenLead.replace(/\s/g, "").split("/");
      const leadId = nameArr[nameArr.length - 1];
      // this.lead_id = leadId;
      // this.paymentForm.get("lead_id").patchValue(leadId);
    }
  }

  getLeadId(chosenLead) {
    const nameArr = chosenLead.replace(/\s/g, "").split("/");
    const leadId = nameArr[nameArr.length - 1];
    return leadId;
  }

  valueChanged(ev) {
    // console.log(this.current_units_arr);
    this.resetUnitForm().then((res) => {
      console.log("form resetted successfully");
      console.log(this.paymentForm.value);
      console.log(ev);
      this.current_units_arr.forEach((element) => {
        if (element.serial + " (" + element.project.name + ")" == ev) {
          console.log(element.serial + " (" + element.project.name + ")");
          this.unit_serial_select_bug_handler_serial = element.serial;
          this.unit_serial = element.serial;
          this.paymentForm.value.unit_serial = element.serial;
          console.log("matched");
          console.log(element);
          console.log(this.unit_serial);
          this.unit_details = { ...element };
          console.log(this.unit_details);
          this.delivery_compilation = element.project.delivery_compilation
            ? `${element.project.delivery_compilation}%`
            : "";
          this.project_type = element.project.type;
          this.phases = element.project.phases;
          this.paymentForm.get("status").patchValue(element.status);
          this.paymentForm.get("build_area").patchValue(element.build_area);
          this.paymentForm.get("outdoor_area").patchValue(element.outdoor_area);
          this.paymentForm.get("phase_id").patchValue(element.phase_id);
          this.paymentForm.get("unit_id").patchValue(element.id);
          // this.paymentForm.get("indoor_price").patchValue(element.indoor_price);
          // this.paymentForm
          //   .get("outdoor_price")
          //   .patchValue(element.outdoor_price);
          if (element.project.delivery_compilation) {
            this.paymentForm
              .get("delivery_date")
              .patchValue(
                moment(element.project.delivery_compilation).format(
                  "YYYY-MM-DD"
                )
              );
          }
          this.unit_details = { ...element };
          console.log(this.unit_details);
          this.paymentTable = [];
          this.remainingAmount = undefined;
          this.unitRemaining = undefined;
          this.maintenanceRemaining = undefined;
          this.storageRemaining = undefined;
          this.garageRemaining = undefined;
          this.extraOutDoorRemaining = undefined;
          this.generatedPrices = undefined;
          this.completionRate = 0;
          console.log("form filled successfully");
          console.log(this.paymentForm.value);
        }
      });
      setTimeout(() => {
        console.log("force reset finish type");
        this.paymentForm.get("finishing_type_id").patchValue(null);
        this.onFinishTypePriceChange(null);
        console.log(this.unit_serial);
      }, 100);
    });

    // document.querySelector<HTMLInputElement>('#finishing_type_id').dispatchEvent(new Event('change'));
  }

  getPaymentTermsPaylod() {
    let payload = {
      project_id: this.unit_details.project.id,
      phase_id: this.paymentForm.get("phase_id").value || "",
      finishing_type_id: this.paymentForm.get("finishing_type_id").value,
    };
    return payload;
  }

  getInstallments() {
    this.slimLoadingBarService.start(() => {
      // console.log('Loading complete');
    });

    let paymentForm = this.paymentForm.value;
    let data = {
      slots: paymentForm.slots,
      unit_serial: this.unit_serial_select_bug_handler_serial,
      generated_view: paymentForm.generated_view,
      price: paymentForm.price,
      starting_date: paymentForm.starting_date,
      delivery_date: paymentForm.delivery_date,
      finishing_type_id: paymentForm.finishing_type_id,
    };
    this.paymentService.getInstallments(data).subscribe(
      (data) => {
        // console.log(data);
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
        // console.log(data);
        this.unit_details = { ...data };
        console.log(this.unit_details);
        this.fillTheForm(data).then((res) => {
          console.log(res);
          console.log(this.paymentForm);
          console.log(this.paymentForm.value);
          console.log(this.paymentForm.valid);
        });
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  checkUnitIdQueryParameter() {
    this.route.queryParams
      .filter((params) => params.unit_id)
      .subscribe((params) => {
        // console.log(params);
        this.unit_id = params.unit_id;
        this.getUnitDetails(params.unit_id);
      });
  }

  fillTheForm(unit_details) {
    return new Promise((resolve, reject) => {
      this.unit_serial_select_bug_handler_serial = unit_details.serial;
      this.unit_serial = unit_details.serial;
      console.log(this.unit_serial);
      this.paymentForm.value.unit_serial = unit_details.serial;
      this.project_type = unit_details.project.type;
      this.paymentForm.get("status").patchValue(unit_details.status);
      this.type = "";
      this.phases = unit_details.project.phases;
      this.unit_details = { ...unit_details };
      console.log(this.unit_details);
      this.paymentForm.get("unit_id").patchValue(unit_details.id);
      this.paymentForm.get("phase_id").patchValue(unit_details.phase_id);
      this.paymentForm.get("build_area").patchValue(unit_details.build_area);
      this.paymentForm
        .get("outdoor_area")
        .patchValue(unit_details.outdoor_area);
      this.paymentForm.get("phase_id").patchValue(unit_details.phase_id);
      this.paymentForm
        .get("indoor_price")
        .patchValue(unit_details.indoor_price);
      this.paymentForm
        .get("outdoor_price")
        .patchValue(unit_details.outdoor_price);
      if (unit_details.project.delivery_compilation) {
        this.paymentForm
          .get("delivery_date")
          .patchValue(
            moment(unit_details.project.delivery_compilation).format(
              "YYYY-MM-DD"
            )
          );
      }
      if (this.unit_details.finishing_types.length > 0) {
        this.onFinishTypePriceChange(this.unit_details.finishing_types[0].id);
      }
      resolve(true);
    });
    // setTimeout(() => {
    //   this.paymentForm.get('finishing_type_id').reset();
    //   console.log(this.paymentForm.value);
    // }, 0);
  }

  generatePrices() {
    this.slimLoadingBarService.start(() => {
      // console.log('Loading complete');
    });
    console.log(this.is_merge_storage_price_accessor);
    this.payment_types = this.payment_types_raw.filter((type) => {
      if (
        type.value === "down_payment" ||
        type.value === "installment" ||
        type.value === "maintenance"
      )
        return true;
      else if (type.value === "storage") {
        return !this.is_merge_storage_price_accessor;
      } else if (type.value === "garage") {
        return !this.is_merge_garage_price_accessor;
      } else if (type.value === "extra_outdoor_meters") {
        return !this.is_merge_extra_outdoor_price_accessor;
      }
    });
    console.log(this.payment_types);
    let paymentForm = this.paymentForm.value;
    let data = {
      ...paymentForm,
      unit_serial: this.unit_serial_select_bug_handler_serial,
    };
    this.paymentService.generateCustomerPaymentPlan(data).subscribe(
      (data) => {
        // console.log(data);
        this.resetPayment();
        this.remainingAmount = undefined;
        this.unitRemaining = undefined;
        this.maintenanceRemaining = undefined;
        this.storageRemaining = undefined;
        this.garageRemaining = undefined;
        this.extraOutDoorRemaining = undefined;
        this.generatedPrices = data;
        this.paymentTable = [];
        this.unitRemaining = this.generatedPrices[0].unit_price;
        this.maintenanceRemaining = this.generatedPrices[0].maintenance_fees;
        this.storageRemaining = this.generatedPrices[0].storage_price;
        this.extraOutDoorRemaining =
          this.generatedPrices[0].unit_outdoor_meter_price;
        this.garageRemaining = this.generatedPrices[0].garage_price;
        this.remainingAmount = this.generatedPrices[0].total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  findLastInstallmentDate(newSubPayments) {
    return newSubPayments.reverse().find((elm) => elm.static_date);
  }

  calculateTable() {
    for (let i = 0; i < this.payment_number; i++) {
      let payment: any = {
        id: "",
        type: this.payment_types.find((elm) => elm.value == this.payment_type)
          .name,
        interval: this.paymentForm.get("interval").value,
        payment_value: this.payment_type,
        static_date: null,
      };
      if (this.payment_type_amount == "percentage") {
        const single_percentage = this.payment_amount / this.payment_number;
        payment.amount = (
          (single_percentage * this.generatedPrices[0].unit_price) /
          100
        ).toFixed(2);
        payment.percentage = single_percentage;
      } else {
        // //console.log(this.payment_types);
        // //console.log(this.generatedPrices);
        // //console.log(this.payment_type);
        payment.amount = this.payment_amount;
        if (
          this.payment_type == "installment" ||
          this.payment_type == "down_payment"
        ) {
          payment.percentage = (
            (this.payment_amount * 100) /
            this.generatedPrices[0].unit_price
          ).toFixed(2);
        } else if (this.payment_type == "maintenance") {
          payment.percentage = (
            (this.payment_amount * 100) /
            this.generatedPrices[0].maintenance_fees
          ).toFixed(2);
        } else if (
          this.payment_type == "garage" &&
          this.generatedPrices[0].garage_price
        ) {
          payment.percentage = (
            (this.payment_amount * 100) /
            this.generatedPrices[0].garage_price
          ).toFixed(2);
        }
      }
      let payment_type_arr = this.paymentTable.filter(
        (elm) => elm.payment_value == this.payment_type
      );
      payment.name = `${
        this.payment_types.find((elm) => elm.value == this.payment_type).name
      } ${payment_type_arr.length == 0 ? 1 : payment_type_arr.length + 1}`;
      if (this.paymentTable.length == 0)
        payment.static_date = moment(
          this.paymentForm.get("starting_date").value
        ).format("YYYY-MM-DD");
      else {
        // let installmentPlans = this.paymentTable
        //   .filter((payment) => payment.payment_value == "installment")
        //   .reverse();
        //console.log(this.paymentTable);
        if (this.paymentTable.length == 0)
          payment.static_date = moment(
            this.paymentForm.get("starting_date").value
          ).format("YYYY-MM-DD");
        else {
          payment.static_date = moment(
            this.paymentTable[this.paymentTable.length - 1].static_date
          )
            .add(this.paymentForm.get("interval").value, "M")
            .format("YYYY-MM-DD");
        }
      }
      this.paymentTable.push(JSON.parse(JSON.stringify(payment)));
      this.paymentTable.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
      })
    }
    //console.log(this.paymentTable);
    this.calculateRemainingAmount();
    this.calculateCompletionRate();
    this.resetPayment();
    // this.calculateStaticDate();
  }

  getStaticDate(index) {
    console.log(index);
    console.log(this.paymentTable);
    let paymentTableInstallments = this.paymentTable.filter(
      (payment) => payment.type == "Installments"
    );
    if (paymentTableInstallments.length == 0) return null;
    else {
      if (index == 0)
        return moment(this.paymentForm.get("starting_date").value).format(
          "YYYY-MM-DD"
        );
      else {
        let findLastStaticDate = paymentTableInstallments
          .reverse()
          .find((payment) => payment.static_date).static_date;
        return moment(findLastStaticDate)
          .add(this.paymentForm.get("interval").value, "M")
          .format("YYYY-MM-DD");
      }
    }
  }

  calculateStaticDate() {
    for (let i = 0; i < this.paymentTable.length; i++) {
      this.paymentTable[i] = {
        ...this.paymentTable[i],
        static_date: JSON.parse(JSON.stringify(this.getStaticDate(i))),
      };
    }
  }

  resetPayment() {
    this.payment_type = undefined;
    this.payment_number = undefined;
    this.payment_amount = undefined;
  }

  calculateRemainingAmount() {
    this.calcUnitRemaining();
    this.calcMaintenanceRemaining();
    if (!this.is_merge_storage_price_accessor) this.calcStorageRemaining();
    if (!this.is_merge_garage_price_accessor) this.calcGarageRemaining();
    if (!this.is_merge_extra_outdoor_price_accessor)
      this.calcExtraOutDoorRemaining();
  }

  calcUnitRemaining() {
    let accm = this.paymentTable.reduce((accm, current_val) => {
      return accm + +current_val.amount;
    }, 0);
    this.remainingAmount = this.generatedPrices[0].total - accm;
    let unitAccm = this.paymentTable
      .filter((payment) => {
        return (
          payment.payment_value == "installment" ||
          payment.payment_value == "down_payment"
        );
      })
      .reduce((accm, current_val) => {
        return accm + +current_val.amount;
      }, 0);
    const total_unit_price = this.is_merge_garage_price_accessor
      ? +this.generatedPrices[0].garage_price +
        +this.generatedPrices[0].unit_price
      : +this.generatedPrices[0].unit_price;
    this.unitRemaining = this.roundNumber(total_unit_price - unitAccm);
  }

  calcGarageRemaining() {
    let garageAccm = this.paymentTable
      .filter((payment) => {
        return payment.payment_value == "garage";
      })
      .reduce((accm, current_val) => {
        return accm + +current_val.amount;
      }, 0);
    this.garageRemaining = this.generatedPrices[0].garage_price - garageAccm;
  }

  calcStorageRemaining() {
    let storageAccm = this.paymentTable
      .filter((payment) => {
        return payment.payment_value == "storage";
      })
      .reduce((accm, current_val) => {
        return accm + +current_val.amount;
      }, 0);
    this.storageRemaining = this.generatedPrices[0].storage_price - storageAccm;
  }

  calcExtraOutDoorRemaining() {
    let extraOutdoorAccm = this.paymentTable
      .filter((payment) => {
        return payment.payment_value == "extra_outdoor_meters";
      })
      .reduce((accm, current_val) => {
        return accm + +current_val.amount;
      }, 0);
    this.extraOutDoorRemaining =
      this.generatedPrices[0].extra_outdoor_meter_price - extraOutdoorAccm;
  }

  calcMaintenanceRemaining() {
    let maintenaceAccm = this.paymentTable
      .filter((payment) => {
        return payment.payment_value == "maintenance";
      })
      .reduce((accm, current_val) => {
        return accm + +current_val.amount;
      }, 0);
    this.maintenanceRemaining =
      this.generatedPrices[0].maintenance_fees - maintenaceAccm;
  }

  roundNumber(number: number) {
    if (number < 1 && number >= 0) return 0;
    return number;
  }

  // .filter((payment) => {
  //   moment(payment.static_date).diff(moment(this.paymentForm.value.delivery_date), 'days') <= 0
  // })

  calculateCompletionRate() {
    let completationAount = this.paymentTable
      .filter(
        (payment) =>
          payment.payment_value == "installment" ||
          payment.payment_value == "down_payment" ||
          payment.payment_value == "garage"
      )
      .filter((payment) => {
        return moment(payment.static_date).isBefore(
          moment(this.paymentForm.value.delivery_date)
        );
      })
      .reduce((acc, currenct_payment) => {
        return acc + +currenct_payment.amount;
      }, 0);
    this.completionRate = (
      (completationAount * 100) /
      this.generatedPrices[0].unit_price
    ).toFixed(0);
    if (completationAount == 0) this.completionRate = 0;
    console.log(this.completionRate);
  }

  amountChange(event, payment, index) {
    // //console.log(this.paymentTable);
    if (this.List_edits_amount) this.onPriceChange(payment, index);
    this.calculateTablePercentage();
    this.calculateRemainingAmount();
    this.calculateCompletionRate();
  }

  calculateTablePercentage() {
    this.paymentTable = this.paymentTable.map((elm, index) => {
      const type = elm.type;
      if (type == "Down Payment" || type == "Installments") {
        elm.percentage = ((elm.amount * 100) / this.generatedPrices[0].unit_price).toFixed(2);
      } else if (type == "Maintenance") {
        elm.percentage = ((elm.amount * 100) / this.generatedPrices[0].maintenance_fees).toFixed(2);
      } else if (type == "Garage") {
        elm.percentage = ((elm.amount * 100) / this.generatedPrices[0].garage_price).toFixed(2);
      }
      return {
        ...elm,
      };
    });
  }

  onPriceChange(payment, edit_index) {
    //console.log(this.paymentTable);
    if (
      payment.payment_value == "down_payment" ||
      payment.payment_value == "installment"
    ) {
      this.paymentTable = this.paymentTable.map((elm, current_index) => {
        return {
          ...elm,
          amount:
            (elm.payment_value == "down_payment" ||
              elm.payment_value == "installment") &&
              current_index > edit_index
              ? this.paymentTable[edit_index].amount
              : elm.amount,
        };
      });
    }
  }

  intervalChange(event, index) {}

  dateTimeChange(event, index) {
    if (this.paymentTable[index].type == "Installments") {
      let paymentTableInstallments = this.paymentTable.slice(index + 1);
      let last_static_date = this.paymentTable[index].static_date;
      for (let i = 0; i < paymentTableInstallments.length; i++) {
        if (paymentTableInstallments[i].type == "Installments") {
          paymentTableInstallments[i] = {
            ...paymentTableInstallments[i],
            static_date: moment(last_static_date)
              .add(this.paymentForm.get("interval").value, "M")
              .format("YYYY-MM-DD"),
          };
          last_static_date = paymentTableInstallments[i].static_date;
        }
      }
      this.paymentTable = this.paymentTable
        .slice(0, index + 1)
        .concat(paymentTableInstallments);
    }
    this.calculateRemainingAmount();
    this.calculateCompletionRate();
  }

  removePayment(index) {
    this.paymentTable.splice(index, 1);
    this.calculateRemainingAmount();
    this.calculateCompletionRate();
  }

  submitTable() {
    let paymentForm = this.paymentForm.value;
    let payload = {
      table: this.paymentTable,
      slots: paymentForm.slots,
      unit_serial: this.unit_serial_select_bug_handler_serial,
      generated_view: paymentForm.generated_view,
      price: paymentForm.price,
      starting_date: paymentForm.starting_date,
      finishing_type_id: paymentForm.finishing_type_id,
      unit_indoor_meter_discount: paymentForm.unit_indoor_meter_discount,
      unit_outdoor_meter_doscount: paymentForm.unit_outdoor_meter_doscount,
      unit_id: paymentForm.unit_id,
      lead_id: this.chosenLead ? +this.getLeadId(this.chosenLead) : null,
    };
    console.log(payload);
    if (this.remainingAmount < 0 || this.remainingAmount > 1) {
      swal("Remaining amount must be zero", "error", "error");
      return;
    }
    let invalid_dates = this.paymentTable.filter(
      (payment) =>
        payment.static_date == undefined || payment.static_date == null
    );
    if (invalid_dates.length != 0) {
      swal("Please fill all dates", "error", "error");
      return;
    }
    this.slimLoadingBarService.start();
    this.paymentService.saveCustomPaymentPlan(payload).subscribe(
      (res) => {
        swal("Success", "", "success");
        this.slimLoadingBarService.complete();
        this.router.navigateByUrl("/pages/list-custom-payments");
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  approve(payment_id) {
    let payload = {
      status: "approved",
    };
    this.slimLoadingBarService.start();
    this.paymentService
      .changeCustomPaymentPlanStatus(payment_id, payload)
      .subscribe(
        (data) => {
          swal("Woohoo!", "Approved payment plan succesfully!", "success");
          this.router.navigateByUrl("/pages/list-custom-payments");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  decline(payment_id) {
    let payload = {
      status: "declined",
    };
    this.slimLoadingBarService.start();
    this.paymentService
      .changeCustomPaymentPlanStatus(payment_id, payload)
      .subscribe(
        (data) => {
          swal("Woohoo!", "Declined payment plan succesfully!", "success");
          this.router.navigateByUrl("/pages/list-custom-payments");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  editPayment() {
    let payload = {
      table: this.paymentTable,
      unit_id: this.payment_plan_details.unit.id,
    };
    // console.log(payload);
    if (this.remainingAmount != 0) {
      swal("Remaining amount must be zero", "error", "error");
      return;
    }
    this.slimLoadingBarService.start();
    this.paymentService
      .updateCustomPaymentPlan(this.payment_id, payload)
      .subscribe(
        (res) => {
          this.slimLoadingBarService.complete();
          swal(
            "Woohoo!",
            "Updated custom payment plan succesfully!",
            "success"
          );
          this.router.navigateByUrl("/pages/list-custom-payments");
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  submitCommentModal(payment_id, modal) {
    if (!this.admin_comment) {
      swal("Error", "Comment can not be empty", "error");
      return;
    } else {
      let payload = {
        comment: this.admin_comment,
      };
      this.slimLoadingBarService.start();
      this.paymentService.addPaymentComment(payment_id, payload).subscribe(
        (data) => {
          modal.close();
          // this.getAllProjectUnits(this.project_id);
          this.updateSinglePaymentDataComments(this.payment_id);
          swal("Woohoo!", "Comment have added succesfully!", "success");
          // this.router.navigateByUrl('/pages/list-custom-payments');
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }


  updateSinglePaymentDataComments(id) {
    this.paymentService.getSingleCustomPayment(id).subscribe(
      (res: any) => {
        this.payment_plan_details.comments = res.comments;
      },
      (err) => {}
    );
  }

  goToLead(lead) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/pages/leads`], {
        queryParams: {
          lead_id: lead.id,
        },
      })
    );

    window.open(url, "_blank");
  }
}
