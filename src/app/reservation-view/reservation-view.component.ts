import { MarketingService } from "./../services/marketing/marketing.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { UserServiceService } from "./../services/user-service/user-service.service";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
} from "@angular/forms";
import {
  addMonths,
  differenceInCalendarMonths,
  format,
  getDate,
  lastDayOfMonth,
  parse,
  setDate,
} from "date-fns";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { ReservationService } from "./../services/reservation-service/reservation.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { environment } from "./../../environments/environment";
import { Observable } from "rxjs/Observable";
import { Lightbox } from "ngx-lightbox";
import { ProjectsService } from "../services/projects/projects.service";
import { Ticket } from "../models/ticket";

@Component({
  selector: "app-reservation-view",
  templateUrl: "./reservation-view.component.html",
  styleUrls: ["./reservation-view.component.css"],
})
export class ReservationViewComponent implements OnInit {
  ListEdits_inputs = false;
  methods: any;
  reservation_details: any;
  userProfile: any;
  chosenAgent: any;
  dataFromSearch: any;
  arrSearch: any;
  selling_price: any;
  selling_date: any;
  confirmation_date: any;
  commentReservation: any;
  installmentForm: FormGroup;
  installmentMethods: any;
  installmentDays: any = [];
  is_refreshing = false;
  doc_type_installment_modal: any = ["PDF", "Excel"];
  is_installment_modal_loading = false;
  payments_option = ["Quarter", "Semi-annual", "Annual"];
  last_price: any;
  cfo_pin: any;
  filesForm: FormGroup;
  filterForm: FormGroup;
  uploadExcel: FormGroup;
  file_name: any;
  file_name2: any;
  signature_date: any;
  chosenLeadID: any;
  leadArrSerach: any;
  chosenLead: any;
  chosenClient: any = {};
  chosenLeadReason: any;
  chosenLeadPhone: any;
  chosenLeadName: any;
  chosenLeadNationalityID: any;
  chosenLeadNationality: any;
  chosenLeadDistrict: any;
  chosenLeadIssueDate: any;
  chosenLeadCivilRegistery: any;
  chosenLeadBirthday: any;
  chosenLeadAddress: any;
  filterAgentByWordText: any;
  percentage: any;
  refundReason: any;
  type_extra_discount: any = "percentage";
  discount_on: string = "garage";
  value_extra_discount: any;
  reason: any;
  down_payment: any;
  deal_types: any = ["Direct", "In-Direct"];
  direct_option: any = ["Individual"];
  ambassadors: any;
  brokers: any;
  deal_type: any;
  commission_date: any;

  claim_form = {
    claim_date: "",
    claim_from: "",
  };

  // ------------add-customer decl------------
  customersData: any;
  chosenCustomer;
  addCustomerForm = {
    lead_id: "",
    lead_name: "",
    lead_phone: "",
    lead_email: "",
    lead_national_id: "",
    lead_religion: "",
    lead_nationality: "",
    lead_other_phone: "",
    lead_birthday: "",
    lead_address: "",
    lead_district: "",
    sharing_percentage: "",
  };
  staticLeads = [
    {
      created_at: "2021-12-01 13:44:03",
      id: 225,
      lead_address: null,
      lead_birthday: null,
      lead_district: null,
      lead_email: null,
      lead_fax_number: null,
      lead_home_phone: null,
      lead_issue_date: null,
      lead_job_title: null,
      lead_marital_status: null,
      lead_name: "Ali .syed",
      lead_national_id: null,
      lead_nationality: null,
      lead_other_phone: null,
      lead_phone: "96550747384",
      lead_work_address: null,
      lead_workplace: null,
      reservation_id: 250,
      sharing_percentage: 100,
      updated_at: "2021-12-01 13:44:03",
    },
    {
      created_at: "2021-12-01 13:44:03",
      id: 225,
      lead_address: null,
      lead_birthday: null,
      lead_district: null,
      lead_email: null,
      lead_fax_number: null,
      lead_home_phone: null,
      lead_issue_date: null,
      lead_job_title: null,
      lead_marital_status: null,
      lead_name: "Ali .syed",
      lead_national_id: null,
      lead_nationality: null,
      lead_other_phone: null,
      lead_phone: "96550747384",
      lead_work_address: null,
      lead_workplace: null,
      reservation_id: 250,
      sharing_percentage: 100,
      updated_at: "2021-12-01 13:44:03",
    },
    {
      created_at: "2021-12-01 13:44:03",
      id: 225,
      lead_address: null,
      lead_birthday: null,
      lead_district: null,
      lead_email: null,
      lead_fax_number: null,
      lead_home_phone: null,
      lead_issue_date: null,
      lead_job_title: null,
      lead_marital_status: null,
      lead_name: "Ali .syed",
      lead_national_id: null,
      lead_nationality: null,
      lead_other_phone: null,
      lead_phone: "96550747384",
      lead_work_address: null,
      lead_workplace: null,
      reservation_id: 250,
      sharing_percentage: 100,
      updated_at: "2021-12-01 13:44:03",
    },
  ];
  customer_id;
  single_customer;
  refundReasons: any = [
    "Financial issue",
    "Personal issue",
    "Legal action",
    "Activate by Mistake",
    "Contract details",
    "Rejected Cheques",
    "transfer to another unit",
  ];
  slots: any;
  extra_slots: any;
  storage_slots: number;

  last_payment_type: any;
  is_overseas: any;
  slip_number: any;
  cheque_number: any;
  due_date: any;
  commission_to: any;
  cash: any;
  ev: any;
  installment_delay: any;
  type = "6 years";
  paymentForm: FormGroup;
  payment_term_id: any;

  selling_price_in_modal: any;
  channelview: any;

  edit_lead_data = {
    lead_id: "",
    lead_name: "",
    lead_phone: "",
    lead_email: "",
    lead_national_id: "",
    lead_nationality: "",
    lead_religion: "",
    lead_other_phone: "",
    lead_birthday: "",
    lead_address: "",
    lead_district: "",
    lead_phone2: "",
    lead_gender: "",
    lead_country: "",
    sharing_percentage: "",
  };

  contractForm: FormGroup;

  cancel_reason: any;
  cancel_date: any;

  agents: any;

  agent_in_charge: any;

  contract_type_details = {
    contract_type: "",
    rent_value: "",
    rent_start_date: "",
    rent_end_date: "",
    rent_years_num: "",
    payment_type: "",
    is_overseas: "",
    installment_years: "",
    // installment_fees: "",
  };
  payment_plans: any;
  _staticMasterPlanImages: any;

  currentSlide: any;

  payment_collections_list = [
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: true,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: true,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: false,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: false,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: false,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: false,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: false,
    },
    {
      name: "test",
      rf_serial: "test",
      unit_serial: "test",
      date: "2020-10-13 19:51:01",
      status: "test",
      is_collected: false,
    },
  ];
  sharedAgentsCommissionsView: any;
  sharedAgentsCommissions: FormArray = new FormArray([]);
  disable_save_shared_comission = false;

  oversea_contract_sent_date: any = new Date();

  payment_type: any = "down_payment";
  slip_type: any;
  slip_customer: any;
  deposit_amount: any;

  complete_down_payment_amount: any;

  banks: any;
  bank_id: any;

  documentForm: FormGroup;
  documents: any;

  contract_signed_by_client_date: any;
  contract_approve_date: any;
  contract_dilever_date: any;

  cheque_recieved_date: any;

  /*Payment collection variables Start*/
  payment_collections: any;
  pageTest = 1;
  /*Payment collection variables End*/

  reservationFiles = [];
  finalPaymentPlanFile;
  isReadonlyMode = false;
  reservationId;
  currentRole = "";
  isAccountant = false;
  divisionForm: any = {};

  // cheques book
  enable_edit_payment_collections = false;
  disableSavePaymentCollection = false;
  check_all = false;
  current_active_cheque: number;
  enableRemiderType: string;
  disableReminderType: string;
  chequeCollectType: any;
  collect_type = "fully-collected";
  collection_date = "";
  chequeRejectType: any;

  developer_id: number;
  name_on_cheques: string;
  cheque_book_name: string;

  reminder_reason: string;

  uploadScannedChequeForm: FormGroup;

  reject_reason: any;
  reject_comment: string;
  cheque_amount: any;

  partially_methods = ["Cash", "Visa", "Transfer", "Cheque"];

  partially_method: any;
  partially_data: any;

  addContractLog = {
    reservation_id: "",
    agent_id: "",
    delivered_at: "",
    status: "",
    details: "",
  };

  developers: any;
  events = [];

  current_units_arr: any;
  arr: any;
  transfer_unit_id: any;

  store_status: any;

  dynamicForms = [
    {
      form: undefined,
      title: "إقرار إلغاء تعاقد وتنازل عن وحدة",
      api_call: "cancel_contract",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "إقرار و تعهد",
      api_call: "commitment",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب إسترداد مبلغ حجز",
      api_call: "refund_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "السبب",
          name: "reason",
          type: "textarea",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب إضافة  شريك",
      api_call: "add_customer",
      controls: [
        {
          label: "الاسم بالكامل",
          name: "name",
          type: "text",
          value: "",
        },
        {
          label: "رقم قومى/جواز سفر",
          name: "national_id",
          type: "text",
          value: "",
        },
        {
          label: "المقبم ب",
          name: "address",
          type: "text",
          value: "",
        },
        {
          label: "المهنة",
          name: "job",
          type: "text",
          value: "",
        },
        {
          label: "التليفون",
          name: "phone",
          type: "text",
          value: "",
        },
        {
          label: "البريد الالكترونى",
          name: "email",
          type: "email",
          value: "",
        },
        {
          label: "درجه القرابة(ان وجد)",
          name: "degree_of_kinship",
          type: "text",
          value: "",
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
      ],
    },
    {
      form: undefined,
      title: "طلب  حذف شريك",
      api_call: "remove_customer",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب إلغاء تعاقد",
      api_call: "cancel_contract_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "السبب",
          name: "reason",
          type: "textarea",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تأجيل سداد",
      api_call: "delay_payment",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "السبب",
          name: "reason",
          type: "textarea",
          value: "",
        },
        {
          label: "معلومات",
          name: "details",
          type: "textarea",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تحويل",
      api_call: "transfer_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "الوحده المراد التحويل اليها",
          name: "unit_id",
          type: "unit_id",
          value: "",
          observableSource: (keyword: any): any => {
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
          },
          valueChanged: (event) => {
            console.log(event);
            if (this.current_units_arr.length > 0) {
              this.current_units_arr.forEach((element) => {
                if (
                  element.serial + " (" + element.project.name + ")" ==
                  event
                ) {
                  console.log("matched");
                  console.log(element);
                  this.transfer_unit_id = element.id;
                }
              });
            }
          },
        },
        {
          label: "السبب",
          name: "reason",
          type: "textarea",
          value: "",
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تعاقد على تشطيب",
      api_call: "finishing_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تعجيل سداد",
      api_call: "expedited_payment",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "سعر الوحدة",
          name: "unit_price",
          type: "text",
          value: "",
          disabled: true,
        },
        {
          label: "المبلغ المطلوب تعجيل سداده",
          name: "needed_collect",
          type: "text",
          value: "",
        },
        {
          label: "نسبه الخصم",
          name: "discount_percentage",
          type: "text",
          value: "",
        },
        {
          label: "قيمه الخصم",
          name: "discount_amount",
          type: "text",
          value: "",
        },
        {
          label: "المطلوب سداده",
          name: "nedded_price",
          type: "text",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تعديل هندسي",
      api_call: "geometric_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "معلومات",
          name: "details",
          type: "textarea",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تغيير نظام سداد",
      api_call: "change_payment_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "السبب",
          name: "reason",
          type: "textarea",
          value: "",
        },
        {
          label: "نظام السداد الحالى",
          name: "old_payment",
          type: "text",
          value: "",
        },
        {
          label: "نظام السداد المطلوب",
          name: "new_payment",
          type: "text",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "طلب تنازل",
      api_call: "waiver_request",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "الاسم بالكامل",
          name: "name",
          type: "text",
          value: "",
        },
        {
          label: "رقم قومى/جواز سفر",
          name: "national_id",
          type: "text",
          value: "",
        },
        {
          label: "المقبم ب",
          name: "address",
          type: "text",
          value: "",
        },
        {
          label: "المهنه",
          name: "job",
          type: "text",
          value: "",
        },
        {
          label: "التليفون",
          name: "phone",
          type: "text",
          value: "",
        },
        {
          label: "البريد الالكترونى",
          name: "email",
          type: "email",
          value: "",
        },
        {
          label: "درجه القرابة(ان وجد)",
          name: "nationality",
          type: "text",
          value: "",
        },
        {
          label: "السبب",
          name: "reason",
          type: "textarea",
          value: "",
        },
        {
          label: "الاسم بالكامل",
          name: "name",
          type: "name",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "مذكرة داخلية",
      api_call: "notes",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "مقدم الى السيد",
          name: "name",
          type: "text",
          value: "",
        },
        {
          label: "معلومات",
          name: "details",
          type: "textarea",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "نموذج تحديث بيانات",
      api_call: "update_data",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
        {
          label: "عنوان الاقامه",
          name: "residential_address",
          type: "text",
          value: "",
        },
        {
          label: "عنوان المراسلات",
          name: "correspondence_address",
          type: "text",
          value: "",
        },
        {
          label: "رقم التليفون 1",
          name: "phone_1",
          type: "tel",
          value: "",
        },
        {
          label: "رقم التليفون 2",
          name: "phone_2",
          type: "tel",
          value: "",
        },
        {
          label: "رقم التليفون 3",
          name: "phone_3",
          type: "tel",
          value: "",
        },
        {
          label: "البريد الالكترونى 1",
          name: "email_1",
          type: "email",
          value: "",
        },
        {
          label: "البريد الالكترونى 2",
          name: "email_2",
          type: "email",
          value: "",
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "نموذج تفويض",
      api_call: "delegate_form",
      controls: [
        {
          label: "اسم المفوض",
          name: "delegate_name",
          type: "text",
          value: "",
        },
        {
          label: "رقم قومى/جواز سفر",
          name: "delegate_national_id",
          type: "text",
          value: "",
        },
        {
          label: "المفوض اليه",
          name: "delegate_to_name",
          type: "text",
          value: "",
        },
        {
          label: "رقم قومى/جواز سفر",
          name: "delegate_to_national_id",
          type: "text",
          value: "",
        },
        {
          label: "التفاصيل",
          name: "details",
          type: "text",
          value: "",
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "إقرار إستلام نسخة عقد",
      api_call: "receiving_contract",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
    {
      form: undefined,
      title: "خصم الإحالة",
      api_call: "referral_discount",
      controls: [
        {
          label: "العميل",
          name: "lead_id",
          type: "select",
          value: "",
          bindValue: "lead_name",
          options: undefined,
        },
        {
          label: "الوحده المراد التحويل اليها",
          name: "unit_id",
          type: "unit_id",
          value: "",
          observableSource: (keyword: any): any => {
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
          },
          valueChanged: (event) => {
            console.log(event);
            if (this.current_units_arr.length > 0) {
              this.current_units_arr.forEach((element) => {
                if (
                  element.serial + " (" + element.project.name + ")" ==
                  event
                ) {
                  console.log("matched");
                  console.log(element);
                  this.transfer_unit_id = element.id;
                }
              });
            }
          },
        },
        {
          label: "نسبه العمولة",
          name: "commission_rate",
          type: "text",
          value: "",
        },
        {
          label: "قيمه العمولة",
          name: "commission",
          type: "text",
          value: "",
        },
        {
          label: "طريقة التسوية",
          name: "method",
          type: "text",
          value: "",
        },
        {
          label: "تاريخ الطلب",
          name: "date",
          type: "date",
          value: "",
        },
      ],
    },
  ];

  acknowledgementForm;

  add_cheque = {
    name: "",
    bank_id: "", // done
    store_status: "", // done
    cheque_number: "", // done
    amount: "", // done
    amount_received: "0", // done
    date: new Date(), // done
    type: 1,
    // fixed
    status: "under-collection",
    send_reminder: 1, // done
    print_status: 1, // done
  };

  store_banks = [];

  chequeCollectCustomer: any;

  fines: any;
  collect_type_fines = "fully-collected";
  collection_date_fines = "";
  chequeCollectTypeFine: any;
  chequeCollectCustomerFines: any;
  current_active_cheque_fine: number;
  partially_method_fines: any;
  partially_data_fines: any;
  cheque_amount_fines: any;
  currency_code: any = "EGP";

  totalChequeBookAmount = 0;
  totalCDBAmount = 0;
  old_customer: any = {};

  has_basement: any;
  basement_area: any;
  basement_price: any;
  tickets: any;
  legal_type: any;
  legal_note: any;
  handover_status: any;
  handover_date: any;
  handoverLogs: any[] = [];
  incentive_users: any[] = [];
  broker_incentive_id: any;
  countries: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private userService: UserServiceService,
    private leadsService: LeadsService,
    private _lightbox: Lightbox,
    private projectsService: ProjectsService,
    private marketingService: MarketingService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getdevelopers();
    this.getChannels();
    this.getEvents();
    this.getStoreBanks();
    this.getAllCountries();
    this.userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    this.currentRole = window.localStorage.getItem("role");
    if (
      this.currentRole &&
      (this.currentRole == "A.R Accountant" ||
        this.currentRole == "G.L Accountant" ||
        this.currentRole == "Treasury Accountant")
    )
      this.isAccountant = true;
    this.getQParams();
  }

  getAllCountries() {
    this.userService.getAllCountries().subscribe((res: any) => {
      this.countries = res.data;
    });
  }

  getReservationTickets() {
    this.slimLoadingBarService.start();
    this.reservationService.getReservationTickets(this.reservationId).subscribe(
      (data: any) => {
        this.tickets = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getIncentiveUsers(broker_id: number) {
    this.userService.get_incentive_users(broker_id).subscribe(
      (res: any) => {
        this.incentive_users = res;
        console.log(this.agents);
      },
      (err) => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getStoreBanks() {
    this.slimLoadingBarService.start();
    this.userService.getBanks().subscribe(
      (data: any) => {
        this.store_banks = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  createDynamicForm() {
    for (let i = 0; i < this.dynamicForms.length; i++) {
      let formGroup = new FormGroup({});
      for (let j = 0; j < this.dynamicForms[i].controls.length; j++) {
        let control = this.dynamicForms[i].controls[j];
        formGroup.addControl(control.name, new FormControl(control.value));
        if (
          this.dynamicForms[i].controls[j].type == "select" &&
          this.dynamicForms[i].controls[j].name == "lead_id"
        ) {
          this.dynamicForms[i].controls[j].options = JSON.parse(
            JSON.stringify(this.reservation_details.sharing_leads)
          );
          if (this.reservation_details.sharing_leads.length == 1) {
            // this.dynamicForms[i].controls[j].value = this.reservation_details.sharing_leads[0].id;
            formGroup.patchValue({
              lead_id: this.reservation_details.sharing_leads[0].lead_id,
            });
          }
        }
      }
      this.dynamicForms[i].form = formGroup;
    }
    console.log(this.dynamicForms);
  }

  onAcknowledgmentFormClick(form, modal) {
    console.log(form);
    this.acknowledgementForm = form;
    modal.open();
  }

  onSubmitAcknowledgment(modal) {
    console.log(this.reservationId);
    console.log(this.acknowledgementForm);
    let payload: any = JSON.parse(
      JSON.stringify(this.acknowledgementForm.form.value)
    );
    if (this.acknowledgementForm.api_call == "transfer_request") {
      payload.unit_id = this.transfer_unit_id;
    }
    this.slimLoadingBarService.start();
    this.reservationService
      .submitAcknowledgmentForm(
        this.acknowledgementForm.api_call,
        this.reservationId,
        payload
      )
      .subscribe(
        (res) => {
          modal.close();
          this.slimLoadingBarService.complete();
          swal("Success", "added acknowledgment successfully", "success");
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  getEvents() {
    this.slimLoadingBarService.start();
    this.reservationService.getAllEvents().subscribe(
      (res: any) => {
        console.log(res);
        this.events = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getParams(id) {
    console.log(id);
    this.createInstallmentForm();
    this.activatedRoute.params.subscribe((res) => {
      console.log(res);
      if (id) this.reservationId = id;
      else if (res["id"]) this.reservationId = res["id"];
      else {
        this.reservationId = JSON.parse(
          window.localStorage.getItem("reservationDetails")
        ).id;
      }

      this.createDocumentForm();
      this.createPaymentForm();
      this.createFilesUploadForm();
      this.getReservation();
      this.getReservationTickets();
    });
  }

  getQParams() {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.isReadonlyMode = res["ro"] == 1;
      this.getParams(res["id"]);
    });
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

  channelChange(_, change = true) {
    if (change) {
      this.divisionForm.deal_source = null;
    }
    if (!this.divisionForm.deal_type) this.divisionForm.deal_type = "Direct";
    console.log(Array.isArray(this.require_channels));
    if (Array.isArray(this.require_channels)) {
      this.require_channels.push(() => {
        this.channels.forEach((e) => {
          if (e.id == this.divisionForm.deal_category) {
            this.leadSources = [];
            if (change) {
              this.divisionForm.deal_source = null;
            }
            this.leadSources = e.sources;
            this.channelview = e.name;
            if (change && this.channelview != "Brokers") {
              if (this.divisionForm.broker_id) {
                this.divisionForm.broker_id = null;
              } else if (this.divisionForm.ambassador_id) {
                this.divisionForm.ambassador_id = null;
              }
            }
          }
        });
      });
    } else {
      console.log(this.channels);
      console.log(this.divisionForm.deal_type);
      this.channels.forEach((e) => {
        if (e.name == this.divisionForm.deal_type) {
          this.leadSources = [];
          if (change) {
            this.divisionForm.deal_source = null;
          }
          this.leadSources = e.sources;
          this.channelview = e.name;
          if (change && this.channelview != "Brokers") {
            if (this.divisionForm.broker_id) {
              this.divisionForm.broker_id = null;
            } else if (this.divisionForm.ambassador_id) {
              this.divisionForm.ambassador_id = null;
            }
          }
        }
      });
      console.log(this.leadSources);
    }
  }

  editOldLeadModalSubmit(modal) {
    const payload = {
      id: this.old_customer.id,
      ...this.old_customer,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .updateOldCustomer(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.old_customer = {};
          this.getReservation();
          modal.close();
          swal("Customer updated successfully", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
      percentage: [{ value: "", disabled: true }, Validators.required],
      payment_term_id: ["", Validators.required],
    });
  }
  createDocumentForm() {
    this.documentForm = this.fb.group({
      name: ["", Validators.required],
      document_value: [null],
      document_name: [null],
    });
  }

  onDocumentSubmit() {
    const payload = this.documentForm.value;
    console.log(payload);
    this.slimLoadingBarService.start();
    this.reservationService
      .addDocument(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          swal("Success", "added document successfully", "success");
          this.documentForm.reset();
          this.getReservationsDocuments();
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  getReservationsDocuments() {
    this.slimLoadingBarService.start();
    this.reservationService
      .getReservationDocuments(this.reservation_details.id)
      .subscribe(
        (res: any) => {
          this.documents = res.filter((document) => {
            return !(
              document.type === "Accountant Approved" &&
              this.reservation_details.authorization.can_accountant_approve == 1
            );
          });
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  deleteDocument(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this document!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .deleteReservationDocument(this.reservation_details.id, id)
          .subscribe(
            (res: any) => {
              swal("Success", "Deleted document successfully", "success");
              this.slimLoadingBarService.complete();
              this.getReservationsDocuments();
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

  onFileChange(event) {
    // residence_image: ['', Validators.required],
    //   residence_name: ['', Validators.required]
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      this.file_name = file.name;
      reader.onload = () => {
        // this.documentForm.get('image').setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: ((reader.result as any) as any).split(',')[1]
        // });
        this.documentForm
          .get("document_value")
          .patchValue((reader.result as any as any).split(",")[1]);
        this.documentForm.get("document_name").patchValue(file.name);
      };
    }
  }

  createContractForm(data?) {
    if (data.contract_type == "rent") {
      this.contractForm = this.fb.group({
        contract_type: [data.contract_type || ""],
        //rent
        rent_value: [data.rent_details.rent_value || ""],
        rent_start_date: [data.rent_details.rent_start_date || ""],
        rent_end_date: [data.rent_details.rent_end_date || ""],
        rent_years_num: [data.rent_details.rent_years_num || ""],
        // sale
        payment_type: [data.payment_type || ""],
        is_overseas: [data.is_overseas],
        installment_years: [data.installment_years || ""],
        // installment_fees: [data.installment_fees || ""],
      });
    } else {
      this.contractForm = this.fb.group({
        contract_type: [data.contract_type || ""],
        //rent
        rent_value: [""],
        rent_start_date: [""],
        rent_end_date: [""],
        rent_years_num: [""],
        // sale
        payment_type: [data.payment_type || ""],
        is_overseas: [data.is_overseas],
        installment_years: [data.installment_years || ""],
        // installment_fees: [data.installment_fees || ""],
      });
    }
    console.log(this.contractForm.value);
  }

  deleteControl(index) {}

  getSharedComission(id) {
    this.reservationService.getSharedComissions(id).subscribe(
      (res: any) => {
        console.log({ res });
        this.sharedAgentsCommissionsView = res;
        res.forEach((element) => {
          this.addInputsForSharedComissions(element);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addInputsForSharedComissions(element?) {
    if (element) {
      const group = new FormGroup({
        user_id: new FormControl(element.user_id || null),
        comission_percentage: new FormControl(
          element.comission_percentage || null
        ),
      });
      this.sharedAgentsCommissions.push(group);
    } else {
      const group = new FormGroup({
        user_id: new FormControl(null),
        comission_percentage: new FormControl(null),
      });
      this.sharedAgentsCommissions.push(group);
    }
  }

  saveSharedCommission() {
    console.log(this.sharedAgentsCommissions.value);
    let all_comissions_value = 0;
    const sharedAgentsCommissionsValue = this.sharedAgentsCommissions.value;
    if (sharedAgentsCommissionsValue) {
      sharedAgentsCommissionsValue.forEach((agnet_commision) => {
        all_comissions_value += +agnet_commision.comission_percentage;
      });
    }
    console.log(all_comissions_value);
    if (+all_comissions_value != 100) {
      swal("error", "Total Commission is not equal to 100", "error");
      return;
    } else {
      this.disable_save_shared_comission = true;
      this.slimLoadingBarService.start();
      this.reservationService
        .addShareComission(
          this.reservation_details.id,
          sharedAgentsCommissionsValue
        )
        .subscribe(
          (res: any) => {
            swal("success", "Commissions updated successfully", "success");
            this.disable_save_shared_comission = false;
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.disable_save_shared_comission = false;
            this.slimLoadingBarService.complete();
            this.errorHandlerService.handleErorr(err);
            console.log(err);
          }
        );
    }
  }

  getAllAgents() {
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

  onAgentInChargeSelected(event) {
    const payload = {
      agent_in_charge: this.agent_in_charge,
    };
    this.leadsService
      .changeAgentInCharge(this.reservation_details.id, payload)
      .subscribe(
        (res) => {
          swal("Success", "Agent in charge changed successfully", "success");
          this.getReservation();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getPaymentTerms() {
    this.userService
      .getPaymentTermsByProject(this.reservation_details.unit.project.id)
      .subscribe(
        (res) => {
          this.methods = res;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  getReservation() {
    this.slimLoadingBarService.start();
    this.reservationService.getSingleReservation(this.reservationId).subscribe(
      (data: any) => {
        this.sharedAgentsCommissions = new FormArray([]);
        console.log("reservation", data.data[0]);
        this.reservation_details = data.data[0];

        this.reservation_details.financial_position =
          this.reservation_details.late_installments_no;
        this.getSharedComission(this.reservation_details.id);
        this.cheque_recieved_date =
          this.reservation_details.cheque_recieved_date;
        this.cancel_reason = this.reservation_details.cancel_reason;
        this.cancel_date = this.reservation_details.cancel_date;
        this.getChequesTempaltes();
        // this.deal_type_change();
        this.getAmbassadors();
        this.getBrokers();
        this.getAllAgents();
        this.getReservationsDocuments();
        this.down_payment =
          this.reservation_details.unit_price *
          (this.reservation_details.percentage / 100);
        this.getPaymentTerms();
        if (this.reservation_details.unit.layout_images) {
          if (this.reservation_details.unit.layout_images.length) {
            this.currentSlide = 0;
          }
        }
        this.createContractForm(this.reservation_details);
        const payload = {
          project_id: this.reservation_details.project_id,
          phase_id: this.reservation_details.phase_id,
          finishing_type_id: this.reservation_details.finishing_type_id,
        };
        this.getPaymentTermsByProjectId(
          this.reservation_details.unit.project_id
        );
        this.edit_lead_data.lead_address =
          this.reservation_details.lead_address;
        this.edit_lead_data.lead_religion =
          this.reservation_details.lead_religion;
        this.edit_lead_data.lead_birthday =
          this.reservation_details.lead_birthday;
        this.edit_lead_data.lead_district =
          this.reservation_details.lead_district;
        this.edit_lead_data.lead_national_id =
          this.reservation_details.lead_national_id;
        this.edit_lead_data.lead_nationality =
          this.reservation_details.lead_nationality;
        if (this.reservation_details.lead) {
          this.edit_lead_data.lead_name = this.reservation_details.lead.name;
          this.edit_lead_data.lead_email = this.reservation_details.lead.email;
          this.edit_lead_data.lead_phone = this.reservation_details.lead.phone;
          this.edit_lead_data.lead_phone2 =
            this.reservation_details.lead.phone_2;
        }
        this.selling_price_in_modal = this.reservation_details.unit_price;
        this.installmentDays = [];
        this.agent_in_charge = this.reservation_details.agent_in_charge;
        this.broker_incentive_id = this.reservation_details.broker_incentive_id;
        this.reservation_details.broker_id &&
          this.getIncentiveUsers(this.reservation_details.broker_id);
        //   let agentsArr = [];
        //   this.leadsService.getAgents().subscribe(
        //     (data: any) => {
        //       agentsArr = data;
        //     });
        //   for (let i = 0; i <= agentsArr.length; i++) {
        //     if (agentsArr[i].id === 1) {
        //         this.agents.push({ label: this.agents[i].name, value: this.agents[i].id });
        //     }
        // }

        //   this.agents.forEach(
        //     (agent)=> {
        //         this.agents.push({label: agent.name, value: agent.id});
        //         console.log(agent);
        //         this.agent_in_charge = agent.id;
        //     }
        // );

        console.log("sasa", this.agent_in_charge);

        for (let i = 1; i < 29; i++) {
          this.installmentDays.push(i);
        }
        this.down_payment =
          this.reservation_details.unit_price *
          (this.reservation_details.percentage / 100);
        console.log(this.reservation_details);
        console.log(this.installmentMethods);
        this.last_payment_type = this.reservation_details.payment_type;
        this.is_overseas = this.reservation_details.is_overseas;
        this.getPaymentCollection(this.reservation_details.id);
        this.getFines(this.reservation_details.id);
        this.installmentForm.patchValue({
          type: this.reservation_details.installment_years,
          percentage: this.reservation_details.percentage,
        });
        console.log(this.installmentForm.value);
        this.divisionForm.deal_type = this.reservation_details.deal_type;
        this.divisionForm.deal_category =
          this.reservation_details.deal_category;
        this.divisionForm.deal_source = this.reservation_details.deal_category;
        if (this.reservation_details.deal_category == "Ambassador") {
          this.divisionForm.ambassador_id =
            this.reservation_details.ambassador_id;
        } else if (this.reservation_details.deal_category == "Broker") {
          this.divisionForm.broker_id = this.reservation_details.broker_id;
        }
        this.channelChange(false);

        this.reservation_details.users = this.sortUsers(
          this.reservation_details.users
        );
        this.createDynamicForm();
        this.has_basement = this.reservation_details.has_basement
          ? true
          : false;
        this.basement_area = this.reservation_details.unit_basement_area;
        this.basement_price = this.reservation_details.unit_basement_price;
        if (
          this.userProfile.role == "Super Development" ||
          this.userProfile.role == "Moderator" ||
          this.userProfile.role == "Admin" ||
          this.userProfile.role == "Helpdesk Agent" ||
          this.userProfile.role == "Helpdesk Supervisor" ||
          this.userProfile.role == "Legal and Technical" ||
          this.userProfile.email == "f.shaker@cred-eg.com" ||
          this.userProfile.email == "m.badr@cred-eg.com"
        ) {
          this.getHandoverLogs();
        }
        const allowedRoles = [
          "Admin",
          "Legal and Technical",
          "Legal Head",
          "Super Moderator",
          "CRM Supervisor",
          "CRM Agent",
          "Treasury Accountant",
          "A.R Accountant",
          "G.L Accountant",
          "Helpdesk Supervisor",
          "Helpdesk Agent"
        ];

        const userRole = this.userProfile.role ? this.userProfile.role.trim() : "";

        console.log('User Role (Trimmed):', userRole);
        console.log('Check Legal Type:', this.reservation_details.check_legal_type);
        console.log('Is Role Allowed?', allowedRoles.includes(userRole));

        if (
          this.reservation_details.check_legal_type &&
          allowedRoles.includes(userRole)
        ) {
          swal({
            title: "<strong>Customers Legal Stage</strong>",
            type: "info",
            html: `
                  ${Object.keys(this.reservation_details.check_legal_type).map(
                    (customer_name) => {
                      return `
                                  ${this.reservation_details.check_legal_type[
                                    customer_name
                                  ].map((legal_type) => {
                                    return `
                                              <div class="row">
                                                <div class="col-md-12">
                                                  <div class="form-group">
                                                    <label class="d-flex justify-content-start" for="input-first-name">${
                                                      "Lead Name: " +
                                                      customer_name +
                                                      "  " +
                                                      " / RF-ID: " +
                                                      `<a class="btn-link" href="/pages/project/view-reservation/${legal_type.id}">#${legal_type.id}</a>`
                                                    }</label>
                                                    <input type="text" class="form-control" value="${
                                                      legal_type.legal_type_text
                                                    }" readonly>
                                                  </div>
                                                </div>
                                              </div>
                                            `;
                                  })}
                            `;
                    }
                  )}
            `,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: true,
          });
        }
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getHandoverLogs() {
    this.slimLoadingBarService.start();
    this.reservationService.getHandoverLogs(this.reservationId).subscribe(
      (res: any) => {
        this.handoverLogs = res;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  sortUsers(users) {
    const sorted = [];
    ["Property Consultant", "Team Leader"].map((title) => {
      const index = users.findIndex((user) => user.role === title);
      if (index > -1) {
        sorted.push(users[index]);
        users.splice(index, 1);
      }
    });

    sorted.push(...users);
    return sorted;
  }

  createFilesUploadForm() {
    this.filesForm = this.fb.group({
      receipt: [null, Validators.required],
      signed: [null, Validators.required],
      date: [null, Validators.required],
    });

    this.uploadScannedChequeForm = this.fb.group({
      scannedCheque: [null, Validators.required],
    });

    this.filterForm = this.fb.group({
      serial: [""],
      agent: [""],
      lead_name: [""],
    });

    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
  }

  filterLeadObservable = (keyword: any): any => {
    const baseUrl: string = environment.api_base_url;
    console.log(baseUrl);
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

  contractSignedByClientModalSubmit(modal) {
    const payload = {
      date: this.contract_signed_by_client_date,
    };
    modal.close();
    this.slimLoadingBarService.start();
    this.reservationService
      .contract_sign_by_client(this.reservation_details.id, payload)
      .subscribe(
        (data) => {
          this.getReservation();
          swal("Woohoo!", "Contract signed by client succesfully!", "success");
        },
        (err) => console.log(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  contractApproveModalSubmit(modal) {
    const payload = {
      date: this.contract_approve_date,
    };
    modal.close();
    this.slimLoadingBarService.start();
    this.reservationService
      .contract_approve(this.reservation_details.id, payload)
      .subscribe(
        (data) => {
          this.getReservation();
          swal("Woohoo!", "Contract approved succesfully!", "success");
        },
        (err) => console.log(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  contractDileveredModalSubmit(modal) {
    const payload = {
      date: this.contract_dilever_date,
    };
    modal.close();
    this.slimLoadingBarService.start();
    this.reservationService
      .contract_delivered(this.reservation_details.id, payload)
      .subscribe(
        (data) => {
          this.getReservation();
          swal("Woohoo!", "Contract delivered succesfully!", "success");
        },
        (err) => console.log(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  adminDecline(reservationId, modal) {
    swal({
      title: "Are you sure?",
      text: "You will decline the reservation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, decline it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        if (this.reservation_details.authorization.can_refund_reason == 1) {
          modal.open();
          console.log("success");
        } else {
          console.log("err");
          // this.reservationService.adminDecline(reservationId, {}).subscribe(data => {
          //   swal('Woohoo!', 'Declined Successfully!', 'success');
          //   this.getReservation();
          // }, err => this.errorHandlerService.handleErorr(err));
        }
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

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
            // this.getReservation();
            this.router.navigateByUrl("/pages/reservations");
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
              this.getReservation();
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

  cheque_recieved_submit(modal) {
    const data = {
      date: this.cheque_recieved_date,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .cheque_recieved(this.reservation_details.id, data)
      .subscribe(
        () => {
          modal.close();
          this.getReservation();
          swal("Woohoo!", "cheque Recieved succesfully!", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  cancel_cheque_recieved(reservation_id) {
    swal({
      title: "Are you sure?",
      text: "cheque Recieved Will be Cancelled!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancel_cheque_recieved(reservation_id)
          .subscribe(
            (data) => {
              this.getReservation();
              swal(
                "Woohoo!",
                "cheque Recieved Cancelled succesfully!",
                "success"
              );
            },
            (err) => console.log(err),
            () => this.slimLoadingBarService.complete()
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  /***
   * start of assign modal
   */

  closeAssignModal() {}

  submitAssignModal(res_id, modal) {
    this.slimLoadingBarService.start();
    if (!this.chosenAgent) {
      swal("You must chose a property consultant", "", "error");
    } else {
      this.reservationService
        .assignToLead(res_id, this.chosenAgent.id)
        .subscribe(
          (data) => {
            console.log(data);
            swal("Woohoo!", "Assigned to user successfully!", "success");
            this.getReservation();
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
    }
  }

  openAssignModal(unit_id) {}

  /***
   * end of assign modal
   */

  /**
   * start of edit selling price
   */

  openEditSellingPriceModal(reservation) {}

  closeEditSellingPriceModal(modal) {
    // this.selling_price_in_modal = '';
    this.selling_price_in_modal = this.reservation_details.unit_price;
    modal.close();
  }

  submiteditSellingPriceModal(reservation, modal) {
    // this.percentage = this.price_precentage;
    // this.reason = this.reason;
    // if (!this.percentage) swal("percentage can not be empty", "", "error");
    if (!this.reason) swal("reason can not be empty", "", "error");
    else {
      modal.close();
      const data = {
        type: this.type_extra_discount,
        value: this.value_extra_discount,
        reason: this.reason,
        selling_price: this.selling_price_in_modal,
        discount_on: this.discount_on,
      };
      this.slimLoadingBarService.start();
      this.reservationService.editSellingPrice(reservation.id, data).subscribe(
        (data: any) => {
          swal("Discount applied successfully", "", "success");
          this.type_extra_discount = "percentage";
          this.value_extra_discount = "";
          this.discount_on = "garage";
          this.reason = "";
          this.getReservation();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  /**
   * end of selling price
   */

  /**
   * Start of change selling date modal
   */

  openChangeSellingDateModal(reservation) {}

  closeChangeSellingDateModal() {}

  submitChangeSellingDateModal(reservation, modal) {
    if (!this.selling_date) swal("Selling date can not be empty", "", "error");
    else {
      const data = {
        selling_date: this.selling_date,
      };
      this.slimLoadingBarService.start();
      this.reservationService.changeSellingDate(reservation.id, data).subscribe(
        (data) => {
          modal.close();
          swal("Selling date changed successfully", "", "success");
          this.getReservation();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  submitChangeSellingPriceModal(price, maintenance_fees, modal) {
    if (!price) swal("Price can not be empty", "", "error");
    if (!maintenance_fees)
      swal("Maintenance Fees can not be empty", "", "error");
    else {
      const data = {
        price,
        maintenance_fees,
      };
      this.slimLoadingBarService.start();
      this.reservationService
        .changeSellingPrice(this.reservation_details.id, data)
        .subscribe(
          (data) => {
            modal.close();
            swal("Prices changed successfully", "", "success");
            this.getReservation();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }
  /**
   * End of change selling date modal
   */

  /**
   * Start of change selling date modal
   */

  openChangeConfirmationDateModal(reservation) {}

  closeChangeConfirmationDateModal() {}

  submitConfirmationDateModal(reservation, modal) {
    if (!this.confirmation_date)
      swal("Confirmation date can not be empty", "", "error");
    else {
      const data = {
        confirmation_date: this.confirmation_date,
      };
      this.slimLoadingBarService.start();
      this.reservationService
        .changeConfirmationDate(reservation.id, data)
        .subscribe(
          (data) => {
            modal.close();
            swal("Confirmation date changed successfully", "", "success");
            this.getReservation();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  /**
   * End of change selling date modal
   */

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
            this.getReservation();
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
   * Start of Installment Modal
   */

  createInstallmentForm() {
    this.installmentForm = this.fb.group({
      percentage: ["", Validators.required],
      slots: ["0", Validators.required],
      type: ["", Validators.required],
      day: ["5", Validators.required],
      doc_type: ["PDF", Validators.required],
      installment_plan: ["Quarter", Validators.required],
      installment_delay: [""],
    });
  }

  openInstallmentModal(reservation) {}

  closeInstallmentModal() {}

  submitInstallmentModal(reservation, modal) {
    const data = this.installmentForm.value;
    data.r_serial = reservation.id;
    console.log(data);
    /* call back end point here and dismiss loader in success */
    // this.is_installment_modal_loading = true;
    modal.close();
    this.reservationService.installmentPdf(data).subscribe(
      (res: any) => {
        modal.close();
        console.log(res.url);
        window.open(res.url);
        this.getPaymentCollection(this.reservation_details.id);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  /**
   * End of Installment Modal
   */

  /**
   * Start of accountant approve modal
   */

  accountantApproveModalOpen(reservation) {
    this.slip_customer = null;
  }

  accountantApproveModalClose() {}

  accountApprove(reservation, modal) {
    const payload: any = {
      amount_received: this.reservation_details.total_down_payment,
      slip_number: this.slip_number,
      type: this.slip_type,
      lead_id: this.slip_customer,
      cheque_number: this.cheque_number,
    };

    if (this.slip_type == 4) {
      payload.due_date = this.due_date;
      payload.bank_id = this.bank_id;
      payload.store_status = this.store_status;
    } else {
      payload.collection_date = this.collection_date;
    }
    if (this.payment_type == "deposit") {
      if (this.deposit_amount > this.reservation_details.total_down_payment) {
        swal(
          "error",
          "deposit amount is bigger than the down payment amount",
          "error"
        );
        return;
      } else if (!this.deposit_amount) {
        swal("error", "you must enter a deposit amount", "error");
        return;
      } else {
        payload.amount_received = this.deposit_amount;
      }
    } else if (this.payment_type == "down_payment") {
    }
    this.slimLoadingBarService.start();
    this.reservationService
      .accountantApprove(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.getReservation();
          this.payment_type = "down_payment";
          this.deposit_amount = null;
          this.slimLoadingBarService.complete();
          modal.close();
          swal("success", "Accountant approved successfully", "success");
        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
        }
      );
    // let data = {
    //   price: reservation.unit_price,
    //   is_edit_mode: false
    // };
    // this.slimLoadingBarService.complete();
    // this.reservationService.accountantApprove(reservation.id, data).subscribe(
    //   data => {
    //     swal('Accountant approved successfully', '', 'success');
    //     this.getReservation();
    //     modal.close();
    //   },
    //   err => this.errorHandlerService.handleErorr(err),
    //   () => this.slimLoadingBarService.complete()
    // );
  }

  addBankTransferFormData = {
    transfer_by: "",
    document_name: "",
    document_value: null,
  };

  addBankTransferModalOpen(form) {
    form.reset();
    this.addBankTransferFormData = {
      transfer_by: "",
      document_name: "",
      document_value: null,
    };
  }

  onBankTransferFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.addBankTransferFormData.document_name = file.name;
        this.addBankTransferFormData.document_value = (
          reader.result as any as any
        ).split(",")[1];
      };
    }
  }

  addBankTransfer(modal) {
    if (
      !(
        this.addBankTransferFormData.transfer_by &&
        this.addBankTransferFormData.document_name &&
        this.addBankTransferFormData.document_value
      )
    ) {
      swal("error", "Please fill the form.", "error");
      return;
    }
    this.slimLoadingBarService.start();
    this.reservationService
      .addBankTransfer(
        this.reservation_details.id,
        this.addBankTransferFormData
      )
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          modal.close();
          swal("success", "Bank Transfer Added Successfully.", "success");
        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  BanksTransfersFiles = [];

  ViewBankTransferModalOpen() {
    this.BanksTransfersFiles = [];
    this.slimLoadingBarService.start();
    this.reservationService
      .getBankTransfer(this.reservation_details.id)
      .subscribe(
        (res: any) => {
          this.BanksTransfersFiles = res;
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.slimLoadingBarService.reset();
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  // editPrice(last_price) {
  //   this.last_price = last_price;
  //   this.is_edit_mode_account_approve = true;
  // }

  // closeEditPrice(reservation_details) {
  //   console.log(reservation_details);
  //   reservation_details.unit_price = this.last_price;
  //   this.is_edit_mode_account_approve = false;
  // }

  editPriceUsingPercentage(event) {
    // console.log(+this.selling_price_in_modal);
    // if (this.price_precentage > 0) {
    //   this.selling_price_in_modal =
    //     ((+this.reservation_details.unit_price * +this.price_precentage) / 100) - +this.reservation_details.unit_price;
    // } else {
    //   this.selling_price_in_modal = this.reservation_details.unit_price;
    // }
  }

  sellingPriceChange(event) {
    // if (+this.selling_price_in_modal > 0) {
    //   this.price_precentage = (+this.selling_price_in_modal * 100) / +this.reservation_details.unit_price;
    // } else {
    //   this.price_precentage = 0;
    // }
  }

  checkNumber(event) {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    console.log(event.key);
    if (arr.indexOf(+event.key) == -1) event.preventDefault();
  }

  /**
   * End of accountant approve modal
   */

  /***
   * start of first modal
   * */

  handleReceiptFile(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.filesForm.get("receipt").patchValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  handleSignedFile(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name2 = file.name;
      reader.onload = () => {
        this.filesForm.get("signed").patchValue({
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
    const data: any = {
      id: reservationId,
      date: formModel.date,
    };
    if (formModel.receipt) {
      data.receipt = formModel.receipt.value;
      data.file_name = formModel.receipt.filename;
    }
    if (formModel.signed) {
      data.scan_url = formModel.signed.value;
      data.file_name2 = formModel.signed.filename;
    }
    console.log(data);
    this.reservationService.contractorApproved(data).subscribe(
      (data) => {
        console.log(data);
        this.getReservation();
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

  /***
   * end of first modal
   */

  /**
   * Start of Change Signature Modal
   */

  openChangeSignatureModal(reservation) {}

  closeChangeSignatureModal() {}

  submitChangeSignatureModal(reservation, modal) {
    if (!this.signature_date)
      swal("Signature date can not be empty", "", "error");
    else {
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
   * start of re-assign client modal
   */

  reAssignClientModalOpen(reservation) {}

  observableSource = (keyword: any): any => {
    const baseUrl: string = environment.api_base_url;
    const data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .get(`${baseUrl}leads?keyword=${keyword}`)
        .map((res: any) => {
          console.log(res.data.length);
          if (res.data.length == 0) {
            const arr = [];
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
            this.chosenClient = {
              lead_id: element.id,
              lead_name: element.name,
              lead_address: element.address,
              lead_home_phone: element.phone_2,
              lead_phone: element.phone,
              lead_birthday: element.date_of_birth,
              lead_email: element.email,
              lead_work_address: element.work_address,
              lead_national_id: element.national_num,
              lead_is_residence: element.is_residence,
              // deal_type: element.lead_channel.name,
              deal_type: element.lead_channel
                ? element.lead_channel.name
                : null,
              lead_source: element.lead_source,
              ambassador_id: element.ambassador_id,
              broker_id: element.broker_id,
            };

            if (element.broker_id) {
              this.chosenClient.broker_id = element.broker_id;
              delete this.chosenClient.ambassador_id;
            }
            if (element.ambassador_id) {
              this.chosenClient.ambassador_id = element.ambassador_id;
              delete this.chosenClient.broker_id;
            }
            console.log(this.documentForm.value);
            console.log(this.chosenClient);
            if (!element.ambassador_id && element.broker_id) {
              this.chosenClient.deal_category = "Individual";
            }

            console.log(element, this.chosenLead);
            this.chosenLeadID = element.id;
            found = true;
            this.chosenLeadName = element.name;
            this.chosenLeadPhone = element.phone;
            this.chosenLeadAddress = element.address;
            this.chosenLeadBirthday = element.date_of_birth;
            // this.chosenLeadCivilRegistery =
            this.chosenLeadIssueDate = element.national_issue_date;
            // this.chosenLeadDistrict = element.
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
    else {
      this.slimLoadingBarService.start();
      this.reservationService.reAssignToLead(this.chosenClient).subscribe(
        (res) => {
          this.getReservation();
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

  /***
   * start of Refund Admin Decline Modal
   */

  refundAdminDeclineModalSubmit(modal) {
    const payload = {
      refund_reason: this.refundReason,
    };
    if (!this.refundReason)
      swal("You have to provide a refund reason", "", "error");
    else {
      this.slimLoadingBarService.start();
      this.reservationService
        .adminDecline(this.reservation_details.id, JSON.stringify(payload))
        .subscribe(
          (data) => {
            swal("Woohoo!", "Declined Successfully!", "success");
            this.getReservation();
            modal.close();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  /***
   * End of Refund Admin Decline Modal
   */

  /***
   * Start of division modal
   */

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
    this.userService.getBorkers({ is_select_form: true }).subscribe(
      (data: any) => {
        this.brokers = data;
        console.log(this.brokers);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  changeEventModalSubmit(modal, event_id) {
    const payload = {
      event_id,
    };

    this.slimLoadingBarService.start();
    this.reservationService
      .changeEvent(this.reservation_details.id, payload)
      .subscribe(
        (res) => {
          swal("Event changes successfully", "", "success");
          modal.close();
          this.getReservation();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  divisionModalSubmit(modal) {
    const payload = this.divisionForm;
    // console.log(payload);
    payload.reservation_id = this.reservation_details.id;
    if (this.divisionForm.deal_type == "Direct") {
      // this.divisionForm.ambassador_id = "";
      // this.divisionForm.broker_id = "";
    } else {
      if (this.divisionForm.deal_source == "Broker") {
        this.divisionForm.ambassador_id = "";
      } else if (this.divisionForm.deal_source == "Ambassador") {
        this.divisionForm.broker_id = "";
      }
    }
    this.slimLoadingBarService.start();
    this.reservationService.changeDealType(payload).subscribe(
      (res) => {
        swal("Division changes successfully", "", "success");
        modal.close();
        this.getReservation();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );

    // if (this.divisionForm)
    //   swal("Division can not be empty", "", "error");
    // else {
    //   this.slimLoadingBarService.start();
    //   this.reservationService.changeDealType(payload).subscribe(
    //     (res) => {
    //       swal("Division changes successfully", "", "success");
    //       modal.close();
    //       this.getReservation();
    //     },
    //     (err) => this.errorHandlerService.handleErorr(err),
    //     () => this.slimLoadingBarService.complete()
    //   );
    // }
  }

  divisionModalClose() {}

  divisionModalOpen() {}

  openChangeDealType(modal) {
    modal.open();
    console.log(this.divisionForm.deal_type);
    this.channelChange(this.divisionForm.deal_type);
  }

  /***
   * End of division modal
   */

  /**
   * start of comission modal
   */

  commissionModalSubmit(modal) {
    if (!this.commission_date)
      swal("Commission date can not be empty", "", "error");
    else {
      const payload = {
        commission_date: this.commission_date,
        commission_to: this.commission_to,
      };
      this.slimLoadingBarService.start();
      this.reservationService
        .makeCommission(this.reservation_details.id, payload)
        .subscribe(
          (res) => {
            swal("Comission submited successfully", "", "success");
            modal.close();
            this.getReservation();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  /**
   * end of comission modal
   */

  /**
   * start of Claim modal
   */

  claimModalSubmit(modal) {
    if (!this.claim_form.claim_date)
      swal("Claim date can not be empty", "", "error");
    else {
      const payload = {
        claim_date: this.claim_form.claim_date,
        claim_from: this.claim_form.claim_from,
      };
      this.slimLoadingBarService.start();
      this.reservationService
        .makeClaim(this.reservation_details.id, payload)
        .subscribe(
          (res) => {
            swal("Claim submited successfully", "", "success");
            modal.close();
            this.getReservation();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  /**
   * end of Claim modal
   */

  garageSlotsModalOpen() {}

  garageSlotsModalClose() {}

  garageSlotsSubmit(modal) {
    if (!this.slots) swal("Number of slots must be entered", "", "error");
    else {
      const payload = {
        slots: this.slots,
        rf_id: this.reservation_details.id,
      };
      this.slimLoadingBarService.start();
      this.reservationService.changeGarageSlots(payload).subscribe(
        (res: any) => {
          modal.close();
          swal("Chanegd number of slots successfully", "", "success");
          this.getReservation();
        },
        (err) => console.log(err)
      );
    }
  }

  garageExtraSlotsSubmit(modal) {
    if (!this.extra_slots)
      swal("Number of Extra Slots must be entered", "", "error");
    else {
      const payload = {
        extra_slots: this.extra_slots,
        rf_id: this.reservation_details.id,
      };
      this.slimLoadingBarService.start();
      this.reservationService.changeExtraGarageSlots(payload).subscribe(
        (res: any) => {
          modal.close();
          swal("Chanegd number of Extra Slots successfully", "", "success");
          this.getReservation();
        },
        (err) => console.log(err)
      );
    }
  }

  storageSlotsModalOpen() {}

  storageSlotsModalClose() {}

  storageSlotsSubmit(modal) {
    if (!this.storage_slots)
      swal("Number of slots must be entered", "", "error");
    else {
      const payload = {
        storage_slots: this.storage_slots,
        rf_id: this.reservation_details.id,
      };
      this.slimLoadingBarService.start();
      this.reservationService.changeStorageSlots(payload).subscribe(
        (res: any) => {
          modal.close();
          swal("Chanegd number of storage slots successfully", "", "success");
          this.getReservation();
        },
        (err) => console.log(err)
      );
    }
  }

  addContractLogModalSubmit(modal, valid) {
    if (!valid) swal("Please fill the form", "", "error");
    else {
      this.addContractLog.reservation_id = this.reservationId;
      this.slimLoadingBarService.start();
      this.reservationService.addContractLog(this.addContractLog).subscribe(
        (res: any) => {
          modal.close();
          swal("Log Added", "", "success");
          this.getReservation();
        },
        (err) => console.log(err)
      );
    }
  }

  paymentTypeModalOpen() {}

  paymentTypeModalClose() {}

  paymentTypeSubmit(modal) {
    const payload = {
      payment_type: this.last_payment_type,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .changePaymentType(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.getReservation();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }
  paymentTermModalOpen() {}

  paymentTermModalClose() {}
  paymentTermSubmit(modal) {
    const payload = this.paymentForm.value;
    console.log(payload);
    this.slimLoadingBarService.start();
    this.reservationService
      .changePaymentTerm(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.getReservation();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  changePaymentMethod(event) {
    const paymentTermId = this.paymentForm.value.payment_term_id;
    console.log(this.methods, this.paymentForm.value.payment_term_id);
    const percentage = this.methods.find((meth) => {
      if (meth.id == paymentTermId) return meth;
    });
    console.log(percentage);
    this.percentage = percentage.downpayment_percentage;
  }

  overseasModalModalOpen() {}

  overseasModalModalClose() {}

  overseasModalSubmit(modal) {
    const payload = {
      is_overseas: this.is_overseas,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .changeOverseas(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.getReservation();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  editLeadModalModalOpen(leadId) {
    this.customer_id = leadId;
    this.reservation_details.sharing_leads.forEach((lead) => {
      if (lead.lead_id == this.customer_id) {
        this.single_customer = lead;

        this.edit_lead_data.lead_id = this.single_customer.lead_id;
        this.edit_lead_data.lead_religion = this.single_customer.lead_religion;
        this.edit_lead_data.lead_name = this.single_customer.lead_name;
        this.edit_lead_data.lead_phone = this.single_customer.lead_phone;
        this.edit_lead_data.lead_email = this.single_customer.lead_email;
        this.edit_lead_data.lead_national_id =
          this.single_customer.lead_national_id;
        this.edit_lead_data.lead_nationality =
          this.single_customer.lead_nationality;
        this.edit_lead_data.lead_other_phone =
          this.single_customer.lead_other_phone;
        this.edit_lead_data.lead_birthday = this.single_customer.lead_birthday;
        this.edit_lead_data.lead_address = this.single_customer.lead_address;
        this.edit_lead_data.lead_district = this.single_customer.lead_district;
        this.edit_lead_data.lead_gender = this.single_customer.lead_gender;
        this.edit_lead_data.lead_country = this.single_customer.lead_country;
        this.edit_lead_data.sharing_percentage =
          this.single_customer.sharing_percentage;
      }
    });
  }

  deleteLead(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this customer!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .deleteLead(this.reservation_details.id, id)
          .subscribe(
            (res: any) => {
              swal("Success", "Customer deleted successfully", "success");
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  editLeadModalModalClose() {}

  editLeadModalSubmit(lead_id, modal) {
    const payload = this.edit_lead_data;
    this.slimLoadingBarService.start();
    this.reservationService
      .editLeadInReservation(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          modal.close();
          swal("Customer Updated Successfully", "", "success").then(() => {
            this.getReservation();
          });
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  cancelReservationReasonModalSubmit(modal) {
    const payload = {
      cancel_reason: this.cancel_reason,
      cancel_date: this.cancel_date,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .cancelReservationReasonDate(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.getReservation();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  onCloseTeamTreeModalModalClose() {}

  reactivateReservation() {
    swal({
      title: "Are you sure?",
      text: "Re-activate this reservation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .reactivateReservation(this.reservation_details.id)
          .subscribe(
            (data) => {
              this.getReservation();
              swal("Woohoo!", "Re-activated succesfully!", "success");
              this.slimLoadingBarService.complete();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
            },
            () => this.slimLoadingBarService.complete()
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  /** Start of Change Contract Type Modal */

  get contractTypeFromContractForm() {
    return this.contractForm.get("contract_type").value;
  }

  contractTypeModalOpen() {}

  contractTypeModalClose() {}

  contractTypeModalSubmit(modal) {
    const payload = this.contractForm.value;
    this.slimLoadingBarService.start();
    this.reservationService
      .changeContractType(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          this.getReservation();
          this.slimLoadingBarService.complete();
          modal.close();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.reset();
        }
      );
  }
  /** End of Change Contract Type Modal  */

  changePaymentMethodToContract(event) {
    // this.methods.forEach(element => {
    //   if (element.plan_name == event) {
    //     this.reservation_fees = element.downpayment_percentage;
    //   }
    // });
  }

  getPaymentTermsByProjectId(project_id) {
    console.log(project_id);
    this.userService.getProjectPaymentTerms(project_id).subscribe(
      (res) => {
        const arr: any = res;
        this.payment_plans = arr;
        console.log(this.payment_plans);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  openUnitLAyoutGallery(images, index) {
    this._staticMasterPlanImages = [];
    for (let i = 0; i < images.length; i++) {
      const src = images[i].url;
      const caption = " ";
      const thumb = images[i].url;
      const album = {
        src: src,
        caption: caption,
        thumb: thumb,
      };
      this._staticMasterPlanImages.push(album);
    }
    console.log(this._staticMasterPlanImages);
    this._lightbox.open(this._staticMasterPlanImages, index);
  }

  prevSlide() {
    if (this.currentSlide == 0) {
      this.currentSlide =
        this.reservation_details.unit.layout_images.length - 1;
      return;
    } else if (this.currentSlide == 1) {
      this.currentSlide = 0;
      return;
    } else {
      this.currentSlide--;
      return;
    }
  }

  nextSlide() {
    if (
      this.currentSlide ==
      this.reservation_details.unit.layout_images.length - 1
    ) {
      this.currentSlide = 0;
      return;
    } else {
      this.currentSlide++;
      return;
    }
  }

  /*
   * Payment Collections Starts
   */
  pageChange(event) {
    console.log(event);
  }

  deleteSharedCommissionFromAgent(index) {
    this.sharedAgentsCommissions.removeAt(index);
  }

  overSeaContractSentModalOpen() {}

  overSeaContractSentModalubmit(modal) {
    if (!this.oversea_contract_sent_date) {
      swal("error", "enter oversea contract send date", "error");
    }
    const payload = {
      send_date: this.oversea_contract_sent_date,
    };
    this.slimLoadingBarService.start();
    swal({
      title: "Are you sure?",
      text: "Sent Oversea Contract!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .sentOverSeaContract(this.reservation_details.id, payload)
          .subscribe(
            (data) => {
              this.getReservation();
              swal(
                "Woohoo!",
                "Oversea contract date set successfully!",
                "success"
              );
              modal.close();
              this.slimLoadingBarService.complete();
            },
            (err) => {
              this.slimLoadingBarService.reset();
              this.errorHandlerService.handleErorr(err);
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  getPaymentCollection(reservation_id) {
    this.reservationService
      .getPaymentCollectionForAReservation(reservation_id)
      .subscribe(
        (res: any) => {
          this.payment_collections = res.map((c) => {
            if (c.receipts) {
              c.collect_types = Array.from(
                new Set(c.receipts.map((r) => r.type_string))
              ).join(", ");
            }
            c.db_date = c.date;
            return c;
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getFines(reservation_id) {
    this.reservationService
      .getReservationFines({
        filter_reservation: reservation_id,
        paginate: false,
      })
      .subscribe(
        (res: any) => {
          // remove data from fines
          this.fines = res.map((c) => {
            if (c.receipts) {
              c.collect_types = Array.from(
                new Set(c.receipts.map((r) => r.type_string))
              ).join(", ");
            }
            return c;
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }
  acceptPaymentCollection(collection_id, index) {
    swal({
      title: "Are you sure?",
      text: "You will collect!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, collect it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        const payload = {
          status: "collected",
        };
        this.slimLoadingBarService.start();
        this.reservationService
          .updatePaymentCollectionStatus(collection_id, payload)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              // this.getPaymentCollections();
              this.payment_collections[index].status = "collected";
              swal("success", "Accepted Payment Successfully", "success");
            },
            (err) => {
              this.slimLoadingBarService.reset();
              this.errorHandlerService.handleErorr(err);
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  rejectPaymentCollection(collection_id, index) {
    swal({
      title: "Are you sure?",
      text: "You will reject!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        const payload = {
          status: "rejected",
        };
        this.slimLoadingBarService.start();
        this.reservationService
          .updatePaymentCollectionStatus(collection_id, payload)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              // this.getPaymentCollections();
              this.payment_collections[index].status = "rejected";
              swal("success", "Rejected Payment Successfully", "success");
            },
            (err) => {
              this.slimLoadingBarService.reset();
              this.errorHandlerService.handleErorr(err);
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  onPaymentTypeChange() {
    if (this.payment_type == "down_payment") {
      this.deposit_amount = null;
    } else if (this.payment_type == "deposit") {
    }
  }
  /*
   * Payment Collections Ends
   */

  completeDownPaymentModalOpen(reservation_details) {}

  completeDownPaymentModalClose() {}

  completeDownPaymentSubmit(reservation_details, completeDownPaymentModal) {
    if (!this.complete_down_payment_amount) {
      swal("error", "you must enter an amount first", "error");
      return;
    } else {
      const payload: any = {
        amount_received: this.complete_down_payment_amount,
        slip_number: this.slip_number,
        type: this.slip_type,
        lead_id: this.slip_customer,
      };
      if (this.slip_type == 4) {
        payload.cheque_number = this.cheque_number;
      }
      this.slimLoadingBarService.start();
      this.reservationService
        .completeDownPayment(this.reservation_details.id, payload)
        .subscribe(
          (res: any) => {
            this.complete_down_payment_amount = null;
            this.slimLoadingBarService.complete();
            swal("success", "", "success");
            completeDownPaymentModal.close();
            this.getReservation();
          },
          (err) => {
            this.slimLoadingBarService.reset();
            this.errorHandlerService.handleErorr(err);
          }
        );
    }
  }

  printPaymentsPdf() {
    this.slimLoadingBarService.start();
    this.projectsService
      .printPaymentsPdf(this.reservation_details.id)
      .subscribe(
        (res: any) => {
          this.projectsService.printHtml(res.url);
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.slimLoadingBarService.reset();
          console.log(err);
        }
      );
  }

  printChequeModalSubmit() {
    if (this.bank_id) {
      const payload = {
        cheque_template_id: this.bank_id,
      };
      this.slimLoadingBarService.start();
      this.projectsService
        .printBankCheques(this.reservation_details.id, payload)
        .subscribe(
          (res: any) => {
            this.projectsService.printHtml(res.url);
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.slimLoadingBarService.reset();
            console.log(err);
          }
        );
    }
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

  getChequesTempaltes() {
    this.projectsService.getBanks().subscribe(
      (res: any) => {
        this.banks = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelSendOverseasContract() {
    swal({
      title: "Are you sure?",
      text: "You will cancel send overseas contract!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelSendOverseasContract(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Cancelled send overseas contract successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  cancelContractReview() {
    swal({
      title: "Are you sure?",
      text: "You will cancel contract review!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelContractReview(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Cancelled contract review successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  cancelContractSignedByClient() {
    swal({
      title: "Are you sure?",
      text: "You will cancel contract signed by client!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelContractSignedByClient(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Cancelled contract signed by client successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  cancelContractApprove() {
    swal({
      title: "Are you sure?",
      text: "You will cancel contract approve!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelContractApprove(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Cancelled contract approve successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  cancelContractDelivered() {
    swal({
      title: "Are you sure?",
      text: "You will cancel contract delivered!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelContractDelivered(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Cancelled contract delivered successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  contractToBeDelivered() {
    swal({
      title: "Are you sure?",
      text: "You will mark contract to be delivered!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .contractToBeDelivered(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Marked contract to be delivered successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  downloadReservation() {
    this.slimLoadingBarService.start();
    this.reservationService
      .downloadReservation(this.reservation_details.id)
      .subscribe(
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

  downloadFile(url) {
    window.open(url, "_blank");
  }

  exportFinalPaymentPlan() {
    this.reservationService
      .exportFinalPaymentPlan(this.reservation_details.id)
      .subscribe(
        (res: any) => {
          this.downloadFile(res);
        },
        (err) => {}
      );
  }

  importFinalPaymentPlan() {
    this.reservationService
      .importFinalPaymentPlan(
        this.reservation_details.id,
        this.finalPaymentPlanFile
      )
      .subscribe(
        (res) =>
          swal("Success", "Payment plan uploaded successfully", "success"),
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  onImportPlanChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.finalPaymentPlanFile = {
          file_name: file.name,
          file: (<string>reader.result).split(",")[1],
        };
        this.importFinalPaymentPlan();
      };
    }
  }

  cancelCommission() {
    swal({
      title: "Are you sure?",
      text: "You will cancel comissions!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelComissions(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal("Success", "Cancelled comissions successfully", "success");
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  cancelExtraDiscount() {
    swal({
      title: "Are you sure?",
      text: "You will cancel Extra Discount!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .cancelExtraDiscount(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Cancelled Extra Discount successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
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

  printFinalPaymentPlan() {
    this.slimLoadingBarService.start();
    this.reservationService
      .printFinalPaymentPlan(this.reservation_details.id)
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          window.open(res.url);
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  deleteFinalPaymentCollection() {
    swal({
      title: "Are you sure?",
      text: "You will delete the Final Payment Plan Collection!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .deleteFinalPaymentPlanCollection(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              swal(
                "Success",
                "Deleted Final Payment Plan Collection",
                "success"
              );
              this.getReservation();
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

  checkPhoneValid(event: any) {
    const pattren = /[0-9\+]/;
    console.log(event.keyCode);
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattren.test(inputChar)) {
      event.preventDefault();
    }
  }

  customerSource = (keyword: any): any => {
    const baseUrl: string = environment.api_base_url;
    const data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .get(`${baseUrl}leads?keyword=${keyword}&without_freezed=${true}`)
        .map((res: any) => {
          if (res.data.length == 0) {
            const arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.customersData = res.data;
            res.data.forEach((e) => {
              this.arrSearch.push(`${e.name} / ${e.id}`);
            });
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };
  getCustomerDetails(reservation) {
    console.log("chooosen", this.customersData);

    if (!this.chosenCustomer) {
      swal("Lead name can not be empty!");
    } else {
      if (this.customersData.length == 0) {
        swal("No Lead with that name.");
      } else {
        let found = false;
        this.customersData.forEach((element) => {
          const leadId = this.chosenCustomer.replace(/\s/g, "").split("/")[1];
          if (element.id == leadId) {
            this.addCustomerForm.lead_id = element.id;
            found = true;

            this.addCustomerForm.lead_name = element.name;
            this.addCustomerForm.lead_phone = element.phone;
            this.addCustomerForm.lead_email = element.email;
            this.addCustomerForm.lead_national_id = element.national_num;
            this.addCustomerForm.lead_religion = element.lead_religion;
            this.addCustomerForm.lead_nationality = element.national_num;
            this.addCustomerForm.lead_other_phone = element.phone_2;
            this.addCustomerForm.lead_birthday = element.date_of_birth;
            this.addCustomerForm.lead_address = element.address;
            this.addCustomerForm.lead_district = element.location;
            this.addCustomerForm.sharing_percentage =
              element.sharing_percentage;
          }
        });
        if (!found) swal("No Lead with that name.");
      }
    }
  }

  addCustomerModalOpen(reservation) {}

  addCustomerModalSubmit(reservation, modal) {
    if (!this.addCustomerForm.lead_id)
      swal(
        "Lead ID can not be empty",
        "Click on get info button to get the lead.",
        "error"
      );
    else if (!this.addCustomerForm.lead_phone)
      swal("Client Name can not be empty", "", "error");
    else if (!this.addCustomerForm.lead_name)
      swal("Client Phone can not be empty", "", "error");
    else {
      //call the back end point
      this.slimLoadingBarService.start();
      this.reservationService
        .addLead(reservation.id, this.addCustomerForm)
        .subscribe(
          (res) => {
            this.getReservation();
            swal("Customer added successfully", "", "success");
            this.chosenCustomer = "";

            //Set all object key to null after submission
            this.setNull(this.addCustomerForm);

            modal.close();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
          },
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  setNull(obj) {
    this.setAll(obj, null);
  }
  setAll(obj, val) {
    Object.keys(obj).forEach(function (index) {
      obj[index] = val;
    });
  }

  // ====== cheques book ======

  enablePaymentCollectionEdit(enable_or_disable: boolean): void {
    this.enable_edit_payment_collections = enable_or_disable;
    if (enable_or_disable) {
      this.onChequeAmountChanged();
    } else {
      this.getPaymentCollection(this.reservationId);
    }
  }

  // reminder
  oOpenEnableReminder(id, modal, type?) {
    if (id) this.current_active_cheque = id;
    if (type) this.enableRemiderType = type;
    else this.enableRemiderType = null;
    modal.open();
  }

  oOpenDisableReminder(id, modal, type?) {
    if (id) this.current_active_cheque = id;
    if (type) this.disableReminderType = type;
    else this.disableReminderType = null;
    modal.open();
  }

  enableSelectedReminder(modal) {
    const selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (selectedCheques.length == 0) {
      swal("warning", "There is no selected Cheques");
    } else {
      this.oOpenEnableReminder(null, modal, "multiple");
    }
  }

  disableSelectedReminder(modal) {
    const selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (selectedCheques.length == 0) {
      swal("warning", "There is no selected Cheques");
    } else {
      this.oOpenDisableReminder(null, modal, "multiple");
    }
  }

  // collect
  onOpenCollectCheque(id, modal, type?) {
    if (id) this.current_active_cheque = id;
    if (type) this.chequeCollectType = type;
    else this.chequeCollectType = null;
    console.log(this.chequeCollectType);
    modal.open();
  }

  collectSelectedCheque(modal) {
    const selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (selectedCheques.length == 0) {
      swal("warning", "There is no selected Cheques");
    } else {
      this.collect_type = "fully-collected";
      this.onOpenCollectCheque(null, modal, "multiple");
    }
  }

  // reject
  onOpenRejectCheque(id, modal, type?) {
    if (id) this.current_active_cheque = id;
    if (type) this.chequeRejectType = type;
    else this.chequeRejectType = null;
    console.log(this.chequeRejectType);
    modal.open();
  }

  rejectSelectedCheque(modal) {
    const selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    if (selectedCheques.length == 0) {
      swal("warning", "There is no selected Cheques");
    } else {
      this.collect_type = "fully-collected";
      this.onOpenRejectCheque(null, modal, "multiple");
    }
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

  onCheckAllToggleFines(event) {
    this.check_all = event;
    this.fines.forEach((e) => {
      if (this.check_all) {
        e.checked = true;
      } else {
        e.checked = false;
      }
    });
  }

  onBankBlur(event, index) {
    this.payment_collections.forEach((payment, payment_index) => {
      if (payment_index > index) {
        this.payment_collections[payment_index].bank_id =
          this.payment_collections[index].bank_id;
      }
    });
  }
  onStoreBankBlur(event, index) {
    this.payment_collections.forEach((payment, payment_index) => {
      if (payment.status === "cancelled") return;
      if (payment_index > index) {
        this.payment_collections[payment_index].store_status =
          this.payment_collections[index].store_status;
      }
    });
  }

  onChequeNumberBlur(event, index) {
    if (typeof this.payment_collections[index].cheque_number == "number") {
      this.payment_collections.forEach((payment, payment_index) => {
        if (payment_index > index) {
          this.payment_collections[payment_index].cheque_number =
            this.payment_collections[payment_index - 1].cheque_number + 1;
        }
      });
    }
  }

  onOpenUploadScannedCheque(id, modal) {
    this.current_active_cheque = id;
    modal.open();
  }

  savePaymnetcollection() {
    this.disableSavePaymentCollection = true;
    this.slimLoadingBarService.start();
    this.projectsService
      .updateChequeBook(this.reservation_details.id, this.payment_collections)
      .subscribe(
        (res: any) => {
          this.disableSavePaymentCollection = false;
          this.enablePaymentCollectionEdit(false);
          this.getReservation();
          swal("Success", "", "success");
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.disableSavePaymentCollection = false;
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }

  onChequeAmountChanged() {
    this.totalChequeBookAmount = 0;
    this.totalCDBAmount = 0;
    this.payment_collections.map((c) => {
      if (c.status === "cancelled") return;
      if (
        c.installment_type == "Down Payment" ||
        c.installment_type == "Installment"
      )
        this.totalChequeBookAmount += +c.amount || 0;
      else if (c.installment_type == "CDB")
        this.totalCDBAmount += +c.amount || 0;
    }, 0);
  }

  DATE_FORMAT = "yyyy-MM-dd";
  onChequeDateChanged(event, index) {
    const date = parse(
      this.payment_collections[index].date,
      this.DATE_FORMAT,
      new Date()
    );
    const db_date = parse(
      this.payment_collections[index].db_date,
      this.DATE_FORMAT,
      new Date()
    );

    let day_of_month = getDate(date);
    console.log(day_of_month);

    const monthsDiff = differenceInCalendarMonths(date, db_date);
    this.payment_collections.forEach((payment, payment_index) => {
      if (payment.status === "cancelled") return;
      if (payment_index > index) {
        let current_date = parse(payment.db_date, this.DATE_FORMAT, new Date());
        current_date = setDate(current_date, 1);
        current_date = addMonths(current_date, monthsDiff);

        let last_day_of_month = getDate(lastDayOfMonth(current_date));

        current_date = setDate(
          current_date,
          day_of_month > last_day_of_month ? last_day_of_month : day_of_month
        );

        payment.date = format(current_date, this.DATE_FORMAT);
      }
    });
  }

  submitPrintPaymentCollectioModal(modal) {
    const payload = {
      developer_id: +this.developer_id,
      cheque_book_name: this.cheque_book_name,
      name_on_cheques: this.name_on_cheques,
    };
    this.slimLoadingBarService.start();
    this.projectsService
      .printChequBook(this.reservation_details.id, payload)
      .subscribe(
        (res: any) => {
          window.open(res.url);
          swal("Success", "", "success");
          this.slimLoadingBarService.complete();
          modal.close();
          this.getReservation();
          modal.close();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }

  submitEnableReminder(modal) {
    let payload;
    if (this.enableRemiderType == "multiple") {
      const selectedCheques = this.payment_collections.filter(
        (list) => list.checked == true
      );
      payload = {
        ids: selectedCheques.map((cheque) => cheque.id),
        send_reminder: 1,
        reminder_reason: this.reminder_reason,
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        send_reminder: 1,
        reminder_reason: this.reminder_reason,
      };
    }
    this.slimLoadingBarService.start();
    this.reservationService
      .enableOrDisableReminderCheque(this.reservationId, payload)
      .subscribe(
        (res: any) => {
          modal.close();
          this.reminder_reason = "";
          this.getReservation();
          this.onCheckAllToggle(false);
          this.enableRemiderType = null;
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  submitDisableReminder(modal) {
    let payload;
    if (this.disableReminderType == "multiple") {
      const selectedCheques = this.payment_collections.filter(
        (list) => list.checked == true
      );
      payload = {
        ids: selectedCheques.map((cheque) => cheque.id),
        send_reminder: 0,
        reminder_reason: this.reminder_reason,
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        send_reminder: 0,
        reminder_reason: this.reminder_reason,
      };
    }
    this.slimLoadingBarService.start();
    this.reservationService
      .enableOrDisableReminderCheque(this.reservationId, payload)
      .subscribe(
        (res: any) => {
          modal.close();
          this.reminder_reason = "";
          this.getReservation();
          this.onCheckAllToggle(false);
          this.disableReminderType = null;
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  deleteFine(id) {
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
          ids: id,
        };
        this.slimLoadingBarService.start();
        this.reservationService
          .deleteReservationFine(this.reservation_details.id, payload)
          .subscribe(
            (res: any) => {
              swal("Success", "Deleted Fine successfully", "success");
              this.slimLoadingBarService.complete();
              this.getFines(this.reservation_details.id);
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

  submitRejectCheque(modal) {
    let payload;
    if (this.chequeRejectType == "multiple") {
      const selectedCheques = this.payment_collections.filter(
        (list) => list.checked == true
      );
      payload = {
        ids: selectedCheques.map((cheque) => cheque.id),
        status: "bounced",
        reject_reason: this.reject_reason,
        reject_comment:
          this.reject_reason == "other" ? this.reject_comment : "",
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        status: "bounced",
        reject_reason: this.reject_reason,
        reject_comment:
          this.reject_reason == "other" ? this.reject_comment : "",
      };
    }
    this.slimLoadingBarService.start();
    this.reservationService
      .collectCheque(this.reservationId, payload)
      .subscribe(
        (res: any) => {
          modal.close();
          this.current_active_cheque = null;
          this.cheque_amount = null;
          this.reject_reason = null;
          this.reject_comment = null;
          this.getReservation();
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
    date: "",
    partially_method: "",
    cheque_number: "",
    store_status: null,
    bank_id: null,
    currency_code: "EGP",
  };
  onOpenCancelCheque(id, modal) {
    this.current_active_cheque = id;
    modal.open();
  }

  cancelModalSubmitting = false;
  submitCancelCheque(modal) {
    if (this.cancelModalSubmitting) return;

    let payload;
    if (this.cancle_formdata.cancel_for === "under-collection") {
      payload = {
        ids: [this.current_active_cheque],
        status: "cancelled",
      };
    } else {
      let payload = {
        ids: [this.current_active_cheque],
        status: "cancelled",
        early_payment_discount: this.cancle_formdata.early_payment_discount,
        date: this.cancle_formdata.date,
        partially_method: this.cancle_formdata.partially_method,
        cheque_number: this.cancle_formdata.cheque_number,
        currency_code: this.cancle_formdata.currency_code,
        bank_id: this.cancle_formdata.bank_id,
        store_status: this.cancle_formdata.store_status,
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
          };
          this.current_active_cheque = null;
          modal.close();
          this.getReservation();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.collectModalSubmitting = false;
      });
  }

  collectModalSubmitting = false;
  submitCollectCheque(modal) {
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
      };
    } else {
      payload = {
        ids: [this.current_active_cheque],
        status: this.collect_type,
        lead_id: this.chequeCollectCustomer,
        partially_method: this.partially_method,
        collection_date: this.collection_date,
      };
      if (this.collect_type == "partially-collected") {
        payload.amount_received = this.cheque_amount;
        if (payload.partially_method == "3") {
          payload.partially_data = this.partially_data;
        }
      }
    }
    this.collectModalSubmitting = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .collectCheque(this.reservationId, payload)
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
          this.getReservation();
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

  uploadScannedChequeSubmit(modal) {
    this.slimLoadingBarService.start(() => {
      console.log("Loading complete");
    });
    const formModel = Object.assign({}, this.uploadScannedChequeForm.value);
    console.log(formModel);
    if (!formModel.scannedCheque) {
      swal("Oops...", "Files can not be empty!", "error");
    } else {
      const data = {
        // receipt: formModel.receipt.value,
        // scan_url: formModel.signed.value,
        // id: reservationId,
        // file_name2: formModel.signed.filename,
        // file_name: formModel.receipt.filename,
        image_value: formModel.scannedCheque.value,
        image_name: formModel.scannedCheque.filename,
      };
      console.log(data);
      this.reservationService
        .uploadScannedCheque(this.current_active_cheque, data)
        .subscribe(
          (data) => {
            console.log(data);
            this.getReservation();
            this.getPaymentCollection(this.reservationId);
            this.slimLoadingBarService.complete();
            modal.close();
            this.uploadScannedChequeForm.reset();
            swal("Woohoo!", "Contractor Approved!", "success");
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
    }
  }

  handleUploadScannedCheque(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        // this.filesForm.get("receipt").setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: (reader.result as any).split(",")[1],
        // });
        this.uploadScannedChequeForm.get("scannedCheque").setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any).split(",")[1],
        });
      };
    }
  }

  printSelectedCheque() {
    const selectedCheques = this.payment_collections.filter(
      (list) => list.checked == true
    );
    const payload = {
      ids: selectedCheques.map((cheque) => cheque.id),
    };
    this.reservationService.printCheques(this.reservationId, payload).subscribe(
      (res: any) => {
        const WindowPrt = window.open(res.url, "", "");
        WindowPrt.focus();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  printCheque(id) {
    const payload = {
      ids: [id],
    };
    this.reservationService.printCheques(this.reservationId, payload).subscribe(
      (res: any) => {
        const WindowPrt = window.open(res.url, "", "");
        WindowPrt.focus();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  showCheque(id) {
    const payload = {
      ids: [id],
      print_status: 1,
    };
    this.reservationService
      .hideOrShowCheque(this.reservationId, payload)
      .subscribe(
        (res: any) => {
          this.getPaymentCollection(this.reservationId);
          this.slimLoadingBarService.complete();
          swal("success", "Show successfully", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.reset();
        }
      );
  }

  hideCheque(id) {
    const payload = {
      ids: [id],
      print_status: 0,
    };
    this.reservationService
      .hideOrShowCheque(this.reservationId, payload)
      .subscribe(
        (res: any) => {
          this.getPaymentCollection(this.reservationId);
          swal("success", "Hide successfully", "success");
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.reset();
        }
      );
  }

  getdevelopers() {
    this.slimLoadingBarService.start();
    this.userService.getDevelopers().subscribe(
      (data: any) => {
        this.developers = data;
        console.log(this.developers);
      },
      (err) => {},
      () => this.slimLoadingBarService.complete()
    );
  }

  async uploadScanned(event: any, document_id: number, fileInput) {
    let scanned_document_files_uploads = [];
    let selectedFiles = event.target.files;
    let onParsingEnd = new Promise((resolve, reject) => {
      for (let i = 0; i < selectedFiles.length; i++) {
        let file = selectedFiles[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          let attach = {
            name: file.name,
            type: file.type,
            src: (reader.result as any as any).split(",")[1],
          };
          await scanned_document_files_uploads.push(attach);
          if (i + 1 == selectedFiles.length)
            resolve(scanned_document_files_uploads);
        };
      }
    });
    onParsingEnd.then((data) => {
      console.log(data);
      this.slimLoadingBarService.start();
      this.reservationService
        .uploadScannedFiles(this.reservationId, document_id, {
          scanned_files: data,
        })
        .subscribe(
          (res) => {
            console.log(fileInput);
            fileInput.value = null;
            this.slimLoadingBarService.complete();
            this.getReservationsDocuments();
            swal("Success", "scanned document added successfully", "success");
          },
          (err) => {
            this.slimLoadingBarService.reset();
          }
        );
    });
  }

  applyScanned(id) {
    console.log(id);
    this.slimLoadingBarService.start();
    this.reservationService.applyScanned(this.reservationId, id).subscribe(
      (res) => {
        swal("Success", "apply scanned successfully", "success");
        this.slimLoadingBarService.complete();
        this.getReservationsDocuments();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  goToLead(lead_id) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/pages/leads`], {
        queryParams: {
          lead_id: lead_id,
        },
      })
    );

    window.open(url, "_blank");
  }

  goToReservation(reservation) {
    const role = this.userProfile.role;
    console.log(role);
    let url;
    if (
      role == "Helpdesk Supervisor" ||
      role == "Helpdesk Agent" ||
      role == "Call Center" ||
      role == "Helpdesk Agent"
    ) {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/pages/project/view-reservation`], {
          queryParams: {
            ro: 1,
            id: reservation.id,
          },
        })
      );
    } else {
      url = this.router.serializeUrl(
        this.router.createUrlTree([`/pages/project/view-reservation`], {
          queryParams: {
            id: reservation.id,
          },
        })
      );
    }

    window.open(url, "_blank");
  }

  addChequeBook(modal) {
    this.slimLoadingBarService.start();
    this.reservationService
      .addCheque(this.reservationId, this.add_cheque)
      .subscribe(
        (res) => {
          this.slimLoadingBarService.complete();
          modal.close();
          swal("Success", "Cheque added successfully", "success");
          this.getPaymentCollection(this.reservationId);
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
  }

  // collect fine
  onOpenCollectChequeFine(id, modal, type?) {
    if (id) this.current_active_cheque_fine = id;
    if (type) this.chequeCollectTypeFine = type;
    else this.chequeCollectTypeFine = null;
    console.log(this.chequeCollectTypeFine);
    modal.open();
  }

  collectFinesModalSubmitting = false;
  submitCollectChequeFine(modal) {
    if (this.collectFinesModalSubmitting) return;
    let payload;
    if (this.chequeCollectTypeFine == "multiple") {
      const selectedFines = this.fines.filter((list) => list.checked == true);
      payload = {
        ids: selectedFines.map((cheque) => cheque.id),
        status: this.collect_type_fines,
        lead_id: this.chequeCollectCustomerFines,
        partially_method: this.partially_method_fines,
        collection_date: this.collection_date_fines,
        currency_code: this.currency_code,
      };
    } else {
      payload = {
        ids: [this.current_active_cheque_fine],
        status: this.collect_type_fines,
        lead_id: this.chequeCollectCustomerFines,
        partially_method: this.partially_method_fines,
        collection_date: this.collection_date_fines,
        currency_code: this.currency_code,
      };
      if (this.collect_type_fines == "partially-collected") {
        payload.is_partially_collect = true;

        payload.amount_received = this.cheque_amount_fines;
        if (payload.partially_method == "3") {
          payload.partially_data = this.partially_data_fines;
        }
      }
    }
    this.collectFinesModalSubmitting = true;
    this.slimLoadingBarService.start();
    this.reservationService
      .collectChequeFine(this.reservationId, payload)
      .subscribe(
        (res: any) => {
          swal("Woohoo!", "Collected!", "success");
          modal.close();
          this.collect_type_fines = null;
          this.current_active_cheque_fine = null;
          this.cheque_amount_fines = null;
          this.partially_method_fines = null;
          this.partially_data_fines = null;
          this.collection_date_fines = "";
          this.chequeCollectCustomerFines = "";
          this.getReservation();
          this.onCheckAllToggleFines(false);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.collectFinesModalSubmitting = false;
      });
  }

  cdb_form = {
    amount: 0,
    date: "",
  };

  // Add CDB Form
  openaddCDB() {
    this.cdb_form = {
      amount: 0,
      date: "",
    };
  }

  submitaddCDB(modal) {
    this.slimLoadingBarService.start();
    this.reservationService
      .addCDB(this.reservationId, this.cdb_form)
      .subscribe(
        (res: any) => {
          swal("Woohoo!", "Collected!", "success");
          modal.close();
          this.getPaymentCollection(this.reservationId);
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

  submitting_add_fine = false;
  addDelayFineToCheque(modal) {
    this.add_fineModal.submitting = true;
    this.slimLoadingBarService.start();
    this.submitting_add_fine = true;
    this.reservationService
      .addDelayFine(
        this.add_fineModal.reservaton_id,
        this.add_fineModal.payload
      )
      .subscribe(
        (res: any) => {
          swal("Success", "", "success");
          this.getPaymentCollection(this.reservationId);
          modal.close();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.submitting_add_fine = false;
      });
  }

  deleteCheque(id) {
    let payload = {
      ids: [id],
    };
    this.slimLoadingBarService.start();
    this.reservationService.deleteCheque(payload).subscribe(
      (res) => {
        this.slimLoadingBarService.complete();
        swal("success", "Cheque deleted successfully", "success");
        this.getPaymentCollection(this.reservationId);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  reserAccountantApprove(id) {
    this.slimLoadingBarService.start();
    swal({
      title: "Are you sure?",
      text: "You will reset accountant approve!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .resetAccountantApprove(this.reservation_details.id)
          .subscribe(
            (res: any) => {
              swal(
                "Success",
                "Reset accountant approve successfully",
                "success"
              );
              this.slimLoadingBarService.complete();
              this.getReservation();
              this.getPaymentCollection(this.reservation_details.id);
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

  addOldCustomerSubmit(modal) {
    if (!this.addCustomerForm.lead_id)
      swal(
        "Lead ID can not be empty",
        "Click on get info button to get the lead.",
        "error"
      );
    else if (!this.addCustomerForm.lead_phone)
      swal("Client Name can not be empty", "", "error");
    else if (!this.addCustomerForm.lead_name)
      swal("Client Phone can not be empty", "", "error");
    else {
      console.log(this.addCustomerForm);
      this.slimLoadingBarService.start();
      this.reservationService
        .addOldCustomer(this.reservationId, this.addCustomerForm)
        .subscribe(
          (res) => {
            this.slimLoadingBarService.complete();
            this.getReservation();
            swal("Old Customer added successfully", "", "success");
            this.addCustomerForm.lead_id = null;
            this.addCustomerForm.lead_name = null;
            this.addCustomerForm.lead_phone = null;
            this.addCustomerForm.lead_email = null;
            this.addCustomerForm.lead_national_id = null;
            this.addCustomerForm.lead_religion = null;
            this.addCustomerForm.lead_nationality = null;
            this.addCustomerForm.lead_other_phone = null;
            this.addCustomerForm.lead_birthday = null;
            this.addCustomerForm.lead_address = null;
            this.addCustomerForm.lead_district = null;
            this.addCustomerForm.sharing_percentage = null;
            modal.close();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  addLegalActionSubmit(modal) {
    let payload = {
      legal_type: this.legal_type,
      legal_note: this.legal_note,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .addLegalAction(this.reservationId, payload)
      .subscribe(
        (res) => {
          this.slimLoadingBarService.complete();
          this.getReservation();
          this.legal_type = null;
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  addHandoverActionSubmit(modal) {
    let payload = {
      handover_status: this.handover_status,
      handover_date: this.handover_date,
    };
    this.slimLoadingBarService.start();
    this.reservationService
      .addHandoverAction(this.reservationId, payload)
      .subscribe(
        (res) => {
          this.slimLoadingBarService.complete();
          this.getReservation();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  deleteOldCustomer(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this old customer!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.reservationService
          .deleteOldCustomer(this.reservation_details.id, id)
          .subscribe(
            (data) => {
              swal("Success", "Deleted old customer successfully", "success");
              this.slimLoadingBarService.complete();
              this.getReservation();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.reset();
            }
          );
      }
    });
  }

  openEditOldCustomerModa(modal, old_customer) {
    this.old_customer = {
      id: old_customer.id,
      lead_name: old_customer.lead_name,
      lead_phone: old_customer.lead_phone,
      lead_email: old_customer.lead_email,
      lead_national_id: old_customer.lead_national_id,
      lead_nationality: old_customer.lead_nationality,
      lead_other_phone: old_customer.lead_other_phone,
      lead_birthday: old_customer.lead_birthday,
      lead_address: old_customer.lead_address,
      lead_district: old_customer.lead_district,
      sharing_percentage: old_customer.sharing_percentage,
    };
    modal.open();
  }

  submitChangeBasementModal(reservation, modal) {
    let data = {
      has_basement: this.has_basement,
      basement_area: this.basement_area,
      basement_price: this.basement_price,
      reservation_id: this.reservation_details.id,
    };
    this.slimLoadingBarService.start();
    this.reservationService.changeBasement(data).subscribe(
      (res) => {
        modal.close();
        swal("Basement data changed successfully", "", "success");
        this.getReservation();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getTicketDescription(ticket: Ticket): string {
    const desc = ticket.description || "-";
    return desc.length <= 20 ? desc : `${desc.slice(0, 20)}...`;
  }

  goToTicketView(id, resolved?: boolean, no_actions: boolean = false) {
    let qParams = {};
    if (resolved) qParams["type"] = "resolved";
    if (no_actions) qParams["no_actions"] = no_actions;
    this.router.navigate([`/pages/view-ticket/${id}`], {
      queryParams: qParams,
    });
  }

  goToEditTicket(id) {
    this.router.navigate([`/pages/edit-ticket/${id}`], {
      queryParams: { reservation_id: this.reservationId },
    });
  }

  assignBrokerIncentive(modal) {
    const payload = {
      broker_incentive_id: this.broker_incentive_id,
    };
    this.slimLoadingBarService.start();
    this.userService
      .assign_broker_incentive(this.reservation_details.id, payload)
      .subscribe(
        (res) => {
          swal("Assign Broker Incentive Successfully", "", "success");
          this.getReservation();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }
}
