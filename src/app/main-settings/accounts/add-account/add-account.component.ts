import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { environment } from "../../../../environments/environment";
import { AccountsService } from "../../../services/settings-service/accounts/accounts.service";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { User } from "../../../dtos/user.viewmodel";

@Component({
  selector: "app-add-account",
  templateUrl: "./add-account.component.html",
  styleUrls: ["./add-account.component.css"],
})
export class AddAccountComponent implements OnInit {
  documentForm: FormGroup;

  user: User;

  brokers;

  id: number;

  edit: boolean;

  roles: any;

  file_name: string;

  showError: boolean;

  messages = "";
  can_manage_payment_plan: boolean;
  is_full_access: boolean = true;

  constructor(
    private accountService: AccountsService,
    public errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.id = +this.route.snapshot.params["id"];
    this.http.get(`${environment.api_base_url}get_roles`).subscribe(
      (data) => {
        this.roles = data;
      },
      (err) => {
        console.log(err);
      }
    );

    if (this.id > 0) {
      this.getdata(this.id);
      this.edit = true;
    } else {
      this.user = new User();
      this.edit = false;
    }
    this.user = new User();
    this.showError = false;
    this.getAllBrokers();
  }

  createForm() {
    this.documentForm = this.fb.group(
      {
        name: ["", Validators.required],
        email: ["", Validators.required],
        password: "",
        phone: ["", Validators.required],
        role: ["", Validators.required],
        broker_id: [""],
        job_title: null,
        facebook_url: null,
        twitter_url: null,
        instagram_url: null,
        about: null,
        id: null,
        image: null,
        image_name: null,
        can_manage_payment_plan: false,
        is_full_access: true,
      },
      {
        validator: (group) => {
          if (!group.controls.id.value) {
            return Validators.required(group.controls.password);
          }
          return null;
        },
      }
    );
  }

  getdata(id) {
    this.accountService.getAccount(id).subscribe(
      (data) => {
        console.log(data);
        this.user = data;
        this.documentForm
          .get("can_manage_payment_plan")
          .patchValue(data.can_manage_payment_plan);
        this.documentForm.get("is_full_access").patchValue(data.is_full_access);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllBrokers() {
    this.accountService.getBrokers().subscribe((res) => {
      this.brokers = res;
    });
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.file_name = file.name;
      reader.onload = () => {
        this.documentForm
          .get("image")
          .setValue((reader.result as any).split(",")[1]);
        this.documentForm.get("image_name").setValue(file.name);
      };
    }
  }

  onDocumentSubmit() {
    const formModel = this.documentForm.value;
    if (formModel.role == "Broker Agent" && !this.user.brokerCompany) {
      swal("You must choose Brokerage Company", "", "error");
      return;
    }
    if (formModel.name && formModel.email && formModel.phone) {
      const data = {
        id: formModel.id,
        name: formModel.name,
        email: formModel.email,
        password: formModel.password,
        job_title: formModel.job_title,
        phone: formModel.phone,
        facebook_url: formModel.facebook_url,
        twitter_url: formModel.twitter_url,
        instagram_url: formModel.instagram_url,
        image: formModel.image,
        image_name: formModel.image_name,
        role: formModel.role.id,
        broker_id: formModel.broker_id,
        can_manage_payment_plan: formModel.can_manage_payment_plan,
        is_full_access: formModel.is_full_access,
      };
      console.log(data);
      if (this.edit === false) {
        this.accountService.createaccount(data).subscribe(
          (res) => {
            this.router.navigate(["pages/settings/accounts"]);
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
          }
        );
      } else {
        this.accountService.editaccount(data.id, data).subscribe(
          (respo) => {
            this.router.navigate(["pages/settings/accounts"]);
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      }
    } else {
      this.showError = true;
      this.messages = "";
      if (!formModel.name.valid) {
        this.messages = "Name Field is invalid";
      }
      if (!formModel.email.valid) {
        this.messages = "Email Field is invalid";
      }
      if (!formModel.password.valid) {
        this.messages = "Password Field is invalid";
      }
      if (!formModel.phone.valid) {
        this.messages = "Phone Field is invalid";
      }
    }
  }

  alertRequired(e) {
    e.target.parentElement.style.display = "none";
  }

  changeManagePaymentPlanSelect(event) {
    console.log(event);
  }
}
