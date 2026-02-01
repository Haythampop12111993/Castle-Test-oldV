import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ColdCallsService } from "../../cold-calls/cold-calls.service";
import { Lead } from "../../dtos/lead.viewmodel";
import { BranchService } from "../../services/branch/branch.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ReservationService } from "../../services/reservation-service/reservation.service";
import { MarketingService } from "./../../services/marketing/marketing.service";
import { ProjectsService } from "./../../services/projects/projects.service";
import { ErrorHandlerService } from "./../../services/shared/error-handler.service";
import { UserServiceService } from "./../../services/user-service/user-service.service";
import { LeadCampaignsService } from "../../services/lead-service/lead-campaigns.service";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { get } from "jquery";

@Component({
  selector: "addlead",
  templateUrl: "./addlead.component.html",
  styleUrls: ["./addlead.component.css"],
  providers: [LeadsService],
})
export class AddLeadComponent {
  title = "addlead";

  lead: any = null;
  leadSources: Array<any> = [];
  agents: any;
  brokers: Array<any> = [];
  ambassadors: Array<any> = [];
  leadId;
  leadDetails = [];
  private sub: any;
  genderId: any;
  genders: Array<any> = [{ text: "Male" }, { text: "Female" }];
  roleId;
  role: any;
  data: Array<any> = [];
  currentEmailValid = true;
  errortext: boolean;
  userData: any;
  defineRule: any;
  channels: any;
  channel: any;
  projects: any;
  types: any;
  branches: any = [];
  channelview: any;

  disable_submit_button = false;

  arrSearch: any = [];
  dataFromSearch: any;

  selectedCar: number;

  cars = [
    { id: 1, name: "Volvo" },
    { id: 2, name: "Saab" },
    { id: 3, name: "Opel" },
    { id: 4, name: "Audi" },
  ];

  id_types = ["passport", "id"];

  events: any = [];
  lead_campaigns: any = [];

  // contact
  contact_data;
  contact_screen;

  leads: any;
  incentive_users: any = [];
  selected_incentive_broker: any;
  leadsArrayString: any = [];
  chosenLead: any;

  primaryIti: any;
  secondaryIti: any;
  tertiaryIti: any;
  countries: any = [];

  constructor(
    private leadsService: LeadsService,
    private route: ActivatedRoute,
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    private marketingService: MarketingService,
    private projectsService: ProjectsService,
    private userService: UserServiceService,
    public http: HttpClient,
    private branchService: BranchService,
    private reservationService: ReservationService,
    private leadCampaignsService: LeadCampaignsService,
    private coldCallsService: ColdCallsService,
    private cdr: ChangeDetectorRef
  ) {
    this.userData = JSON.parse(window.localStorage.getItem("userProfile"));
    this.lead = new Lead();
    this.lead.gender = "Male";
    this.leadSource();
    if (
      this.userData.role == "Admin" ||
      this.userData.role == "Super Development" ||
      (this.userData.is_sales_team && this.userData.is_arm)
    ) {
      // this.getBrokers();
    }
  }

  ngOnInit() {
    this.getBrokers();
    this.getAmbassadors();
    this.getEvents();
    this.getLeadCampaigns();
    this.getChannels();
    this.getProjects();
    this.getTypes();
    this.getBranches();
    this.getAllCountries();
    this.sub = this.route.params.subscribe((params) => {
      this.leadId = +params["id"]; // (+) converts string 'id' to a number
      if (this.leadId > 0) {
        const { screen } = this.route.snapshot.queryParams;
        if (screen) {
          this.contact_screen = screen;
          this.getContact();
        } else {
          this.getLeadDetails();
        }
      } else {
        this.clearControls();
      }
    });

    this.slimLoadingBarService.start(() => {
      console.log("Loading complete");
    });
    this.leadsService.getAgents({ with_admins: true }).subscribe(
      (data: any) => {
        console.log(data);
        console.log(this.lead.agent_id);
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

  ngAfterViewInit() {
    const primaryInput = document.querySelector(
      "#primaryPhoneNumber"
    ) as HTMLInputElement | null;
    const secondaryInput = document.querySelector(
      "#secondaryPhoneNumber"
    ) as HTMLInputElement | null;
    const tertiaryInput = document.querySelector(
      "#tertiaryPhoneNumber"
    ) as HTMLInputElement | null;
    if (
      this.userData.is_sales_team &&
      primaryInput &&
      secondaryInput &&
      tertiaryInput
    ) {
      primaryInput.maxLength = 11;
      secondaryInput.maxLength = 11;
      tertiaryInput.maxLength = 11;
    }
    // this.primaryIti = window["intlTelInput"](primaryInput, {
    //   initialCountry: "eg",
    //   excludeCountries: ["il"],
    //   utilsScript:
    //     "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.4/build/js/utils.js",
    // });
    // this.secondaryIti = window["intlTelInput"](secondaryInput, {
    //   initialCountry: "eg",
    //   excludeCountries: ["il"],
    //   utilsScript:
    //     "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.4/build/js/utils.js",
    // });
    // this.tertiaryIti = window["intlTelInput"](tertiaryInput, {
    //   initialCountry: "eg",
    //   excludeCountries: ["il"],
    //   utilsScript:
    //     "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.4/build/js/utils.js",
    // });
    // // Store the instance variables if needed for later use
    // window["primaryIti"] = this.primaryIti;
    // window["secondaryIti"] = this.secondaryIti;
    // window["tertiaryIti"] = this.tertiaryIti;
  }

  getAllCountries() {
    this.userService.getAllCountries().subscribe(
      (res: any) => {
        this.countries = res.data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    )
  }

  getPhoneNumbers() {
    // const phone = window["primaryIti"].getNumber();
    // const phone_2 = window["secondaryIti"].getNumber();
    // const phone_3 = window["tertiaryIti"].getNumber();

    // return {
    //   phone,
    //   phone_2,
    //   phone_3,
    // };
    return {};
  }

  getIncentiveUsers(broker_id: number) {
    this.incentive_users = [];
    this.lead.broker_incentive_id = "";
    this.userService.get_incentive_users(broker_id).subscribe(
      (res: any) => {
        this.incentive_users = res;
        console.log(this.agents);
        this.lead.broker_incentive_id = this.selected_incentive_broker;
      },
      (err) => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  save() {
    if(this.userData.is_sales_team) {
      if(this.lead.phone.length > 11) {
        swal("All Phones Numbers Must Be 11 Digits","","error");
        return;
      }
      if(this.lead.phone_2) {
        if(this.lead.phone_2.length > 11) {
          swal("All Phones Numbers Must Be 11 Digits","","error");
          return;
        }
      }
      if(this.lead.phone_3) {
        if(this.lead.phone_3.length > 11) {
          swal("All Phones Numbers Must Be 11 Digits","","error");
          return;
        }
      }
    }
    this.slimLoadingBarService.start();
    this.errortext = null;

    this.lead.agent_id =
      this.lead.agent_id && this.lead.agent_id != null
        ? this.lead.agent_id.id
        : "";

    if (this.contact_screen) {
      if (this.channel) {
        this.lead.lead_channel_id = this.channel;
      }
      if (this.lead.lead_source) {
        this.disable_submit_button = true;
        const payload = {
          ...this.lead,
          ...this.getPhoneNumbers(),
        };
        this.coldCallsService
          .convertToInterested(this.leadId, payload)
          .subscribe(
            (data) => {
              this.slimLoadingBarService.complete();
              swal(
                "Woohoo!",
                "Converted to Interested Successfully!",
                "success"
              ).then((value) => {
                switch (this.contact_screen) {
                  case "cold-all":
                    this.router.navigateByUrl(
                      `/pages/cold-calls/details/${this.contact_data.card_id}/card?data=all`
                    );
                    break;
                  case "cold-agent":
                    this.router.navigateByUrl(
                      `/pages/cold-calls/details/${this.contact_data.card_id}/agent`
                    );
                    break;
                  case "cold-contact":
                    this.router.navigateByUrl(`/pages/cold-calls/my-contacts`);
                    break;
                  default:
                    this.router.navigateByUrl(`/pages/cold-calls/all`);
                    break;
                }
              });
              this.disable_submit_button = false;
              this.resetForm();
              if (this.userData.role != "Broker Incentive") {
                this.router.navigate(['/pages/leads'])
              }
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.errortext = err._body;
              this.slimLoadingBarService.complete();
              this.disable_submit_button = false;
              console.log(err);
              if (err.error.message == "Lead already exists with you") {
                if (!isNaN(err.error.leadId)) {
                  // this.router.navigate([`/pages/leads/${err.error.leadId}`]);
                }
              }
            }
          );
      } else {
        swal("Lead source is required", "", "error");
      }
    } else if (this.leadId) {
      if (this.channel) {
        this.lead.lead_channel_id = this.channel;
      }
      if (this.lead.lead_source) {
        this.disable_submit_button = true;
        const payload = {
          ...this.lead,
          ...this.getPhoneNumbers(),
        };
        this.leadsService.editALead(this.leadId, payload).subscribe(
          (data) => {
            console.log(data);
            this.slimLoadingBarService.complete();
            swal("Woohoo!", "Lead updated succesfully!", "success").then(
              (value) => {
                // this.router.navigate(["pages/leads"]);
              }
            );
            this.disable_submit_button = false;
            this.resetForm();
            if (this.userData.role != "Broker Incentive") {
              this.router.navigate(['/pages/leads'])
            }
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.errortext = err._body;
            this.slimLoadingBarService.complete();
            this.disable_submit_button = false;
            console.log(err);
            if (err.error.message == "Lead already exists with you") {
              if (!isNaN(err.error.leadId)) {
                // this.router.navigate([`/pages/leads/${err.error.leadId}`]);
              }
            }
          }
        );
      } else {
        swal("Lead source is required", "", "error");
      }
    } else {
      this.lead.lead_channel_id = this.channel;
      if (this.lead.lead_source) {
        this.disable_submit_button = true;
        const payload = {
          ...this.lead,
          ...this.getPhoneNumbers(),
        };
        this.leadsService.createLead(payload).subscribe(
          (data) => {
            console.log(data);
            this.slimLoadingBarService.complete();
            swal("Woohoo!", "Lead created succesfully!", "success").then(
              (value) => {
                // this.router.navigate(["pages/leads"]);
              }
            );
            this.disable_submit_button = false;
            this.resetForm();
            if (this.userData.role != "Broker Incentive") {
              this.router.navigate(['/pages/leads'])
            }
          },
          (err) => {
            this.errortext = err._body;
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
            this.disable_submit_button = false;
            console.log(err);
            if (err.error.message == "Lead already exists with you") {
              if (!isNaN(err.error.leadId)) {
                // this.router.navigate([`/pages/leads/${err.error.leadId}`]);
              }
            }
          }
        );
      } else {
        swal("Lead source is required", "", "error");
      }
    }
  }

  resetForm() {
    Object.keys(this.lead).forEach((key) => {
      this.lead[key] = null;
    })
    if(this.userData.role == 'Broker Incentive'){
      this.lead.lead_channel_id = "2";
      this.lead.lead_source = "Broker"
    }
  }

  getContact() {
    if (this.lead.broker_id === null) {
      this.lead.broker_id = 1;
    }

    if (
      this.lead.lead_source === null ||
      this.lead.lead_source == "Self Generate"
    ) {
      this.lead.lead_source = "Self Generate";
    }

    if (this.lead.agent_id === null) {
      this.leadId.agent_id = 0;
    }

    this.slimLoadingBarService.start();
    this.coldCallsService
      .getContact(this.leadId)
      .subscribe(
        (res: any) => {
          this.contact_data = res;

          this.lead.name = res.name;
          this.lead.email = res.email;
          this.lead.phone = res.phones[0] ? res.phones[0].full_phone : "";
          this.lead.phone_2 = res.phones[1] ? res.phones[1].full_phone : "";
          this.lead.phone_3 = res.phones[2] ? res.phones[2].full_phone : "";
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }

  calculatesChannelAndSources(channel_id, leadSource) {
    console.log(channel_id, leadSource, this.channels);
    this.channel = channel_id;
    if (Array.isArray(this.require_channels)) {
      this.require_channels.push(() => {
        this.channels.forEach((channel) => {
          if (channel.id == channel_id) {
            this.leadSources = channel.sources;
            console.log(this.leadSources);
          }
          this.lead.lead_source = leadSource;
        });
      });
    } else {
      this.channels.forEach((channel) => {
        if (channel.id == channel_id) {
          this.leadSources = channel.sources;
          console.log(this.leadSources);
        }
        this.lead.lead_source = leadSource;
      });
    }
  }

  leadSource() {
    var data = this.leadsService.leadSource();
  }

  getLeadDetails() {
    console.log(this.leadId);
    if (this.lead.broker_id === null) {
      this.lead.broker_id = 1;
    }

    if (
      this.lead.lead_source === null ||
      this.lead.lead_source == "Self Generate"
    ) {
      this.lead.lead_source = "Self Generate";
    }

    if (this.lead.agent_id === null) {
      this.leadId.agent_id = 0;
    }

    this.slimLoadingBarService.start();
    this.leadsService.getLeadDetails(this.leadId).subscribe(
      (data: any) => {
        console.log(data);
        this.lead.name = data.lead.name;
        this.lead.phone = data.lead.phone;
        this.lead.email = data.lead.email;
        this.lead.gender = data.lead.gender;
        this.lead.religion = data.lead.religion;
        this.lead.occupation = data.lead.occupation;
        this.lead.workplace = data.lead.workplace;
        this.lead.intrestedProjects = data.lead.interested_projects.map(
          (project) => project.id
        );
        this.lead.intrestedUnitTypes = data.lead.intrestedUnitTypes;
        this.lead.budget_from = data.lead.budget_from;
        this.lead.budget_to = data.lead.budget_to;
        this.lead.lead_source = data.lead.lead_source;
        this.lead.agent_id = data.lead.agent;
        this.lead.id_address = data.lead.id_address;
        this.lead.date_of_birth = data.lead.date_of_birth;
        this.lead.address = data.lead.address;
        this.lead.comment = data.lead.comment;
        this.lead.how_hear_about_us = data.lead.how_hear_about_us;
        this.lead.lead_channel_id = data.lead.lead_channel_id;
        this.lead.phone_2 = data.lead.phone_2;
        this.lead.phone_3 = data.lead.phone_3;
        this.lead.ambassador_id = data.lead.ambassador_id;
        this.lead.broker_id = data.lead.broker_id;
        this.lead.lead_event_id = data.lead.lead_event_id;
        this.lead.nationality = data.lead.nationality;
        this.lead.id_type = data.lead.id_type;
        this.lead.id_number = data.lead.id_number;
        data.lead.broker_incentive && (this.selected_incentive_broker = data.lead.broker_incentive.id);
        this.lead.branch_id = data.lead.branch_id;
        this.lead.available_time_to_call = data.lead.available_time_to_call;
        this.lead.lead_campaign_id = data.lead.lead_campaign_id;
        this.lead.catch_date = data.lead.catch_date;
        this.channel = data.lead.lead_channel;
        if (this.lead.lead_source == "Broker") {
          this.getIncentiveUsers(this.lead.broker_id);
        }
        if (data.lead.byc_id) {
          this.leadsArrayString = [data.lead.byc.name];
          this.leads = [data.lead.byc];
          this.lead.byc_id = data.lead.byc_id;
          this.observableSource(data.lead.byc.name).subscribe((res) => {
            this.chosenLead = `${data.lead.byc.name} / ${data.lead.byc.id}`;
          });
        }

        console.log(this.lead.lead_source);
        this.calculatesChannelAndSources(
          data.lead.lead_channel_id,
          data.lead.lead_source
        );
        this.slimLoadingBarService.complete();
        // Set the phone numbers when in edit mode
        if (this.lead.phone && this.primaryIti) {
          this.primaryIti.setNumber(this.lead.phone);
        }
        if (this.lead.phone_2 && this.secondaryIti) {
          this.secondaryIti.setNumber(this.lead.phone_2);
        }
        if (this.lead.phone_3 && this.tertiaryIti) {
          this.tertiaryIti.setNumber(this.lead.phone_3);
        }
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getGenders() {
    this.genders = null;
    this.genders = this.leadsService.getGenders();
  }

  clearControls() {
    this.lead = new Lead();
    this.lead.lead_source = "Self Generate";
    this.lead.gender = "Male";
    this.lead.agent_id = null;
    console.log("lead_source", this.lead.lead_source);
  }

  cancel() {}

  gotodashboard() {
    // this.router.navigate(["/pages/leads"]);
  }

  require_channels = [];

  getChannels() {
    this.slimLoadingBarService.start();
    this.marketingService.getChannels().subscribe(
      (res: any) => {
        this.channels = res;
        if (this.userData.role == "Call Center") {
          this.channels = res.filter((channel) => channel.name == "Direct");
        }
        if (
          this.userData.is_sales_team ||
          this.userData.role == "Call Center"
        ) {
          this.channel = 1;
          this.channelChange(1);
        }
        this.require_channels.map((a) => a());
        this.require_channels = null;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  channelChange(_, change = true) {
    if (change) {
      this.lead.lead_source = null;
    }
    if (Array.isArray(this.require_channels)) {
      this.require_channels.push(() => {
        this.channels.forEach((e) => {
          if (e.id == this.channel) {
            this.leadSources = [];
            if (change) {
              this.lead.lead_source = null;
            }
            this.leadSources = e.sources;
            this.channelview = e.name;
            if (change && this.channelview != "Brokers") {
              if (this.lead.broker_id) {
                this.lead.broker_id = null;
              } else if (this.lead.ambassador_id) {
                this.lead.ambassador_id = null;
              }
            }
          }
        });
      });
    } else {
      this.channels.forEach((e) => {
        if (e.id == this.channel) {
          this.leadSources = [];
          if (change) {
            this.lead.lead_source = null;
          }
          this.leadSources = e.sources;
          this.channelview = e.name;
          if (change && this.channelview != "Brokers") {
            if (this.lead.broker_id) {
              this.lead.broker_id = null;
            } else if (this.lead.ambassador_id) {
              this.lead.ambassador_id = null;
            }
          }
        }
      });
    }
  }

  getProjects() {
    this.projectsService.getProjects().subscribe(
      (data: any) => {
        this.projects = data;
        console.log(this.projects);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getTypes() {
    this.projectsService.getUnitTypes().subscribe((data: any) => {
      this.types = data;
    });
  }

  getBranches() {
    this.branchService.getAllBranches().subscribe((res: any) => {
      this.branches = res.data;
    });
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

  checkPhoneValid(event: any) {
    const pattren = /[0-9\+]/;
    console.log(event.keyCode);
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattren.test(inputChar)) {
      event.preventDefault();
    }
  }

  /*
   * Listen On Lead Source Select
   *
   * if select Broker -> Broker select will appear
   */
  changeLeadSource(ev) {
    console.log(ev);
    // if (ev == 'Broker') this.channelview = ev;
  }

  getEvents() {
    this.reservationService.getAllEvents().subscribe((res: any) => {
      this.events = res;
      console.log(res);
    });
  }

  getLeadCampaigns() {
    this.leadCampaignsService.getCampaignsList().subscribe((res: any) => {
      this.lead_campaigns = res.data;
    });
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
          console.log(res.data);
          if (res.data.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res.data;
            res.data.forEach((e) => {
              this.arrSearch.push(`${e.name} / ${e.id}`);
            });
            // console.log(arr);
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  getLinkedLeadDetails(): any {
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
          const nameArr = this.chosenLead.replace(/\s/g, "").split("/");
          const leadId = nameArr[nameArr.length - 1];
          if (element.id == leadId) {
            console.log(element);
            this.lead.byc_id = element.id;
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

  convertLeads(data) {
    this.leadsArrayString = [];
    this.leads = data.data;
    this.leads.forEach((element) => {
      this.leadsArrayString.push(element.name);
    });
  }

  unLink() {
    this.chosenLead = null;
    delete this.lead.byc_id;
    this.arrSearch = [];
    this.leadsArrayString = [];
  }

  onlyNumber(event) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
  }
}
