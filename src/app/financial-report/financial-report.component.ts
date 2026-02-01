import { UserServiceService } from "./../services/user-service/user-service.service";
import { FinancialReportsService } from "./../services/financial-reports/financial-reports.service";
import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ProjectsService } from "../services/projects/projects.service";

import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: "app-financial-report",
  templateUrl: "./financial-report.component.html",
  styleUrls: ["./financial-report.component.css"],
})
export class FinancialReportComponent implements OnInit {
  isLoading = false;

  view = "bounced-checks";
  page = 1;
  paginate;

  views_conf = {
    filters: false,
    charts: false,
  };

  reports: any = {
    bounced_cheques: [],
    projects_sales: [],
    payment_status: [],
    matching: {
      headers: [],
      data: [],
    },
    post_date_analysis: {
      months: {
        headers: [],
        data: [],
      },
      years: {
        headers: [],
        data: [],
      },
    },
    combined_statement: {
      data: [],
      cards: {},
    },
  };

  charts: any = {
    projects_sales: {},
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

  filter_form: any = {};
  filter_schema: any = {};

  filter_dependencies = {
    projects: [],
    unitTypes: [],
    banks: [],
    years: Array(50)
      .fill("")
      .map((v, idx) => new Date().getUTCFullYear() - idx + 25),
    deal_statuses: ["all", "contracted", "pending"],
    project_types: ["Residential", "Commercial"],
    payment_types: ["fully-collected", "pending"],
  };
  downloading_export: boolean = false;

  area_counter_form = {
    date: "",
    type: "",
    project_id: "",
  };

  projects: any;

  designTypes: any;

  area: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private financialReportsService: FinancialReportsService,
    private projectService: ProjectsService,
    private userServiceService: UserServiceService
  ) {}

  ngOnInit() {
    this.getAllDependencies();
    this.setView(this.view);
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe((data: any) => {
      this.projects = data.data;
    });
  }

  getdesignTypes(project_id) {
    if (project_id) {
      this.slimLoadingBarService.start();
      // this.projectService.getDesignTypes(project_id).subscribe((data) => {
      //   this.designTypes = data;
      //   console.log(this.designTypes);
      // });
      this.area_counter_form.type = "";
      this.designTypes = this.projects.find(
        (project) => project.id === project_id
      ).unit_types;
    }
  }

  onProjectAreaCounterChange() {
    console.log("on change");
    this.getdesignTypes(this.area_counter_form.project_id);
  }

  getAllDependencies() {
    forkJoin(
      this.projectService.getProjects(),
      this.projectService.getUnitTypes(),
      this.userServiceService.getBanks()
    ).subscribe(([projectesRes, unitTypesRes, banksRes]: any) => {
      this.filter_dependencies.projects = projectesRes.data;
      this.filter_dependencies.unitTypes = unitTypesRes;
      this.filter_dependencies.banks = banksRes;
    });
  }

  setView(tab: string) {
    this.view = tab;
    this.filter_form = {};
    this.views_conf.filters = false;
    this.views_conf.charts = null;
    switch (tab) {
      case "bounced-checks": {
        this.filter_schema = {
          filter_project_id: 1,
          filter_lead: 1,
          filter_unit: 1,
          filter_unit_type_id: 1,
          filter_date_from: 1,
          filter_date_to: 1,
        };
        break;
      }
      case "sales-reports": {
        this.filter_schema = {
          filter_project_id: 1,
        };
        this.views_conf.charts = false;
        break;
      }
      case "delivery-date": {
        this.filter_schema = {
          filter_project_id: 1,
          filter_lead: 1,
          filter_unit: 1,
          filter_unit_type_id: 1,
          filter_date_from: 1,
          filter_date_to: 1,
        };
        break;
      }
      case "matching": {
        this.filter_schema = {
          filter_project_id: 1,
          filter_store_bank_id: 1,
          filter_date_from: 1,
          filter_date_to: 1,
        };
        this.views_conf.charts = false;
        break;
      }
      case "post_date_analysis": {
        this.filter_schema = {
          filter_year: 1,
          filter_store_bank_id: 1,
          filter_project_id: 1,
        };
        this.views_conf.charts = false;
        break;
      }
      case "combined-statement": {
        this.filter_schema = {
          filter_project_id: 1,
          filter_lead: 1,
          filter_unit: 1,
          filter_unit_type_id: 1,
          filter_date_from: 1,
          filter_date_to: 1,
          filter_deal_status: 1,
          filter_project_type: 1,
          filter_payment_type: 1,
        };

        this.filter_form.filter_deal_status = "contracted";
        break;
      }
      case "area-counter":
        break;
    }

    this.getData();
  }

  getData() {
    this.page = 1;
    switch (this.view) {
      case "bounced-checks": {
        this.getBouncedChequesReport();
        break;
      }
      case "sales-reports": {
        this.getProjectsSalesReport();
        break;
      }
      case "delivery-date": {
        this.getPaymentStatusReport();
        break;
      }
      case "matching": {
        this.getARMatchingReport();
        break;
      }
      case "post_date_analysis": {
        this.getPostDateAnalysisReport();
        break;
      }
      case "combined-statement": {
        this.getCombinedStatementReport();
        this.getCombinedStatementCards();
        break;
      }
      case "area-counter": {
        this.disableLoading();
        this.getAreaCounter();
        break;
      }
    }
  }

  getAreaCounter() {
    console.log(this.area_counter_form);
    if (
      this.area_counter_form.date &&
      this.area_counter_form.project_id &&
      this.area_counter_form.type
    ) {
      this.financialReportsService
        .getAreaCounter(this.area_counter_form)
        .subscribe((res: any) => {
          this.area = res.area;
        });
    }
  }

  getBouncedChequesReport(is_export?) {
    if (is_export) {
      this.downloading_export = true;
      this.filter_form.is_export = true;
    } else this.enableLoading();
    this.financialReportsService
      .getBouncedChequesReport(this.filter_form)
      .subscribe(
        (res: any) => {
          this.filter_form.is_export = false;
          this.downloading_export = false;
          if (is_export) {
            window.open(res);
          } else {
            this.reports.bounced_cheques = res;
          }
        },
        (err) => {
          this.downloading_export = false;
          console.log(err);
        },
        () => {
          if (this.view === "bounced-checks") {
            this.disableLoading();
          }
        }
      );
  }

  getProjectsSalesReport(is_export?) {
    if (is_export) {
      this.filter_form.is_export = true;
      this.downloading_export = true;
    } else {
      this.enableLoading();
    }
    this.financialReportsService
      .getProjectsSalesReport(this.filter_form)
      .subscribe(
        (res: any) => {
          if (is_export) {
            window.open(res);
            this.filter_form.is_export = false;
            this.downloading_export = false;
          } else {
            this.reports.projects_sales = res;

            //* charts
            this.charts.projects_sales = {
              labels: [],
              datasets: [],
            };

            // fetch data
            let datasets = res.reduce(
              (obj, row) => {
                this.charts.projects_sales.labels.push(row.project_name);

                obj.Sold.push(row.sold_units_value);
                obj.Cheques.push(row.cheques_value);
                obj.Collected.push(row.collected_value);
                obj.Bounced.push(row.bounced_value);

                return obj;
              },
              {
                Sold: [],
                Cheques: [],
                Collected: [],
                Bounced: [],
              }
            );

            // set data
            this.charts.projects_sales.datasets = Object.entries(datasets).map(
              ([key, value]) => {
                return {
                  label: key,
                  data: value,
                };
              }
            );
            console.log(this.charts);
          }
        },
        (err) => {
          this.downloading_export = false;
          console.log(err);
        },
        () => {
          if (this.view === "sales-reports") {
            this.disableLoading();
          }
        }
      );
  }

  getPaymentStatusReport(page = 1, is_export?) {
    if (is_export) {
      this.filter_form.is_export = true;
      this.downloading_export = true;
    } else {
      this.enableLoading();
    }
    this.financialReportsService
      .getPaymentStatusReport({ page, ...this.filter_form })
      .subscribe(
        (res: any) => {
          if (is_export) {
            window.open(res);
            this.filter_form.is_export = false;
            this.downloading_export = false;
          } else {
            this.reports.payment_status = res.data;
            this.paginate = {
              last_page: res.last_page,
              per_page: res.per_page,
              total: res.total,
            };
          }
        },
        (err) => {
          this.downloading_export = false;
          console.log(err);
        },
        () => {
          if (this.view === "delivery-date") {
            this.disableLoading();
          }
        }
      );
  }

  getARMatchingReport(is_export?) {
    if (is_export) {
      this.downloading_export = true;
      this.filter_form.is_export = true;
    } else {
      this.enableLoading();
    }
    this.financialReportsService
      .getARMatchingReport(this.filter_form)
      .subscribe(
        (res: any) => {
          if (is_export) {
            window.open(res);
            this.filter_form.is_export = false;
            this.downloading_export = false;
          } else {
            if (res.length > 0) {
              // data
              this.reports.matching.headers = res[0].banks.map(
                (bank) => bank.bank_name
              );

              this.reports.matching.data = res.map((row) => {
                row.banks = row.banks.reduce((obj, bank) => {
                  obj[bank.bank_name] = bank;
                  return obj;
                }, {});

                return row;
              });

              //* charts
              this.charts.matching = {
                labels: [],
                datasets: [],
              };

              // fetch data
              let datasets = this.reports.matching.data.reduce((obj, row) => {
                this.charts.matching.labels.push(row.project_name);

                Object.entries(row.banks).map(([key, bank]: any) => {
                  if (!obj[key]) {
                    obj[key] = [bank.amount];
                  } else {
                    obj[key].push(bank.amount);
                  }
                });

                return obj;
              }, {});

              // set data
              this.charts.matching.datasets = Object.entries(datasets).map(
                ([key, value]) => {
                  return {
                    label: key,
                    data: value,
                  };
                }
              );
            } else {
              this.reports.matching.headers = [];

              this.reports.matching.data = [];
              this.charts.matching = null;
            }
          }
        },
        (err) => {
          this.downloading_export = false;
          console.log(err);
        },
        () => {
          if (this.view === "matching") {
            this.disableLoading();
          }
        }
      );
  }

  getPostDateAnalysisReport(is_export?, sub_type?) {
    if (is_export) {
      this.downloading_export = true;
      this.filter_form.is_export = true;
      this.filter_form.type = sub_type;
    } else {
      this.enableLoading();
    }
    this.financialReportsService
      .getPostDateAnalysisReport(this.filter_form)
      .subscribe(
        (res: any) => {
          if (is_export) {
            window.open(res);
            this.downloading_export = false;
            this.filter_form.is_export = false;
            delete this.filter_form.type;
          } else {
            // years
            if (res.years.length > 0) {
              this.reports.post_date_analysis.years.headers =
                res.years[0].banks.map((bank) => bank.bank_name);

              this.reports.post_date_analysis.years.data = res.years.map(
                (row) => {
                  row.banks = row.banks.reduce((obj, bank) => {
                    obj[bank.bank_name] = bank;
                    return obj;
                  }, {});

                  return row;
                }
              );

              //* charts
              this.charts.post_date_analysis.years = {
                labels: [],
                datasets: [],
              };

              // fetch data
              let datasets = this.reports.post_date_analysis.years.data.reduce(
                (obj, row) => {
                  this.charts.post_date_analysis.years.labels.push(
                    row.year_name
                  );

                  Object.entries(row.banks).map(([key, bank]: any) => {
                    if (!obj[key]) {
                      obj[key] = [bank.amount];
                    } else {
                      obj[key].push(bank.amount);
                    }
                  });

                  return obj;
                },
                {}
              );

              // set data
              this.charts.post_date_analysis.years.datasets = Object.entries(
                datasets
              ).map(([key, value]) => {
                return {
                  label: key,
                  data: value,
                };
              });
            } else {
              this.reports.post_date_analysis.years.headers = [];
              this.reports.post_date_analysis.years.data = [];
              this.charts.post_date_analysis.years = null;
            }

            // months
            if (res.months.length > 0) {
              this.reports.post_date_analysis.months.headers =
                res.months[0].banks.map((bank) => bank.bank_name);

              this.reports.post_date_analysis.months.data = res.months.map(
                (row) => {
                  row.banks = row.banks.reduce((obj, bank) => {
                    obj[bank.bank_name] = bank;
                    return obj;
                  }, {});

                  return row;
                }
              );

              //* charts
              this.charts.post_date_analysis.months = {
                labels: [],
                datasets: [],
              };

              // fetch data
              let datasets = this.reports.post_date_analysis.months.data.reduce(
                (obj, row) => {
                  this.charts.post_date_analysis.months.labels.push(
                    row.month_name
                  );

                  Object.entries(row.banks).map(([key, bank]: any) => {
                    if (!obj[key]) {
                      obj[key] = [bank.amount];
                    } else {
                      obj[key].push(bank.amount);
                    }
                  });

                  return obj;
                },
                {}
              );

              // set data
              this.charts.post_date_analysis.months.datasets = Object.entries(
                datasets
              ).map(([key, value]) => {
                return {
                  label: key,
                  data: value,
                };
              });
            } else {
              this.reports.post_date_analysis.months.headers = [];
              this.reports.post_date_analysis.months.data = [];
              this.charts.post_date_analysis.months = null;
            }
          }
        },
        (err) => {
          this.downloading_export = false;
          console.log(err);
        },
        () => {
          if (this.view === "post_date_analysis") {
            this.disableLoading();
          }
        }
      );
  }

  getCombinedStatementReport(page = 1, is_export?) {
    if (is_export) {
      this.downloading_export = true;
      this.filter_form.is_export = true;
    } else {
      this.enableLoading();
    }
    this.financialReportsService
      .getCombinedStatementReport({ page, ...this.filter_form })
      .subscribe(
        (res: any) => {
          if (is_export) {
            window.open(res);
            this.filter_form.is_export = false;
            this.downloading_export = false;
          } else {
            if (res.data.length > 0) {
              this.reports.combined_statement.data = res.data;
              this.paginate = {
                last_page: res.last_page,
                per_page: res.per_page,
                total: res.total,
              };
            } else {
              this.reports.combined_statement.data = [];
            }
          }
        },
        (err) => {
          console.log(err);
          this.downloading_export = false;
        },
        () => {
          if (this.view === "combined-statement") {
            this.disableLoading();
          }
        }
      );
  }

  getCombinedStatementCards() {
    this.financialReportsService
      .getCombinedStatementCards(this.filter_form)
      .subscribe(
        (res: any) => {
          this.reports.combined_statement.cards = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

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

  downloadReport(sub_type?) {
    switch (this.view) {
      case "bounced-checks": {
        this.getBouncedChequesReport(true);
        break;
      }
      case "sales-reports": {
        this.getProjectsSalesReport(true);
        break;
      }
      case "delivery-date": {
        this.getPaymentStatusReport(this.page ? this.page : 1, true);
        break;
      }
      case "matching": {
        this.getARMatchingReport(true);
        break;
      }
      case "post_date_analysis": {
        if (sub_type) {
          this.getPostDateAnalysisReport(true, "year");
        } else {
          this.getPostDateAnalysisReport(true, "month");
        }
        break;
      }
      case "combined-statement": {
        this.getCombinedStatementReport(this.page ? this.page : 1, true);
        this.getCombinedStatementCards();
        break;
      }
    }
  }

  singleReportDownloadCombinedStatemenet(row) {
    console.log(row);
    this.financialReportsService
      .downloadReportCombinedStatementAccount(row.id)
      .subscribe((res: any) => {
        window.open(res);
      });
  }
}
