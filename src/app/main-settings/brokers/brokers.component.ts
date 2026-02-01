import { map } from "rxjs/operators";
import { ProjectsService } from "./../../services/projects/projects.service";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { environment } from "../../../environments/environment";
import { UserServiceService } from "../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";

@Component({
  selector: "app-brokers",
  templateUrl: "./brokers.component.html",
  styleUrls: ["./brokers.component.css"],
})
export class BrokersComponent implements OnInit {
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  broker_export_url: any;
  search_brokers_keyword: any;

  brokers: any;
  oldBroker: any = {};
  broker_last_name: any;

  brokerSubscribe: Subscription;

  brokerUploadExcel: FormGroup;
  agents: any;

  brokers_raw_data: any;
  base_url_for_pagination: any;
  last_page_url: any;
  current_page: any = 1;

  brokerDocumentForm: FormGroup;
  brokerToUploadDocumentId;
  brokerDocuments = [];
  @ViewChild("documentFile") documentFile;

  brokerCommissionData: any = {};
  projects: Array<any> = [];

  constructor(
    private userService: UserServiceService,
    private leadService: LeadsService,
    private projectService: ProjectsService,
    private fb: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService
  ) {
    this.broker_export_url = `${
      environment.api_base_url
    }brokers/export?token=${window.localStorage.getItem("token")}`;
  }

  ngOnInit() {
    this.getAllAgents();
    this.getBrokers();
    this.brokerUploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
    this.brokerDocumentForm = this.fb.group({
      file: [null, Validators.required],
      name: [null, Validators.required],
    });
    this.getprojects();
  }

  getprojects() {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.brokerCommissionData = data.data.reduce((obj, project) => {
          obj[project.id] = {
            value: 0,
            commision_id: null,
          };
          return obj;
        }, {});
        this.projects = data.data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getBrokers() {
    this.slimLoadingBarService.start();
    this.userService.getBrokersPaginated().subscribe(
      (data: any) => {
        this.brokers_raw_data = data;
        this.base_url_for_pagination = data.last_page_url.split("?")[0];
        this.last_page_url = data.last_page_url;
        this.current_page = data.current_page;
        data.data.forEach((element) => {
          element.edit_mode = false;
          element.users_arr = element.users;
          element.users = element.users.map((user) => user.id);
        });
        this.brokers = data.data;
        console.log(this.brokers);
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  edit_broker(index) {
    console.log(this.brokers);
    this.brokers.forEach((element, i) => {
      if (i == index) {
        this.broker_last_name = this.brokers[i].name;
        this.brokers[i].edit_mode = true;
        this.oldBroker = Object.assign({}, this.brokers[i]);
      } else {
        this.brokers[i].edit_mode = false;
      }
    });
  }

  save_broker(index) {
    this.slimLoadingBarService.start();
    const broker_id = this.brokers[index].id;
    this.userService.editBroker(broker_id, this.brokers[index]).subscribe(
      (data) => {
        this.brokers[index].users_arr = this.brokers[index].users.map(
          (userId) => this.agents.find((user) => user.id === userId)
        );
        this.brokers[index].edit_mode = false;
        swal("Updated successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deleteBrokerDocument(broker, document_id) {
    console.log("broker doc : ", broker, document_id);

    this.userService.deleteBrokerDocument(broker, document_id).subscribe(
      (res: any) => {
        this.brokerDocuments = res;
        console.log("document deleted : ", res);
      },
      (err) => console.log("error")
    );
  }

  deactivate_broker(index) {
    this.slimLoadingBarService.start();
    let broker = this.brokers[index];
    const broker_id = broker.id;
    this.userService
      .activeBroker(broker_id, Number(!broker.is_active))
      .subscribe(
        (data) => {
          this.brokers[index].is_active = Number(!broker.is_active);
          swal(
            `${broker.is_active ? "Deactivated" : "Activated"} successfully`,
            "",
            "success"
          );
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  cancelBroker(index) {
    this.brokers[index] = this.oldBroker;
    this.brokers[index].edit_mode = false;
  }

  searchBrokers(ev) {
    console.log(ev);
    console.log(this.search_brokers_keyword);
    if (this.search_brokers_keyword) {
      if (this.brokerSubscribe) {
        this.brokerSubscribe.unsubscribe();
      }
      this.getBroker();
    } else {
      this.getBrokers();
    }
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

  getBroker() {
    this.slimLoadingBarService.start();
    this.brokerSubscribe = this.leadService
      .searchBroker(this.search_brokers_keyword)
      .subscribe(
        (data: any) => {
          data.forEach((element) => {
            element.edit_mode = false;
            if (!element.agent) {
              element.agent = { name: "", id: "" };
            }
          });
          this.brokers = data;
          this.slimLoadingBarService.complete();
        },
        (err) => this.errorHandlerService.handleErorr(err)
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

  pageChange(ev) {
    this.current_page = ev;
    const selectedUrl = `${this.base_url_for_pagination}?page=${ev}`;
    this.infinite(selectedUrl, ev);
  }

  infinite(url, event) {
    console.log(url);
    console.log("pagination ");
    this.leadsService.infinteWithPaginated(url).subscribe(
      (data: any) => {
        this.brokers_raw_data = data;
        this.base_url_for_pagination = data.last_page_url.split("?")[0];
        this.last_page_url = data.last_page_url;
        this.current_page = data.current_page;
        data.data.forEach((element) => {
          element.edit_mode = false;
          element.users_arr = element.users;
          element.users = element.users.map((user) => user.id);
        });
        this.brokers = data.data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  // Broker Commissions
  resetCommissions() {
    this.brokerCommissionData = this.projects.reduce((obj, project) => {
      obj[project.id] = {
        value: 0,
        commision_id: null,
      };
      return obj;
    }, {});
  }

  commissionsModalOpen(brokerId) {
    this.resetCommissions();
    this.slimLoadingBarService.start();
    this.userService.getBrokerCommissions(brokerId).subscribe(
      (data: any) => {
        data.map((d) => {
          this.brokerCommissionData[d.project_id].value = d.commission;
          this.brokerCommissionData[d.project_id].commission_id = d.id;
        });
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  commissionsModalClose() {
    this.resetCommissions();
  }

  submitCommissions(brokerId, modal) {
    let payload = {
      commissions: this.projects.map((proj) => ({
        project_id: proj.id,
        commission: this.brokerCommissionData[proj.id].value || 0,
      })),
    };

    this.userService.updateBrokerCommissions(brokerId, payload).subscribe(
      (res) => {
        swal("Success", "Commissions uploaded successfully", "success");
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }
  /* BROKER DOCUMENT SECTION START */

  uploadBrokerDocumentModalOpen(broker) {
    console.log("selected broker: ", broker);
    this.brokerToUploadDocumentId = broker.id;
  }

  uploadBrokerDocumentModalClose() {
    this.brokerDocumentForm.reset();
    this.documentFile.nativeElement.value = "";
  }

  uploadBrokerDocument(modal) {
    let payload = {
      documents: this.brokerDocumentForm.get("file").value,
    };
    console.log(payload);
    // payload['name'] = this.brokerDocumentForm.get('name').value;

    this.userService
      .uploadBrokerDocument(this.brokerToUploadDocumentId, payload as any)
      .subscribe(
        (res) => {
          swal("Success", "Document uploaded successfully", "success");
          this.brokerDocumentForm.reset();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  handleDocumentUpload(event) {
    if (event.target.files && event.target.files.length > 0) {
      let files = this.handleFormatMultiple(event.target.files);
      this.brokerDocumentForm.get("file").setValue(files);
    }
  }

  handleFormatMultiple(filesArray) {
    let files = Object.values(filesArray);
    let filesBase46 = [];
    for (let i = 0; i < files.length; i++) {
      let img: any = files[i];
      let reader = new FileReader();
      let x = reader.readAsDataURL(img);
      reader.onload = () => {
        let imgObject = {
          document_name: img.name,
          document_value: (reader.result as any).split(",")[1],
        };
        filesBase46.push(imgObject);
      };
    }
    return filesBase46;
  }

  showBrokerDocumentsModalOpen(broker) {
    this.userService.getBrokerDocuments(broker.id).subscribe(
      (res) => (this.brokerDocuments = res as any),
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }
  /* BROKER DOCUMENT SECTION END */
}
