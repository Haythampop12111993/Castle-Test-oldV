import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { UserServiceService } from "../services/user-service/user-service.service";

@Component({
  selector: "app-brokers-list",
  templateUrl: "./brokers-list.component.html",
  styleUrls: ["./brokers-list.component.css"],
})
export class BrokersListComponent implements OnInit {
  userProfile: any = JSON.parse(window.localStorage.getItem("userProfile"));
  pagination_meta = {
    page: 1,
    totalPages: 0,
  };
  brokers_list: any;

  is_refreshing = false;
  filterForm: FormGroup;
  filterActive = false;
  filterData: any;

  pagination: any = [];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private fb: FormBuilder,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    this.createFilter();
    this.getBrokers();
  }

  getBrokers(reset = false, is_export = false) {
    if (reset) {
      this.pagination_meta.page = 1;
    }
    const payload = {
      ...this.filterForm.value,
      page: this.pagination_meta.page,
    };
    this.slimLoadingBarService.start();
    this.userService.getBrokersPaginated(payload).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.brokers_list = res.data;
        this.pagination_meta.totalPages = res.last_page;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  createFilter() {
    this.filterForm = this.fb.group({
      keyword: "",
    });
  }

  resetFilters() {
    this.createFilter();
    this.getBrokers(true);
  }

  pageChange(event) {
    this.pagination_meta.page = event;
    this.getBrokers();
  }
}
