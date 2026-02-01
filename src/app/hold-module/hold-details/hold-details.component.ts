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
import { ProjectsService } from "../../services/projects/projects.service";
import { environment } from "../../../environments/environment";
import { HoldService } from "../hold.service";

@Component({
  selector: 'app-hold-details',
  templateUrl: './hold-details.component.html',
  styleUrls: ['./hold-details.component.css']
})
export class HoldDetailsComponent implements OnInit {

  hold_id: any;
  hold_details: any;
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
    lead_workplace: ""
  };
  edit_hold_data = {
    phase: "",
    hold_value: "",
  }
  expiration_date: any;
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
  divisionForm: FormGroup;
  deal_types: any = ["Direct", "In-Direct"];
  direct_option: any = ["Individual", "Ambassador"];
  deal_type: any;
  ambassadors: any;
  brokers: any;
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
  commentHold: any;
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

  todayDate = new Date();

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
    private holdService: HoldService,
    private projectService: ProjectsService
  ) {
    this.userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
  }

  ngOnInit() {
    this.todayDate;
    this.getProjects();
    this.getChannels();
    this.createDivisionForm();
    this.getAmbassadors();
    this.getAllAgents();
    this.getBrokers();
    this.deal_type_change();
    this.getPaymentTypes();
    this.activatedRoute.params.subscribe((res: any) => {
      console.log(res);
      this.hold_id = res.id;
      this.getHold(this.hold_id);
    });
    this.paymentForm = this.fb.group({
      percentage: [{ value: "", disabled: true }, Validators.required],
      payment_term_id: ["", Validators.required],
    });
  
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

  getChannels() {
    this.slimLoadingBarService.start();
    this.marketingService.getChannels().subscribe(
      (res: any) => {
        this.channels = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
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

  getHold(id?) {
    this.slimLoadingBarService.start();
    this.holdService.getHold(id || this.hold_id).subscribe(
      (res: any) => {
        this.hold_details = res;
        if (this.hold_details.expiration_date) {
          this.expiration_date = this.hold_details.expiration_date;
          console.log('----------------------', this.expiration_date);
          
        }
        // this.agent_in_charge = res.agent_in_charge;
        if(res.agent_in_charge)
          this.agent_in_charge = this.agents.find(a => a.id == res.agent_in_charge);

        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }



  accountantApprove() {
    swal({
      title: "Are you sure?",
      text: "You will collect cash the Hold!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.holdService
          .cashCollected(this.hold_details.id)
          .subscribe((res: any) => {
            swal("Woohoo!", "Approved Successfully!", "success");
            this.getHold(this.hold_id);
          });
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  cancel() {
    swal({
      title: "Are you sure?",
      text: "You will Cancel the Hold!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.holdService.cancelHold(this.hold_details.id).subscribe((res: any) => {
          swal("Woohoo!", "Cancelled Successfully!", "success");
          this.getHold(this.hold_id);
        });
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  //customer/unit info tab functions
  downloadHoldDocument() {
    this.slimLoadingBarService.start();
    this.holdService.downloadHoldDocument(this.hold_details.id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  submitConfirmationDateModal(holdDetails, modal) {
    if (!this.expiration_date)
      swal("Expiration date can not be empty", "", "error");
    else {
      let data = {
        expiration_date: this.expiration_date,
      };
      this.slimLoadingBarService.start();
      this.holdService.changeExpirationDate(this.hold_details.id, data).subscribe(
        (data) => {
          modal.close();
          swal("Expiration date changed successfully", "", "success");
          this.getHold(holdDetails.id);
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  swalDelete(holdId) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this hold!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.holdService.deleteHold(holdId).subscribe(
          (data) => {
            this.slimLoadingBarService.complete();
            swal("Deleted!", "Hold has been deleted.", "success");
            this.router.navigateByUrl("/pages/hold-table");
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


  openEditLead() {
    this.edit_lead_data = JSON.parse(JSON.stringify(this.hold_details));
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

  openEditHold() {
    this.edit_hold_data = JSON.parse(JSON.stringify(this.hold_details));
  }

  editLeadModalSubmit(modal) {
    let payload = this.edit_lead_data;
    this.slimLoadingBarService.start();
    this.holdService.editLeadInHold(this.hold_details.id, payload).subscribe(
      (res: any) => {
        this.getHold(this.hold_id);
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  editHoldModalSubmit(modal) {
    let payload = this.edit_hold_data;
    this.slimLoadingBarService.start();
    this.holdService.editHoldInfo(this.hold_details.id, payload).subscribe(
      (res: any) => {
        this.getHold(this.hold_id);
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
    this.hold_details.lead_channel = this.lead_channel;
    this.hold_details.lead_source = this.lead_source;
    modal.close();
    this.slimLoadingBarService.start();
    this.holdService.changeChannelSource(this.hold_details.id, data).subscribe(
      (res: any) => {
        this.getHold(this.hold_id);
        this.slimLoadingBarService.complete();
        swal("success", "changed channel and source successfully", "success");
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  channelChange(event) {
    this.channels.forEach((e) => {
      if (e.name == this.lead_channel) {
        console.log(e);
        this.leadSources = [];
        this.lead_source = null;
        this.leadSources = e.sources;
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
      agent_in_charge: this.agent_in_charge ? this.agent_in_charge.id : '',
    };
    this.holdService.changeAgentInCharge(this.hold_details.id, payload).subscribe(
      (res) => {
        swal("Success", "Agent in charge changed successfully", "success");
        this.getHold();
      },
      (err) => {
        console.log(err);
        this.agent_in_charge = undefined;
      }
    );
  }

  createDivisionForm() {
    this.divisionForm = this.fb.group({
      deal_type: ["", Validators.required],
    });
  }

  deal_type_change() {
    this.divisionForm.get("deal_type").valueChanges.subscribe((val) => {
      console.log(val);
      if (val == "Direct") {
        if (this.divisionForm.get("broker_id"))
          this.divisionForm.removeControl("broker_id");
        this.divisionForm.addControl(
          "deal_category",
          new FormControl("", Validators.required)
        );
        this.division_type_change();
        console.log(this.divisionForm.value);
      } else if (val == "In-Direct") {
        console.log(val);
        if (this.divisionForm.get("deal_category"))
          this.divisionForm.removeControl("deal_category");
        if (this.divisionForm.get("ambassador_id"))
          this.divisionForm.removeControl("ambassador_id");
        this.divisionForm.addControl(
          "broker_id",
          new FormControl(undefined, Validators.required)
        );
      }
    });
  }

  division_type_change() {
    console.log("division_type_change changed");
    this.divisionForm.get("deal_category").valueChanges.subscribe((val) => {
      if (val == "Ambassador") {
        console.log("Ambassador");
        this.divisionForm.addControl(
          "ambassador_id",
          new FormControl("", Validators.required)
        );
      } else if (val == "Individual") {
        console.log("Individual");
        // if (this.divisionForm.removeControl('ambassador_id'))
        //   this.divisionForm.removeControl('ambassador_id');
      }
    });
  }

  divisionModalSubmit(modal) {
    let payload = Object.assign({},this.divisionForm.value);
    console.log(payload);
    payload.hold_id = this.hold_details.id;
    if (this.divisionForm.invalid)
      swal("Division can not be empty", "", "error");
    else {
      if (this.divisionForm.value.ambassador_id)
        payload.ambassador_id = this.divisionForm.value.ambassador_id.id;
      if (this.divisionForm.value.broker_id)
        payload.broker_id = this.divisionForm.value.broker_id.id;

      this.slimLoadingBarService.start();
      this.holdService.changeDealType(payload).subscribe(
        (res) => {
          swal("Division changes successfully", "", "success");
          modal.close();
          this.getHold();
           
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
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

  overseasModalSubmit(modal) {
    let payload = {
      is_overseas: this.is_overseas,
    };
    this.slimLoadingBarService.start();
    this.holdService.changeOverseas(this.hold_details.id, payload).subscribe(
      (res: any) => {
        this.getHold();
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }


  paymentTypeSubmit(modal) {
    let payload = {
      payment_type: this.last_payment_type,
    };
    this.slimLoadingBarService.start();
    this.holdService.changePaymentType(this.hold_details.id, payload).subscribe(
      (res: any) => {
        this.getHold();
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  submitCommentModal(hold_id, modal) {
    if (!this.commentHold) swal("Error", "Comment can not be empty", "error");
    else {
      this.slimLoadingBarService.start();
      this.holdService.addHoldComment(hold_id, this.commentHold).subscribe(
        (data) => {
          modal.close();
          this.getHold();
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

  submitAssignModal(res_id, modal) {
    this.slimLoadingBarService.start();
    if (!this.chosenAgent)
      swal("You must chose a property consultant", "", "error");
    else {
      this.holdService.assignToAgent(res_id, this.chosenAgent.id).subscribe(
        (data) => {
          modal.close();
          console.log(data);
          swal("Woohoo!", "Assigned to user successfully!", "success");
          this.getHold();
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
    }
  }

}
