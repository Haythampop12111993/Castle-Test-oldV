import { UserServiceService } from "./../services/user-service/user-service.service";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ProjectsService } from "../services/projects/projects.service";
import { MarketingService } from "../services/marketing/marketing.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { TeamService } from "../services/settings-service/team/team.service";
import { HttpParams } from "@angular/common/http";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color } from "ng2-charts";
@Component({
  selector: "app-marketing-report",
  templateUrl: "./marketing-report.component.html",
  styleUrls: ["./marketing-report.component.css"],
})
export class MarketingReportComponent implements OnInit {
  monthly_sources_residential: any;
  brokers_residential: any;
  monthly_report: any;
  monthly_yearly_report: any;
  daily_residential_reservations: any;
  hold_reports: any;
  eois_reports: any;

  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  view: any;

  projects: any;
  projectsDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  agentsDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  unitTypesDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  filter_form: FormGroup;

  project_id: any;
  source_id: any;
  campaign_id: any;
  agent_id: any;
  broker_id: any;
  types: any;

  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  allSources;
  allEvents;
  allAgents;
  allBrokers;

  selectedSources: any = [];
  sources_filter = false;
  brokers_filter = false;

  isLoading = false;

  agents_activities_leads_data;
  activeCampaign: any | null = null;

  // loading alg
  loading_texts = [
    "Initiating Report",
    "Calculate Data",
    "Grouping Results",
    "Loading",
  ];

  loader = {
    index: 0,
    dot: 0,
    maxDot: 3,
    text: this.loading_texts[0],
    interval: null,
  };

  page = 1;
  leadsPage = 1;

  sourcePage = 1;

  views_conf = {
    filters: false,
    charts: false,
  };

  charts: any = {
    eoi_accumulative: {},
    eoi_daily: {},
    eoi_monthly: {},
    eoi_yearly: {},
    matching: {},
    post_date_analysis: {
      months: {},
      years: {},
    },
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      gridLines: {
        display: false,
      },
    },

    layout: {
      padding: 10,
    },
    elements: {
      line: {
        fill: "origin",
        radius: 5,
        tension: 0.4,
      },
    },
  };

  downloading_export: boolean = false;

  unit_types: any;
  unit_types_filter: boolean = false;

  unit_types_status: any;
  unit_types_status_filter: boolean = false;

  unit_design_types: any;

  years = [
    2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
    2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033,
  ];

  params: any = {
    sort: null,
  };

  brokerParams: any = {
    projects_ids: null,
    from_date: null,
    to_date: null,
    brokers_ids: null,
    agents_ids: null,
    page: 1,
  };
  campaignsFilter: any;
  campaigns: any;
  leads: any;
  leadStatus: any;
  agents: any;
  campaign_name: string;
  keyword: any;
  catch_from: any;
  catch_to: any;
  allTeams: any;
  team_ids: any;
  campaign_ids: any;

  // Pie Chart Configuration
  pieChartData: number[] = [];
  pieChartLabels: string[] = [];
  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right',
    },
  };
  pieChartColors: Color[] = [
    {
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
      ],
    },
  ];

  // Bar Chart Configuration
  barChartData: ChartDataSets[] = [];
  barChartLabels: string[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };
  barChartColors: Color[] = [
    {
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
      ],
      borderColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
      ],
      borderWidth: 1,
    },
  ];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private projectService: ProjectsService,
    private teamService: TeamService,
    private leadService: LeadsService,
    private formBuilder: FormBuilder,
    private leadsService: LeadsService,
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private marketingService: MarketingService
  ) {
    if (this.userData.role == "Campaign Viewer") {
      this.view = "campaign";
    } else {
      this.view = "sources";
    }
  }

  ngOnInit() {
    this.setView(this.view);
    this.userData.role != "Campaign Viewer" && this.getUnitDesignTypes();
    this.createFilterForm();
    this.getAllProjects();
    this.getTeams()
    this.getAllAgents();
    this.userData.role != "Campaign Viewer" && this.getAllBrokers();
    this.userData.role != "Campaign Viewer" && this.getCampaignsFilter();
    this.userData.role != "Campaign Viewer" && this.getCampaigns();
  }


  getTeams() {
    this.slimLoadingBarService.start();
    this.teamService.getTeams().subscribe(
      res => {
        this.allTeams = res.data;
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }


  getCampaignsFilter() {
    this.slimLoadingBarService.start();
    this.marketingService.getCampaigns({ paginate: false }).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        console.log(res);
        this.campaignsFilter = res;
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  getCampaigns(params: any = {}) {
    this.slimLoadingBarService.start();
    this.marketingService.getCampaigns(params).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.campaigns = res;
        this.activeCampaign = this.campaigns.data[0];
        this.getLeadsAgents(this.activeCampaign.id);
        this.getLeads(this.activeCampaign.id);
        this.getLeadStatus(this.activeCampaign.id);
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  getNewRecord(event) {
    this.campaigns = event;
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  resetCharts() {
    // Clear chart data to force reinitialization
    this.pieChartData = [];
    this.pieChartLabels = [];
    this.barChartData = [];
    this.barChartLabels = [];
  }

  getLeadStatus(campaign_id) {
    const params = {
      campaign_id: campaign_id,
    };

    // Clear existing chart data before loading new data
    this.resetCharts();

    this.marketingService.getLeadStatus(params).subscribe((res: any) => {
      this.leadStatus = res;

      // Populate Pie Chart Data (Leads by Status)
      if (this.leadStatus && this.leadStatus.statuses && this.leadStatus.statuses.length > 0) {
        this.pieChartLabels = this.leadStatus.statuses.map(function(status) {
          return status.status_name;
        });
        this.pieChartData = this.leadStatus.statuses.map(function(status) {
          return status.status_count;
        });
      }

      // Populate Bar Chart Data (All Lead Statuses Comparison)
      if (this.leadStatus && this.leadStatus.statuses && this.leadStatus.statuses.length > 0) {
        this.barChartLabels = this.leadStatus.statuses.map(function(status) {
          return status.status_name;
        });
        this.barChartData = [
          {
            data: this.leadStatus.statuses.map(function(status) {
              return status.status_count;
            }),
            label: 'Leads Count by Status'
          }
        ];
      }
    });
  }

  getLeads(
    campaign_id,
    page = 1,
    keyword?: any,
    catch_from?: any,
    catch_to?: any
  ) {
    this.slimLoadingBarService.start();
    const params = {
      page: page,
      campaign_id: campaign_id,
      keyword: keyword,
      catch_from: catch_from,
      catch_to: catch_to,
      order_by: "created_at",
    };
    this.leadService.getLeads(params).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.leads = res;
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  exportLeads(
    campaign_id,
    page = 1,
    keyword?: any,
    catch_from?: any,
    catch_to?: any
  ) {
    this.slimLoadingBarService.start();
    const params = {
      page: page,
      campaign_id: campaign_id,
      keyword: keyword,
      catch_from: catch_from,
      catch_to: catch_to,
      order_by: "created_at",
      is_export: 1,
      export_from_campaign_report: 1,
    };
    this.leadService.getLeads(params).subscribe(
      (res: any) => {
        window.open(res.url, "_blank");
      },
      (err) => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  getLeadsAgents(
    campaign_id: number,
    agent_id?: number,
    keyword?: any,
    catch_from?: any,
    catch_to?: any
  ) {
    const params = {
      campaign_id: campaign_id,
      agent_id: agent_id,
      keyword: keyword,
      catch_from: catch_from,
      catch_to: catch_to,
    };
    this.marketingService.getLeadsAgents(params).subscribe((res: any) => {
      this.agents = res;
    });
  }

  resetSearch() {
    this.leadsPage = 1;
    this.catch_to = null;
    this.agent_id = null;
    this.catch_from = null;
    this.keyword = null;
    this.getLeads(this.activeCampaign.id);
    this.getLeadsAgents(this.activeCampaign.id);
  }

  getUnitDesignTypes() {
    this.projectService.getUnitDesignTypes().subscribe((res: any) => {
      this.unit_design_types = res.map((type, index) => {
        return {
          name: type,
          id: index,
        };
      });
    });
  }

  createFilterForm() {
    this.filter_form = this.formBuilder.group({
      // from_date: ['moment(new Date()).format("YYYY-MM-DD")'],
      // to_date: [moment(new Date()).format("YYYY-MM-DD")]
      from_date: null,
      to_date: null,
      year: null,
    });
  }

  getAllSources(params: any = {}) {
    this.projectService.getAllSources(params).subscribe((res: any) => {
      this.allSources = res;
      console.log("************sources***********", this.allSources);
    });
  }

  getAllAgents() {
    this.leadsService.getAgents().subscribe((data: any) => {
      this.allAgents = data;
    });
  }

  getAllBrokers() {
    this.userService
      .getBorkers({ is_select_form: true })
      .subscribe((data: any) => {
        this.allBrokers = data;
        console.log(this.allBrokers);
      });
  }

  sortByChangeHandler() {
    switch (this.view) {
      case "sources":
        this.getMonthlyReportResdiential(this.params);
      case "agent_activities_leads":
        this.getActivitiesLeadsAgentsReports(this.params);
        break;
      break;
      case "brokers":
        this.getBrokersResidential(this.params);
        break;
    }
  }

  get from_date() {
    return this.filter_form.get("from_date").value;
  }

  get to_date() {
    return this.filter_form.get("to_date").value;
  }

  get year() {
    return this.filter_form.get("year").value;
  }
  // get sources_ids() {
  //   return this.filter_form.get("sources_ids").value;
  // }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
      },
      (err) => {}
    );
  }

  onItemSelect(item: any) {
    // console.log(item);
    // let ids =
  }

  onProjectSelectionChange() {
    // console.log(this.project_id);
    // if (this.is_filter) {
    //   this.filter();
    // } else {
    let ids = [];
    if (this.project_id) {
      this.project_id.forEach((project) => {
        ids.push(project.id);
      });
    }
  }

  onSelectAll(items: any) {}

  filter() {
    // to do filter all reports
    let ids = [];
    let projects_ids_string = "";
    if (this.project_id) {
      this.project_id.forEach((project) => {
        ids.push(project.id);
      });
    }
    if (ids.length > 0) {
      projects_ids_string = ids.join(",");
    }
    console.log("===============================================");
    let sourcesIds = [];
    let sources_ids_string = "";
    if (this.source_id) {
      this.source_id.forEach((source) => {
        sourcesIds.push(source.id);
      });
    }
    if (sourcesIds.length > 0) {
      sources_ids_string = sourcesIds.join(",");
    }
    console.log(
      "======================**=========================",
      sources_ids_string
    );
    let eventsIds = [];
    let events_ids_string = "";
    if (eventsIds.length > 0) {
      events_ids_string = eventsIds.join(",");
    }

    let brokersIds = [];
    let brokers_ids_string = "";
    if (this.broker_id) {
      this.broker_id.forEach((broker) => {
        brokersIds.push(broker.id);
      });
    }
    if (brokersIds.length > 0) {
      brokers_ids_string = brokersIds.join(",");
    }

    let agentsIds = [];
    let agents_ids_string = "";
    if (this.agent_id) {
      this.agent_id.forEach((agent) => {
        agentsIds.push(agent.id);
      });
    }
    if (agentsIds.length > 0) {
      agents_ids_string = agentsIds.join(",");
    }
    console.log("======================**=========================");
    console.log(
      projects_ids_string,
      sources_ids_string,
      this.from_date,
      this.to_date
    );
    let typesNames = [];
    let types_names_string = "";
    console.log(this.types);
    if (this.types) {
      this.types.forEach((type) => {
        typesNames.push(type.name);
      });
    }
    if (typesNames.length > 0) {
      types_names_string = typesNames.join(",");
    }

    if (this.view == "sources") {
      this.sources_filter = true;
      let params = {
        projects_ids: projects_ids_string,
        from_date: this.from_date,
        to_date: this.to_date,
        campaign_id: this.campaign_id,
        sources_ids: sources_ids_string,
        agents_ids: agents_ids_string,
      };
      this.getMonthlyReportResdiential(params);
    }
    if (this.view == "agent_activities_leads") {
      let params = {
        agents_ids: agents_ids_string,
        'team_ids[]': this.team_ids,
        'campaign_ids[]': this.campaign_ids,
      }
      this.getActivitiesLeadsAgentsReports(params);
    }
    if (this.view == "brokers") {
      this.brokers_filter = true;
      let params = {
        projects_ids: projects_ids_string,
        from_date: this.from_date,
        to_date: this.to_date,
        brokers_ids: brokers_ids_string,
        agents_ids: agents_ids_string,
        page: 1,
      };
      this.brokerParams.projects_ids = projects_ids_string;
      this.brokerParams.from_date = this.from_date;
      this.brokerParams.to_date = this.to_date;
      this.brokerParams.brokers_ids = brokers_ids_string;
      this.brokerParams.agents_ids = agents_ids_string;
      this.brokerParams.page = 1;
      this.page = 1;
      this.getBrokersResidential(this.brokerParams);
    }
    if (this.view == "campaign") {
      let params = {
        campaign_name: this.campaign_name,
      };
      this.getCampaigns(params);
    }

    // TODO filters sales agents
  }

  filterReports() {}

  reset() {
    this.filter_form.reset();
    this.project_id = "";
    this.source_id = "";
    this.agent_id = "";
    this.broker_id = "";
    this.team_ids = [];
    this.campaign_ids = [];
    // this.is_filter = false;
    this.sources_filter = false;
    this.unit_types_filter = false;
    this.unit_types_status_filter = false;
    this.setView(this.view);
  }

  getMonthlyReportResdiential(params) {
    console.log(params.is_export);
    if (this.userData.role != "Moderator") {
      if (params.is_export) {
        this.downloading_export = true;
      } else {
        this.isLoading = true;
      }
      this.slimLoadingBarService.start();
      this.projectService.getDailyReportyMonthly(params).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.downloading_export = false;
          if (params.is_export) {
            window.open(res);
          } else {
            this.monthly_sources_residential = res;
          }
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.isLoading = false;
          this.downloading_export = false;
          console.log(err);
          this.slimLoadingBarService.reset();
        }
      );
    }
  }


  getActivitiesLeadsAgentsReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getActivitiesLeadsAgentsReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.agents_activities_leads_data = res;
        }
        this.downloading_export = false;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.downloading_export = false;
        this.isLoading = false;
      }
    );
  }

  getBrokersResidential(params) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.slimLoadingBarService.start();
    this.projectService.getBrokersResidential(params).subscribe(
      (res: any) => {
        this.downloading_export = false;
        this.isLoading = false;
        if (params.is_export) {
          window.open(res);
        } else {
          this.brokers_residential = res;
        }
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.downloading_export = false;
        this.isLoading = false;
        this.slimLoadingBarService.reset();
      }
    );
  }

  setView(tab: String) {
    this.views_conf.filters = false;
    this.views_conf.charts = null;
    this.view = tab;
    this.params.sort = null;
    if (tab == "sources") {
      let params = {
        page: this.sourcePage,
      };
      this.getMonthlyReportResdiential(params);
      this.getAllSources();
    }
    if (tab == "brokers") {
      let params = {
        page: this.page,
      };
      this.getBrokersResidential(params);
      // this.getAllSources();
    }
    if (tab == "agent_activities_leads") {
      this.getActivitiesLeadsAgentsReports();
    }
    if (tab == "campaign") {
      this.getCampaigns({});
    }
  }

  isHelpDeskUser() {
    // return this.userData.role == "Helpdesk Supervisor" || this.userData.role == "Helpdesk Agent"
    return this.userData.role == "Helpdesk Agent";
  }

  enableLoading() {
    this.isLoading = true;

    this.loader.index = 0;
    this.loader.dot = 0;
    this.loader.text = this.loading_texts[0];

    this.loader.interval = setInterval(() => {
      if (!this.isLoading) return this.disableLoading();

      if (this.loader.dot < this.loader.maxDot) {
        this.loader.dot++;
        this.loader.text += ".";
      } else {
        this.loader.dot = 0;
        if (this.loader.index < this.loading_texts.length - 1) {
          this.loader.index++;
        } else {
          this.loader.index = 0;
        }
        this.loader.text = this.loading_texts[this.loader.index];
      }
    }, 1000);
  }

  disableLoading() {
    this.isLoading = false;
    clearInterval(this.loader.interval);
  }

  pageChange(ev) {
    this.brokerParams.page = ev;
    this.getBrokersResidential(this.brokerParams);
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  leadsPageChange(ev) {
    this.leadsPage = ev;
    this.getLeads(
      this.activeCampaign.id,
      ev,
      this.keyword,
      this.catch_from,
      this.catch_to
    );
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  campaignPageChange(event) {
    const arr = this.campaigns.last_page_url.split("?");
    const selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.marketingService.infinit(url).subscribe(
      (data: any) => {
        this.campaigns = data;
        this.slimLoadingBarService.complete();
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  sourcePageChange(ev) {
    this.getMonthlyReportResdiential(ev);
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  downloadReport() {
    console.log(this.view);
    let ids = [];
    if (this.project_id) {
      this.project_id.forEach((project) => {
        ids.push(project.id);
      });
    }
    let projects_ids_string = ids.join(",");
    let sourcesIds = [];
    let sources_ids_string = "";
    if (this.source_id) {
      this.source_id.forEach((source) => {
        sourcesIds.push(source.id);
      });
    }
    if (sourcesIds.length > 0) {
      sources_ids_string = sourcesIds.join(",");
    }
    let eventsIds = [];
    let events_ids_string = "";
    if (eventsIds.length > 0) {
      events_ids_string = eventsIds.join(",");
    }

    let brokersIds = [];
    let brokers_ids_string = "";
    if (this.broker_id) {
      this.broker_id.forEach((broker) => {
        brokersIds.push(broker.id);
      });
    }
    if (brokersIds.length > 0) {
      brokers_ids_string = brokersIds.join(",");
    }

    let agentsIds = [];
    let agents_ids_string = "";
    if (this.agent_id) {
      this.agent_id.forEach((agent) => {
        agentsIds.push(agent.id);
      });
    }
    if (agentsIds.length > 0) {
      agents_ids_string = agentsIds.join(",");
    }
    let typesNames = [];
    let types_names_string = "";
    if (this.types) {
      this.types.forEach((type) => {
        typesNames.push(type.name);
      });
    }
    if (types_names_string.length > 0) {
      types_names_string = typesNames.join(",");
    }
    let params = {
      page: this.sourcePage,
      projects_ids: projects_ids_string,
      from_date: this.from_date,
      to_date: this.to_date,
      agents_ids: agents_ids_string,
      is_export: true,
    };
    this.params.sort && (params["sort"] = this.params.sort);
    switch (this.view) {
      case "sources":
        params["sources_ids"] = sources_ids_string;
        this.getMonthlyReportResdiential(params);
        break;
      case "agent_activities_leads":
        this.getActivitiesLeadsAgentsReports(this.params);
        break;
      case "brokers":
        params["brokers_ids"] = brokers_ids_string;
        this.getBrokersResidential(params);
        break;
    }
  }
}
