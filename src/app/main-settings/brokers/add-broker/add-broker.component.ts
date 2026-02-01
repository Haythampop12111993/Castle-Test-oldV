import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { environment } from "../../../../environments/environment";
import { UserServiceService } from "../../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { LeadsService } from "../../../services/lead-service/lead-service.service";

@Component({
  selector: "app-add-broker",
  templateUrl: "./add-broker.component.html",
  styleUrls: ["./add-broker.component.css"],
})
export class AddBrokerComponent implements OnInit {
  broker_export_url: any;

  add_broker: any = {
    name: "",
    contact_phone: "",
    contact_address: "",
    contact_person: "",
    users: null,
    tax_number: "",
  };

  brokerUploadExcel: FormGroup;
  agents: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private userService: UserServiceService,
    private leadService: LeadsService,
    private fb: FormBuilder,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getAllAgents();
    this.broker_export_url = `${
      environment.api_base_url
    }brokers/export?token=${window.localStorage.getItem("token")}`;

    this.brokerUploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
  }

  getAllAgents() {
    this.leadService.getAgents().subscribe(
      (data: any) => {
        this.agents = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  addBroker() {
    if (!this.add_broker.tax_number) {
      swal("error", "you must enter a tax number", "error");
    }
    this.slimLoadingBarService.start();
    this.userService.addBroker(this.add_broker).subscribe(
      (data) => {
        swal("Added a broker successfully", "", "success");
        this.add_broker = {
          name: "",
          contact_phone: "",
          contact_address: "",
          contact_person: "",
          users: null,
          tax_number: "",
        };
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  importBrokersModalOpen() {}

  importBrokersModalClose() {
    // this.createFilesUpload();
    // let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    // inputValue = '';
  }

  handleBrokerUploadExcel(event) {
    console.log(event);
    console.log(event.target.files);
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.brokerUploadExcel.get("file").setValue({
          file_name: file.name,
          file_value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  uploadBrokerExcelMethod(modal) {
    if (this.brokerUploadExcel.valid) {
      const formValue = this.brokerUploadExcel.value;
      const data = {
        file_name: formValue.file.file_name,
        file: formValue.file.file_value,
      };
      this.slimLoadingBarService.start();
      this.leadService.importBrokers(data).subscribe(
        (reso) => {
          // this.createFilesUpload();
          this.brokerUploadExcel.reset();
          let inputValue = (<HTMLInputElement>(
            document.getElementById("brokerExcelFile")
          )).value;
          inputValue = "";
          modal.close();
          swal("Brokers imported successfully", "", "success");
          this.slimLoadingBarService.complete();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }
}
