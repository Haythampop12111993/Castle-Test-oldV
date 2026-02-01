import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { UserServiceService } from "../../services/user-service/user-service.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { MarketingService } from "../../services/marketing/marketing.service";
import { EoiService } from "../../services/eoi/eoi.service";
import { ProjectsService } from "../../services/projects/projects.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-eoi-view",
  templateUrl: "./eoi-view.component.html",
  styleUrls: ["./eoi-view.component.css"],
})
export class EoiViewComponent implements OnInit {
  eoi_id: any;
  eoi_details: any;
  userProfile: any;
  dataFromSearch: any;
  refundReason: any;
  refundReasons: any = [
    "Financial issue",
    "Personal issue",
    "Activate by Mistake",
    "Contract details",
    "Rejected Cheques",
  ];
  channels: any;
  channel: any;
  lead_channel: any;
  lead_source: any;
  leadSources: any;
  edit_lead_data = {
    lead_name: "",
    lead_nationality: "",
    lead_national_id: "",
    lead_address: "",
    lead_birthday: undefined,
    lead_district: "",
    lead_email: "",
    lead_arabic_name: "",
    lead_job_title: "",
    lead_issue_date: "",
    lead_workplace: "",
  };
  edit_eoi_data = {
    interested_type: "",
    interested_area_from: "",
    interested_area_to: "",
    phase: "",
    eoi_value: "",
  };
  confirmation_date: any;
  chosenLeadID: any;
  leadArrSerach: any;
  chosenLead: any;
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
  agent_in_charge: any;
  agents: any;
  deal_types: any = ["Direct", "In-Direct"];
  direct_option: any = ["Individual", "Ambassador"];
  deal_type: any;
  ambassadors: any;
  brokers: any;
  searchedBrokers: any;
  is_overseas: any;
  last_payment_type: any;
  paymentForm: FormGroup;
  selling_price: any;
  price_precentage: any;
  percentage: any;
  reason: any;
  selling_price_in_modal: any;
  selling_date: any;
  signature_date: any;
  commentEoi: any;
  payment_types: any;

  projects: any;

  reservations: any = [
    {
      id: 12,
    },
    {
      id: 23,
    },
  ];

  divisionForm: any = {};
  channelview: any;
  require_channels = [];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private userService: UserServiceService,
    private leadsService: LeadsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private marketingService: MarketingService,
    private eoiService: EoiService,
    private projectService: ProjectsService
  ) {
    this.userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
  }

  ngOnInit() {
    this.getProjects();
    this.getChannels();
    this.getAmbassadors();
    this.getAllAgents();
    this.getBrokers();
    this.getPaymentTypes();
    this.activatedRoute.params.subscribe((res: any) => {
      console.log(res);
      this.eoi_id = res.id;
      this.getEoi(this.eoi_id);
    });
    this.paymentForm = this.fb.group({
      percentage: [{ value: "", disabled: true }, Validators.required],
      payment_term_id: ["", Validators.required],
    });
  }

  getPaymentTypes() {
    this.slimLoadingBarService.start();
    this.eoiService.getPaymentTypes().subscribe(
      (res: any) => {
        this.payment_types = res;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
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

  getEoi(id?) {
    this.slimLoadingBarService.start();
    this.eoiService.getEoi(id || this.eoi_id).subscribe(
      (res: any) => {
        this.eoi_details = res;
        // this.agent_in_charge = res.agent_in_charge;
        if (res.agent_in_charge)
          this.agent_in_charge = this.agents.find(
            (a) => a.id == res.agent_in_charge
          );

        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  //Operationstab functions
  refundAdminDeclineModalSubmit(modal) {
    let payload = {
      refund_reason: this.refundReason,
    };
    if (!this.refundReason)
      swal("You have to provide a refund reason", "", "error");
    else {
      this.slimLoadingBarService.start();
      this.eoiService
        .refundEOI(this.eoi_details.id, JSON.stringify(payload))
        .subscribe(
          (data) => {
            swal("Woohoo!", "Refunded Successfully!", "success");
            this.getEoi(this.eoi_id);
            modal.close();
          },
          (err) => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
    }
  }

  accountantApprove() {
    swal({
      title: "Are you sure?",
      text: "You will approve the EOI!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.eoiService
          .approveEoi(this.eoi_details.id)
          .subscribe((res: any) => {
            swal("Woohoo!", "Approved Successfully!", "success");
            this.getEoi(this.eoi_id);
          });
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  cancel() {
    swal({
      title: "Are you sure?",
      text: "You will Cancel the EOI!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.eoiService.cancelEoi(this.eoi_details.id).subscribe((res: any) => {
          swal("Woohoo!", "Cancelled Successfully!", "success");
          this.getEoi(this.eoi_id);
        });
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  //customer/unit info tab functions
  downloadEoiDocument() {
    this.slimLoadingBarService.start();
    this.eoiService.downloadEoiDocument(this.eoi_details.id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  submitConfirmationDateModal(eoiDetails, modal) {
    if (!this.confirmation_date)
      swal("Confirmation date can not be empty", "", "error");
    else {
      let data = {
        confirmation_date: this.confirmation_date,
      };
      this.slimLoadingBarService.start();
      this.eoiService.changeConfirmationDate(eoiDetails.id, data).subscribe(
        (data) => {
          modal.close();
          swal("Confirmation date changed successfully", "", "success");
          this.getEoi(eoiDetails.id);
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  divisionModalSubmit(modal) {
    const payload = this.divisionForm;
    // console.log(payload);
    payload.eoi_id = this.eoi_details.id;
    if (this.divisionForm.deal_type == "Direct") {
      this.divisionForm.ambassador_id = "";
      this.divisionForm.broker_id = "";
    } else {
      if (this.divisionForm.deal_source == "Broker") {
        this.divisionForm.ambassador_id = "";
      } else if (this.divisionForm.deal_source == "Ambassador") {
        this.divisionForm.broker_id = "";
      }
    }
    this.slimLoadingBarService.start();
    this.eoiService.changeDealType(payload).subscribe(
      (res) => {
        swal("Division changes successfully", "", "success");
        modal.close();
        this.getEoi();
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

  adminDecline(eoiId, modal) {
    swal({
      title: "Are you sure?",
      text: "You will decline the eoi!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, decline it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        if (this.eoi_details.authorization.can_refund_reason == 1) {
          modal.open();
          console.log("success");
        } else {
          console.log("err");
        }
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  swalDelete(eoiId) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this eoi!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.eoiService.deleteEoi(eoiId).subscribe(
          (data) => {
            this.slimLoadingBarService.complete();
            swal("Deleted!", "Eoi has been deleted.", "success");
            this.router.navigateByUrl("/pages/eoi-table");
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

  reAssignClientSubmit(eoi, modal) {
    if (!this.chosenLeadID)
      swal(
        "Lead ID can not be empty",
        "click on get info button to get the lead id.",
        "error"
      );
    else if (!this.chosenLeadPhone)
      swal("Client Phone can not be empty", "", "error");
    else if (!this.chosenLeadName)
      swal("Client Name can not be empty", "", "error");
    else if (!this.chosenLeadReason)
      swal("Reason can not be empty", "", "error");
    else if (!this.chosenLeadNationalityID)
      swal("Client Nationality can not be empty", "", "error");
    else if (!this.chosenLeadNationality)
      swal("Client Nationality ID can not be empty", "", "error");
    else if (!this.chosenLeadDistrict)
      swal("Client Lead District can not be empty", "", "error");
    else if (!this.chosenLeadIssueDate)
      swal("Client Issue Date can not be empty", "", "error");
    else if (!this.chosenLeadCivilRegistery)
      swal("Client Civil Registery can not be empty", "", "error");
    else if (!this.chosenLeadBirthday)
      swal("Client Birthday can not be empty", "", "error");
    else if (!this.chosenLeadAddress)
      swal("Client Address can not be empty", "", "error");
    else {
      //call the back end point
      let data = {
        lead_id: this.chosenLeadID,
        eoi_id: eoi.id,
        reason: this.chosenLeadReason,
        lead_name: this.chosenLeadName,
        lead_phone: this.chosenLeadPhone,
        lead_national_id: this.chosenLeadNationalityID,
        lead_nationality: this.chosenLeadNationality,
        lead_district: this.chosenLeadDistrict,
        lead_issue_date: this.chosenLeadIssueDate,
        lead_civil_registry: this.chosenLeadCivilRegistery,
        lead_birthday: this.chosenLeadBirthday,
        lead_address: this.chosenLeadAddress,
      };
      this.slimLoadingBarService.start();
      this.eoiService.reAssignToLead(data).subscribe(
        (res) => {
          this.getEoi(this.eoi_id);
          swal("Re-assign eoi to client successfully", "", "success");
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  openEditLead() {
    this.edit_lead_data = JSON.parse(JSON.stringify(this.eoi_details));
    if (this.edit_lead_data.lead_birthday)
      this.edit_lead_data.lead_birthday = new Date(
        this.edit_lead_data.lead_birthday
      )
        .toJSON()
        .split("T")[0];

    if (this.edit_lead_data.lead_issue_date)
      this.edit_lead_data.lead_issue_date = new Date(
        this.edit_lead_data.lead_issue_date
      )
        .toJSON()
        .split("T")[0];
  }

  openEditEOi() {
    this.edit_eoi_data = JSON.parse(JSON.stringify(this.eoi_details));
  }

  editLeadModalSubmit(modal) {
    let payload = this.edit_lead_data;
    this.slimLoadingBarService.start();
    this.eoiService.editLeadInEoi(this.eoi_details.id, payload).subscribe(
      (res: any) => {
        this.getEoi(this.eoi_id);
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  editEoiModalSubmit(modal) {
    let payload = this.edit_eoi_data;
    this.slimLoadingBarService.start();
    this.eoiService.editEoiInfo(this.eoi_details.id, payload).subscribe(
      (res: any) => {
        this.getEoi(this.eoi_id);
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  changeChannelAndSourceModalSubmit(modal) {
    let data = {
      lead_channel: this.lead_channel,
      lead_source: this.lead_source,
    };
    console.log(data);
    this.eoi_details.lead_channel = this.lead_channel;
    this.eoi_details.lead_source = this.lead_source;
    modal.close();
    this.slimLoadingBarService.start();
    this.eoiService.changeChannelSource(this.eoi_details.id, data).subscribe(
      (res: any) => {
        this.getEoi(this.eoi_id);
        this.slimLoadingBarService.complete();
        swal("success", "changed channel and source successfully", "success");
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

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
    if (!this.divisionForm.deal_type) this.divisionForm.deal_type = 'Direct';
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

  reactivateEoi() {
    swal({
      title: "Are you sure?",
      text: "Re-activate this Eoi!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.eoiService.reactivateEoi(this.eoi_details.id).subscribe(
          (data) => {
            this.getEoi(this.eoi_details.id);
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

  //dealTypeTab functions starts here

  onAgentInChargeSelected(event) {
    console.log(this.agent_in_charge);
    let payload = {
      agent_in_charge: this.agent_in_charge ? this.agent_in_charge.id : "",
    };
    this.eoiService.changeAgentInCharge(this.eoi_details.id, payload).subscribe(
      (res) => {
        swal("Success", "Agent in charge changed successfully", "success");
        this.getEoi();
      },
      (err) => {
        console.log(err);
        this.agent_in_charge = undefined;
      }
    );
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
        this.searchedBrokers = this.brokers;
        console.log(this.brokers);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  overseasModalSubmit(modal) {
    let payload = {
      is_overseas: this.is_overseas,
    };
    this.slimLoadingBarService.start();
    this.eoiService.changeOverseas(this.eoi_details.id, payload).subscribe(
      (res: any) => {
        this.getEoi();
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  //accountant information tab funcitons starts here
  cheque_recieved(eoi_id) {
    swal({
      title: "Are you sure?",
      text: "cheque Recieved!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.eoiService.cheque_recieved(eoi_id).subscribe(
          (data) => {
            this.getEoi();
            swal("Woohoo!", "cheque Recieved succesfully!", "success");
          },
          (err) => console.log(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  paymentTypeSubmit(modal) {
    let payload = {
      payment_type: this.last_payment_type,
    };
    this.slimLoadingBarService.start();
    this.eoiService.changePaymentType(this.eoi_details.id, payload).subscribe(
      (res: any) => {
        this.getEoi();
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  submiteditSellingPriceModal(eoi, modal) {
    this.reason = this.reason;
    if (!this.reason) swal("reason can not be empty", "", "error");
    else {
      let data = {
        eoi_value: this.selling_price_in_modal,
        reason: this.reason,
      };
      this.slimLoadingBarService.start();
      this.eoiService.editSellingPrice(eoi.id, data).subscribe(
        (data: any) => {
          swal("Selling price changes successfully", "", "success");
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  submitChangeSellingDateModal(eoi, modal) {
    if (!this.selling_date) swal("EOI date can not be empty", "", "error");
    else {
      let data = {
        selling_date: this.selling_date,
      };
      this.slimLoadingBarService.start();
      this.eoiService.changeSellingDate(eoi.id, data).subscribe(
        (data) => {
          modal.close();
          swal("EOI date changed successfully", "", "success");
          this.getEoi();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  submitCommentModal(eoi_id, modal) {
    if (!this.commentEoi) swal("Error", "Comment can not be empty", "error");
    else {
      this.slimLoadingBarService.start();
      this.eoiService.addEoiComment(eoi_id, this.commentEoi).subscribe(
        (data) => {
          modal.close();
          this.getEoi();
          swal("Woohoo!", "Comment have added succesfully!", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  //PC info Tab starts here
  chosenAgent: any;
  filterAgentByWordText: any;
  arrSearch: any;

  submitAssignModal(res_id, modal) {
    this.slimLoadingBarService.start();
    if (!this.chosenAgent)
      swal("You must chose a property consultant", "", "error");
    else {
      this.eoiService.assignToLead(res_id, this.chosenAgent.id).subscribe(
        (data) => {
          console.log(data);
          modal.close();
          swal("Woohoo!", "Assigned to user successfully!", "success");
          this.getEoi();
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
    }
  }

  filterLeadObservable = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
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

  redirectToLeadDetails(leadId) {
    if (!isNaN(leadId)) {
      this.router.navigate([`/pages/leads/${leadId}`]);
    }
    return;
  }

  getProjects() {
    this.projectService.getProjects().subscribe((res: any) => {
      this.projects = res.data;
    });
  }

  onProjectChange(event) {
    console.log(this.eoi_details.project_id);
    let payload = {
      project_id: this.eoi_details.project_id,
    };
    this.slimLoadingBarService.start();
    this.eoiService.changeProject(this.eoi_details.id, payload).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        swal("Success", "Changed Project Successfully", "success");
        this.getEoi();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  onReservationLink(event) {
    console.log(this.eoi_details.reservation_id);
    let payload = {
      reservation_id: this.eoi_details.reservation_id,
    };
    this.slimLoadingBarService.start();
    this.eoiService
      .changeLinkedReservationEOI(this.eoi_details.id, payload)
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          swal("Success", "Changed Linked Reservation Successfully", "success");
          this.getEoi();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.reset();
        }
      );
  }

  searchBroker(val: string) {
    this.searchedBrokers = this.brokers.filter((el: any)=>{
      return el.name.trim().toLowerCase().includes(val.trim().toLowerCase())
    })
  }
}
