import { UserServiceService } from "./../services/user-service/user-service.service";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ReservationService } from "./../services/reservation-service/reservation.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ProjectsService } from "../services/projects/projects.service";

@Component({
  selector: "app-daily-report",
  templateUrl: "./daily-report.component.html",
  styleUrls: ["./daily-report.component.css"],
})
export class DailyReportComponent implements OnInit {
  monthly_sources_residential: any;
  brokers_residential: any;
  monthly_report: any;
  monthly_yearly_report: any;
  daily_residential_reservations: any;
  hold_reports: any;
  eois_reports: any;

  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  view: any;

  allStatus: any = [
    {
      id: null,
      name: "All",
    },
    {
      id: "active",
      name: "Existing",
    },
    {
      id: "not_active",
      name: "Resigned",
    },
  ];
  is_active: any;

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
  allStatussDropdownSettings = {
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
  agent_id: any;
  broker_id: any;
  types: any;

  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  allSources;
  allEvents;
  allAgents;
  allMangers;

  selectedSources: any = [];

  contracts_filter = false;
  sources_filter = false;
  brokers_filter = false;
  hold_filter = false;
  eois_filter = false;

  isLoading = false;

  agent_sales_filter = false;
  agents_sales_projects;
  agents_sales_data;

  agent_activities_filter = false;
  agents_activities_actions;
  agents_activities_data;
  contract_cycle_data;

  agent_activities_leads_filter = false;
  agents_activities_leads_data;

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

  project_units_report: any;
  project_units_report_filter: boolean = false;

  eastshire_units_report: any;
  eastshire_units_report_filter: boolean = false;

  season_inventory_report: any;
  season_inventory_report_filter: boolean = false;

  manager_sales_report: any;
  manager_sales_report_filter: boolean = false;

  pc_sales_report: any;
  pc_sales_report_filter: boolean = false;

  pc_eois_report: any;
  pc_eois_report_filter: boolean = false;

  manager_eois_report: any;
  manager_eois_report_filter: boolean = false;

  overseas_sales_report: any;
  overseas_sales_report_filter: boolean = false;

  channel_sales_report: any;
  channel_sales_report_filter: boolean = false;
  projects_units_yearly_report_filter: boolean = false;

  pc_target_report: any;
  pc_target_report_filter: boolean = false;

  managers_target_report: any;
  managers_target_report_filter: boolean = false;

  years = [
    2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
    2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033,
  ];

  params: any = {
    sort: null,
  };

  pieChartLabels: string[] = ["Pending", "Contracted"];
  pieUnitChartData: number[];
  pieUnitValueChartData: number[];
  pieChartType: string = "pie";

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private leadsService: LeadsService,
    private userService: UserServiceService
  ) {
    this.view = "contracts";
    console.log(this.userData);
  }

  ngOnInit() {
    this.getUnitDesignTypes();
    this.createFilterForm();
    this.getAllProjects();
    this.getMonthlyReport();
    this.getDailyReportsResidentialReservations();
    this.getAllAgents();
    this.getAllMangers();
  }

  statusChange(event) {
    this.is_active = event.id;
  }

  sortByChangeHandler() {
    switch (this.view) {
      case "months":
        this.getMonthlyYearlyReport(this.params);
        break;
      case "agent_sales":
        this.getSalesAgentsReports(this.params);
        break;
      case "agent_activities":
        this.getActivitiesAgentsReports(this.params);
        break;
      case "contract_cycle":
        this.getContractCycleReports(this.params);
        break;
      case "agent_activities_leads":
        this.getActivitiesLeadsAgentsReports(this.params);
        break;
      case "manager_sales_report":
        this.getManagerSalesReports(this.params);
        break;
      case "pc_sales_report":
        this.getPCSalesReports(this.params);
        break;
      case "pc_eois_report":
        this.getPCEoisReports(this.params);
        break;
      case "manager_eois_report":
        this.getManagerEoisReports(this.params);
        break;
      case "overseas_sales_report":
        this.getOverseasSalesReports(this.params);
        break;
      case "channel_sales_report":
        this.getChannelSalesReports(this.params);
        break;
      case "pc_target_report":
        this.getPCTargetReports(this.params);
        break;
      case "managers_target_report":
        this.getManagersTargetReports(this.params);
        break;
    }
  }

  sortByColumn(view, sortType, sortColumnDate) {
    let selectedFirstUser;
    let selectedSecondUser;
    switch (view) {
      case "agent_sales":
        if (sortType == "asc") {
          this.agents_sales_data.data = this.agents_sales_data.data.sort(
            (a, b) => {
              return a.total - b.total;
            }
          );
        } else {
          this.agents_sales_data.data = this.agents_sales_data.data.sort(
            (a, b) => {
              return b.total - a.total;
            }
          );
        }
        break;
      case "manager_sales_report":
        if (sortType == "asc") {
          this.manager_sales_report.users =
            this.manager_sales_report.users.sort((a, b) => {
              return a.contracted_value - b.contracted_value;
            });
        } else {
          this.manager_sales_report.users =
            this.manager_sales_report.users.sort((a, b) => {
              return b.contracted_value - a.contracted_value;
            });
        }
        break;
      case "pc_sales_report":
        if (sortType == "asc") {
          this.pc_sales_report.users = this.pc_sales_report.users.sort(
            (a, b) => {
              return a.contracted_value - b.contracted_value;
            }
          );
        } else {
          this.pc_sales_report.users = this.pc_sales_report.users.sort(
            (a, b) => {
              return b.contracted_value - a.contracted_value;
            }
          );
        }
        break;
      case "channel_sales_report":
        if (sortType == "asc") {
          this.channel_sales_report.reservations[0] =
            this.channel_sales_report.reservations[0].sort((a, b) => {
              return a.total_value - b.total_value;
            });
        } else {
          this.channel_sales_report.reservations[0] =
            this.channel_sales_report.reservations[0].sort((a, b) => {
              return b.total_value - a.total_value;
            });
        }
        break;
      case "pc_target_report":
        if (sortType == "asc") {
          this.pc_target_report.users.sort((a, b) => {
            selectedFirstUser = a.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            selectedSecondUser = b.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            return (
              selectedFirstUser.achievement_percentage -
              selectedSecondUser.achievement_percentage
            );
          });
        } else {
          this.pc_target_report.users.sort((a, b) => {
            selectedFirstUser = a.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            selectedSecondUser = b.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            return (
              selectedSecondUser.achievement_percentage -
              selectedFirstUser.achievement_percentage
            );
          });
        }
        break;
      case "managers_target_report":
        if (sortType == "asc") {
          this.managers_target_report.users.sort((a, b) => {
            selectedFirstUser = a.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            selectedSecondUser = b.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            return (
              selectedFirstUser.achievement_percentage -
              selectedSecondUser.achievement_percentage
            );
          });
        } else {
          this.managers_target_report.users.sort((a, b) => {
            selectedFirstUser = a.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            selectedSecondUser = b.target_arr.find(
              (x) => x.date == sortColumnDate
            );
            return (
              selectedSecondUser.achievement_percentage -
              selectedFirstUser.achievement_percentage
            );
          });
        }
        break;
    }
  }

  pageChange(event) {
    console.log(event);
    this.page = event;
    this.filter(true);
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
      // date_from: ['moment(new Date()).format("YYYY-MM-DD")'],
      // date_to: [moment(new Date()).format("YYYY-MM-DD")]
      date_from: null,
      date_to: null,
      year: null,
    });
  }

  getAllSources() {
    this.projectService.getAllSources().subscribe((res: any) => {
      this.allSources = res;
      console.log("************sources***********", this.allSources);
    });
  }

  getAllAgents() {
    this.leadsService.getAgents().subscribe((data: any) => {
      this.allAgents = data;
    });
  }

  getAllMangers() {
    this.leadsService.getManagers().subscribe((data: any) => {
      this.allMangers = data;
    });
  }

  get date_from() {
    return this.filter_form.get("date_from").value;
  }

  get date_to() {
    return this.filter_form.get("date_to").value;
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
    let projects_ids_string = ids.join(",");
    let params = {
      projects_ids: projects_ids_string,
    };

    if (ids.length > 0) {
      this.getDailyReportsResidentialReservations(params);
      this.getMonthlyReport(params);
      this.getMonthlyYearlyReport(params);
      this.getEoisDailyReports(params);
    } else {
      this.getDailyReportsResidentialReservations();
      this.getMonthlyReport();
      this.getMonthlyYearlyReport();
      this.getEoisDailyReports();
    }
    // }
  }

  onSelectAll(items: any) {}

  filter(pageChanged: boolean = false) {
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
      this.date_from,
      this.date_to
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
    let params = {
      projects_ids: projects_ids_string,
      date_from: this.date_from,
      date_to: this.date_to,
    };
    pageChanged && (params["page"] = this.page);
    if (this.view == "contracts") {
      params["agent_ids"] = agents_ids_string;
      this.contracts_filter = true;
      this.getDailyReportsResidentialReservations(params);
      this.getMonthlyReport(params);
    }
    if (this.view == "months") {
      params["agent_ids"] = agents_ids_string;
      this.getMonthlyYearlyReport(params);
    }
    if (this.view == "eois") {
      params["agent_ids"] = agents_ids_string;
      this.eois_filter = true;
      this.getEoisDailyReports(params);
    }
    if (this.view == "agent_activities") {
      delete params["projects_ids"];
      params["agent_ids"] = agents_ids_string;
      params["is_active"] = this.is_active;
      this.contracts_filter = true;
      this.getActivitiesAgentsReports(params);
    }
    if (this.view == "agent_activities_leads") {
      delete params["projects_ids"];
      params["agent_ids"] = agents_ids_string;
      this.contracts_filter = true;
      this.getActivitiesLeadsAgentsReports(params);
    }
    if (this.view == "agent_sales") {
      params["agent_ids"] = agents_ids_string;
      params["is_active"] = this.is_active;
      this.manager_sales_report_filter = true;
      this.getSalesAgentsReports(params);
    }
    console.log(types_names_string);
    if (this.view == "manager_sales_report") {
      params.date_from = null;
      params.date_to = null;
      params["types"] = types_names_string;
      params["is_active"] = this.is_active;
      this.manager_sales_report_filter = true;
      this.getManagerSalesReports(params);
    }
    if (this.view == "pc_sales_report") {
      params.date_from = null;
      params.date_to = null;
      params["agent_ids"] = agents_ids_string;
      params["types"] = types_names_string;
      params["is_active"] = this.is_active;
      this.pc_sales_report_filter = true;
      this.getPCSalesReports(params);
    }
    if (this.view == "pc_eois_report") {
      params.date_from = null;
      params.date_to = null;
      params["agent_ids"] = agents_ids_string;
      params["types"] = types_names_string;
      params["is_active"] = this.is_active;
      this.pc_eois_report_filter = true;
      this.getPCEoisReports(params);
    }
    if (this.view == "manager_eois_report") {
      params.date_from = null;
      params.date_to = null;
      params["agent_ids"] = agents_ids_string;
      params["types"] = types_names_string;
      params["is_active"] = this.is_active;
      this.manager_eois_report_filter = true;
      this.getManagerEoisReports(params);
    }
    if (this.view == "overseas_sales_report") {
      params.date_from = null;
      params.date_to = null;
      params["types"] = types_names_string;
      this.overseas_sales_report_filter = true;
      this.getOverseasSalesReports(params);
    }
    if (this.view == "channel_sales_report") {
      params.date_from = null;
      params.date_to = null;
      params["types"] = types_names_string;
      this.channel_sales_report_filter = true;
      this.getChannelSalesReports(params);
    }
    if (this.view == "pc_target_report") {
      params.date_from = null;
      params.date_to = null;
      params["agent_ids"] = agents_ids_string;
      params["year"] = this.year;
      params["is_active"] = this.is_active;
      this.pc_target_report_filter = true;
      this.getPCTargetReports(params);
    }
    if (this.view == "managers_target_report") {
      params.date_from = null;
      params.date_to = null;
      params["year"] = this.year;
      params["agent_ids"] = agents_ids_string;
      params["is_active"] = this.is_active;
      this.managers_target_report_filter = true;
      this.getManagersTargetReports(params);
    }
    // TODO filters sales agents
  }

  filterReports() {}

  reset(withoutView?: boolean) {
    this.filter_form.reset();
    // this.getDailyReportsResidentialReservations();
    // this.getMonthlyReport();
    // this.getMonthlyYearlyReport();
    // this.getEoisDailyReports();
    this.project_id = "";
    this.source_id = "";
    this.agent_id = "";
    this.broker_id = "";
    // this.is_filter = false;
    this.contracts_filter = false;
    this.sources_filter = false;
    this.hold_filter = false;
    this.eois_filter = false;
    this.agent_sales_filter = false;
    this.unit_types_filter = false;
    this.unit_types_status_filter = false;
    this.project_units_report_filter = false;
    this.eastshire_units_report_filter = false;
    this.season_inventory_report_filter = false;
    this.manager_sales_report_filter = false;
    this.pc_sales_report_filter = false;
    this.pc_eois_report_filter = false;
    this.manager_eois_report_filter = false;
    this.overseas_sales_report_filter = false;
    this.channel_sales_report_filter = false;
    this.projects_units_yearly_report_filter = false;
    this.pc_target_report_filter = false;
    this.managers_target_report_filter = false;
    !withoutView && this.setView(this.view);
  }

  getMonthlyReport(params: any = {}) {
    this.isLoading = true;
    this.projectService.getMonthlyReport(params).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.monthly_report = res;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  getMonthlyYearlyReport(params: any = {}) {
    if (params.is_export) {
      this.downloading_export = true;
    } else {
      this.isLoading = true;
    }
    if (this.userData.role != "Moderator") {
      this.projectService.getMonthlyYearlyReport(params).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.downloading_export = false;
          if (params.is_export) {
            window.open(res);
          } else {
            this.monthly_yearly_report = res;
          }
        },
        (err) => {
          this.isLoading = false;
          this.downloading_export = false;
          console.log(err);
        }
      );
    }
  }

  getSalesAgentsReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getAgentSalesReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.agents_sales_data = res;
          if (res.data && res.data.length > 0) {
            this.agents_sales_projects = res.data[0].projects;
          }
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

  getActivitiesAgentsReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getActivitiesAgentsReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.agents_activities_data = res;
          if (res.data && res.data.length > 0) {
            this.agents_activities_actions = res.data[0].actions;
          }
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

  getContractCycleReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getContractCycleReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.contract_cycle_data = res.data;
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

  getDailyReportsResidentialReservations(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService
      .getDailyReportsResidentialReservations(params)
      .subscribe(
        (res: any) => {
          if (params.is_export) {
            window.open(res);
          } else {
            const toDataArray = (section: any, key: string) => {
              const entry = section && section[key] ? section[key] : undefined;
              const value =
                entry && entry.value !== undefined && entry.value !== null
                  ? entry.value
                  : undefined;
              return value === null || value === undefined ? [] : [value];
            };

            const reports = res || {};
            const daily = reports.daily || {};
            const monthly = reports.monthly || {};
            const yearly = reports.yearly || {};
            const accumulative = reports.accumulative || {};

            this.daily_residential_reservations = reports;
            this.charts.daily_reservations = {
              labels: [],
              datasets: [],
            };
            this.charts.daily_reservations.labels = ["Daily"];
            this.charts.daily_reservations.datasets = [
              {
                data: toDataArray(daily, "cancelledDeal"),
                label: ["Cancelled Deal"],
              },
              {
                data: toDataArray(daily, "doneDeal"),
                label: ["Done Deal"],
              },
              {
                data: toDataArray(daily, "pendingContract"),
                label: ["Pending Deals"],
              },
              {
                data: toDataArray(daily, "total"),
                label: ["Total Deal"],
              },
            ];

            this.charts.monthly_reservations = {
              labels: [],
              datasets: [],
            };
            this.charts.monthly_reservations.labels = ["Monthly"];
            this.charts.monthly_reservations.datasets = [
              {
                data: toDataArray(monthly, "cancelledDeal"),
                label: ["Cancelled Deal"],
              },
              {
                data: toDataArray(monthly, "doneDeal"),
                label: ["Done Deal"],
              },
              {
                data: toDataArray(monthly, "pendingContract"),
                label: ["Pending Deals"],
              },
              {
                data: toDataArray(monthly, "total"),
                label: ["Total Deal"],
              },
            ];

            this.charts.yearly_reservations = {
              labels: [],
              datasets: [],
            };
            this.charts.yearly_reservations.labels = ["Yearly"];
            this.charts.yearly_reservations.datasets = [
              {
                data: toDataArray(yearly, "cancelledDeal"),
                label: ["Cancelled Deal"],
              },
              {
                data: toDataArray(yearly, "doneDeal"),
                label: ["Done Deal"],
              },
              {
                data: toDataArray(yearly, "pendingContract"),
                label: ["Pending Deals"],
              },
              {
                data: toDataArray(yearly, "total"),
                label: ["Total Deal"],
              },
            ];

            this.charts.accumulative_reservations = {
              labels: [],
              datasets: [],
            };
            this.charts.accumulative_reservations.labels = ["Accumulative"];
            this.charts.accumulative_reservations.datasets = [
              {
                data: toDataArray(accumulative, "cancelledDeal"),
                label: ["Cancelled Deal"],
              },
              {
                data: toDataArray(accumulative, "doneDeal"),
                label: ["Done Deal"],
              },
              {
                data: toDataArray(accumulative, "pendingContract"),
                label: ["Pending Deals"],
              },
              {
                data: toDataArray(accumulative, "total"),
                label: ["Total Deal"],
              },
            ];
          }
          this.isLoading = false;
          this.downloading_export = false;
        },
        (err) => {
          console.log(err);
          this.downloading_export = false;
          this.isLoading = false;
        }
      );
  }

  getEoisDailyReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getEoisDailyReports(params).subscribe(
      (res: any) => {
        this.downloading_export = false;
        this.isLoading = false;
        if (params.is_export) {
          window.open(res);
        } else {
          this.eois_reports = res;
          this.charts.eoi_accumulative = {
            labels: [],
            datasets: [],
          };

          this.charts.eoi_accumulative.labels = ["Accumulative"];
          this.charts.eoi_accumulative.datasets = [
            {
              data: [res.accumulative.approved.value],
              label: ["approved"],
            },
            {
              data: [res.accumulative.cancelled.value],
              label: ["cancelled"],
            },
            {
              data: [res.accumulative.deposited.value],
              label: ["deposited"],
            },
            {
              data: [res.accumulative.pending.value],
              label: ["pending"],
            },
            {
              data: [res.accumulative.refunded.value],
              label: ["refunded"],
            },
          ];
          this.charts.eoi_daily.labels = ["Daily"];
          this.charts.eoi_daily.datasets = [
            {
              data: [res.daily.approved.value],
              label: ["approved"],
            },
            {
              data: [res.daily.cancelled.value],
              label: ["cancelled"],
            },
            {
              data: [res.daily.deposited.value],
              label: ["deposited"],
            },
            {
              data: [res.daily.pending.value],
              label: ["pending"],
            },
            {
              data: [res.daily.refunded.value],
              label: ["refunded"],
            },
          ];
          this.charts.eoi_monthly.labels = ["Monthly"];
          this.charts.eoi_monthly.datasets = [
            {
              data: [res.monthly.approved.value],
              label: ["approved"],
            },
            {
              data: [res.monthly.cancelled.value],
              label: ["cancelled"],
            },
            {
              data: [res.monthly.deposited.value],
              label: ["deposited"],
            },
            {
              data: [res.monthly.pending.value],
              label: ["pending"],
            },
            {
              data: [res.monthly.refunded.value],
              label: ["refunded"],
            },
          ];
          this.charts.eoi_yearly.labels = ["Yearly"];
          this.charts.eoi_yearly.datasets = [
            {
              data: [res.yearly.approved.value],
              label: ["approved"],
            },
            {
              data: [res.yearly.cancelled.value],
              label: ["cancelled"],
            },
            {
              data: [res.yearly.deposited.value],
              label: ["deposited"],
            },
            {
              data: [res.yearly.pending.value],
              label: ["pending"],
            },
            {
              data: [res.yearly.refunded.value],
              label: ["refunded"],
            },
          ];
          console.log(this.charts);
        }
      },
      (err) => {
        this.downloading_export = false;
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  getManagerSalesReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getManagerSalesReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.manager_sales_report = res;
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

  getPCSalesReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getPCSalesReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.pc_sales_report = res;
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

  getManagerEoisReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getManagerEoisReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.manager_eois_report = res;
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

  getPCEoisReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getPCEoisReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.pc_eois_report = res;
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

  getOverseasSalesReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getOverSalesReport(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.overseas_sales_report = res;
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

  getChannelSalesReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getChannelSalesReport(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.channel_sales_report = res;
        }
        this.downloading_export = false;
        this.isLoading = false;
        this.pieUnitChartData = [
          this.channel_sales_report.total.reserved_total_units,
          this.channel_sales_report.total.contracted_total_units,
        ];
        this.pieUnitValueChartData = [
          this.channel_sales_report.total.reserved_total_value,
          this.channel_sales_report.total.contracted_total_value,
        ];
        console.log(this.pieUnitChartData);
        console.log(this.pieUnitValueChartData);
      },
      (err) => {
        console.log(err);
        this.downloading_export = false;
        this.isLoading = false;
      }
    );
  }

  getPCTargetReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getPCTargetReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.pc_target_report = res;
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

  getManagersTargetReports(params: any = {}) {
    if (params.is_export) this.downloading_export = true;
    else this.isLoading = true;
    this.projectService.getManagersTargetReports(params).subscribe(
      (res: any) => {
        if (params.is_export) {
          window.open(res);
        } else {
          this.managers_target_report = res;
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

  setView(tab: String) {
    this.views_conf.filters = false;
    this.views_conf.charts = null;
    this.view = tab;
    this.params.sort = null;
    this.reset(true);
    let params = {
      is_active: "active",
    };
    if (tab == "months") {
      this.getMonthlyYearlyReport();
    }
    if (tab == "contracts") {
      this.getDailyReportsResidentialReservations();
      this.views_conf.charts = false;
    }
    if (tab == "eois") {
      this.views_conf.charts = false;
      this.getEoisDailyReports();
    }
    if (tab == "agent_sales") {
      this.is_active = "active";
      this.getSalesAgentsReports(params);
    }
    if (tab == "agent_activities") {
      this.is_active = "active";
      this.getActivitiesAgentsReports(params);
    }
    if (tab == "contract_cycle") {
      this.getContractCycleReports();
    }
    if (tab == "agent_activities_leads") {
      this.getActivitiesLeadsAgentsReports();
    }
    if (tab == "manager_sales_report") {
      this.is_active = "active";
      this.getManagerSalesReports(params);
    }
    if (tab == "pc_sales_report") {
      this.is_active = "active";
      this.getPCSalesReports(params);
    }
    if (tab == "pc_eois_report") {
      this.is_active = "active";
      this.getPCEoisReports(params);
    }
    if (tab == "manager_eois_report") {
      this.is_active = "active";
      this.getManagerEoisReports(params);
    }
    if (tab == "overseas_sales_report") {
      this.getOverseasSalesReports();
    }
    if (tab == "channel_sales_report") {
      this.getChannelSalesReports();
      this.views_conf.charts = false;
    }
    if (tab == "pc_target_report") {
      this.is_active = "active";
      this.getPCTargetReports(params);
    }
    if (tab == "managers_target_report") {
      this.is_active = "active";
      this.getManagersTargetReports(params);
    }
  }

  isHelpDeskUser() {
    // return this.userData.role == "Helpdesk Supervisor" || this.userData.role == "Helpdesk Agent"
    return this.userData.role == "Helpdesk Agent";
  }

  onAgentsSelectionChange() {}

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
      projects_ids: projects_ids_string,
      date_from: this.date_from,
      date_to: this.date_to,
      is_export: true,
    };
    switch (this.view) {
      case "months":
      case "contracts":
        this.getDailyReportsResidentialReservations(params);
        break;
      case "eois":
        this.getEoisDailyReports(params);
        break;
      case "agent_sales":
        delete params["projects_ids"];
        params["agent_ids"] = agents_ids_string;
        params["is_active"] = this.is_active;
        this.getSalesAgentsReports(params);
        break;
      case "agent_activities":
        params["agent_ids"] = agents_ids_string;
        this.getActivitiesAgentsReports(params);
        break;
      case "agent_activities":
        delete params["date_from"];
        delete params["date_to"];
        delete params["projects_ids"];
        this.getActivitiesAgentsReports(params);
        break;
      case "contract_cycle":
        this.getContractCycleReports(params);
        break;
      case "agent_activities_leads":
        params["agent_ids"] = agents_ids_string;
        this.getActivitiesLeadsAgentsReports(params);
        break;
      case "manager_sales_report":
        delete params["date_from"];
        delete params["date_to"];
        params["types"] = types_names_string;
        params["is_active"] = this.is_active;
        this.getManagerSalesReports(params);
        break;
      case "pc_sales_report":
        delete params["date_from"];
        delete params["date_to"];
        params["agent_ids"] = agents_ids_string;
        params["types"] = types_names_string;
        params["is_active"] = this.is_active;
        this.getPCSalesReports(params);
        break;
      case "pc_eois_report":
        delete params["date_from"];
        delete params["date_to"];
        params["agent_ids"] = agents_ids_string;
        params["types"] = types_names_string;
        params["is_active"] = this.is_active;
        this.getPCEoisReports(params);
        break;
      case "manager_eois_report":
        delete params["date_from"];
        delete params["date_to"];
        params["agent_ids"] = agents_ids_string;
        params["types"] = types_names_string;
        params["is_active"] = this.is_active;
        this.getManagerEoisReports(params);
        break;
      case "overseas_sales_report":
        delete params["date_from"];
        delete params["date_to"];
        params["types"] = types_names_string;
        this.getOverseasSalesReports(params);
        break;
      case "channel_sales_report":
        delete params["date_from"];
        delete params["date_to"];
        params["types"] = types_names_string;
        this.getChannelSalesReports(params);
        break;
      case "pc_target_report":
        delete params["date_from"];
        delete params["date_to"];
        params["agent_ids"] = agents_ids_string;
        params["is_active"] = this.is_active;
        this.getPCTargetReports(params);
        break;
      case "managers_target_report":
        delete params["date_from"];
        delete params["date_to"];
        params["is_active"] = this.is_active;
        this.getManagersTargetReports(params);
        break;
    }
  }
}
