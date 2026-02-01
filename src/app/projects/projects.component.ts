import { ImageZoomService } from "./../shared/image-zoom/image-zoom.service";
import { environment } from "./../../environments/environment";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ProjectsService } from "../services/projects/projects.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import * as _ from "lodash";
import { Lightbox } from "ngx-lightbox";

import swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "projects",
  templateUrl: "./projects.component.html",
  styleUrls: [
    "../../assets/css/style.css",
    "../../assets/css/custom.css",
    "./projects.component.css",
  ],
  providers: [ProjectsService],
})
export class ProjectsComponent implements OnInit {
  pagination: any = {
    page: 1,
    last: null,
    total: null,
    to: null,
    last_page: null,
  };
  projectUnits: any = [];
  totalRec: number;
  projects: Array<any> = [];
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));
  next_page_url: any;
  prev_page_url: any;
  current_page: any;
  private _staticMasterPlanImages: Array<any> = [];
  filesForm: FormGroup;

  keyword = '';
  environment = environment;
  unit_excel_name: any;
  unit_excel: any;
  project_id: number;
  file: any;

  constructor(
    private projectService: ProjectsService,
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService,
    public leadsService: LeadsService,
    private _lightbox: Lightbox,
    private formBuilder: FormBuilder,
    private imageZoomService: ImageZoomService
  ) {
    this.getprojects(1, true);
    this.filesForm = this.formBuilder.group({
      file_name: [null, Validators.required],
      file: [null, Validators.required],
    });
  }

  ngOnInit() {}

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

  submitComissionModal(project_id, modal) {
    let payload = this.filesForm.value;
    modal.close();
    console.log(payload);
    this.slimLoadingBarService.start();
    this.leadsService.uploadComissionPerProject(project_id, payload).subscribe(
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

  downloadComissionSheet(project_id) {
    this.slimLoadingBarService.start();
    this.leadsService.downloadComissionPerProject(project_id).subscribe(
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

  downloadAvailableSheet(project_id) {
    this.slimLoadingBarService.start();
    this.projectService
      .filterUnits(project_id, {
        is_export: 1,
        status: "Available",
      })
      .subscribe(
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

  downloadFile(url) {
    window.open(url);
  }
  getprojects(page = 1, first = false) {
    this.projects = null;
    this.slimLoadingBarService.start();
    this.projectService.getProjects({ page }).subscribe(
      (data) => {
        this.pagination.page = data.current_page;
        this.pagination.per_page = data.per_page;
        this.pagination.total = data.total;
        this.pagination.to = data.to;
        this.pagination.last_page = data.last_page;
        this.projects = data.data;
        this.projects.forEach((project, x) => {
          this.projects[x].excel = `${environment.api_base_url}units/export/${
            project.id
          }?token=${window.localStorage.getItem("token")}`;
          project.unit_types = _.values(project.unit_types);
        });
        this.slimLoadingBarService.complete();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  openGallery(images, index) {
    this._staticMasterPlanImages = [];
    for (let i = 0; i < images.length; i++) {
      const src = images[i].image.url;
      const caption = " ";
      const thumb = images[i].image.url;
      const album = {
        src: src,
        caption: caption,
        thumb: thumb,
      };
      this._staticMasterPlanImages.push(album);
    }
    console.log(this._staticMasterPlanImages);
    this._lightbox.open(this._staticMasterPlanImages, index);
  }

  printImg(src) {
    this.projectService.printImg(src);
  }

  getProjectUnitsbytype(project_id, unit_type_id) {
    this.router.navigate(["/pages/projects/units", project_id], {
      queryParams: { type: unit_type_id, status: "Available" }
    });
  }

  goToUnits(project_id) {
    this.router.navigate(["/pages/projects/units", project_id]);
  }

  openMasterPlanZoom(img) {
    this.imageZoomService.open(img);
  }

  setupModeMasterPlan(id) {
    this.router.navigate(["/pages/master-plan"], {
      queryParams: { mode: "setup", id: id },
    });
  }

  staticMasterPlanImagesModalModalOpen() {}

  staticMasterPlanImagesModalClose() {}

  staticMasterPlanImagesModalSubmit(modal) {
    // let payload = {
    //   is_overseas: this.is_overseas
    // };
    // this.slimLoadingBarService.start();
    // this.reservationService
    //   .changeOverseas(this.reservation_details.id, payload)
    //   .subscribe(
    //     (res: any) => {
    //       this.getReservation();
    //       modal.close();
    //     },
    //     err => this.errorHandlerService.handleErorr(err),
    //     () => this.slimLoadingBarService.complete()
    //   );
  }

  openExcel(url) {
    window.open(url);
  }

  onExcelChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.unit_excel_name = file.name;
      reader.onload = () => {
        this.unit_excel = {
          unit_excel_name: file.name,
          unit_excel_filetype: file.type,
          unit_excel_value: (reader.result as any).split(",")[1],
        }
      };
    }
  }

  submitImportNewUnitsModal(modal) {
    let payload = {
      unit_excel_name:this.unit_excel.unit_excel_name,
      unit_excel_filetype:this.unit_excel.unit_excel_filetype,
      unit_excel_value:this.unit_excel.unit_excel_value,
      operation: "add",
    }
    this.projectService.importUnits(this.project_id, payload).subscribe(
      (data) => {
        this.getprojects(1, true);
        swal("Woohoo!", "Units imported successfully!", "success");
        modal.close();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  updateImportNewUnitsModal(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.unit_excel_name = file.name;
      reader.onload = () => {
        this.unit_excel = {
          unit_excel_name: file.name,
          unit_excel_filetype: file.type,
          unit_excel_value: (reader.result as any).split(",")[1],
        }

        let payload = {
          unit_excel_name:this.unit_excel.unit_excel_name,
          unit_excel_filetype:this.unit_excel.unit_excel_filetype,
          unit_excel_value:this.unit_excel.unit_excel_value,
          operation: "edit",
        }
        this.projectService.importUnits(this.project_id, payload).subscribe(
          (data) => {
            this.getprojects(1, true);
            swal("Woohoo!", "Units imported successfully!", "success");
            event.target.value = '';
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            event.target.value = '';
          }
        );
      };
    }
  }

  deleteBtn(img, projectIndex, index) {
    console.log(img, index);
    swal({
      title: "Are you sure?",
      text: "You will delete this masterplan!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, detele it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.projectService.deleteStaticMasterPlan(img.id).subscribe(
          (data) => {
            this.projects[projectIndex].static_master_plan.splice(index, 1);
            swal("Woohoo!", "Deleted this masterplan!", "success");
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  goToBuildingSlots(project_id) {
    this.router.navigateByUrl(`/pages/building-slots/${project_id}`);
  }

  goToConstructionUpdates(id: number) {
    this.router.navigateByUrl(`/pages/projects/${id}/construction-updates`);
  }
}
