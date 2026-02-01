import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { environment } from "../../../environments/environment";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { UserServiceService } from "../../services/user-service/user-service.service";

@Component({
  selector: "app-add-store-bank",
  templateUrl: "./add-store-bank.component.html",
  styleUrls: ["./add-store-bank.component.css"],
})
export class AddStoreBankComponent implements OnInit {
  //#region Definitions
  bank_export_url: any;
  title: string = "Add Bank";
  add_bank: any = {
    name: "",
    account_number: "",
  };
  bankId: any;
  isEditState = false;
  bank: any;
  //#region

  current_bank: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private userService: UserServiceService,
    private leadService: LeadsService,
    private fb: FormBuilder,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.bank_export_url = `${
      environment.api_base_url
    }store_banks/export?token=${window.localStorage.getItem("token")}`;
    this.bankId = +this.route.snapshot.params["id"];
    if (this.bankId > 0) {
      this.isEditState = true;
      this.title = "Edit Bank";
      this.getBank(this.bankId);
    }
  }

  getBank(id?) {
    this.current_bank = JSON.parse(window.localStorage.getItem("current_bank"));
    this.add_bank = {
      name: this.current_bank.name,
      account_number: this.current_bank.account_number,
      id: this.current_bank.id,
    };
  }

  addBank() {
    this.slimLoadingBarService.start();
    let serUrl;
    if (this.add_bank && this.add_bank.id) {
      serUrl = this.userService.editBank(this.add_bank.id, this.add_bank);
    } else {
      serUrl = this.userService.addBank(this.add_bank);
    }
    console.log(serUrl);
    serUrl.subscribe(
      (data) => {
        swal("Added Bank successfully", "", "success");
        this.add_bank = {
          name: "",
          account_number: "",
        };
        this.router.navigateByUrl("/pages/settings/store_banks");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  ngOnDestroy() {
    this.current_bank = null;
  }
}
