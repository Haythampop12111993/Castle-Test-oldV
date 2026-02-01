import { ProjectsService } from "./../../services/projects/projects.service";
import { environment } from "./../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { LeadsService } from "../../services/lead-service/lead-service.service";
import { UserServiceService } from "../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";

@Component({
  selector: "app-ambassadors",
  templateUrl: "./ambassadors.component.html",
  styleUrls: ["./ambassadors.component.css"],
})
export class AmbassadorsComponent implements OnInit {
  ambassador_export_url: any;

  oldAmbassadors: any = {};

  add_ambassador: any = {
    name: "",
    contact_phone: "",
    contact_address: "",
    contact_person: "",
  };

  search_ambassador_keyword: any;

  ambassadors: any;

  ambassadorSubsrice: Subscription;

  agents: any;

  uploadExcel: FormGroup;

  ambassadorDocumentForm: FormGroup;
  ambassadorToUploadDocumentId;
  ambassadorDocuments = [];
  @ViewChild("documentFile") documentFile;

  ambassadorCommissionData: any = {};
  projects: Array<any> = [];

  constructor(
    private leadService: LeadsService,
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private projectService: ProjectsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ambassador_export_url = `${
      environment.api_base_url
    }ambassadors/export?token=${window.localStorage.getItem("token")}`;

    this.uploadExcel = this.fb.group({
      file: [null, Validators.required],
    });
    this.getAmbassadors();
    this.getAgents();

    this.ambassadorDocumentForm = this.fb.group({
      file: [null, Validators.required],
      name: [null, Validators.required],
    });
    this.getprojects();
  }

  getprojects() {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.ambassadorCommissionData = data.data.reduce((obj, project) => {
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

  getAgents() {
    this.leadService.getPropertyConsultant().subscribe((res: any) => {
      this.agents = res;
    });
  }

  getAmbassadors() {
    this.slimLoadingBarService.start();
    this.userService.getAmbasdors().subscribe(
      (data: any) => {
        data.forEach((element) => {
          element.edit_mode = false;
          if (!element.agent) {
            element.agent = { name: "", id: "" };
          }
        });
        this.ambassadors = data;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAmbassador() {
    this.slimLoadingBarService.start();
    this.ambassadorSubsrice = this.leadService
      .searchAmbassador(this.search_ambassador_keyword)
      .subscribe(
        (data: any) => {
          data.forEach((element) => {
            element.edit_mode = false;
            if (!element.agent) {
              element.agent = { name: "", id: "" };
            }
          });
          this.ambassadors = data;
          this.slimLoadingBarService.complete();
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  searchAmbassadors(ev) {
    if (this.search_ambassador_keyword) {
      if (this.ambassadorSubsrice) {
        this.ambassadorSubsrice.unsubscribe();
      }
      this.getAmbassador();
    } else {
      this.getAmbassadors();
    }
  }

  edit_ambassador(index) {
    this.ambassadors.forEach((element, i) => {
      if (i == index) {
        this.ambassadors[i].edit_mode = true;
        this.oldAmbassadors = Object.assign({}, this.ambassadors[i]);
      } else {
        this.ambassadors[i].edit_mode = false;
      }
    });
  }

  save_ambassador(index) {
    this.slimLoadingBarService.start();
    const ambassador_id = this.ambassadors[index].id;
    if (this.ambassadors[index].agent.id) {
      this.ambassadors[index].contact_person = this.ambassadors[index].agent.id;
    }
    this.userService
      .editAmbassadors(ambassador_id, this.ambassadors[index])
      .subscribe(
        (data) => {
          this.ambassadors[index].edit_mode = false;
          swal("Updated successfully", "", "success");
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  deleteAmbassadorDocument(ambassador, document_id) {
    console.log(this.ambassadorDocuments);
    this.userService
      .deleteAmbassadorDocument(ambassador, document_id)
      .subscribe(
        (res: any) => {
          this.ambassadorDocuments.splice(
            this.ambassadorDocuments.findIndex((val) => (val.id = document_id)),
            1
          );
          console.log("document deleted : ", res);
        },
        (err) => console.log("error")
      );
  }

  cancel_ambassador(index) {
    this.ambassadors[index] = this.oldAmbassadors;
    this.ambassadors[index].edit_mode = false;
  }

  importAmbassadorsModalOpen() {}

  importAmbassadorsModalClose() {
    // this.createFilesUpload();
    // let inputValue = (<HTMLInputElement>document.getElementById("file")).value;
    // inputValue = '';
  }

  handleUploadExcel(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadExcel.get("file").setValue({
          file_name: file.name,
          file_value: (reader.result as any).split(",")[1],
        });
      };
    }
  }

  uploadExcelMethod(modal) {
    const formValue = this.uploadExcel.value;
    const data = {
      file_name: formValue.file.file_name,
      file: formValue.file.file_value,
    };
    this.slimLoadingBarService.start();
    this.leadService.importAmbassadors(data).subscribe(
      (reso) => {
        this.uploadExcel.reset();
        let inputValue = (<HTMLInputElement>document.getElementById("file"))
          .value;
        inputValue = "";
        modal.close();
        swal("Ambassadors imported successfully", "", "success");
        this.slimLoadingBarService.complete();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  exportAmbassadors() {
    this.slimLoadingBarService.start();
    this.leadService.exportAmbassadors().subscribe((res: any) => {
      window.open(res);
      this.slimLoadingBarService.complete();
    });
  }

  // Ambassador Commissions
  resetCommissions() {
    this.ambassadorCommissionData = this.projects.reduce((obj, project) => {
      obj[project.id] = {
        value: 0,
        commision_id: null,
      };
      return obj;
    }, {});
  }

  commissionsModalOpen(ambassadorId) {
    this.resetCommissions();
    this.slimLoadingBarService.start();
    this.userService.getAmbassadorCommissions(ambassadorId).subscribe(
      (data: any) => {
        data.map((d) => {
          this.ambassadorCommissionData[d.project_id].value = d.commission;
          this.ambassadorCommissionData[d.project_id].commission_id = d.id;
        });
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  commissionsModalClose() {
    this.resetCommissions();
  }

  submitCommissions(ambassadorId, modal) {
    let payload = {
      commissions: this.projects.map((proj) => ({
        project_id: proj.id,
        commission: this.ambassadorCommissionData[proj.id].value || 0,
      })),
    };

    this.userService
      .updateAmbassadorCommissions(ambassadorId, payload)
      .subscribe(
        (res) => {
          swal("Success", "Commissions uploaded successfully", "success");
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  /* ambassador DOCUMENT SECTION START */

  uploadAmbassadorDocumentModalOpen(ambassador) {
    console.log("selected ambassador: ", ambassador);
    this.ambassadorToUploadDocumentId = ambassador.id;
  }

  uploadAmbassadorDocumentModalClose() {
    this.ambassadorDocumentForm.reset();
    this.documentFile.nativeElement.value = "";
    console.log("uploadAmbassadorDocumentModalClose()");
  }

  uploadAmbassadorDocument(modal) {
    let payload = {
      documents: this.ambassadorDocumentForm.get("file").value,
    };
    // payload["name"] = this.ambassadorDocumentForm.get("name").value;
    this.userService
      .uploadAmbassadorDocument(
        this.ambassadorToUploadDocumentId,
        payload as any
      )
      .subscribe(
        (res) => {
          swal("Success", "Document uploaded successfully", "success");
          this.ambassadorDocumentForm.reset();
          modal.close();
        },
        (err) => this.errorHandlerService.handleErorr(err)
      );
  }

  handleDocumentUpload(event) {
    if (event.target.files && event.target.files.length > 0) {
      let files = this.handleFormatMultiple(event.target.files);
      this.ambassadorDocumentForm.get("file").setValue(files);
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

  showAmbassadorDocumentsModalOpen(ambassador) {
    this.userService.getAmbassadorDocuments(ambassador.id).subscribe(
      (res) => (this.ambassadorDocuments = res as any),
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }
  /* ambassador DOCUMENT SECTION END */
}
