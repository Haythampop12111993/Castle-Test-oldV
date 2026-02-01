import { Component, OnInit } from "@angular/core";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ReservationService } from "../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-client-statements",
  templateUrl: "./client-statements.component.html",
  styleUrls: ["./client-statements.component.css"],
})
export class ClientStatementsComponent implements OnInit {
  filter_collapsed = true;
  clients_raw_data;
  totalRec: number;
  per_page: any;
  total: any;
  pageTest: any = 1;
  pagination: any = [];
  last_page_url: any;
  prev_page_url: any;
  current_page: any;
  filterActive = false;
  is_refreshing = false;
  clients: any;
  filterForm: FormGroup;

  constructor(
    private leadService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForms();
  }

  ngOnInit() {
    // this.getClientStatements();
    if (
      [
        "keyword",
        "date_from",
        "date_to",
        "unit_serial",
      ].some((f) => this.route.snapshot.queryParams[f])
    ) {
      this.filterClients(false);
    } else {
      this.getClientStatements();
    }
  }

  createForms() {
    this.filterForm = this.fb.group({
      status: ["Closed"],
      with_finance: [1],
      keyword: [this.route.snapshot.queryParams.keyword || ""],
      date_from: [this.route.snapshot.queryParams.date_from || ""],
      date_to: [this.route.snapshot.queryParams.date_to || ""],
      unit_serial: [this.route.snapshot.queryParams.date_to || ""],
    });
  }

  getClientStatements() {
    const {status} = this.filterForm.value;
    this.leadService.getLeads({status}).subscribe((res: any) => {
      console.log(res);
      this.clients_raw_data = res;
      this.clients = res.data;
      this.pagination = [];
      this.last_page_url = res.last_page_url;
      this.current_page = 1;
      this.per_page = res.to;
      this.total = res.total;
    });
  }

  pageChange(event) {
    let arr = this.last_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    if (this.filterActive) {
      this.infiniteWithFilter(selectedUrl, event);
    } else {
      this.infinite(selectedUrl, event);
    }
  }

  infiniteWithFilter(url, number) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    this.leadService.getLeads(this.filterForm.value).subscribe(
      (data: any) => {
        this.clients_raw_data = data;
        this.totalRec = data.total;
        this.clients = data.data;
        this.current_page = number;
        this.per_page = data.to;
        this.total = data.total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      },
      () => (this.is_refreshing = false)
    );
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.is_refreshing = true;
    this.leadService.infinit(url).subscribe(
      (data: any) => {
        this.clients_raw_data = data;
        this.totalRec = data.total;
        this.clients = data.data;
        this.current_page = number;
        this.per_page = data.to;
        this.total = data.total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      },
      () => (this.is_refreshing = false)
    );
  }

  viewClient(client) {
    this.router.navigate(["/pages/clients-statements", client.id]);
  }

  resetFilters(cache = true) {
    this.filterForm.reset({
      status: "Closed",
      with_finance: 1,
    });
    this.getClientStatements();
  }

  filterClients(cache = true) {
    this.pageTest = 1;
    let formModel = this.filterForm.value;
    console.log(formModel);
    if (cache) this.setQueryParams(formModel);
    this.leadService.getLeads(formModel).subscribe( (res: any) => {
      this.clients_raw_data = res;
      this.clients = res.data;
      this.pagination = [];
      this.last_page_url = res.last_page_url;
      this.current_page = 1;
      this.per_page = res.to;
      this.total = res.total;
    });
  }

  // cache filters
  setQueryParams(params = {}) {
    let data: any = {};

    ["keyword",  "date_from", "date_to", "unit_serial"].map((f) => {
      if (params[f]) {
        data[f] = params[f];
      }
    });
    console.log(data);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
      replaceUrl: true,
    });
  }
}
