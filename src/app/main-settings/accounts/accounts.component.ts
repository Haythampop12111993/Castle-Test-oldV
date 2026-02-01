import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { AccountsService } from "../../services/settings-service/accounts/accounts.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { environment } from "../../../environments/environment";
import { UserServiceService } from "../../services/user-service/user-service.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";

@Component({
  selector: "app-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.css"],
})
export class AccountsComponent implements OnInit {
  searchUserKeyword: any;

  accounts: any[] = [];

  user_export_url: any;

  inaccounts = null;

  accounts_raw_data: any;

  current_page: any = 1;

  filesForm: FormGroup;

  base_url_for_pagination: any;

  last_page_url: any;

  file_name: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private accountsService: AccountsService,
    public userService: UserServiceService,
    public leadsService: LeadsService,
    public errorHandlerService: ErrorHandlerService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user_export_url = `${
      environment.api_base_url
    }users/export?token=${window.localStorage.getItem("token")}`;
    console.log(this.user_export_url);
    this.getaccounts();
    this.filesForm = this.fb.group({
      excel: [null, Validators.required],
    });
  }

  getaccounts() {
    this.accounts = null;
    this.accounts = this.accountsService.getAccounts().subscribe(
      (data) => {
        this.accounts_raw_data = data;
        this.base_url_for_pagination = data.last_page_url.split("?")[0];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        this.current_page = 1;
        this.inaccounts = data.data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  searchUsers() {
    if (this.searchUserKeyword) {
      this.slimLoadingBarService.start();
      this.accountsService.searchUser(this.searchUserKeyword).subscribe(
        (res: any) => {
          this.accounts_raw_data = res;
          this.inaccounts = res.data;
          this.last_page_url = res.last_page_url;
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    } else {
      this.reset();
    }
  }

  reset() {
    this.searchUserKeyword = "";
    this.inaccounts = null;
    this.getaccounts();
  }

  editaccount(accountid) {
    this.router.navigate(["./pages/settings/accounts/add/", accountid]);
  }

  disableUser(userID, userName) {
    swal({
      title: "Are you sure?",
      text: `you will disable this user ${userName} !`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.accountsService.disableUser(userID).subscribe(
          (data) => {
            this.getaccounts();
            swal(
              "Woohoo!",
              `User ${userName} disablled successfully`,
              "success"
            );
          },
          (err) => console.log(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  exportUsers() {
    this.slimLoadingBarService.start();
    this.userService.exportUsers().subscribe(
      (data: any) => {
        window.open(data);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  activeUser(userID, userName) {
    swal({
      title: "Are you sure?",
      text: `you will enable this user ${userName} !`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.accountsService.enableUser(userID).subscribe(
          (data) => {
            this.getaccounts();
            swal(
              "Woohoo!",
              `User ${userName} has been enabled successfully`,
              "success"
            );
          },
          (err) => console.log(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  pageChange(ev) {
    const selectedUrl = `${this.base_url_for_pagination}?page=${ev}`;
    this.infinite(selectedUrl, ev);
  }

  infinite(url, event) {
    console.log(url);
    if (this.searchUserKeyword) {
      console.log("pagination with keyword");
      this.accountsService
        .paginationWithFilter(url, this.searchUserKeyword)
        .subscribe(
          (res: any) => {
            this.accounts_raw_data = res;
            this.inaccounts = res.data;
            this.last_page_url = res.last_page_url;
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
    } else {
      console.log("pagination ");
      this.leadsService.infinit(url).subscribe(
        (res: any) => {
          this.accounts_raw_data = res;
          this.inaccounts = res.data;
          this.last_page_url = res.last_page_url;
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
    }
  }

  importUsers(modal) {
    const excel = this.filesForm.get("excel").valid;
    if (!excel) {
      swal("you must choose an excel file", "", "error");
    } else {
      const formData = this.filesForm.value;
      const payload = {
        file_name: formData.excel.file_name,
        file_value: formData.excel.file_value,
      };
      this.slimLoadingBarService.start();
      this.accountsService.importUsers(payload).subscribe(
        (data) => {
          swal("users imports successfully", "", "success");
          this.getaccounts();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );

      console.log(payload);
    }
  }

  handleUsersExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.filesForm.get("excel").setValue({
          file_name: file.name,
          file_value: (reader.result as any).split(",")[1],
        });
      };
    }
  }
}
