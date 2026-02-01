import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { UserServiceService } from "../services/user-service/user-service.service";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../environments/environment";

import swal from "sweetalert2";

@Component({
  selector: "app-brokers-incentives-manage",
  templateUrl: "./brokers-incentives-manage.component.html",
  styleUrls: ["./brokers-incentives-manage.component.css"],
})
export class BrokersIncentivesManageComponent implements OnInit {
  add_broker: any = {
    name: "",
    contact_phone: "",
    contact_address: "",
    contact_person: "",
    contact_email: "",
    users: null,
  };

  brokerUploadExcel: FormGroup;
  agents: any;

  mode;
  directors: any;
  managers: any;
  national_id_image: any;
  tax_id_image: any;
  commercial_register_image: any;
  brokers: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private brokerService: UserServiceService,
    private leadService: LeadsService,
    private fb: FormBuilder,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getBrokers();
    this.route.params.subscribe((res) => {
      if (res.id) {
        this.mode = "edit";
        const storedSettings =
          JSON.parse(
            window.localStorage.getItem("edit_broker_incentives_settings")
          ) || {};
        this.add_broker = {
          ...JSON.parse(
            window.localStorage.getItem("edit_broker_incentives_settings")
          ),
          ...(storedSettings.manager
            ? { manager: storedSettings.manager.id }
            : {}),
          ...(storedSettings.director
            ? { director: storedSettings.director.id }
            : {}),
        };
      } else this.mode = "add";
    });
  }

  ngOnInit() {}

  getBrokers() {
    this.slimLoadingBarService.start();
    this.brokerService.getBorkers({ is_select_form: true }).subscribe(
      (data: any) => {
        this.brokers = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllAgents() {
    this.leadService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  submitBroker() {
    if (this.mode == "add") {
      this.addBroker();
    } else {
      const payload = {
        ...this.add_broker,
      };
      this.update_broker(payload);
    }
  }

  update_broker(payload) {
    this.slimLoadingBarService.start();
    const broker_id = this.add_broker.id;
    this.brokerService.editBrokerIncentive(broker_id, payload).subscribe(
      (data) => {
        swal("Updated successfully", "", "success");
        this.router.navigateByUrl("/pages/brokers/incentives");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  addBroker() {
    let payload: any = {
      ...this.add_broker,
    };
    if (this.national_id_image)
      payload.national_id_image = this.national_id_image;
    if (this.tax_id_image) payload.tax_id_image = this.tax_id_image;
    if (this.commercial_register_image)
      payload.commercial_register_image = this.commercial_register_image;
    this.slimLoadingBarService.start();
    this.brokerService.addBrokerIncentive(payload).subscribe(
      (data) => {
        swal("Added a broker successfully", "", "success");
        this.router.navigateByUrl("/pages/brokers/incentives");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
}
