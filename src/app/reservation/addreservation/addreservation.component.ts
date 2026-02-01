import { MarketingService } from "./../../services/marketing/marketing.service";
import { UserServiceService } from "./../../services/user-service/user-service.service";
import { environment } from "./../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./../../services/shared/error-handler.service";
import { ProjectsService } from "./../../services/projects/projects.service";
import { LeadsService } from "./../../services/lead-service/lead-service.service";
import { ActivatedRoute } from "@angular/router";
import {
  NgZone,
  ViewEncapsulation,
  ViewChild,
  NgModule,
  Renderer2,
  AfterViewInit,
  Component,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  NgForm,
  NgModel,
  Validators,
  ValidatorFn,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { NgClass } from "@angular/common";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ReservationService } from "../../services/reservation-service/reservation.service";
import { Reservation } from "../../dtos/reservation.viewmodel";
import swal from "sweetalert2";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Observable } from "rxjs/Observable";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { p } from "@angular/core/src/render3";
import { HoldService } from "../../hold-module/hold.service";

@Component({
  selector: "addreservation",
  templateUrl: "./addreservation.component.html",
  styleUrls: ["./addreservation.component.css"],
  providers: [ReservationService],
})
export class AddreservationComponent implements OnInit {
  documentForm: FormGroup;
  reservation: Reservation;
  showError: boolean;
  messages: any;
  leadphonenumber: string;
  sub: any;
  unitId: any;
  isHold;
  leads: any;
  leadsArrayString: any = [];
  chosenLead: any;
  loadingData: boolean = false;
  arrSearch: any = [];
  dataFromSearch: any;
  unit_serial: any;
  blockTimer: any;
  disabledSubmitWhileSending: boolean = false;
  deal_types: any = ["Direct", "In-Direct"];
  direct_option: any = ["Individual"];
  ambassadors: any;
  brokers: any;
  deal_type: any;
  garage_price: any;
  double_garage_price: any;
  unit_garage_price: any;
  // methods: any = ['7 Years 15perc DP and 85perc over 25 ins WWNC', '6 Years 10perc DP and 90perc over 22 ins WWNC', '5 Years 5perc DP and 95perc over 19 ins WWNC', '6 years', '6 years overseas', '7.5 years', '7.5 years cityscape', '7.5 years overseas','New Homes- 5perc DP, 5perc After 6 Month, 25 Equal Inst'];
  methods: any;
  commercial_methods: any;
  installment_years: any;
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  project_type: any;
  rent_types: any;
  sale_types: any;
  payment_type: any = "Installment";
  is_overseas: any;
  reservation_fees: any;
  type: any;

  ready_to_add_contract_sale: boolean = true;
  ready_to_add_contract_rent: boolean = false;
  unit_details: any;

  is_residence: any = 1;

  current_selected_user: any;
  incentive_users: any;
  holdId;
  counteries: any;

  constructor(
    private addReservation: ReservationService,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    vRef: ViewContainerRef,
    private leadsService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    public route: ActivatedRoute,
    public projectService: ProjectsService,
    private marketingService: MarketingService,
    public errorHandlerService: ErrorHandlerService,
    public renderer2: Renderer2,
    public http: HttpClient,
    private userService: UserServiceService,
    private holdService: HoldService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
    this.reservation = new Reservation();
    this.sub = this.route.params.subscribe((params) => {
      console.log("paramas", params);

      this.unitId = +params["id"];

      route.queryParams.subscribe((p) => {
        console.log(p.hold);
        this.isHold = p.hold;
        if (this.unitId > 0 && this.isHold) {
          console.log("from hold");
          console.log("is hold", this.isHold);
          this.holdId = this.unitId;
          holdService.getHold(this.holdId).subscribe((res: any) => {
            console.log("this is the hold data", res);
            this.unit_details = res.unit;
            this.unit_serial = res.unit.serial;
            this.documentForm.patchValue({
              unit_id: res.unit.id,
              unit_building: res.unit.building_id || "",
              unit_phase: res.phase || "",
              unit_land_area: res.unit.land_area || "",
              unit_building_area: res.unit.build_area || "",
              unit_basement_area: res.unit.basement_area || "",
              unit_uncovered_basement_area:
                res.unit.basement_uncovered_area || "",
              unit_roof_area: res.unit.roof_area || "",
              unit_semi_covered_roof_area: res.unit.uncovered_roof_area || "",
              unit_penthouse_area: res.unit.penthouse_area || "",
              unit_garden_area: res.unit.garden_area || "",
              finishing_type_id: res.finishing_type_id || "",
              unit_price: res.unit_price || res.unit.unit_price || "",
              unit_garden_price: res.unit.garden_price || "",
              unit_garage_area: res.unit.garage_area || "",
              unit_garage_price: "",
              storage_slots: "",
              extra_outdoor_meters: "",
              unit_extra_area: res.unit.extra_area || "",
              unit_extra_price: res.unit.extra_price || "",
              unit_maintenance_price: res.unit.maintenance_fees || "",
              unit_location: res.unit.location || "",
              reservation_fees: "",
              // installment_fees: res.unit.installment || "",
              installment_Years: "",
              project_type: "Residential",
              contract_type: "sale",
              lead_id: res.lead_id,
              lead_name: res.lead_name,
              lead_address: res.lead_address,
              lead_religion: res.lead_religion,
              lead_nationality: res.lead_nationality,
              lead_gender: res.gender,
              lead_country: res.country,
              lead_home_phone: res.lead_home_phone,
              lead_phone: res.lead_phone,
              lead_birthday: res.lead_birthday,
              lead_email: res.lead_email,
              lead_work_address: res.lead_work_address,
              lead_national_id: res.lead_national_id,
              lead_is_residence: res.lead.is_residence,
              // deal_type: element.lead_channel.name,
              deal_type: res.deal_type || null,
              lead_source: res.lead_source,
              ambassador_id: res.ambassador_id,
              broker_id: res.broker_id,
              broker_incentive_id: res.broker_incentive_id || "",
              is_overseas: res.is_overseas,
            });
            // this.garage_price = Number(res.unit.garage_price);
            // this.double_garage_price = this.garage_price * 2;
          });
        }
      });

      console.log(this.unitId);
      if (this.unitId > 0 && !this.isHold) {
        this.slimLoadingBarService.start();
        this.projectService.getCurrentUnit(this.unitId).subscribe(
          (data: any) => {
            this.project_type = data.project.type || "Commercial";
            console.log(data);
            this.blockTimer = data.remaining_temp_block_seconds || 0;
            if (data.remaining_temp_block_seconds == 0) this.blocktimeEnd();
            this.unit_details = data;
            this.unit_serial = data.serial;
            this.documentForm.patchValue({
              unit_id: data.id,
              unit_building: data.building_id || "",
              unit_phase: data.phase_id || "",
              unit_land_area: data.land_area || "",
              unit_building_area: data.build_area || "",
              unit_basement_area: data.basement_area || "",
              unit_uncovered_basement_area: data.basement_uncovered_area || "",
              unit_roof_area: data.roof_area || "",
              unit_semi_covered_roof_area: data.uncovered_roof_area || "",
              unit_penthouse_area: data.penthouse_area || "",
              unit_garden_area: data.garden_area || "",
              unit_price: "",
              unit_garden_price: data.garden_price || "",
              unit_garage_area: data.garage_area || "",
              unit_garage_price: "",
              storage_slots: "",
              extra_outdoor_meters: "",
              unit_extra_area: data.extra_area || "",
              unit_extra_price: data.extra_price || "",
              unit_maintenance_price: data.maintenance_fees || "",
              unit_location: data.location || "",
              reservation_fees: "",
              // installment_fees: data.installment || "",
              installment_Years: "",
              project_type: "Residential",
              contract_type: "sale",
            });
            this.onCustomPaymentPlanFill();
            // if (data.project.type == "Commercial") {
            //   this.commercial_methods = [
            //     "rent for 3 years",
            //     "rent for 4 years",
            //     "rent for 5 years",
            //   ];
            //   this.documentForm.patchValue({
            //     contract_type: "sale",
            //   });
            // } else if (data.project.type == "Residential") {
            //   this.documentForm.patchValue({
            //     contract_type: "sale",
            //   });
            // }

            // this.garage_price = Number(data.garage_price);
            // this.double_garage_price = this.garage_price * 2;
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
      }
    });
  }
  getLeads() {
    // this.getAllLeads();
  }

  getIncentiveUsers(broker_id: number, broker_incentive_id?: number) {
    !broker_id && (broker_id = this.documentForm.get("broker_id").value);
    this.incentive_users = [];
    // this.lead.broker_incentive_id = "";
    this.documentForm.get("broker_incentive_id").setValue("");
    this.userService.get_incentive_users(broker_id).subscribe(
      (res: any) => {
        this.incentive_users = res;
        if (broker_incentive_id) {
          this.incentive_users.forEach((user) => {
            if (user.id == broker_incentive_id) {
              this.documentForm.get("broker_incentive_id").setValue(user.id);
            }
          });
        }
      },
      (err) => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  // getPaymentTerms() {
  //   this.userService.getAllPaymentTerms().subscribe(res => {
  //     this.methods = res;
  //   }, err => this.errorHandlerService.handleErorr(err));
  // }

  changePaymentMethod(event) {
    this.methods.forEach((element) => {
      if (element.plan_name == event) {
        this.reservation_fees = element.downpayment_percentage;
      }
    });
  }

  getPaymentTermsByProjectId(project_id, payment_plan_id) {
    //console.log(project_id);
    this.userService.getProjectPaymentTerms(project_id).subscribe(
      (res) => {
        let arr: any = res;
        this.methods = arr;
        console.log(this.methods);

        if (payment_plan_id && this.methods.length > 0) {
          let matchedPayment = this.methods.find(
            (payment) => payment.id == +payment_plan_id
          );
          console.log(matchedPayment);
          if (matchedPayment)
            this.documentForm.patchValue({
              installment_years: matchedPayment.plan_name,
            });
          console.log(this.documentForm.value);
        }
        //console.log(this.methods);
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
              let string = `${e.name} / ${e.id}`;
              if (e.agent) {
                string += ` / ${e.agent.name}`;
              }
              this.arrSearch.push(string);
            });
            // console.log(arr);
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
    console.log(this.chosenLead);
    console.log(this.dataFromSearch);
    if (!this.chosenLead) {
      swal("Lead name can not be empty!");
    } else {
      if (this.dataFromSearch.length == 0) {
        swal("No Lead with that name.");
      } else {
        let found = false;
        console.log(this.dataFromSearch);
        this.dataFromSearch.forEach((element) => {
          let current_selected_user = element;
          const nameArr = this.chosenLead.replace(/\s/g, "").split("/");
          const leadId = nameArr[1];
          if (element.id == leadId) {
            console.log(element);
            this.documentForm.patchValue({
              lead_id: element.id,
              lead_name: element.name,
              lead_address: element.address,
              lead_nationality: element.nationality,
              lead_gender: element.gender,
              lead_country: element.country,
              lead_religion: element.religion,
              lead_home_phone: element.phone_2,
              lead_phone: element.phone,
              lead_birthday: element.date_of_birth,
              lead_email: element.email,
              lead_work_address: element.id_address,
              lead_national_id: element.national_num || element.id_number,
              lead_is_residence: element.is_residence,
              // deal_type: element.lead_channel.name,
              deal_type: element.lead_channel
                ? element.lead_channel.name
                : null,
              deal_category: element.lead_channel
                ? element.lead_channel.name === "Direct"
                  ? element.lead_source
                  : ""
                : "",
              lead_source: element.lead_source,
              ambassador_id: element.ambassador_id,
              broker_id: element.broker_id,
              broker_incentive_id: element.broker_incentive_id || "",
              land_area: element.land_area,
              root_area: element.root_area,
            });
            if (element.broker_id) {
              this.getIncentiveUsers(
                element.broker_id,
                element.broker_incentive_id
              );
            }
            this.cdr.detectChanges();
            found = true;
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

  ngOnInit() {
    this.getLeads();
    this.deal_type_change();
    this.getChannels();
    this.getAmbassadors();
    this.getBrokers();
    this.getAllCountries();
    // this.getPaymentTerms();
  }

  getAllCountries() {
    this.userService.getAllCountries().subscribe(
      (res: any) => {
        this.counteries = res.data;
      }
    )
  }

  valueChanged(ev) {
    this.chosenLead = ev;
    // this.searchForInputs(ev);
  }

  createForm() {
    this.documentForm = this.fb.group({
      lead_id: [0, Validators.required],
      lead_name: [null, Validators.required],
      lead_address: [null, Validators.required],
      lead_home_phone: [null],
      lead_phone: [null, Validators.required],
      lead_other_phone: [null],
      lead_nationality: [null, Validators.required],
      lead_gender: [null, Validators.required],
      lead_country: [null, Validators.required],
      lead_religion: [null],
      lead_birthday: [null],
      lead_national_id: [null, Validators.required],
      lead_district: [null, Validators.required],
      lead_email: [null],
      lead_work_address: [null],
      unit_id: [null],
      project_type: [null],
      unit_building: [null],
      unit_phase: [null],
      unit_land_area: [null],
      unit_building_area: [null],
      unit_basement_area: [null],
      land_area: [null],
      unit_roof_area: [null],
      roof_area: [null],
      unit_penthouse_area: [null],
      unit_garden_area: [null],
      unit_price: [null],
      unit_garden_price: [null],
      unit_garage_area: [null],
      unit_garage_price: [null],
      storage_slots: [null, Validators.required],
      extra_outdoor_meters: [null, Validators.required],
      unit_extra_area: [null],
      unit_extra_price: [null],
      unit_maintenance_price: [null],
      unit_location: [null],
      reservation_fees: [null],
      // installment_fees: [null],
      installment_years: [null, Validators.required],
      deal_type: [null, Validators.required],
      deal_category: [null, Validators.required],
      broker_id: [null, Validators.required],
      broker_incentive_id: [null],
      ambassador_id: [null, Validators.required],
      contract_type: ["sale", Validators.required],
      payment_type: ["Installment", Validators.required],
      is_overseas: [null, Validators.required],
      finishing_type_id: [null, Validators.required],
      lead_is_residence: [],
      lead_residence_image: [null],
      lead_residence_name: [null],
      lead_source: [null],
      hold_id: [null],
      has_basement: [false],
    });
  }
  get can_add_residence() {
    if (
      this.documentForm.get("is_overseas").value == 1 &&
      this.documentForm.get("lead_is_residence").value == 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  onResidenceChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        // this.documentForm.get('image').setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: ((reader.result as any) as any).split(',')[1]
        // });
        let value = (reader.result as any as any).split(",")[1];
        this.documentForm.get("lead_residence_image").patchValue(value);
        this.documentForm.get("lead_residence_name").patchValue(file.name);
      };
    }
  }

  onOverSeaChange(event) {
    console.log(event);
    console.log(this.documentForm.get("is_overseas").value);
    console.log(this.documentForm.get("lead_is_residence").value);
    console.log(this.can_add_residence);
  }

  submit() {
    let formModel = this.documentForm.value;
    console.log(this.documentForm.value);
    console.log(this.documentForm.valid);
    if (formModel.lead_id == 0) {
      swal("Please assign lead to reservation.", "", "warning");
    } else {
      if (!formModel.lead_name) {
        swal(
          "Get Lead Info!",
          "Make sure assigning lead to reservation by getting its info!",
          "warning"
        );
      } else {
        this.slimLoadingBarService.start(() => {
          console.log("Loading complete");
        });
        formModel.reservation_fees = formModel.reservation_fees + " % ";
        this.disabledSubmitWhileSending = true;
        let validateErorrs = this.checkValidate();
        if (this.isHold) {
          formModel.hold_id = this.holdId;
        }
        this.addReservation.postReservation(formModel).subscribe(
          (data) => {
            console.log(data);
            swal(
              "Cool!",
              "Reservation is added successfully, pending accountant approve!",
              "success"
            );
            this.router.navigate(["/pages/reservations"]);
            this.slimLoadingBarService.complete();
            this.disabledSubmitWhileSending = false;
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
            this.disabledSubmitWhileSending = false;
          }
        );
      }
    }
  }

  checkValidate() {
    const invalid = [];
    const controls = this.documentForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return {
      can_submit: invalid.length <= 0,
      errors: invalid,
    };
  }

  blocktimeEnd() {
    // swal("Temp Block time has finished", "", "warning");
    // this.router.navigate(["/pages/projects"]);
  }

  channels: any;
  leadSources = [];

  require_channels = [];
  getChannels() {
    this.slimLoadingBarService.start();
    this.marketingService.getChannels().subscribe(
      (res: any) => {
        this.channels = res;
        this.require_channels.map((a) => a());
        this.require_channels = null;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deal_type_change() {
    this.documentForm.get("deal_type").valueChanges.subscribe((val) => {
      console.log(`-------------------${val}`);
      if (Array.isArray(this.require_channels)) {
        this.require_channels.push(() => {
          this.channels.forEach((e) => {
            if (e.name == val) {
              this.leadSources = e.sources;

              if (val == "Direct") {
                this.documentForm.get("lead_source").setValue("");
                this.documentForm.get("broker_id").setValue("");
                this.documentForm.get("ambassador_id").setValue("");
                this.documentForm.get("broker_incentive_id").setValue("");
              } else if (val == "In-Direct") {
                this.documentForm.get("deal_category").setValue("");
              }
            }
          });
        });
      } else {
        this.channels.forEach((e) => {
          if (e.name == val) {
            this.leadSources = e.sources;

            if (val == "Direct") {
              this.documentForm.get("lead_source").setValue("");
              this.documentForm.get("broker_id").setValue("");
              this.documentForm.get("ambassador_id").setValue("");
              this.documentForm.get("broker_incentive_id").setValue("");
            } else if (val == "In-Direct") {
              this.documentForm.get("deal_category").setValue("");
            }
          }
        });
      }
    });

    this.documentForm.get("lead_source").valueChanges.subscribe((val) => {
      if (val == "Ambassador") {
        this.documentForm.get("broker_id").setValue("");
        this.documentForm.get("broker_incentive_id").setValue("");
      } else if (val == "Broker") {
        this.documentForm.get("ambassador_id").setValue("");
        this.documentForm.get("broker_incentive_id").setValue("");
      }
    });
  }

  getAmbassadors() {
    this.slimLoadingBarService.start();
    this.userService.getAmbasdors().subscribe(
      (data: any) => {
        this.ambassadors = data;
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
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  search(event) {}

  onContractTypeChange(value) {
    this.ready_to_add_contract_sale = false;
    this.ready_to_add_contract_rent = false;
    console.log(value);
    if (value == "rent") {
      this.installment_years = null;
      // this.documentForm.patchValue({
      //   payment_type: '',
      //   is_overseas: '',
      //   reservation_fees: '',
      //   installment_fees: '',
      //   installment_years: '',
      // });
      this.documentForm.removeControl("payment_type");
      this.documentForm.removeControl("is_overseas");
      this.documentForm.removeControl("reservation_fees");
      // this.documentForm.removeControl("installment_fees");
      this.documentForm.removeControl("installment_years");

      this.documentForm.addControl(
        "rent_value",
        new FormControl("", Validators.required)
      );
      this.documentForm.addControl(
        "rent_start_date",
        new FormControl("", Validators.required)
      );
      this.documentForm.addControl(
        "rent_end_date",
        new FormControl("", Validators.required)
      );
      this.documentForm.addControl(
        "rent_years_num",
        new FormControl("", Validators.required)
      );
      this.ready_to_add_contract_rent = true;
    } else if (value == "sale") {
      this.documentForm.removeControl("rent_value");
      this.documentForm.removeControl("rent_start_date");
      this.documentForm.removeControl("rent_end_date");
      this.documentForm.removeControl("rent_years_num");

      this.documentForm.addControl(
        "payment_type",
        new FormControl("Installment", Validators.required)
      );
      this.documentForm.addControl(
        "is_overseas",
        new FormControl("", Validators.required)
      );
      this.documentForm.addControl(
        "reservation_fees",
        new FormControl("", Validators.required)
      );
      // this.documentForm.addControl(
      //   "installment_fees",
      //   new FormControl("", Validators.required)
      // );
      this.documentForm.addControl(
        "installment_years",
        new FormControl("", Validators.required)
      );
      this.ready_to_add_contract_sale = true;
    }
  }

  get current_contract_type(): String {
    return this.documentForm.get("contract_type").value;
  }

  onFinishTypePriceChange(id, payment_plan_id) {
    this.unit_details.finishing_types.forEach((type) => {
      if (type.id == id) {
        this.documentForm.patchValue({
          unit_price: type.pivot.price,
        });
      }
    });
    if (this.unit_details) {
      let payload = {
        project_id: this.unit_details.project.id,
        phase_id: this.unit_details.phase_id,
        finishing_type_id: id,
      };
      console.log(payload);
      console.log(payment_plan_id);
      this.getPaymentTermsByProjectId(payload, payment_plan_id);
    }
  }

  onCustomPaymentPlanFill() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.documentForm.patchValue({
        finishing_type_id: params.finish_type_id,
        payment_type: "Installment",
      });
      this.onFinishTypePriceChange(
        params.finish_type_id,
        params.payment_plan_id
      );
    });
  }

  validateNumberParkingSlots(event: KeyboardEvent) {
    console.log(event);
    console.log(this.unit_details);
    // if (event.target)
    const val = this.documentForm.get("unit_garage_price").value;
    console.log(val);
    if (+val > this.unit_details.project.available_parking_slots) {
      event.preventDefault();
      this.documentForm.patchValue({
        unit_garage_price: this.unit_details.project.available_parking_slots,
      });
    }
  }

  validateNumberStorageSlots(event: KeyboardEvent) {
    const val = this.documentForm.get("storage_slots").value;
    console.log(val);
    if (+val > this.unit_details.project.available_storage_slots) {
      event.preventDefault();
      this.documentForm.patchValue({
        storage_slots: this.unit_details.project.available_storage_slots,
      });
    }
  }

  validateExtraOutdoorMeter(event: KeyboardEvent): void {
    const val = this.documentForm.get("extra_outdoor_meters").value;
    console.log(val);
    if (+val > this.unit_details.project.available_extra_outdoor_meters) {
      event.preventDefault();
      this.documentForm.patchValue({
        extra_outdoor_meters:
          this.unit_details.project.available_extra_outdoor_meters,
      });
    }
  }
}
