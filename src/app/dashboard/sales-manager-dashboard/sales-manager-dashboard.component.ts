import { Subscription } from "rxjs/Subscription";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color } from "ng2-charts";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { Team } from "../../shared/team";
import { LeadsService } from "../../services/lead-service/lead-service.service";

@Component({
  selector: "app-sales-manager-dashboard",
  templateUrl: "./sales-manager-dashboard.component.html",
  styleUrls: ["./sales-manager-dashboard.component.scss"],
  providers: [SlimLoadingBarService],
})
export class SalesManagerDashboardComponent implements OnInit, AfterViewInit {
  envStatics = environment.statics;
  currentYear = new Date().getFullYear();
  //#region  Definitions
  channels: any;
  selectedChannel: any;

  projects: any;
  users: [];
  selectedUser: any = {};
  selectedYear: any = {};
  selectedMonth: any = {};
  waletTarget: any;
  rangeDates: Date[];

  userData: any;

  statsData: any;

  salesFilter = {
    date_from: null,
    date_to: null,
  };

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
        // green
        backgroundColor: "green",
        borderColor: "green",
        pointBackgroundColor: "#fff",
        pointBorderColor: "green",
        pointHoverBackgroundColor: "green",
        pointHoverBorderColor: "#fff",
      },
      {
        // blue
        backgroundColor: "blue",
        borderColor: "blue",
        pointBackgroundColor: "#fff",
        pointBorderColor: "blue",
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "#fff",
      },
      {
        // magenta
        backgroundColor: "magenta",
        borderColor: "magenta",
        pointBackgroundColor: "#fff",
        pointBorderColor: "magenta",
        pointHoverBackgroundColor: "magenta",
        pointHoverBorderColor: "#fff",
      },
      {
        // aqua
        backgroundColor: "aqua",
        borderColor: "aqua",
        pointBackgroundColor: "#fff",
        pointBorderColor: "aqua",
        pointHoverBackgroundColor: "aqua",
        pointHoverBorderColor: "#fff",
      },
    ],
    monthlySales: [
      {
        // purple
        backgroundColor: "purple",
        borderColor: "purple",
        pointBackgroundColor: "#fff",
        pointBorderColor: "purple",
        pointHoverBackgroundColor: "purple",
        pointHoverBorderColor: "#fff",
      },
    ],
  };

  @ViewChildren("newsElementContainer") newsElement: QueryList<any>;
  newsIsLoading = true;
  shoroukNewsIsLoading = false;
  mubasherNewsIsLoading = false;
  almasryNewsIsLoading = false;
  almalNewsIsLoading = false;

  newsChangesSubscription: Subscription;

  newsData: any;

  //#endregion

  selectedTeam: Team;
  selectedUserFilter: any;

  selectedProject: any;
  selectedProject_filter: any;
  selectedTeam_filter: any;

  teams: Team[];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private http: HttpClient,
    private router: Router,
    private leadsService: LeadsService
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
    this.getNews();
    this.getTeams();
  }

  getTeams() {
    this.leadsService.getTeams().subscribe((res: Team[]) => {
      this.teams = res;
    });
  }

  //#region get methods
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

  getTarget(month?: number, year?: number, userId?: number) {
    let qP = "";
    if ((month && month > 0) || (year && year > 0) || (userId && userId > 0)) {
      qP = `?`;

      if (month && month > 0) {
        qP += qP.includes("month" || "year" || "user_id")
          ? `&month=${month}`
          : `month=${month}`;
      }
      if (year && year > 0) {
        qP += qP.includes("month" || "year" || "user_id")
          ? `&year=${year}`
          : `year=${year}`;
      }
      if (userId && userId > 0) {
        qP += qP.includes("month" || "year" || "user_id")
          ? `&user_id=${userId}`
          : `user_id=${userId}`;
      }
    }

    this.http
      .get(`${environment.api_base_url}dashboard/current_target${qP}`)
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
  //#endregion

  //#region onchange methods
  onChannelChange() {
    this.filterDashboard();
  }

  onChangeDatePicker() {
    console.log("date chanched");
    console.log(this.rangeDates);
    this.filterDashboard();
  }

  onChangeFilter(year?: any, month?: any, user?: any) {
    this.selectedYear = year || "";
    this.selectedMonth = month || "";
    this.selectedUser = user || "";
    this.getTarget(
      this.selectedMonth ? this.selectedMonth.value : "",
      this.selectedYear ? this.selectedYear.value : "",
      this.selectedUser ? this.selectedUser.id : ""
    );
  }

  //#endregion

  filterDashboard() {
    const params: any = {
      channel_id: this.selectedChannel ? this.selectedChannel.id : "",
      project_id: this.selectedProject ? this.selectedProject.id : "",
      date_from: this.salesFilter.date_from ? this.salesFilter.date_from : "",
      date_to: this.salesFilter.date_to ? this.salesFilter.date_to : "",
      team_id: this.selectedTeam ? this.selectedTeam.id : "",
      user_id: this.selectedUserFilter ? this.selectedUserFilter.id : "",
    };
    this.http
      .get(`${environment.api_base_url}dashboard/stats`, {
        params: params,
      })
      .subscribe((data) => {
        this.statsData = data;
      });
  }

  onGoPageTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  ngAfterViewInit() {
    this.slimLoadingBarService.start();
    (<any>$(".owl-carousel")).owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 2000,
    });
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
}
