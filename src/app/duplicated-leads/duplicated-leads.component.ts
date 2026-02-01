import { Component, OnInit, ViewChild } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { MarketingService } from "../services/marketing/marketing.service";
import { ProjectsService } from "../services/projects/projects.service";
import { AccountsService } from "../services/settings-service/accounts/accounts.service";
import { UserServiceService } from "../services/user-service/user-service.service";

@Component({
  selector: "app-duplicated-leads",
  templateUrl: "./duplicated-leads.component.html",
  styleUrls: ["./duplicated-leads.component.css"],
})
export class DuplicatedLeadsComponent implements OnInit {
  @ViewChild("assignModal") assignModal: any;
  dublicated_raw_data: any = [];
  dublicated_leads: any;
  last_page_url: any;

  current_page: any;
  per_page: any;
  total: any;
  totalRec: any;
  page: any = 1;
  lg = "lg";
  projects: any;
  channels: any;
  sources: any;
  campaigns: any;
  brokers: any;
  ambassadors: any;
  agent_id: any;
  agents: any;
  activeLead: any;
  selectedLeads: any[] = [];
  page_length: number = 15;
  search_form: any = {
    name: "",
    phone: "",
    email: "",
    file_id: null,
    lead_source: null,
    lead_channel_id: null,
    campaign_id: null,
    broker_id: null,
    ambassador_id: null,
    project_id: null,
  };
  files: any[];
  file_opened: boolean = false;

  constructor(
    private leadsService: LeadsService,
    private projectsService: ProjectsService,
    private marketingService: MarketingService,
    private accountService: AccountsService,
    private userService: UserServiceService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getDuplicatedLeads();
    this.getProjects();
    this.getChannels();
    this.getBrokers();
    this.getAmbassadors();
    this.getAgents();
    this.getImportFiles();
  }

  getImportFiles() {
    this.leadsService.getImportFiles().subscribe((res: any) => {
      this.files = res;
    }, (err: any) => {
      this.errorHandlerService.handleErorr(err);
    })
  }

  getImportFileDuplicates(id) {
    this.leadsService.getImportFileDuplicates(id).subscribe((res: any) => {
      this.dublicated_leads = res;
      this.file_opened = true;
    }, (err: any) => {
      this.errorHandlerService.handleErorr(err);
    })
  }

  getAgents() {
    this.leadsService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getDuplicatedLeads() {
    this.slimLoadingBarService.start();
    this.leadsService.getDuplicatedLeads(this.search_form).subscribe(
      (res: any) => {
        delete this.search_form["page"];
        this.slimLoadingBarService.complete();
        this.dublicated_raw_data = res;
        this.dublicated_leads = res.data;
        this.dublicated_leads.forEach((e) => {
          e.checked = false;
          if (this.selectedLeads.length > 0) {
            this.selectedLeads.forEach((s) => {
              if (e.id == s.id) {
                e.checked = true;
              }
            });
          }
        });
        this.last_page_url = res.last_page_url;
        this.current_page = 1;
        this.per_page = res.to;
        this.total = res.total;
        this.totalRec = res.total;
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getProjects() {
    this.projectsService
      .getProjects({ is_select_form: true })
      .subscribe((res: any) => {
        this.projects = res;
      });
  }

  getChannels() {
    this.marketingService.getChannels().subscribe((res: any) => {
      this.channels = res;
    });
  }

  getSources() {
    this.channels.forEach((element) => {
      if (element.id == this.search_form.lead_channel_id) {
        this.sources = element.sources;
      }
    });
  }

  getBrokers() {
    this.accountService.getBrokers().subscribe((res: any) => {
      this.brokers = res;
    });
  }

  getAmbassadors() {
    this.userService.getAmbasdors({ paginate: false }).subscribe((res: any) => {
      this.ambassadors = res;
    });
  }

  resetFilter() {
    const temp_file_id = this.search_form.file_id;
    this.search_form = {
      name: "",
      phone: "",
      email: "",
      lead_source: null,
      lead_channel_id: null,
      campaign_id: null,
      broker_id: null,
      file_id: temp_file_id,
      ambassador_id: null,
      project_id: null,
      page: 1,
    };
    this.getDuplicatedLeads();
  }

  pageChange(event) {
    let arr = this.last_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.leadsService.infinit(url, this.search_form).subscribe(
      (data: any) => {
        this.dublicated_raw_data = data;
        this.dublicated_leads = data.data;
        this.totalRec = data.total;
        this.current_page = number;
        this.per_page = data.to;
        this.total = data.total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }
  redirectToLeadDetails(phone) {
    if (!isNaN(phone)) {
      this.router.navigate(["/pages/leads"], {
        queryParams: {
          filter_name: phone,
        },
      });
    }
    return;
  }

  mergeDuplicateLeads(id?: number) {
    this.slimLoadingBarService.start();
    const payload = {
      ids: [],
    };
    if (id) payload.ids.push(id);
    else {
      this.dublicated_leads.forEach((e) => {
        if (e.checked) payload.ids.push(e.id);
      });
    }
    this.leadsService.mergeDuplicateLeads(payload).subscribe(
      (data: any) => {
        this.getDuplicatedLeads();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  reAssignDuplicateLeads(modal: any, id?: number) {
    this.slimLoadingBarService.start();
    const payload = {
      ids: [],
      agent_id: null,
    };
    if (id) payload.ids.push(id);
    else if (this.activeLead) payload.ids.push(this.activeLead.id);
    else {
      this.dublicated_leads.forEach((e) => {
        if (e.checked) payload.ids.push(e.id);
      });
    }
    payload.agent_id = this.agent_id;
    this.leadsService.reAssignDuplicateLeads(payload).subscribe(
      (data: any) => {
        this.getDuplicatedLeads();
        this.activeLead && (this.activeLead = null);
        this.slimLoadingBarService.complete();
        modal.close();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  deleteDuplicateLeads(id?: number) {
    this.slimLoadingBarService.start();
    const payload = {
      ids: [],
    };
    if (id) payload.ids.push(id);
    else {
      this.dublicated_leads.forEach((e) => {
        if (e.checked) payload.ids.push(e.id);
      });
    }
    this.leadsService.deleteDuplicateLeads(payload).subscribe(
      (data: any) => {
        this.getDuplicatedLeads();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }
  actionChange(event, lead) {
    switch (event) {
      case "merge":
        lead ? this.mergeDuplicateLeads(lead.id) : this.mergeDuplicateLeads();
        break;
      case "reassign":
        this.assignModal.open();
        this.activeLead = lead;
        // lead ? this.reAssignDuplicateLeads(lead.id) : this.reAssignDuplicateLeads();
        break;
      case "delete":
        lead ? this.deleteDuplicateLeads(lead.id) : this.deleteDuplicateLeads();
        break;
    }
  }
}
