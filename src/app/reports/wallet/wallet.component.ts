import { environment } from "./../../../environments/environment";
import { TeamService } from "./../../services/settings-service/team/team.service";
import { ReservationService } from "./../../services/reservation-service/reservation.service";
import { BranchService } from "./../../services/branch/branch.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { LeadsService } from "./../../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "./../../services/shared/error-handler.service";
import { UserServiceService } from "./../../services/user-service/user-service.service";
import { Component, OnInit } from "@angular/core";

import swal from "sweetalert2";

@Component({
  selector: "app-wallet",
  templateUrl: "./wallet.component.html",
  styleUrls: ["./wallet.component.css"],
})
export class WalletComponent implements OnInit {
  filter_expand = false;
  filterForm: FormGroup;
  wallet: any;
  pageTest: any = 1;
  lg: any = "lg";
  last_page_url: any;
  users: any;
  teams: any;
  projects: any;
  userData: any = JSON.parse(window.localStorage.getItem("userProfile")) || {};
  current_balance: any;
  has_filter_data: boolean = false;
  current_commission: any;
  current_wallet_id: any;
  excel: any;

  coming_soon: boolean = true;

  active_tab = "all";

  constructor(
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private slimLoadingService: SlimLoadingBarService,
    private leadsService: LeadsService,
    private branchService: BranchService,
    private reservationService: ReservationService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    if (this.userData.role !== "Property Consultant") {
      this.getUsers();
    }
    this.getProjects();
    if (
      this.userData.role == "Admin" ||
      this.userData.role == "Super Development"
    ) {
      this.getTeams();
    }
    this.setActiveTab("all");
  }

  setActiveTab(tab) {
    this.active_tab = tab;
    let userId = "";
    switch (tab) {
      case "me": {
        userId = this.userData.id;
      }
    }
    if (
      this.userData.role == "Admin" ||
      this.userData.role == "Super Development"
    ) {
      this.adminCreateForm(userId);
      this.exportWallet();
    } else {
      this.userCreateFilterForm(userId);
    }
    this.getWallet();
  }

  adminCreateForm(userId?) {
    this.filterForm = this.formBuilder.group({
      from: [""],
      to: [""],
      team_id: [""],
      project_id: [""],
      commissioned_for: [userId || ""],
      from_collect: [""],
      to_collect: [""],
      reservation_id: [""],
      unit_serial: [""],
      is_collect: [""],
    });
  }

  userCreateFilterForm(userId) {
    this.filterForm = this.formBuilder.group({
      from: [""],
      to: [""],
      project_id: [""],
      commissioned_for: [userId || ""],
      from_collect: [""],
      to_collect: [""],
      reservation_id: [""],
      unit_serial: [""],
      is_collect: [""],
    });
  }

  getWallet() {
    let payload = this.filterForm.value;
    this.slimLoadingService.start();
    this.userService.filterWallet(payload).subscribe(
      (res: any) => {
        this.wallet = res;
        this.last_page_url = res.wallets.last_page_url;
        this.slimLoadingService.complete();
        this.exportWallet();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingService.complete();
      }
    );
  }

  getUsers() {
    this.slimLoadingService.start();
    this.userService.getUsersWallets().subscribe(
      (res: any) => {
        this.users = res;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getProjects() {
    this.slimLoadingService.start();
    this.reservationService.getProjects().subscribe(
      (data) => {
        this.projects = data;
        this.slimLoadingService.complete();
      },
      (err) => {
        this.slimLoadingService.complete();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getTeams() {
    this.slimLoadingService.start();
    this.teamService.getTeams().subscribe(
      (data) => {
        this.teams = data.data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingService.complete()
    );
  }

  pageChange(event) {
    console.log(event);
    console.log(this.last_page_url);
    if (this.last_page_url) {
      let arr = this.last_page_url.split("?");
      let selectedUrl = `${arr[0]}?page=${event}`;
      this.infinite(selectedUrl, event);
    }
  }

  infinite(url, event) {
    this.slimLoadingService.start();
    this.userService.infinit(url, this.filterForm.value).subscribe(
      (res: any) => {
        this.wallet = res;
        this.last_page_url = res.wallets.last_page_url;
        this.slimLoadingService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingService.complete();
      }
    );
  }

  resetFilter() {
    this.setActiveTab(this.active_tab);
    this.getWallet();
  }

  payWallet(id) {
    this.slimLoadingService.start();
    this.userService.payWallet(id).subscribe(
      (res: any) => {
        this.slimLoadingService.complete();
        this.getWallet();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingService.complete();
      }
    );
  }

  exportWallet() {
    let data = this.filterForm.value;
    this.excel = `${
      environment.api_base_url
    }wallets?excel=1&token=${window.localStorage.getItem("token")}`;

    Object.entries(data).map(([key, value]) => {
      if (value) {
        this.excel += `&${key}=${value}`;
      }
    });
  }
}
