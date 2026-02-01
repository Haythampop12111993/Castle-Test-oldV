import { ReservationService } from "./../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Component, OnInit } from "@angular/core";
import { PaymentService } from "../services/payment/payment.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { ProjectsService } from "../services/projects/projects.service";
import "rxjs/add/observable/of";
import { HttpClient } from "@angular/common/http";
import swal from "sweetalert2";
import {
  generate_template,
  print_template,
} from "../shared/helpers/print_helpers";
import { printContract } from "./contractPrint";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-contract-generate",
  templateUrl: "./contract-generate.component.html",
  styleUrls: ["./contract-generate.component.css"],
})
export class ContractGenerateComponent implements OnInit {
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));

  reservation: any;
  payment_collections: any;
  reservation_id: any;

  formData = {
    delegation_of_management_id: null,
    initial_delivery_date: "",
    final_delivery_date: "",
    parking_numbers: "",
    storage_numbers: "",
    additional_section: "",
  };

  project_id: any;

  is_loading: boolean = false;

  contractForm = [];

  sharing_leads: any;
  types: any = ["National ID", "Passport"];
  // contractsTemplates = [];

  contracts: any;

  contractData;

  editorConfig = {
    skin: false,
    inline_styles: false,
    base_url: `${environment.baseHREF}tinymce`,
    suffix: ".min",
    height: 300,
    directionality: "ltr",
    toolbar: `fullscreen | code |preview | formatselect | a11ycheck ltr rtl | alignleft aligncenter alignright alignjustify | undo redo | bold italic underline | outdent indent |  numlist bullist checklist | casechange permanentpen formatpainter removeformat | fullscreen  preview print | media pageembed link`,
    menubar: "custom",
  };
  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.reservation_id = +params["id"] || 0;
      this.project_id = +params["project_id"];
      this.fetchReservation();
      this.fetchPaymentCollection();
    });
  }

  fetchReservation() {
    this.reservationService.getSingleReservation(this.reservation_id).subscribe(
      (data: any) => {
        this.reservation = data.data[0];
        this.sharing_leads = data.data[0].sharing_leads;
        this.fetchContract();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  fetchPaymentCollection() {
    this.reservationService
      .getPaymentCollectionForAReservation(this.reservation_id)
      .subscribe(
        (res: any) => {
          this.payment_collections = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  fetchContract() {
    this.reservationService.getContract(this.reservation_id).subscribe(
      (data: any) => {
        this.contractData = data;
        this.createForm(this.contractData);
        if (this.contractData.length > 0) {
          this.formData = {
            delegation_of_management_id:
              this.contractData[0].delegation_of_management_id,
            initial_delivery_date: this.contractData[0].initial_delivery_date,
            final_delivery_date: this.contractData[0].final_delivery_date,
            parking_numbers: this.contractData[0].parking_numbers,
            storage_numbers: this.contractData[0].storage_numbers,
            additional_section: this.contractData[0].additional_section,
          };
        }
      },
      (err) => {
        this.createForm();
      },
      () => {}
    );
  }

  createForm(data?) {
    this.sharing_leads.map((lead) => {
      let cur;
      if (data) {
        cur = data.find((r) => r.lead_id == lead.lead_id);
      }
      if (cur) {
        this.contractForm.push({
          client_name_ar: cur.name_ar,
          client_address_ar: cur.address_ar,
          client_mailing_address_ar: cur.client_mailing_address_ar,
          client_nationality_ar: cur.nationality_ar,
          client_nationality_id: cur.national_id,
          client_email: cur.client_email,
          client_phone: cur.client_phone,
          client_whatsapp: cur.client_whatsapp,
          lead_id: lead.lead_id,
          sharing_percentage: cur.sharing_percentage,
        });
      } else {
        this.contractForm.push({
          client_name_ar: lead.lead_name,
          client_address_ar: lead.lead_address,
          client_mailing_address_ar: "",
          client_nationality_ar: lead.lead_nationality,
          client_nationality_id: lead.lead_national_id,
          client_email: lead.lead_email,
          client_phone: lead.lead_phone,
          client_whatsapp: lead.lead_phone,
          lead_id: lead.lead_id,
          sharing_percentage: lead.sharing_percentage,
        });
      }
    });
  }

  generateContract() {
    let data = {
      reservation_id: this.reservation_id,
      clients: this.contractForm,
      contract_html: this.generateHTML(),
      ...this.formData,
    };
    this.is_loading = true;
    this.reservationService.generateContract(data).subscribe(
      (res: any) => {
        swal("Success!", "", "success");
        this.contractData = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => (this.is_loading = false)
    );
  }

  openContract(url) {
    window.open(url);
  }

  generateHTML() {
    return generate_template(
      printContract,
      this.reservation,
      this.contractForm,
      this.payment_collections,
      this.formData
    );
  }

  printContract() {
    print_template(
      printContract,
      this.reservation,
      this.contractForm,
      this.payment_collections,
      this.formData
    );
  }
}
