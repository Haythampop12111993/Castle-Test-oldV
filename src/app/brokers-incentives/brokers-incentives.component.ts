import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { UserServiceService } from "../services/user-service/user-service.service";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ProjectsService } from "../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import swal from "sweetalert2";

@Component({
  selector: "app-brokers-incentives",
  templateUrl: "./brokers-incentives.component.html",
  styleUrls: ["./brokers-incentives.component.css"],
})
export class BrokersIncentivesComponent implements OnInit {
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
  current_page: any;

  brokerDocumentForm: FormGroup;
  brokerToUploadDocumentId;
  brokerDocuments = [];
  @ViewChild("documentFile") documentFile;

  brokerCommissionData: any = {};
  projects: Array<any> = [];
  contract_status;
  contract_valid;
  keyword;

  constructor(
    private brokersService: UserServiceService,
    private leadService: LeadsService,
    private projectService: ProjectsService,
    private fb: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private leadsService: LeadsService,
    private router: Router
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

  getBrokers(payload?) {
    this.slimLoadingBarService.start();
    this.brokersService
      .getBrokerIncentives({ ...payload, paginate: 1 })
      .subscribe(
        (data: any) => {
          this.brokers_raw_data = data;
          this.base_url_for_pagination = data.last_page_url.split("?")[0];
          this.last_page_url = data.last_page_url;
          this.current_page = data.current_page;
          // data.data.forEach((element) => {
          // element.edit_mode = false;
          // element.users_arr = element.users;
          // element.users = element.users.map((user) => user.id);
          // });
          this.brokers = data.data;
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  edit_broker(broker) {
    // this.brokers.forEach((element, i) => {
    //   if (i == index) {
    //     this.broker_last_name = this.brokers[i].name;
    //     this.brokers[i].edit_mode = true;
    //     this.oldBroker = Object.assign({}, this.brokers[i]);
    //   } else {
    //     this.brokers[i].edit_mode = false;
    //   }
    // });
    window.localStorage.setItem(
      "edit_broker_incentives_settings",
      JSON.stringify(broker)
    );
    this.router.navigateByUrl(`/pages/brokers/incentives/add/${broker.id}`);
  }

  save_broker(index) {
    this.slimLoadingBarService.start();
    const broker_id = this.brokers[index].id;
    this.brokersService
      .editBrokerIncentive(broker_id, this.brokers[index])
      .subscribe(
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
    this.brokersService.deleteBrokerIncentive(broker.id).subscribe(
      (res: any) => {
        this.brokerDocuments = res;
      },
      (err) => {}
    );
  }

  cancelBroker(index) {
    this.brokers[index] = this.oldBroker;
    this.brokers[index].edit_mode = false;
  }

  searchBrokers(ev) {
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
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  getBroker() {
    this.getBrokers({ keyword: this.keyword });
  }

  importBrokersModalOpen() {}

  importBrokersModalClose() {
    // this.createFilesUpload();
    // let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    // inputValue = '';
  }

  handleBrokerUploadExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
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
          swal("Broker Incentives imported successfully", "", "success");
          this.slimLoadingBarService.complete();
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  pageChange(ev: any) {
    if (ev == null || ev == undefined || Number.isNaN(ev)) return;
    this.current_page = ev;
    const selectedUrl = `${this.base_url_for_pagination}?page=${ev}`;
    this.infinite(selectedUrl, ev);
  }

  infinite(url, event) {
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
  /* BROKER DOCUMENT SECTION START */
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

  resetFilters() {
    this.keyword = "";
    this.contract_status = "";
    this.contract_valid = "";
    this.getBrokers();
  }

  filter() {
    const payload = {
      keyword: this.keyword,
      contract_status: this.contract_status,
      contract_valid: this.contract_valid,
    };
    this.getBrokers(payload);
  }

  addBroker() {
    this.router.navigateByUrl("/pages/brokers/incentives/add");
  }
}
