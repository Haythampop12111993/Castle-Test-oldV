import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "../../../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";

import * as uuid from "uuid";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-setup-payment-plans",
  templateUrl: "./setup-payment-plans.component.html",
  styleUrls: ["./setup-payment-plans.component.css"],
})
export class SetupPaymentPlansComponent implements OnInit {
  setupPaymentForm: FormGroup;

  months: any = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  years: any = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
  ];

  payments = [];
  is_edit_payment: boolean = false;
  payment_index: number;
  activeTab: String = "general";

  extraPayments = [];
  is_edit_extra: boolean = false;
  extra_index: number;

  projects: any;

  paymentPlanDetailsArray: FormArray = new FormArray([]);
  percentage: any = 100;

  total_inp_percentage: any = 0;

  types: any = ["Garage", "Maintenance", "Custom Maintenance", "Gas", "Other"];

  previewPayments: any;

  currentSelectedProjectName: any;

  currentSelectedPhases: any;

  disabled_req: boolean = false;

  finishing_types: any;
  finish_type_name: any;

  phases: any = [];
  phase_serial: any;

  dropdownSettings: any;

  clone_type: any;
  payment_id: any;

  payment_plan_details_clone: any;
  sub$: any;

  constructor(
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAllFinishingTypes();
    this.createSetupPaymentForm();
    this.getAllProjects();
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "serial",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  setupClone() {
    this.sub$ = this.route.queryParams.subscribe((res) => {
      console.log(res);
      this.clone_type = res.clone_type;
      this.payment_id = res.payment_id;
      if (this.clone_type && this.payment_id) {
        this.getPaymentPlanForClone(this.clone_type);
      }
    });
  }

  getPaymentPlanForClone(clone_type) {
    this.slimLoadingBarService.start();
    this.projectsService
      .getPaymentPlanForClone(this.payment_id, clone_type)
      .subscribe((res: any) => {
        console.log(res);
        this.payment_plan_details_clone = res;
        this.setupPaymentForm.patchValue({
          payment_plan_name: res.general.payment_plan_name,
          number_of_years: res.general.number_of_years,
          description: res.general.description,
          project_ids: res.general.project_ids ? res.general.project_ids : [],
          interest_percentage: +res.general.interest_percentage,
          discount_percentage: +res.general.discount_percentage,
          finishing_type_id: res.general.finishing_type_id,
          phases: [],
        });
        let phasesRow = [];
        res.general.phases.forEach((row) => {
          phasesRow.push({
            id: row.phase_id,
            serial: row.serial,
          });
        });
        this.setupPaymentForm.patchValue({
          phases: phasesRow,
        });
        console.log(this.setupPaymentForm.value);
        this.payment_plan_details_clone.payment_details.forEach((row) => {
          let myId = uuid.v4();
          let group = new FormGroup({
            id: new FormControl(myId),
            type: new FormControl(row.type),
            name: new FormControl(row.name),
            percentage: new FormControl(row.percentage),
            interval: new FormControl(row.interval),
            static_date: new FormControl(row.static_date),
          });
          this.paymentPlanDetailsArray.push(group);
        });
        this.percentage = 0;
        // this.paymentPlanDetailsArray.patchValue()
        this.payment_plan_details_clone.extra_payments.forEach((row) => {
          this.extraPayments.push(row);
        });
        // this.onProjectChange(res.general.projects_ids);
      });
  }

  getAllProjects() {
    this.projectsService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
        this.slimLoadingBarService.complete();
        if (!this.sub$) this.setupClone();
        // this.getPaymentPlanForClone(this.clone_type);
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
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

  createSetupPaymentForm() {
    this.setupPaymentForm = this.formBuilder.group({
      payment_plan_name: ["", Validators.required],
      number_of_years: ["", Validators.required],
      description: ["", Validators.required],
      project_ids: [[]],
      example_price: [""],
      interest_percentage: [0],
      discount_percentage: [0],
      finishing_type_id: [, Validators.required],
      phases: [[], Validators.required],

      type: ["down_payment"],
      number: [],
      total_percent: [],

      extra_payment_type: ["", Validators.required],
      extra_payment_name: [""],
      extra_payment_interval: [""],
      extra_payment_static_date: [""],
      extra_payment_price_type: ["Amount"],
      extra_payment_value: [""],
      extra_payment_custom_value: [""],
    });
    this.setupPaymentForm.get("project_ids").valueChanges.subscribe((res) => {
      this.onProjectChange(res);
    });
  }

  addDetails() {
    let type = this.setupPaymentForm.get("type").value;
    let number = this.setupPaymentForm.get("number").value;
    let total_percent = this.setupPaymentForm.get("total_percent").value;

    console.log(type);
    console.log(number);
    console.log(total_percent);

    if (type && number && total_percent && this.percentage >= total_percent) {
      let singlePercentage = this.calculatePercentage(number, total_percent);
      console.log(singlePercentage);
      let payment = {
        id: "",
        type: type == "down_payment" ? "Down Payment" : "Installment",
        name: "",
        percentage: singlePercentage,
        interval: 3,
        static_date: null,
      };
      for (let i = 0; i < number; i++) {
        let name;
        if (type == "down_payment") {
          name = `Down Payment ${i + 1}`;
        } else {
          name = `Installment ${i + 1}`;
        }
        let myId = uuid.v4();
        payment.id = myId;
        console.log(name);
        let group = new FormGroup({
          id: new FormControl(myId),
          type: new FormControl(
            type == "down_payment" ? "Down Payment" : "Installment"
          ),
          name: new FormControl(name),
          percentage: new FormControl(singlePercentage),
          interval: new FormControl(3),
          static_date: new FormControl(),
        });
        this.paymentPlanDetailsArray.push(group);
      }

      this.setupPaymentForm.patchValue({
        type: "",
        number: "",
        total_percent: "",
      });
    }
    this.calculateTotalPercentage();
    console.log(this.paymentPlanDetailsArray.value);
  }

  calculatePercentage(number, total_percent) {
    if (this.percentage >= total_percent) {
      this.percentage = this.percentage - total_percent;
      return total_percent / number;
    }
  }

  calculateTotalPercentage() {
    let paymentPlanDetailsArrayVal = this.paymentPlanDetailsArray.value;
    this.total_inp_percentage = 0;
    paymentPlanDetailsArrayVal.forEach((payment) => {
      this.total_inp_percentage =
        +this.total_inp_percentage + +payment.percentage;
    });
  }

  getPaymentValue() {
    let payment = {
      payment_name: this.setupPaymentForm.get("payment_name").value,
      payment_count: this.setupPaymentForm.get("payment_count").value,
      payment_repeat_time: this.setupPaymentForm.get("payment_repeat_time")
        .value,
      payment_start_month: this.setupPaymentForm.get("payment_start_month")
        .value,
      payment_start_year: this.setupPaymentForm.get("payment_start_year").value,
      percentage: this.setupPaymentForm.get("percentage").value,
    };
    return payment;
  }

  getExtraPaymentValue() {
    let payment = {
      extra_payment_type: this.setupPaymentForm.get("extra_payment_type").value,
      extra_payment_name: this.setupPaymentForm.get("extra_payment_name").value,
      extra_payment_interval: this.setupPaymentForm.get(
        "extra_payment_interval"
      ).value,
      extra_payment_static_date: this.setupPaymentForm.get(
        "extra_payment_static_date"
      ).value,
      extra_payment_price_type: this.setupPaymentForm.get(
        "extra_payment_price_type"
      ).value,
      extra_payment_value: this.setupPaymentForm.get("extra_payment_value")
        .value,
      extra_payment_custom_value: this.setupPaymentForm.get(
        "extra_payment_custom_value"
      ).value,
    };
    return payment;
  }

  save() {
    let payment = this.getPaymentValue();
    console.log(payment.payment_name);
    if (
      payment.payment_name &&
      payment.payment_count &&
      payment.payment_repeat_time &&
      payment.payment_start_month &&
      payment.payment_start_year &&
      payment.percentage
    ) {
      this.payments[this.payment_index] = this.getPaymentValue();
    }
  }

  editPayment(index) {
    this.is_edit_payment = true;
    this.payment_index = index;
    let payment = this.payments[index];
    this.setupPaymentForm.patchValue({
      payment_name: payment.payment_name,
      payment_count: payment.payment_count,
      payment_repeat_time: payment.payment_repeat_time,
      payment_start_month: payment.payment_start_month,
      payment_start_year: payment.payment_start_year,
      percentage: payment.percentage,
    });
  }

  setActiveView(view) {
    console.log(view);
    this.activeTab = view;
    if (view == "preview") {
      let formValue = this.setupPaymentForm.value;
      console.log(formValue);
      this.previewPayments = {
        general: formValue,
        extra_payments: this.extraPayments,
        payment_details: this.paymentPlanDetailsArray.value,
      };
      let unit_price = this.previewPayments.general.example_price;
      const dicount = this.setupPaymentForm.value.discount_percentage;
      const interest_percentage =
        this.setupPaymentForm.value.interest_percentage;
      if (dicount) unit_price = unit_price - (dicount * unit_price) / 100;
      if (interest_percentage)
        unit_price = unit_price + (interest_percentage * unit_price) / 100;
      console.log(unit_price);
      this.previewPayments.payment_details.forEach((payment) => {
        payment.amount = this.calculateExampleAmount(
          payment.percentage,
          unit_price
        );
      });
      console.log(this.previewPayments);
    }
  }

  submit() {
    console.log(this.extraPayments);
    let formValue = this.setupPaymentForm.value;
    let payload = {
      general: formValue,
      extra_payments: this.extraPayments,
      payment_details: this.paymentPlanDetailsArray.value,
    };
    if (
      payload.general.finishing_type_id === undefined ||
      payload.general.finishing_type_id === null
    ) {
      swal("Error!", "Finish Type is required!", "error");
      return;
    }
    console.log(payload);
    this.disabled_req = true;
    this.previewPayments = payload;
    let phases = [];
    if (payload.general.phases) {
      payload.general.phases.forEach((phase) => {
        phases.push({
          id: phase.id,
        });
      });
    }
    payload.general.phases = phases;
    this.slimLoadingBarService.start();
    this.projectsService.addPaymentPlan(payload).subscribe(
      (res: any) => {
        console.log(res);
        this.disabled_req = false;
        this.slimLoadingBarService.complete();
        swal("Woohoo!", "Added Payment method successfully!", "success");
        this.router.navigateByUrl("/pages/settings/payment-terms");
      },
      (err) => {
        this.disabled_req = false;
        console.log(err);
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  back() {
    if (this.activeTab == "preview") {
      this.activeTab = "extra";
      return;
    } else if (this.activeTab == "details") {
      this.activeTab = "general";
      return;
    } else if (this.activeTab == "extra") {
      this.activeTab = "details";
    }
  }

  saveExtra() {}

  addExtra() {
    let payment = this.getExtraPaymentValue();
    console.log(payment);
    if (payment.extra_payment_type) {
      this.extraPayments.push(payment);
      this.setupPaymentForm.patchValue({
        extra_payment_type: "",
        extra_payment_name: "",
        extra_payment_interval: "",
        extra_payment_static_date: "",
        extra_payment_price_type: "",
        extra_payment_value: "",
        extra_payment_custom_value: "",
      });
    }
  }

  percentageChange(event, payment) {
    console.log(payment);
  }

  removePayment(index) {
    let payments = this.paymentPlanDetailsArray.value;
    let removed_percentage = payments[index].percentage;
    console.log(removed_percentage);
    this.percentage = +this.percentage + +removed_percentage;
    this.total_inp_percentage =
      +this.total_inp_percentage - +removed_percentage;
    this.paymentPlanDetailsArray.removeAt(index);
    // this.calculateTotalPercentage();
  }

  removeExtraPayment(index) {
    this.extraPayments.splice(index, 1);
  }

  onProjectChange(value: any[] = []) {
    console.log(value);
    this.currentSelectedProjectName = "";
    console.log(value);
    if (this.projects) {
      this.projects.forEach((project) => {
        if (value.includes(project.id)) {
          console.log(project);
          this.currentSelectedProjectName += `${
            this.currentSelectedProjectName && ","
          } ${project.name}`;
          this.phases.push(
            ...project.phases.map((phase) => {
              return {
                serial: `${phase.serial} - ${project.name}`,
                id: phase.id,
              };
            })
          );
        }
      });
    }
    console.log(this.phases);
    console.log(this.projects);
    console.log(this.projects.length);
    console.log(this.phases.length);
    console.log(this.setupPaymentForm.value);
    // console.log(this.currentSelectedProjectName);
  }

  onPhaseChange(value: any[]) {
    console.log(value);
    this.currentSelectedPhases = "";
    this.phases.forEach((phase) => {
      if (value.includes(phase.id)) {
        this.currentSelectedPhases += `${this.currentSelectedPhases && ","} ${
          phase.serial
        }`;
      }
    });
  }

  calculateExampleAmount(percentage, examplePrice) {
    console.log(percentage, examplePrice);
    let interest_percentage = this.setupPaymentForm.value.interest_percentage;
    console.log(interest_percentage);
    if (interest_percentage && interest_percentage != 0) {
      let new_example_price = (examplePrice * interest_percentage) / 100;
      return (percentage * examplePrice) / 100 + new_example_price;
    } else {
      return (percentage * examplePrice) / 100;
    }
  }

  dateTimeChange(event, index) {
    this.paymentPlanDetailsArray.controls[index].patchValue({
      interval: null,
    });
  }

  intervalChange(event, index) {
    this.paymentPlanDetailsArray.controls[index].patchValue({
      static_date: null,
    });
  }

  onFinishTypeChange(id) {
    this.finishing_types.forEach((finish) => {
      if (finish.id == id) {
        this.finish_type_name = finish.name;
      }
    });
  }

  onPhaseSelectAll(event) {}

  onPhaseSelect(event) {}

  resetExtraPaymentStaticDate(event) {
    console.log("reseting extra payment static date");
    this.setupPaymentForm.get("extra_payment_static_date").patchValue("");
  }

  resetExtraPaymentValue(event) {
    console.log("reseting extra payment value");
    this.setupPaymentForm.get("extra_payment_interval").patchValue("");
  }

  ngOnDestroy() {
    if (this.sub$) this.sub$.unsubscribe();
  }
}
