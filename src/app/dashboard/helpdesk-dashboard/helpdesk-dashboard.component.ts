import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ViewChild,
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color } from "ng2-charts";

import { environment } from "../../../environments/environment";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

// import { OptionsInput } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { CalendarComponent } from 'ng-fullcalendar';

@Component({
  selector: "app-helpdesk-dashboard",
  templateUrl: "./helpdesk-dashboard.component.html",
  styleUrls: ["./helpdesk-dashboard.component.scss"],
  providers: [SlimLoadingBarService],
})
export class HelpdeskDashboardComponent implements OnInit {
  envStatics = environment.statics;
  currentYear = new Date().getFullYear();
  //#region  Definitions
  channels: any;
  selectedChannel: any;

  projects: any;
  selectedProject: any;
  selectedProject_filter: any;
  users: [];
  selectedUser: any = {};
  selectedYear: any = {};
  selectedMonth: any = {};
  waletTarget: any;
  rangeDates: Date[];

  userData: any;

  statsData: any;

  lineChartsData: {
    salesActivity: ChartDataSets[];
    monthlySales: ChartDataSets[];
  } = {
    salesActivity: [],
    monthlySales: [],
  };

  lineChartsLabels = {
    salesActivity: [],
    monthlySales: [],
  };

  lineChartsOptions: {
    salesActivity: ChartOptions;
    monthlySales: ChartOptions;
  } = {
    salesActivity: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          fill: false,
          tension: 0,
        },
      },
    },
    monthlySales: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          fill: false,
        },
      },
    },
  };

  lineChartsColors: { salesActivity: Color[]; monthlySales: Color[] } = {
    salesActivity: [
      {
        backgroundColor: "#786fa6",
        borderColor: "#786fa6",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#786fa6",
        pointHoverBackgroundColor: "#786fa6",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#f8a5c2",
        borderColor: "#f8a5c2",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#f8a5c2",
        pointHoverBackgroundColor: "#f8a5c2",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#63cdda",
        borderColor: "#63cdda",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#63cdda",
        pointHoverBackgroundColor: "#63cdda",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#ea8685",
        borderColor: "#ea8685",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#ea8685",
        pointHoverBackgroundColor: "#ea8685",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#596275",
        borderColor: "#596275",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#596275",
        pointHoverBackgroundColor: "#596275",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#546de5",
        borderColor: "#546de5",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#546de5",
        pointHoverBackgroundColor: "#546de5",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#f19066",
        borderColor: "#f19066",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#f19066",
        pointHoverBackgroundColor: "#f19066",
        pointHoverBorderColor: "#fff",
      },
    ],
    monthlySales: [
      {
        backgroundColor: "#78e08f",
        borderColor: "#78e08f",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#78e08f",
        pointHoverBackgroundColor: "#78e08f",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#3c6382",
        borderColor: "#3c6382",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#3c6382",
        pointHoverBackgroundColor: "#3c6382",
        pointHoverBorderColor: "#fff",
      },
      {
        backgroundColor: "#1e3799",
        borderColor: "#1e3799",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#1e3799",
        pointHoverBackgroundColor: "#1e3799",
        pointHoverBorderColor: "#fff",
      },
    ],
  };

  // BAR CHARTS

  barChartsData: {
    availableInventory: ChartDataSets[];
    soldInventory: ChartDataSets[];
  } = {
    availableInventory: [],
    soldInventory: [],
  };

  barChartsLabels = {
    availableInventory: [],
    soldInventory: [],
  };

  barChartsOptions: {
    availableInventory: ChartOptions;
    soldInventory: ChartOptions;
  } = {
    availableInventory: {
      responsive: true,
      maintainAspectRatio: false,
      barRoundness: 1,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
        },
      },
    },
    soldInventory: {
      responsive: true,
      maintainAspectRatio: false,
      barRoundness: 1,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
        },
      },
    },
  };

  barChartsColors: Color[] = [
    {
      backgroundColor: "#001f3f",
      borderColor: "#001f3f",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#001f3f",
      pointHoverBackgroundColor: "#001f3f",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#0074D9",
      borderColor: "#0074D9",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#0074D9",
      pointHoverBackgroundColor: "#0074D9",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#7FDBFF",
      borderColor: "#7FDBFF",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#7FDBFF",
      pointHoverBackgroundColor: "#7FDBFF",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#39CCCC",
      borderColor: "#39CCCC",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#39CCCC",
      pointHoverBackgroundColor: "#39CCCC",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#3D9970",
      borderColor: "#3D9970",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#3D9970",
      pointHoverBackgroundColor: "#3D9970",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#2ECC40",
      borderColor: "#2ECC40",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#2ECC40",
      pointHoverBackgroundColor: "#2ECC40",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#01FF70",
      borderColor: "#01FF70",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#01FF70",
      pointHoverBackgroundColor: "#01FF70",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#FFDC00",
      borderColor: "#FFDC00",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#FFDC00",
      pointHoverBackgroundColor: "#FFDC00",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#FF851B",
      borderColor: "#FF851B",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#FF851B",
      pointHoverBackgroundColor: "#FF851B",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#FF4136",
      borderColor: "#FF4136",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#FF4136",
      pointHoverBackgroundColor: "#FF4136",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#85144b",
      borderColor: "#85144b",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#85144b",
      pointHoverBackgroundColor: "#85144b",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#F012BE",
      borderColor: "#F012BE",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#F012BE",
      pointHoverBackgroundColor: "#F012BE",
      pointHoverBorderColor: "#fff",
    },
    {
      backgroundColor: "#B10DC9",
      borderColor: "#B10DC9",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#B10DC9",
      pointHoverBackgroundColor: "#B10DC9",
      pointHoverBorderColor: "#fff",
    },
  ];

  newsData: any;

  // news items to detect if rendered
  @ViewChildren("newsElementContainer") newsElement: QueryList<any>;
  newsIsLoading = true;
  shoroukNewsIsLoading = false;
  mubasherNewsIsLoading = false;
  almasryNewsIsLoading = false;
  almalNewsIsLoading = false;

  newsChangesSubscription: Subscription;
  //#endregion

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userProfile"));
    this.getUsers();
    this.getInitialFilter();
    this.getLeadChannels();
    this.getListProjects();
    this.filterDashboard();
    this.getChartsSalesActivities();
    this.getChartsSalesReservations();
    this.getChartsAvailableInventory();
    this.getChartsSoldInventory();
    this.getNews();
  }

  //#region get loaded methods

  getLeadChannels() {
    this.http.get(`${environment.api_base_url}lead_channels`).subscribe(
      (data) => {
        this.channels = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getListProjects() {
    this.http.get(`${environment.api_base_url}list_projects`).subscribe(
      (data) => {
        this.projects = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getChartsSalesActivities() {
    this.http
      .get(`${environment.api_base_url}dashboard/charts/sales_activity`)
      .subscribe(
        (data: any) => {
          this.lineChartsLabels.salesActivity = [...data.months];
          this.lineChartsData.salesActivity = [...data.results];
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getChartsSalesReservations() {
    this.http
      .get(`${environment.api_base_url}dashboard/charts/sales_reservations`)
      .subscribe(
        (data: any) => {
          this.lineChartsLabels.monthlySales = [...data.months];
          this.lineChartsData.monthlySales = [...data.results];
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getChartsAvailableInventory() {
    this.http
      .get(`${environment.api_base_url}dashboard/charts/available_inventory`)
      .subscribe(
        (data: any) => {
          this.barChartsLabels.availableInventory = [...data.months];
          this.barChartsData.availableInventory = [...data.results];
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getChartsSoldInventory() {
    this.http
      .get(`${environment.api_base_url}dashboard/charts/sold_inventory`)
      .subscribe(
        (data: any) => {
          this.barChartsLabels.soldInventory = [...data.months];
          this.barChartsData.soldInventory = [...data.results];
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getNews() {}

  getInitialFilter() {
    let date = new Date();
    this.selectedMonth = {
      value: date.getMonth() + 1,
      name: date.toLocaleDateString("en", { month: "long" }),
    };
    this.selectedYear = {
      value: date.getFullYear(),
      name: date.getFullYear(),
    };
    this.getTarget(this.selectedMonth.value, this.selectedYear.value);
  }

  getUsers() {
    this.http.get(`${environment.api_base_url}users/get_agents`).subscribe(
      (data: any) => {
        this.users = data;
        console.log("users : ", this.users);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getYears() {
    const now = new Date().getUTCFullYear();
    return Array(10)
      .fill("")
      .map((v, idx) => ({ name: now - idx, value: now - idx }));
  }

  getMonths() {
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    return month.map((v, idx) => ({ value: idx + 1, name: v }));
  }

  getTarget(month?: number, year?: number, project?: number, userId?: number) {
    let params = {
      month: month,
      year: year,
      project_id: project,
      user_id: userId,
    };
    this.http
      .get(`${environment.api_base_url}dashboard/current_target`, {
        params: Object.entries(params)
          .filter(([key, val]) => val !== undefined)
          .reduce((obj, [key, val]) => {
            obj[key] = `${val}`;
            return obj;
          }, {}),
      })
      .subscribe(
        (data) => {
          this.waletTarget = data;
          console.log("target : ", this.waletTarget);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  exportTarget() {
    let params = {
      month: this.selectedMonth ? this.selectedMonth.value : "",
      year: this.selectedYear ? this.selectedYear.value : "",

      userId: this.selectedUser ? this.selectedUser.id : "",
    };
    this.http
      .get(`${environment.api_base_url}dashboard/export_target`, {
        responseType: "blob",
        params: Object.entries(params)
          .filter(([key, val]) => val !== undefined)
          .reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj;
          }, {}),
      })
      .subscribe(
        (response) => {
          let fileUrl = window.URL.createObjectURL(response);
          window.open(fileUrl);
        },
        (err) => {
          console.log("error :", err);
        }
      );
  }

  //#endregion

  //#region OnChange methods
  onChannelChange() {
    this.filterDashboard();
  }

  onChangeDatePicker() {
    this.filterDashboard();
  }

  onProjectChange() {
    this.filterDashboard();
  }

  onChangeFilter(year?: any, month?: any, project?: any, user?: any) {
    this.selectedYear = year || "";
    this.selectedMonth = month || "";
    this.selectedProject_filter = project || "";
    this.selectedUser = user || "";
    this.getTarget(
      this.selectedMonth ? this.selectedMonth.value : "",
      this.selectedYear ? this.selectedYear.value : "",
      this.selectedProject_filter ? this.selectedProject_filter.id : "",
      this.selectedUser ? this.selectedUser.id : ""
    );
  }

  //#endregion

  filterDashboard() {
    this.http
      .get(`${environment.api_base_url}dashboard/stats`, {
        params: {
          channel_id: this.selectedChannel ? this.selectedChannel.id : "",
          date_picker: JSON.stringify(this.rangeDates),
          project_id: this.selectedProject ? this.selectedProject.id : "",
        },
      })
      .subscribe((data) => {
        this.statsData = data;
      });
  }

  onGoPageTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  reloadNews(newsName) {
    if (newsName) {
      switch (newsName) {
        case "almalnews":
          this.almalNewsIsLoading = true;
          break;
        case "almasryalyoum":
          this.almasryNewsIsLoading = true;
          break;
        case "mubasher":
          this.mubasherNewsIsLoading = true;
          break;
        case "shorouknews":
          this.shoroukNewsIsLoading = true;
          break;
      }
    }
  }

  onLeadStatusClicked(lead_status) {
    let statuses = [
      { id: 1, name: "New" },
      { id: 2, name: "Interested" },
      { id: 3, name: "Closed" },
      { id: 4, name: "Not Interested" },
      { id: 5, name: "Freeze" },
      { id: 6, name: "No Answer" },
      { id: 7, name: "Not Reachable" },
    ];
    statuses.forEach((stat) => {
      if (stat.name == lead_status.status) {
        console.log(lead_status.name);
        // let channel_id = null;
        // if (this.selectedChannel) {
        //   channel_id = this.selectedChannel.id;
        // }
        this.router.navigate(["/pages/leads"], {
          queryParams: {
            status_id: stat.id,
            status_name: stat.name,
            channel: JSON.stringify(this.selectedChannel),
          },
        });
        return;
      }
    });
  }

  goToLeadsWithActivity(lead_activity) {
    this.router.navigate(["/pages/leads"], {
      queryParams: {
        activity_name: lead_activity.title,
      },
    });
  }

  goToLead(lead) {
    this.router.navigate(["/pages/leads"], {
      queryParams: {
        lead_id: lead.id,
      },
    });
  }
}
