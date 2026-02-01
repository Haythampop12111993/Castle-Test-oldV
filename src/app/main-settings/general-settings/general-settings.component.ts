import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";

import { UserServiceService } from "../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ReservationService } from "../../services/reservation-service/reservation.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-general-settings",
  templateUrl: "./general-settings.component.html",
  styleUrls: ["./general-settings.component.css"],
})
export class GeneralSettingsComponent implements OnInit {
  reservation: any;
  statusLoaded = false;

  leadCycle: any;

  reservation_mobile_status: any;

  lead_mobile_status: any;
  system_open: any;

  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  filesForm: FormGroup;

  constructor(
    private userService: UserServiceService,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,
    private leadsService: LeadsService,
    private formBuilder: FormBuilder
  ) {
    this.filesForm = this.formBuilder.group({
      file_name: [null, Validators.required],
      file: [null, Validators.required],
    });
    console.log(this.userData.role);
    if (
      this.userData.is_c_level !== 1 &&
      (this.userData.role == "A.R Accountant" ||
        this.userData.role == "Treasury Accountant")
    ) {
      this.router.navigate(["/pages/settings/brokers"]);
    } else if (
      this.userData.role == "A.R Accountant" ||
      this.userData.role == "Treasury Accountant"
    ) {
      this.router.navigate(["/pages/settings/payment-terms"]);
    } else if (this.userData.role == "Legal Head") {
      this.router.navigate(["/pages/settings/contracts"]);
    }
  }

  ngOnInit() {
    this.getCurrentReservationStatus();
    this.getCurrentLeadCycleStatus();
    this.getGeneralSettings();
  }

  // this code is for future use
  // DO NOT DELETE IT

  // createSmsConfigurationForm() {
  //   this.smsConfiguration = this.fb.group({
  //     username: ['', Validators.required],
  //     password: ['', Validators.required]
  //   });
  // }

  // sendSmsConfigurations() {
  //   this.slimLoadingBarService.start();
  //   console.log(this.smsConfiguration.value);
  //   this.marketingService.smsCredentials(this.smsConfiguration.value).subscribe(
  //     (res: any) => {
  //       swal('SMS Credentials set successfully', '', 'success');
  //       this.createSmsConfigurationForm();
  //     },
  //     err => this.errorHandlerService.handleErorr(err),
  //     () => this.slimLoadingBarService.complete()
  //   );
  // }

  getCurrentReservationStatus() {
    this.userService.getCurrentReservationStatus().subscribe(
      (data: any) => {
        this.reservation = {
          onColor: "primary",
          offColor: "danger",
          onText: "Enable",
          offText: "Disable",
          value: "",
        };
        this.reservation.value = data[0].value;
        console.log(this.reservation.value);

        // if (data[0].value === 'on') {
        //   this.reservation.value = false;
        // } else {
        //   this.reservation.value = true;
        // }

        this.statusLoaded = true;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  toggleChange(event) {
    console.log(event);
    let status;
    if (event === false) {
      status = "off";
    } else {
      status = "on";
    }

    this.slimLoadingBarService.start();
    this.userService.changeReservationStatus(status).subscribe(
      (data) => {
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getCurrentLeadCycleStatus() {
    this.userService.getCurrentLeadCycle().subscribe(
      (data: any) => {
        this.leadCycle = {
          onColor: "primary",
          offColor: "danger",
          onText: "Enable",
          offText: "Disable",
          value: "",
        };
        this.leadCycle.value = data[0].value;
        console.log(this.leadCycle.value);
        // if (data[0].value === 'on') {
        //   this.leadCycle.value = false;
        // } else {
        //   this.leadCycle.value = true;
        // }
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  leadCycleChange(event) {
    let status;
    if (event === false) {
      status = "off";
    } else {
      status = "on";
    }
    this.slimLoadingBarService.start();
    this.userService.changeLeadCycleStatus(status).subscribe(
      (data) => {},
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getGeneralSettings() {
    this.reservationService.getGeneralSettings().subscribe(
      (res: any) => {
        this.lead_mobile_status = {
          onColor: "primary",
          offColor: "danger",
          onText: "Enable",
          offText: "Disable",
          value: "",
        };
        this.reservation_mobile_status = {
          onColor: "primary",
          offColor: "danger",
          onText: "Enable",
          offText: "Disable",
          value: "",
        };
        this.system_open = {
          onColor: "primary",
          offColor: "danger",
          onText: "Enable",
          offText: "Disable",
          value: "",
        };
        this.reservation_mobile_status.value = res.reservation_mobile_status;
        this.lead_mobile_status.value = res.lead_mobile_status;
        this.system_open.value = res.system_open;
        // if (res.lead_mobile_status === 'on') {
        //   this.lead_mobile_status.value = false;
        // } else {
        //   this.lead_mobile_status.value = true;
        // }
        // if (res.reservation_mobile_status === 'on') {
        //   this.reservation_mobile_status.value = false;
        // } else {
        //   this.reservation_mobile_status.value = true;
        // }
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  reservationMobileStatusChange(event) {
    let status;
    if (event === false) {
      status = "off";
    } else {
      status = "on";
    }
    const payload = {
      key: "reservation_mobile_status",
      value: status,
    };
    this.slimLoadingBarService.start();
    this.reservationService.updateGeneralSettings(payload).subscribe(
      (data) => {
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  leadMobileStatusChanged(event) {
    let status;
    if (event === false) {
      status = "off";
    } else {
      status = "on";
    }
    const payload = {
      key: "lead_mobile_status",
      value: status,
    };
    this.slimLoadingBarService.start();
    this.reservationService.updateGeneralSettings(payload).subscribe(
      (data) => {
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }
  systemStatusChanged(event) {
    let status;
    if (event === false) {
      status = "off";
    } else {
      status = "on";
    }
    const payload = {
      key: "system_open",
      value: status,
    };
    this.slimLoadingBarService.start();
    this.reservationService.updateGeneralSettings(payload).subscribe(
      (data) => {
        this.slimLoadingBarService.complete();
        if (status === "off") {
          swal("Wohoo", "System shut downed successfully", "success");
        } else {
          swal("Wohoo", "System Opened successfully", "success");
        }
      },
      (err) => {
        swal("Ops", "Something went wrong !!!", "error");
        this.slimLoadingBarService.complete();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  submitComissionModal(modal) {
    let payload = this.filesForm.value;
    modal.close();
    console.log(payload);
    this.slimLoadingBarService.start();
    this.leadsService.uploadComissionSettings(payload).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        swal(
          "success",
          "uploaded comisssion for this project successfully",
          "success"
        );
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  handleComissionExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.filesForm.get("file_name").setValue(file.name);
        this.filesForm
          .get("file")
          .setValue((reader.result as any).split(",")[1]);
      };
    }
  }

  downloadComissionSheet() {
    this.slimLoadingBarService.start();
    this.leadsService.downloadComissionSettings().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      }
    );
  }
}
