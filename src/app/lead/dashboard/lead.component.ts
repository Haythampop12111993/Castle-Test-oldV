import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Image } from "angular-modal-gallery";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs/Observable";
import swal from "sweetalert2";
import { LeadActivity, LeadRequest } from "../../dtos/leadActivity.viewmodel";
import { LeadStatus } from "../../dtos/leadStatus.viewmodel";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ProjectsService } from "../../services/projects/projects.service";
import { Team } from "../../shared/team";
import { environment } from "./../../../environments/environment";
import { MarketingService } from "./../../services/marketing/marketing.service";
import { ReservationService } from "./../../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "./../../services/shared/error-handler.service";
import { UserServiceService } from "./../../services/user-service/user-service.service";
import { LeadCampaignsService } from "../../services/lead-service/lead-campaigns.service";
import { LeadTicketTypesService } from "../../services/lead-service/lead-ticket-types.service";
declare var Messenger: any;

type Rotation = {
  created_at: string;
  id: number;
  name: string;
  rotation_projects: [];
  rotation_sources: [];
  rotation_users: [];
  updated_at: string;
};

@Component({
  selector: "leads",
  templateUrl: "./lead.component.html",
  styleUrls: ["./lead.component.css"],
})
export class LeadsComponent implements OnInit {
  environment = environment;
  teams: Team[];
  newLeadCount: number = 0;
  documentForm: FormGroup;
  filterForm: FormGroup;
  filterSubmitDisabled = false;
  @ViewChild("fileInput") fileInput: ElementRef;
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));
  title = "lead";
  activity: LeadActivity = null;
  reminder: any = {
    title: null,
    details: null,
    reminder_datetime: null,
  };
  request: LeadRequest = null;
  lstatus: LeadStatus = null;
  filterStatus: LeadStatus = null;
  leads = null;
  leadActivities: Array<any> = [];
  status: Array<any> = [];

  // filter leads
  @ViewChild("leadsContainer") leadsContainer: ElementRef;
  filteredLeads: Array<any> = [];
  loadingFilteredLeads = false;

  leadDetails: any;
  selectedLead: any;
  agents: Array<any> = [];
  documentTypes: Array<any> = [];
  documentType;
  documentNumber;
  documentIssueDate;
  leadId;
  leadDocuments = null;
  imagesArray: Array<Image>;
  activityHeading: Array<any> = [];
  activitydetails: Array<any> = [];
  loadingIndicationElement: Element;
  @ViewChild("divscroll") inputs;
  leadStatus: any;
  searchLeadsStatus: any;
  leadChannels: any;
  events: any = [];
  lead_campaigns: any = [];
  lead_ticket_types: any = [];
  searchLeadSources: any;
  next_page_url: any;
  selector: string;
  file_name: string;
  fileToUpload: File = null;
  actions: any;
  document: any = {
    type: "",
  };
  uploadExcel: FormGroup;
  lead_source: any = "-1";
  leadSources: Array<any> = [];
  send_to_agent: any = "all";
  agentsArrayString: any = [];
  chosenAgent: any;
  arrSearch: any = [];
  dataFromSearch: any;
  isMarekting = false;
  export_lead: any;
  smsForm: any;
  smsgroup: any;
  emailForm: any;
  channels: any;
  channel: any;
  interest_project: any;
  brokers: any;
  rotation_id: number | "";

  adminComment: any;
  projects: any;

  is_collapsed: boolean = true;
  types: any;

  lead_requests: any;
  activitiesForFilter: any;

  projectsForFilter: any;

  lead_reminders: any;

  reminders: any;

  readOnlyMode: boolean = false;

  actions_is_collapsed: boolean = true;

  allChecked: boolean = false;
  openDropdownIndex: number | null = null;
  selectedLeadsID: any[] = [];
  leadsTotal;
  selectedLeadsCount = 0;
  disableCheckbox: boolean = false;
  formValue;
  allLeadsChecked: boolean = false;

  reassignLeadsPayload: any = {
    reassign_user_id: "",
    new_status: "",
    reason: "",
    select_all: false,
    leads_ids: [],
  };
  deleteLeadsPayload: any = {
    select_all: false,
    ids: [],
  };

  callCenterScript = {
    call_center_script: "",
    sales_script: "",
  };
  //#endregion

  rotations: Rotation[];

  assign_type: "agent" | "rotation" = "agent";

  isSubmittingImport = false;
  comment: string;
  is_edit_comment: boolean = false;
  comment_id: any;

  constructor(
    private leadsService: LeadsService,
    private fb: FormBuilder,
    private router: Router,
    private _route: ActivatedRoute,
    private cookieService: CookieService,
    vRef: ViewContainerRef,
    private zone: NgZone,
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    private http: HttpClient,
    private userService: UserServiceService,
    private marketingService: MarketingService,
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private leadCampaignsService: LeadCampaignsService,
    private leadTicketTypesService: LeadTicketTypesService
  ) {
    this.createFilterForm();
    this.getRotations();
    this.getLeads();
    this.export_lead = `${
      environment.api_base_url
    }leads/export?token=${window.localStorage.getItem("token")}`;
    this.createForm();
    this.activity = new LeadActivity();
    this.request = new LeadRequest();
    this.lstatus = new LeadStatus();
    this.getStatus();
    this.getTeams();
    this.getDocumnetTypes();
    this.getAllActions();
    if (this.userData.role != "Marketing") {
      this.leadSource();
    } else {
      this.leadSources = [
        {
          text: "facebook",
        },
        {
          text: "Youtube",
        },
        {
          text: "Adword",
        },
      ];
      this.isMarekting = true;
    }
    this.getAgents();
    console.log("user role : ", this.userData.role);
    // this.userData.role == "Admin" || this.userData.role == 'CCO' || this.userData.role == 'Development Director'
    //   ? [
    //       { id: 1, name: "New" },
    //       { id: 2, name: "Follow Up" },
    //       { id: 3, name: "Closed" },
    //       { id: 4, name: "Disqualified" },
    //       { id: 5, name: "Freeze" },
    //     ]
    //   : [{ id: 4, name: "Disqualified" }];

    this.searchLeadsStatus =
      this.userData.role == "Admin" || this.userData.role == "Super Development"
        ? [
            { id: 1, name: "New" },
            { id: 2, name: "Interested" },
            { id: 3, name: "Closed" },
            { id: 4, name: "Not Interested" },
            { id: 6, name: "No Answer" },
            { id: 7, name: "Not Reachable" },
          ]
        : [
            { id: 1, name: "New" },
            { id: 2, name: "Interested" },
            { id: 3, name: "Closed" },
            { id: 4, name: "Not Interested" },
            { id: 6, name: "No Answer" },
            { id: 7, name: "Not Reachable" },
          ];
    if (
      this.userData.role == "Admin" ||
      this.userData.role == "Super Development" ||
      this.userData.role == "Moderator" ||
      this.userData.role == "Super Moderator" ||
      this.userData.role == "Marketing" ||
      this.userData.role == "Head Of Sales"
    ) {
      this.searchLeadsStatus = [
        ...this.searchLeadsStatus,
        { id: 5, name: "Freeze" },
      ];
    }
    // admin // moderator // super moderator // marketing

    this.marketingService.getChannels().subscribe((response) => {
      this.leadChannels = response;
    });
    this.http
      .get(`${environment.api_base_url}settings/sources`)
      .subscribe((data) => {
        this.searchLeadSources = data;
      });
    //ro stands for readonly, it's intentionaly encrypted so that end user don't bypass it by changing the value from url
    this._route.queryParams.subscribe((params) => {
      this.readOnlyMode = params["ro"] == 1;
    });
  }

  getTeams() {
    this.leadsService.getTeams().subscribe((res: Team[]) => {
      this.teams = res;
    });
  }

  getRotations() {
    this.projectService
      .getAllRotations({ disable_pagination: true })
      .subscribe((res: any) => {
        this.rotations = res;
      });
  }

  ngOnInit() {
    this.getAllReminders();
    this.createSmSBulkForm();
    // Add click outside listener to close dropdown
    document.addEventListener('click', (event) => {
      if (!(event.target as HTMLElement).closest('.dropdown')) {
        this.openDropdownIndex = null;
      }
    });
    this.getChannels();
    this.createSmSgroupForm();
    this.createEmailBulkForm();
    this.getAllProjects();
    this.getNewLeadStatus();
    this.getEvents();
    this.getleadCampaigns();
    this.getLeadTicketTypes();
    this.getCallCenterScript();
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  getEvents() {
    this.reservationService.getAllEvents().subscribe((res: any) => {
      this.events = res;
    });
  }

  getleadCampaigns() {
    this.leadCampaignsService.getCampaignsList().subscribe((res: any) => {
      this.lead_campaigns = res.data;
    });
  }

  getLeadTicketTypes() {
    this.leadTicketTypesService.getTicketTypesList().subscribe((res: any) => {
      this.lead_ticket_types = res;
    });
  }
  getNewLeadStatus() {
    this.leadsService.getLeadStatuses().subscribe(
      (res: any) => {
        if (res && res.leads_status && res.leads_status.length > 0) {
          let status = res.leads_status.find((a) => a.status == "New");
          if (status) this.newLeadCount = status.count;
        }
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getAllReminders() {
    this.userService.getAllReminders().subscribe(
      (data: any) => {
        this.reminders = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getLeadReminder(id) {
    this.leadsService.getLeadReminder(id).subscribe(
      (res: any) => {
        this.lead_reminders = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filter_name: [""],
      filter_consultant: [null],
      amount: [null],
      filter_status: [[]],
      filter_activity: [[]],
      activity_all: [null],
      filter_channels: [null],
      filter_sources: [[]],
      lead_event_id: [null],
      qualified_feedback_status: [null],
      campaign_id: [null],
      team_id: [null],
      order_by: [{ id: "updated_at", name: "Last Updated" }],
      interested_project_id: [[]],
      date_from: [null],
      date_to: [null],
      from_last_activity_date: [null],
      to_last_activity_date: [null],
      reminder: [""],
      comment: [""],
    });
  }

  getLeadRequests(id) {
    this.projectService.getLeadRequests(id).subscribe(
      (res: any) => {
        this.lead_requests = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLeads() {
    this.route.queryParams.subscribe((params) => {
      // this.reservation_id = +params['id'] || 0;
      console.log(params.status);
      if (params.status_id) {
        this.filterForm.get("filter_status").patchValue([
          {
            id: params.status_id,
            name: params.status_name,
          },
        ]);
        if (params.channel) {
          console.log(JSON.parse(params.channel));
          let channel = JSON.parse(params.channel);
          this.filterForm.get("filter_channels").patchValue(channel);
        }

        this.onFilterSubmit();
      } else if (params.lead_id) {
        this.getLeadDetails(params.lead_id);
      } else if (params.activity_name) {
        this.filterForm.get("activity_all").patchValue({
          name: params.activity_name,
        });
      }
      const leadId = this._route.snapshot.params["id"] || params.lead_id;
      console.log("this._route.snapshot.params", this._route.snapshot.params);

      this.onFilterSubmit(undefined, leadId);
    });
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
        this.projects.unshift({ id: "", name: "All Projects" });
        this.projectsForFilter = [...data.data];
        console.log("!!!!!!!!");
        console.log(this.projectsForFilter);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  onFilterSubmit(paginate_url?, leadId?) {
    console.log("load more");
    this.loadingFilteredLeads = true;
    let page_number = 1;
    if (paginate_url) {
      page_number = paginate_url.split("page=")[1];
    }
    if (leadId) {
      this.leadsService.getLeads({ without_freezed: true }).subscribe(
        (respo: any) => {
          this.filteredLeads = respo.data;
          this.leadsTotal = respo.total;

          //Set new key for checkbox
          this.setKeyForCheckbox();

          this.next_page_url = respo.next_page_url;
          this.slimLoadingBarService.complete();
          this.filterSubmitDisabled = false;
          this.getLeadDetails(leadId);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
          this.filterSubmitDisabled = false;
        }
      );
    } else {
      this.filterSubmitDisabled = true;
      this.slimLoadingBarService.start();
      const {
        fromDateVal,
        interestedProjectVal,
        team_id,
        lead_event_id,
        campaign_id,
        qualified_feedback_status,
        sourceVal,
        channelVal,
        activityVal,
        statusVal,
        agentVal,
        toDateVal,
        reminder,
        comment,
        from_last_activity_date,
        to_last_activity_date,
        activity_all,
      } = this.formDataPayload();
      const params = {
        page: page_number,
        keyword: this.formValue.filter_name,
        amount: this.formValue.amount,
        agent_id: agentVal,
        status: statusVal,
        activity: activityVal,
        lead_channel_id: channelVal,
        lead_source: sourceVal,
        interested_project_id: interestedProjectVal,
        date_from: fromDateVal,
        date_to: toDateVal,
        from_last_activity_date: from_last_activity_date,
        to_last_activity_date: to_last_activity_date,
        lead_event_id: lead_event_id,
        campaign_id: campaign_id,
        qualified_feedback_status: qualified_feedback_status,
        team_id: team_id,
        activity_all: activity_all,
        reminder: reminder,
        comment: comment,
        order_by: this.formValue.order_by ? this.formValue.order_by.id : "",
        without_freezed: true,
      };
      // this.http
      //   .get(
      //     `${environment.api_base_url}leads?keyword=${
      //       this.formValue.filter_name === null
      //         ? ""
      //         : this.formValue.filter_name
      //     }${
      //       this.formValue.amount === null
      //         ? ""
      //         : "&amount=" + this.formValue.amount
      //     }&agent_id=${agentVal === null ? "" : agentVal}&status=${
      //       statusVal === null ? "" : statusVal
      //     }&activity=${
      //       activityVal === null ? "" : activityVal
      //     }&lead_channel_id=${
      //       channelVal === null ? "" : channelVal
      //     }&lead_source=${sourceVal === null ? "" : sourceVal}&order_by=${
      //       this.formValue.order_by ? this.formValue.order_by.id : ""
      //     }&interested_project_id=${
      //       this.formValue.interested_project_id === null
      //         ? ""
      //         : interestedProjectVal
      //     }&date_from=${
      //       this.formValue.date_from === null ? "" : fromDateVal
      //     }&date_to=${
      //       this.formValue.date_to === null ? "" : toDateVal
      //     }&from_last_activity_date=${
      //       this.formValue.from_last_activity_date === null
      //         ? ""
      //         : from_last_activity_date
      //     }&to_last_activity_date=${
      //       this.formValue.to_last_activity_date === null
      //         ? ""
      //         : to_last_activity_date
      //     }&activity_all=${
      //       this.formValue.activity_all === null ? "" : activity_all
      //     }&reminder=${
      //       this.formValue.reminder === null ? "" : reminder
      //     }&comment=${comment}&lead_event_id=${lead_event_id}&qualified_feedback_status=${qualified_feedback_status}&campaign_id=${campaign_id}&team_id=${team_id}&page=${page_number}&without_freezed=true`
      //   )
      this.leadsService.getLeads(params).subscribe(
        (respo: any) => {
          if (paginate_url) {
            this.filteredLeads.push(...respo.data);
          } else {
            this.filteredLeads = respo.data;
            if (respo.data.length !== 0) {
              this.getLeadDetails(this.filteredLeads[0].id);
            }
          }
          this.leadsTotal = respo.total;

          //Set new key for checkbox
          this.setKeyForCheckbox();

          this.next_page_url = respo.next_page_url;
          this.slimLoadingBarService.complete();
          this.filterSubmitDisabled = false;
          this.loadingFilteredLeads = false;
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
          this.filterSubmitDisabled = false;
          this.loadingFilteredLeads = false;
        }
      );
    }
  }

  onReset() {
    this.filterForm.reset();
    this.filterForm.patchValue({
      order_by: { id: "updated_at", name: "Last Updated" },
    });
    this.onFilterSubmit();
  }

  getAllActions() {
    this.slimLoadingBarService.start();
    this.userService.getAllActivites().subscribe(
      (data: any) => {
        this.actions = [...data];
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
    this.userService.getAllActivitesForLeadsFilter().subscribe(
      (data: any) => {
        this.activitiesForFilter = [...data];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCallCenterScript() {
    this.slimLoadingBarService.start();
    this.leadsService.getCallCenterScript().subscribe(
      (data: any) => {
        this.callCenterScript = data;
        console.log(this.callCenterScript);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  viewScript(key) {
    swal({
      width: "70vw",
      title: key
        .split("_")
        .map((a) => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase())
        .join(" "),
      html: `<div class="fs-16 m-00">${this.callCenterScript[key] || ""}</div>`,
    });
  }

  valueChanged(ev) {
    this.chosenAgent = ev;
  }

  leadSource() {
    this.leadSources = null;
    const data = this.leadsService.leadSource();
    this.leadSources = data;
  }

  createForm() {
    // file: this.fileToUpload,
    //   type: this.documentType,
    //   value: this.documentNumber,
    //   value_date: this.documentIssueDate
    this.documentForm = this.fb.group({
      type: ["", Validators.required],
      value: ["", Validators.required],
      value_date: [""],
      image: null,
      is_residence: ["false", Validators.required],
      residence_image: ["", Validators.required],
      residence_name: ["", Validators.required],
    });

    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
  }

  get is_residence() {
    return this.documentForm.get("is_residence").value;
  }

  handleUploadExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadExcel.get("file").setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  uploadExcelMethod(modal) {
    const formModel = this.uploadExcel.value;
    if (!formModel.file) {
      swal("Oops...", "Files can not be empty!", "error");
    } else {
      const data: any = {
        file: formModel.file.value,
        file_name: formModel.file.filename,
      };
      if (this.rotation_id) data.rotation_id = +this.rotation_id;
      if (this.send_to_agent != "all") {
        if (!this.chosenAgent) {
          swal("Oops...", "Agent Can not be empty!", "error");
        } else {
          let agentIsFoundFlag = false;
          this.dataFromSearch.forEach((element) => {
            if (element.name == this.chosenAgent) {
              data.agent_id = element.id;
              agentIsFoundFlag = true;
            }
          });
          if (!agentIsFoundFlag) {
            swal("Oops...", "There is no agent with that name!", "error");
          } else {
            this.uploadExcelUtility(data, modal);
          }
        }
      } else {
        if (this.userData.is_sales_team) {
          data.source = "Self Generated";
        }
        this.slimLoadingBarService.start();
        this.uploadExcelUtility(data, modal);
      }
    }
  }

  uploadExcelUtility(data, modal) {
    this.isSubmittingImport = true;
    this.leadsService
      .uploadLeadsExcel(data)
      .subscribe(
        (response) => {
          modal.close();
          this.onFilterSubmit();
          this.slimLoadingBarService.complete();
          swal("Woohoo!", "Files uploaded succesfully!", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      )
      .add(() => {
        this.isSubmittingImport = false;
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
          .get("residence_image")
          .patchValue((reader.result as any as any).split(",")[1]);
        this.documentForm.get("residence_name").patchValue(file.name);
      };
    }
  }

  onResidenceChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.documentForm.get("image").setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  onDocumentSubmit() {
    this.slimLoadingBarService.start();
    const formModel = this.documentForm.value;
    if (!formModel.image) {
      swal("Oops...", "No file chosen", "error");
    } else {
      const data = {
        image: formModel.image.value,
        type: formModel.type,
        value: formModel.value,
        value_date: formModel.value_date,
        file_name: this.file_name,
        is_residence: formModel.is_residence,
        residence_image: formModel.residence_image,
        residence_name: formModel.residence_name,
      };

      this.leadsService.postDocument(data, this.leadId).subscribe(
        (response) => {
          this.slimLoadingBarService.complete();
          this.createForm();
          swal("Woohoo!", "Document updated succesfully!", "success");
          this.getLeadDetails(this.leadId);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
    }
  }

  SmSgroupSendMethod(modal) {
    const payload = this.smsgroup.value;
    if (!this.smsgroup.valid) {
      swal("All Fields are required", "", "error");
    } else {
      this.slimLoadingBarService.start();
      this.marketingService.sendBulkSmSByStatus(payload).subscribe(
        (res: any) => {
          modal.close();
          this.onFilterSubmit();
          swal("Bulk Messages sent successfully", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  getMoreLeads() {
    if (this.next_page_url) {
      this.getNextLead();
    }
  }

  getNextLead() {
    this.onFilterSubmit(this.next_page_url);
  }
  AddActionLoding = false;
  addAction(modal) {
    this.slimLoadingBarService.start();
    this.activity.leadId = this.leadId;
    const data = {
      title: this.activity.actionName,
      details: this.activity.actionDescription,
      reminder_datetime: this.activity.reminder_datetime,
    };
    this.AddActionLoding = true;
    this.leadsService
      .addLeadActivity(this.leadDetails["id"], data)
      .subscribe(
        (res) => {
          this.activity.actionName = "";
          this.activity.actionDescription = "";
          this.getLeadDetails(this.leadId);
          this.slimLoadingBarService.complete();
          this.activity.actionName = null;
          this.activity.actionDescription = "";
          this.activity.reminder_datetime = null;
          this.getNewLeadStatus();
          this.onFilterSubmit();
          modal.close();
          swal("Woohoo!", "Action created succesfully!", "success");
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      )
      .add(() => {
        this.AddActionLoding = false;
      });
  }

  getStatus() {
    this.status = null;
    this.status = this.leadsService.status();
  }

  changeStatus(modal) {
    this.slimLoadingBarService.start();

    const data = {
      status: this.lstatus.status,
      reason: this.lstatus.changeResaon,
      reminder_datetime: this.lstatus.status_reminder_datetime,
    };

    this.leadsService.changeLeadStatus(this.leadDetails["id"], data).subscribe(
      (respo) => {
        this.getLeadDetails(this.leadId);
        // this.getLeads();
        // this.onFilterSubmit();
        this.filteredLeads.forEach((lead, index) => {
          if (lead.id == this.leadDetails.id) {
            this.filteredLeads[index].status = this.lstatus.status;
          }
        });
        this.getNewLeadStatus();
        modal.close();
        swal("Woohoo!", "Lead status updated succesfully!", "success");
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  assignCopy() {
    this.filteredLeads = Object.assign([], this.leads);
  }

  getLeadDetails(id) {
    if (isNaN(id)) {
      console.error(
        "tried to use getLeadDetails(id), but the id wasn't a number\nData recieved:",
        id
      );

      return;
    }
    this.leadId = id;
    this.selectedLead = id;
    this.slimLoadingBarService.start();
    this.leadsService.getLeadDetails(id).subscribe(
      (data: any) => {
        this.getLeadReminder(this.leadId);
        console.log(data);
        this.getLeadRequests(id);
        this.leadDetails = data.lead;
        this.lstatus.status = data.lead ? data.lead.status : null;
        this.leadActivities = data.activities;
        this.leadId = data.lead.id;
        this.interest_project = data.lead;
        if (this.leadDetails.national_url && this.leadDetails.passport_url) {
          this.imagesArray = [
            new Image(this.leadDetails.national_url),
            new Image(this.leadDetails.passport_url),
          ];
        } else if (
          this.leadDetails.national_url &&
          !this.leadDetails.passport_url
        ) {
          this.imagesArray = [new Image(this.leadDetails.national_url)];
        } else if (
          !this.leadDetails.national_url &&
          this.leadDetails.passport_url
        ) {
          this.imagesArray = [new Image(this.leadDetails.passport_url)];
        } else if (
          !this.leadDetails.national_url &&
          !this.leadDetails.passport_url
        ) {
          this.imagesArray = [];
        }
        if (this.leadDetails.residence_url) {
          this.imagesArray.push(new Image(this.leadDetails.residence_url));
        }
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getActivityDetails(heading) {
    for (let key in this.leadActivities) {
      if (key == heading) {
        const arr = this.leadActivities[heading];
        return arr;
      }
    }
  }

  filterLeadObservable = (keyword: any): any => {
    const baseUrl: string = environment.api_base_url;
    if (keyword) {
      return this.http
        .get(`${baseUrl}users/search?keyword=${keyword}`)
        .map((res: any) => {
          if (res.length == 0) {
            return Observable.of([]);
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res;
            res.forEach((e) => {
              this.arrSearch.push(e.name);
            });
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  observableSource = (keyword: any): any => {
    const baseUrl: string = environment.api_base_url;
    if (keyword) {
      return this.http
        .get(`${baseUrl}users/search?keyword=${keyword}`)
        .map((res: any) => {
          if (res.length == 0) {
            return Observable.of([]);
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res;
            res.forEach((e) => {
              this.arrSearch.push(e.name);
            });
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  };

  getAgents() {
    this.slimLoadingBarService.start();
    this.agents = null;
    this.leadsService.getAgents({ with_admins: true }).subscribe(
      (data: any) => {
        this.agents = data;
        if (!this.userData.is_sales_team) {
          this.agents.forEach((element) => {
            this.agentsArrayString.push(element.name);
          });
        }
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  deleteLead(id) {
    this.slimLoadingBarService.start();
    this.leadsService.delete(id).subscribe(
      (data) => {
        swal("Deleted!", "deleted lead successfully!", "success");
        this.slimLoadingBarService.complete();
        this.leadDetails = null;
        let lead_index;
        this.filteredLeads.forEach((lead, index) => {
          if (lead.id == id) {
            lead_index = index;
          }
        });
        if (lead_index) {
          this.filteredLeads.splice(lead_index, 1);
        }
        this.onFilterSubmit();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  // confirm(title: string, body: string, confirm: () => any, cancel: () => any) {
  //   this.modal
  //     .confirm().size('sm')
  //     .okBtnClass("btn btn-xs btn-info").cancelBtnClass("btn btn-xs btn-info")
  //     .okBtn("Yes").cancelBtn("No")
  //     .title(title).body(body)
  //     .open().then(val => { val.result.then(res => confirm(), res => cancel()) });
  // }

  notifySuccess(message: string) {
    this.notify(message, "success");
  }

  notifyError(message: string) {
    this.notify(message, "danger");
  }

  notify(message: string, status: string) {
    Messenger().post({
      message: message,
      type: status,
      hideAfter: 5,
      singleton: true,
    });
  }

  editLead(leadId) {
    // if (this.userData.role == "Admin") {
    //   this.router.navigate(["./pages/addLead", leadId]);
    // }
    this.router.navigate(["./pages/addLead", leadId]);
  }

  getDocumnetTypes() {
    this.documentTypes = null;
    this.documentTypes = this.leadsService.getDocumnetTypes();
    this.documentType = "Passport";
  }

  confirmLeadDocument() {}

  getLeadDocuments(id) {
    this.leadDocuments = this.leadsService.geLeadDocuments(id);
  }

  assignToAgent() {
    let agent_id = {
      agent_id: this.leadDetails.agent_id,
    };
    this.slimLoadingBarService.start();
    this.leadsService.assignALead(this.leadId, agent_id).subscribe(
      (data) => {
        this.getLeadDetails(this.leadId);
        this.slimLoadingBarService.complete();
        swal(
          "Cool!",
          "Lead assigned to new property consultant succesfully!",
          "success"
        );
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  exportLead() {
    this.slimLoadingBarService.start();
    this.leadsService.exportLeads({ without_freezed: true }).subscribe(
      (data: any) => {
        window.open(data);
        swal("Cool!", "Leads has been exported succesfully!", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  callLead(lead_phone) {
    this.slimLoadingBarService.start();
    this.leadsService
      .callLead({
        caller: this.userData.phone_extension,
        callee: lead_phone,
        cos_id: 1,
        cid_name: this.leadDetails.name,
        cid_number: lead_phone,
      })
      .subscribe(
        (data: any) => {
          swal("Success!", "Calling...", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  createSmSgroupForm() {
    this.smsgroup = this.fb.group({
      lead_status: ["", Validators.required],
      message: ["", Validators.required],
    });
  }
  createSmSBulkForm() {
    this.smsForm = this.fb.group({
      lead_id: ["", Validators.required],
      message: ["", Validators.required],
      phone: ["", Validators.required],
    });
  }

  createEmailBulkForm() {
    this.emailForm = this.fb.group({
      lead_id: ["", Validators.required],
      subject: ["", Validators.required],
      content: ["", Validators.required],
    });
  }
  openSMSgroupModal(modal) {
    this.createSmSgroupForm();
    modal.open();
  }
  openEmailModal(modal) {
    this.createEmailBulkForm();
    this.emailForm.patchValue({
      lead_id: this.leadDetails.id,
    });
    modal.open();
  }

  openSmMModal(modal) {
    this.createSmSBulkForm();
    this.smsForm.patchValue({
      lead_id: this.leadDetails.id,
      phone: this.leadDetails.phone,
    });
    modal.open();
  }
  SmSgroupFormModalOnClose() {
    this.createSmSgroupForm();
  }
  smsModalOnClose() {
    this.createSmSBulkForm();
  }

  emailModalOnClose() {
    this.createEmailBulkForm();
  }

  sendSmSBulk(modal) {
    const payload = this.smsForm.value;
    if (!this.smsForm.valid) {
      swal("All Fields are required", "", "error");
    } else {
      this.slimLoadingBarService.start();
      this.marketingService.sendSingleSmS(payload).subscribe(
        (res: any) => {
          modal.close();
          this.getLeadDetails(payload.lead_id);
          swal("Message send successfully", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  sendEmailBulk(modal) {
    const payload = this.emailForm.value;
    if (!this.emailForm.valid) {
      swal("All Fields are required", "", "error");
    } else {
      this.slimLoadingBarService.start();
      this.marketingService.sendSingleEmail(payload).subscribe(
        (res: any) => {
          modal.close();
          this.getLeadDetails(payload.lead_id);
          swal("Email Sent successfully", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
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

  channelChange(ev) {
    this.channels.forEach((e) => {
      if (e.name == this.channel) {
        this.leadSources = [];
        this.leadSources = e.sources;
      }
    });
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

  addLeadComment(modal) {
    const payload = {
      comment: this.comment,
    };
    this.slimLoadingBarService.start();
    this.leadsService.addLeadComment(this.leadDetails.id, payload).subscribe(
      (res: any) => {
        this.getLeadDetails(this.leadDetails.id);
        this.comment = "";
        this.slimLoadingBarService.complete();
        swal("Comment added successfully.", "", "success");
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editLeadComment(modal) {
    const payload = {
      comment: this.comment,
      comment_id: this.comment_id
    };
    this.slimLoadingBarService.start();
    this.leadsService
      .editLeadComment(this.leadDetails.id, payload)
      .subscribe(
        (res: any) => {
          this.getLeadDetails(this.leadDetails.id);
          this.comment = "";
          this.slimLoadingBarService.complete();
          swal("Comment updated successfully.", "", "success");
          modal.close()
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  toggleDropdown(index: number, event: Event) {
    event.stopPropagation();
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  deleteLeadComment(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete this comment!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then((result: any) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.leadsService.deleteLeadComment(this.leadDetails.id, id).subscribe(
          (res: any) => {
            this.getLeadDetails(this.leadDetails.id);
            swal("success", "Deleted comment successfully!", "success");
          },
          err => {
            swal(err.error.message, "" , "error");
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    })
  }

  brokerChange(value) {
    const payload = {
      lead_id: this.leadDetails.id,
      broker_id: value,
    };
    this.slimLoadingBarService.start();
    this.leadsService.updateLeadBroker(payload).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        swal("Broker assigned to the lead successfully.", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }
  ticketTypeChange(value) {
    const payload = {
      ticket_type_id: value,
    };
    this.slimLoadingBarService.start();
    this.leadsService
      .updateLeadTicketType(this.leadDetails.id, payload)
      .subscribe(
        (res: any) => {
          this.getLeadDetails(this.leadDetails.id);
          this.slimLoadingBarService.complete();
          swal("Changed successfully.", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  exportFilter() {
    this.formValue = this.filterForm.value;
  }

  export() {
    this.slimLoadingBarService.start();
    this.leadsService.exportLeads({ without_freezed: true }).subscribe(
      (res: any) => {
        this.channels = res;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  formDataPayload() {
    this.formValue = this.filterForm.value;
    let agentVal = "";
    if (this.formValue.filter_consultant) {
      const consultantIndex = this.dataFromSearch.findIndex(
        (a) => a.name === this.formValue.filter_consultant
      );
      agentVal = this.dataFromSearch[consultantIndex].id;
    }
    const statusVal =
      this.formValue.filter_status && this.formValue.filter_status.length
        ? this.formValue.filter_status.map((el) => el.name).join(",")
        : "";
    const activityVal =
      this.formValue.filter_activity && this.formValue.filter_activity.length
        ? this.formValue.filter_activity.map((el) => el.name).join(",")
        : "";
    const channelVal = this.formValue.filter_channels
      ? this.formValue.filter_channels.id
      : "";
    const sourceVal =
      this.formValue.filter_sources && this.formValue.filter_sources.length
        ? this.formValue.filter_sources.map((el) => el.name).join(",")
        : "";
    const lead_event_id = this.formValue.lead_event_id
      ? this.formValue.lead_event_id.id
      : "";
    const qualified_feedback_status = this.formValue.qualified_feedback_status
      ? this.formValue.qualified_feedback_status.id
      : "";

    const campaign_id = this.formValue.campaign_id
      ? this.formValue.campaign_id.id
      : "";

    const team_id = this.formValue.team_id ? this.formValue.team_id.id : "";
    const interestedProjectVal =
      this.formValue.interested_project_id &&
      this.formValue.interested_project_id.length
        ? this.formValue.interested_project_id.map((el) => el.id).join(",")
        : "";
    const fromDateVal = this.formValue.date_from
      ? this.formValue.date_from
      : "";
    const toDateVal = this.formValue.date_to ? this.formValue.date_to : "";
    const from_last_activity_date = this.formValue.from_last_activity_date
      ? this.formValue.from_last_activity_date
      : "";
    const to_last_activity_date = this.formValue.to_last_activity_date
      ? this.formValue.to_last_activity_date
      : "";
    const reminder = this.formValue.reminder ? this.formValue.reminder : "";
    const comment = this.formValue.comment ? this.formValue.comment : "";
    const activity_all = this.formValue.activity_all
      ? this.formValue.activity_all.name
      : "";
    console.log(this.formValue.filter_status);
    return {
      fromDateVal,
      interestedProjectVal,
      team_id,
      lead_event_id,
      campaign_id,
      qualified_feedback_status,
      sourceVal,
      channelVal,
      activityVal,
      statusVal,
      agentVal,
      toDateVal,
      reminder,
      comment,
      from_last_activity_date,
      to_last_activity_date,
      activity_all,
    };
    // keyword: this.formValue.filter_name,
    //   fromDateVal: fromDateVal,
    //   interestedProjectVal: interestedProjectVal,
    //   team_id: team_id,
    //   lead_event_id: lead_event_id,
    //   campaign_id: campaign_id,
    //   qualified_feedback_status: qualified_feedback_status,
    //   sourceVal: sourceVal,
    //   channelVal: channelVal,
    //   activityVal: activityVal,
    //   statusVal: statusVal,
    //   agentVal: agentVal,
    //   toDateVal: toDateVal,
    //   reminder: reminder,
    //   comment: comment,
    //   from_last_activity_date: from_last_activity_date,
    //   to_last_activity_date: to_last_activity_date,
    //   activity_all: activity_all,
    //   order_by: this.formValue.order_by,
    //   interested_project_id: this.formValue.interested_project_id,
    //   date_from: this.formValue.date_from,
    //   amount: this.formValue.amount,
    //   is_export: 0,
  }

  exportFillteredLeads() {
    // let payload = this.formDataPayload();
    // payload.is_export = 1
    // this.slimLoadingBarService.start();
    // this.leadsService.exportFillteredLeads(payload).subscribe(
    //   (data: any) => {
    //     // this.searchLeadSources = data;
    //     console.log(data);
    //     window.open(data.url, "_blank");
    //     this.slimLoadingBarService.complete();
    //   },
    //   (err) => {
    //     console.log(err);
    //     this.slimLoadingBarService.reset();
    //   }
    // );
    const {
      fromDateVal,
      interestedProjectVal,
      team_id,
      lead_event_id,
      qualified_feedback_status,
      campaign_id,
      sourceVal,
      channelVal,
      activityVal,
      statusVal,
      agentVal,
      toDateVal,
      reminder,
      comment,
      from_last_activity_date,
      to_last_activity_date,
    } = this.formDataPayload();
    this.slimLoadingBarService.start();
    const params = {
      keyword: this.formValue.filter_name,
      agent_id: agentVal,
      status: statusVal,
      activity: activityVal,
      lead_channel_id: channelVal,
      lead_source: sourceVal,
      is_export: 1,
      order_by: this.formValue.order_by.id,
      interested_project_id: this.formValue.interested_project_id,
      date_from: this.formValue.date_from,
      date_to: this.formValue.date_to,
      from_last_activity_date: this.formValue.from_last_activity_date,
      to_last_activity_date: this.formValue.to_last_activity_date,
      amount: this.formValue.amount,
      reminder: this.formValue.reminder,
      comment: this.formValue.comment,
      lead_event_id: lead_event_id,
      campaign_id: campaign_id,
      team_id: team_id,
      qualified_feedback_status: qualified_feedback_status,
    };
    
    params.interested_project_id && (params.interested_project_id =  this.formValue.interested_project_id.map((p) => p["id"]).join(","))
    // this.http
    //   .get(
    //     `${environment.api_base_url}leads?keyword=${
    //       this.formValue.filter_name === null ? "" : this.formValue.filter_name
    //     }&agent_id=${agentVal === null ? "" : agentVal}&status=${
    //       statusVal === null ? "" : statusVal
    //     }&activity=${activityVal === null ? "" : activityVal}&lead_channel_id=${
    //       channelVal === null ? "" : channelVal
    //     }&lead_source=${
    //       sourceVal === null ? "" : sourceVal
    //     }&is_export=1&order_by=${
    //       this.formValue.order_by ? this.formValue.order_by.id : ""
    //     }&interested_project_id=${
    //       this.formValue.interested_project_id === null
    //         ? ""
    //         : interestedProjectVal
    //     }&date_from=${
    //       this.formValue.date_from === null ? "" : fromDateVal
    //     }&date_to=${
    //       this.formValue.date_to === null ? "" : toDateVal
    //     }&from_last_activity_date=${
    //       this.formValue.from_last_activity_date === null
    //         ? ""
    //         : from_last_activity_date
    //     }&to_last_activity_date=${
    //       this.formValue.to_last_activity_date === null
    //         ? ""
    //         : to_last_activity_date
    //     }&${
    //       this.formValue.amount === null
    //         ? ""
    //         : `amount=${this.formValue.amount}&}`
    //     }reminder=${
    //       this.formValue.reminder === null ? "" : reminder
    //     }&comment${comment}&lead_event_id=${lead_event_id}&qualified_feedback_status=${qualified_feedback_status}&campaign_id=${campaign_id}&team_id=${team_id}`
    //   )
    this.leadsService.getLeads(params).subscribe(
      (data: any) => {
        // this.searchLeadSources = data;
        console.log(data);
        window.open(data.url, "_blank");
        this.slimLoadingBarService.complete();
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  addAdminComent(modal) {
    console.log(this.adminComment);
    let payload = {
      admin_comment: this.adminComment,
    };
    this.slimLoadingBarService.start();
    this.http
      .put(
        `${environment.api_base_url}leads/${this.leadId}/admin_comment`,
        JSON.stringify(payload)
      )
      .subscribe(
        (res: any) => {
          swal("success", "added admin comment successfully", "success");
          this.slimLoadingBarService.complete();
          this.adminComment = this.leadDetails.admin_comment;
          modal.close();
        },
        (err) => {
          console.log(err);
          this.slimLoadingBarService.reset();
        }
      );
  }

  addRequest() {
    console.log(this.request);
    let payload = {
      project_id: this.request.project_id,
      unit_type_id: this.request.unit_type,
      country: this.request.country,
      governorate: this.request.governorate,
      district: this.request.district,
      delivery_date: this.request.delivery_date,
      budget_from: this.request.total_budget_from,
      budget_to: this.request.total_budget_to,
      down_payment_from: this.request.down_payment_from,
      down_payment_to: this.request.down_payment_to,
      installments_from: this.request.monthly_installments_from,
      installments_to: this.request.monthly_installments_to,
      unit_area_from: this.request.unit_area_from,
      unit_area_to: this.request.unit_area_to,
    };
    this.slimLoadingBarService.start();
    this.projectService.addLeadRequest(this.leadDetails.id, payload).subscribe(
      (res: any) => {
        this.getLeadRequests(this.leadDetails.id);
        this.slimLoadingBarService.complete();
        this.request = new LeadRequest();
        swal("Sucecss", "Added request successfully", "success");
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  onProjectChange(event) {
    console.log(this.request.project_id);
    this.getUnitTypes(this.request.project_id);
  }

  getUnitTypes(project_id) {
    this.slimLoadingBarService.start();
    this.projectService.getUnitTypes(project_id).subscribe(
      (data) => {
        this.types = data;
        console.log(this.types);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  leadHadMeeting() {
    swal({
      title: "Are you sure?",
      text: "indoor a meeting!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reserve it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.leadsService.indoorMeeting(this.leadDetails.id).subscribe(
          (data) => {
            console.log(data);
            swal("success", "Indoor Meeting successfully", "success");
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  addReminder() {
    this.slimLoadingBarService.start();
    const data = {
      title: this.reminder.title,
      details: this.reminder.details,
      reminder_datetime: this.reminder.reminder_datetime,
    };
    console.log(data);
    this.leadsService.addLeadReminder(this.leadDetails["id"], data).subscribe(
      (res) => {
        this.reminder = {
          title: null,
          details: null,
          reminder_datetime: null,
        };
        this.getLeadReminder(this.leadId);
        this.slimLoadingBarService.complete();
        swal("Woohoo!", "Reminder created succesfully!", "success");
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  onReminderChange(event, rem) {
    this.slimLoadingBarService.start();
    this.leadsService.toggleReminderRead(rem.id).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  //Set new key for checkbox
  setKeyForCheckbox() {
    this.filteredLeads.forEach((element) => {
      if (this.allChecked == true) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
    this.updateSelectedCount();
  }

  updateAllComplete() {
    this.allChecked =
      this.filteredLeads != null &&
      this.filteredLeads.every((lead) => lead.checked);
    this.updateSelectedCount();
  }

  someComplete(): boolean {
    if (this.filteredLeads == null) {
      return false;
    }
    return (
      this.filteredLeads.filter((lead) => lead.checked).length > 0 &&
      !this.allChecked
    );
  }

  setAll(checked: boolean) {
    this.allChecked = checked;

    if (this.filteredLeads == null) {
      return;
    }
    this.filteredLeads.forEach((lead) => (lead.checked = checked));
    this.updateSelectedCount();
  }

  selectAllLeads(checked: boolean) {
    this.disableCheckbox = checked;
    this.allLeadsChecked = checked;

    if (this.filteredLeads == null) {
      return;
    }
    this.allChecked = false;
    this.filteredLeads.forEach((lead) => (lead.checked = false));

    if (checked) {
      this.selectedLeadsCount = this.leadsTotal;
      this.reassignLeadsPayload.select_all = true;
      this.deleteLeadsPayload.select_all = true;
    } else {
      this.selectedLeadsCount = 0;
      this.reassignLeadsPayload.select_all = false;
      this.deleteLeadsPayload.select_all = false;
      this.setNull(this.reassignLeadsPayload);
      this.setNull(this.deleteLeadsPayload);
    }
  }

  updateSelectedCount() {
    this.selectedLeadsCount = this.filteredLeads.filter(
      (lead) => lead.checked == true
    ).length;
  }

  reassignLeadsModalOpen(modal) {
    this.selectedLeadsID = this.filteredLeads
      .filter((lead) => lead.checked == true)
      .map((lead) => lead.id);
    this.reassignLeadsPayload.leads_ids = this.selectedLeadsID;

    if (this.disableCheckbox) {
      this.reassignLeadsPayload = {
        ...this.reassignLeadsPayload,
        ...this.formValue,
      };
    }

    console.log(this.reassignLeadsPayload);

    if (
      this.selectedLeadsID.length < 1 &&
      !this.reassignLeadsPayload.select_all
    ) {
      swal({
        title: "There is no selected leads",
        text: "You have to select leads first!!",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Go, select leads first!",
      }).then((result) => {
        modal.close();
      });
    }
  }

  reassignLeadsModalClose(modal) {
    this.setNull(this.reassignLeadsPayload);
    modal.close();
  }

  reassignLeadsModalSubmit(modal) {
    swal({
      title: "Are you sure?",
      text: "You are about to do an actions over multiple leads!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Do it!",
      cancelButtonText: "No.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.formValue = this.filterForm.value;
        let agentVal = "";
        if (this.formValue.filter_consultant) {
          const consultantIndex = this.dataFromSearch.findIndex(
            (a) => a.name === this.formValue.filter_consultant
          );
          agentVal = this.dataFromSearch[consultantIndex].id;
        }
        this.reassignLeadsPayload.agent_id = agentVal;
        this.slimLoadingBarService.start();
        this.reassignLeadsPayload.status =
          this.formValue.filter_status && this.formValue.filter_status.length
            ? this.formValue.filter_status.map((el) => el.name).join(",")
            : "";
        this.reassignLeadsPayload.activity =
          this.formValue.filter_activity &&
          this.formValue.filter_activity.length
            ? this.formValue.filter_activity.map((el) => el.name).join(",")
            : "";
        this.reassignLeadsPayload.interested_project_id =
          this.formValue.interested_project_id &&
          this.formValue.interested_project_id.length
            ? this.formValue.interested_project_id.map((el) => el.id).join(",")
            : "";
        this.reassignLeadsPayload.lead_channel_id = this.formValue
          .filter_channels
          ? this.formValue.filter_channels.id
          : "";
        this.reassignLeadsPayload.lead_source =
          this.formValue.filter_sources && this.formValue.filter_sources.length
            ? this.formValue.filter_sources.map((el) => el.name).join(",")
            : "";
        this.reassignLeadsPayload.lead_event_id = this.formValue.lead_event_id
          ? this.formValue.lead_event_id.id
          : "";
        this.reassignLeadsPayload.qualified_feedback_status = this.formValue
          .qualified_feedback_status
          ? this.formValue.qualified_feedback_status.id
          : "";

        this.reassignLeadsPayload.campaign_id = this.formValue
          .campaign_id
          ? this.formValue.campaign_id.id
          : "";

        this.reassignLeadsPayload.team_id = this.formValue.team_id
          ? this.formValue.team_id.id
          : "";
        this.reassignLeadsPayload.date_from = this.formValue.date_from
          ? this.formValue.date_from
          : "";
        this.reassignLeadsPayload.date_to = this.formValue.date_to
          ? this.formValue.date_to
          : "";
        this.reassignLeadsPayload.reminder = this.formValue.reminder
          ? this.formValue.reminder
          : "";
        this.reassignLeadsPayload.keyword = this.formValue.filter_name;
        this.reassignLeadsPayload.activity_all = this.formValue.activity_all
          ? this.formValue.activity_all.name
          : "";
        for (let key in this.reassignLeadsPayload) {
          if (this.reassignLeadsPayload[key] == null)
            delete this.reassignLeadsPayload[key];
        }
        if (this.assign_type == "agent") {
          delete this.reassignLeadsPayload.rotation_id;
        } else {
          delete this.reassignLeadsPayload.reassign_user_id;
        }
        delete this.reassignLeadsPayload.order_by;
        this.leadsService.reassignAllLeads(this.reassignLeadsPayload).subscribe(
          (data) => {
            this.allLeadsChecked = false;
            this.selectAllLeads(false);

            //Set all object key to null after submission
            this.setNull(this.reassignLeadsPayload);

            modal.close();

            this.getLeads();

            this.slimLoadingBarService.complete();

            swal(
              "Cool!",
              "Leads assigned to new agent succesfully!",
              "success"
            );
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.reset();
          },
          () => this.slimLoadingBarService.complete()
        );
      }
    });
  }

  deleteLeadsModalOpen(modal) {
    this.selectedLeadsID = this.filteredLeads
      .filter((lead) => lead.checked == true)
      .map((lead) => lead.id);
    this.deleteLeadsPayload.leads_ids = this.selectedLeadsID;

    if (this.disableCheckbox) {
      this.deleteLeadsPayload = {
        ...this.deleteLeadsPayload,
        ...this.formValue,
      };
    }

    if (
      this.selectedLeadsID.length < 1 &&
      !this.deleteLeadsPayload.select_all
    ) {
      swal({
        title: "There is no selected leads",
        text: "You have to select leads first!!",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Go, select leads first!",
      }).then((result) => {
        modal.close();
      });
    }
  }

  deleteLeadsModalClose(modal) {
    this.setNull(this.deleteLeadsPayload);
    modal.close();
  }

  deleteLeadsModalSubmit(modal) {
    swal({
      title: "Are you sure?",
      text: "You are about to do an actions over multiple leads!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Do it!",
      cancelButtonText: "No.",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.formValue = this.filterForm.value;
        let agentVal = "";
        if (this.formValue.filter_consultant) {
          const consultantIndex = this.dataFromSearch.findIndex(
            (a) => a.name === this.formValue.filter_consultant
          );
          agentVal = this.dataFromSearch[consultantIndex].id;
        }
        this.deleteLeadsPayload.agent_id = agentVal;
        this.deleteLeadsPayload.status =
          this.formValue.filter_status && this.formValue.filter_status.length
            ? this.formValue.filter_status.map((el) => el.name).join(",")
            : "";
        this.deleteLeadsPayload.activity =
          this.formValue.filter_activity &&
          this.formValue.filter_activity.length
            ? this.formValue.filter_activity.map((el) => el.name).join(",")
            : "";
        this.deleteLeadsPayload.interested_project_id =
          this.formValue.interested_project_id &&
          this.formValue.interested_project_id.length
            ? this.formValue.interested_project_id.map((el) => el.id).join(",")
            : "";
        this.deleteLeadsPayload.lead_channel_id = this.formValue.filter_channels
          ? this.formValue.filter_channels.id
          : "";
        this.deleteLeadsPayload.lead_source =
          this.formValue.filter_sources && this.formValue.filter_sources.length
            ? this.formValue.filter_sources.map((el) => el.name).join(",")
            : "";
        this.deleteLeadsPayload.lead_event_id = this.formValue.lead_event_id
          ? this.formValue.lead_event_id.id
          : "";
        this.deleteLeadsPayload.qualified_feedback_status = this.formValue
          .qualified_feedback_status
          ? this.formValue.qualified_feedback_status.id
          : "";

        this.deleteLeadsPayload.campaign_id = this.formValue
          .campaign_id
          ? this.formValue.campaign_id.id
          : "";

        this.deleteLeadsPayload.team_id = this.formValue.team_id
          ? this.formValue.team_id.id
          : "";
        this.deleteLeadsPayload.interested_project_id = this.formValue
          .interested_project_id
          ? this.formValue.interested_project_id
          : "";
        this.deleteLeadsPayload.date_from = this.formValue.date_from
          ? this.formValue.date_from
          : "";
        this.deleteLeadsPayload.date_to = this.formValue.date_to
          ? this.formValue.date_to
          : "";
        this.deleteLeadsPayload.reminder = this.formValue.reminder
          ? this.formValue.reminder
          : "";
        this.deleteLeadsPayload.keyword = this.formValue.filter_name;
        this.deleteLeadsPayload.activity_all = this.formValue.activity_all
          ? this.formValue.activity_all.name
          : "";
        for (let key in this.deleteLeadsPayload) {
          if (this.deleteLeadsPayload[key] == null)
            delete this.deleteLeadsPayload[key];
        }
        delete this.deleteLeadsPayload.order_by;
        this.leadsService.deleteBulkLeads(this.deleteLeadsPayload).subscribe(
          (data) => {
            this.allLeadsChecked = false;
            this.selectAllLeads(false);

            modal.close();

            this.getLeads();

            this.slimLoadingBarService.complete();

            swal("Cool!", "Leads deleted succesfully!", "success");
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.reset();
          },
          () => this.slimLoadingBarService.complete()
        );
      }
    });
  }

  //Set all object key to null after submission #45897879 stackoverflow
  setAllKeys(obj, val) {
    Object.keys(obj).forEach(function (index) {
      obj[index] = val;
    });
  }

  setNull(obj) {
    this.setAllKeys(obj, null);
  }

  // leads scroll

  ngAfterViewInit() {
    this.leadsContainer.nativeElement.addEventListener(
      "scroll",
      this.leadsCheckLastAndLoadNext.bind(this)
    );
  }

  leadsCheckLastAndLoadNext() {
    if (
      !this.loadingFilteredLeads &&
      this.leadsContainer.nativeElement.scrollHeight -
        this.leadsContainer.nativeElement.scrollTop -
        this.leadsContainer.nativeElement.clientHeight <
        10 &&
      this.next_page_url
    ) {
      this.getMoreLeads();
    }
  }

  addToBlocklist() {
    swal({
      title: "Are you sure?",
      text: "you will add this lead to the blocklist!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, blocklist it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.leadsService.addLeadToBlockList(this.leadDetails.id).subscribe(
          (data) => {
            console.log(data);
            swal("success", "lead added to blocklist successfully", "success");
            this.leadDetails = {
              ...this.leadDetails,
              is_blocklist: 1,
            };
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.reset();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  removeFromBlocklist() {
    swal({
      title: "Are you sure?",
      text: "you will remove this lead from the blocklist!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.leadsService
          .removeLeadFromBlockList(this.leadDetails.id)
          .subscribe(
            (data) => {
              console.log(data);
              swal(
                "success",
                "lead removed from blocklist successfully",
                "success"
              );
              this.leadDetails = {
                ...this.leadDetails,
                is_blocklist: 0,
              };
              this.slimLoadingBarService.complete();
            },
            (err) => {
              this.errorHandlerService.handleErorr(err);
              this.slimLoadingBarService.reset();
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }
}
