import { ImageZoomService } from "./../shared/image-zoom/image-zoom.service";
import { ReservationService } from "./../services/reservation-service/reservation.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { ProjectsService } from "./../services/projects/projects.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { Lightbox } from "ngx-lightbox";
import { DomSanitizer } from "@angular/platform-browser";

import { getSlider } from "simple-slider/src/simpleslider.js";

@Component({
  selector: "app-unit-view",
  templateUrl: "./unit-view.component.html",
  styleUrls: ["./unit-view.component.css"],
})
export class UnitViewComponent implements OnInit {
  unitDetails: any;
  project_id: any;
  unit_id: any;
  unit_details: any;
  loading_unit_data: boolean = false;
  userInfo: any = JSON.parse(window.localStorage.getItem("userProfile"));
  blockForm: FormGroup;
  times: any;
  reasons: any;
  stopReservation: any;
  blockReasonData: any;
  layout_form: any;
  image_name: any;
  leadActivities: any = [];
  mode: any;
  comment: any;

  files: File[] = []; // for multi imgs plugin
  _album: any[] = [];
  santizer: DomSanitizer;

  _staticMasterPlanImages: any = [];

  currentSlide: any = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public projectService: ProjectsService,
    private errorHandlerService: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private _lightbox: Lightbox,
    public sanitizer: DomSanitizer,
    private imageZoomService: ImageZoomService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getBlockSettings();
    this.createLayoutForm();
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.project_id = +params.project_id;
      this.unit_id = +params.unit_id;
      this.mode = params.mode;
      console.log(this.mode);
      console.log(this.project_id);
      console.log(this.unit_id);
      this.getUnitDetails(this.unit_id);
    });
  }

  getBlockSettings() {
    this.projectService.getBlockSettings().subscribe((res: any) => {
      this.times = res.times;
      this.reasons = res.reasons;
    });
  }

  ngAfterViewInit() {
    console.log(`view initialized!!!!!!!!!!!!!!!!!!`);
  }

  openUnitLAyoutGallery(images, index) {
    this._staticMasterPlanImages = [];
    for (let i = 0; i < images.length; i++) {
      const src = images[i].url;
      const caption = " ";
      const thumb = images[i].url;
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

  getUnitDetails(unit_id) {
    this.loading_unit_data = true;
    this.projectService.getUnitDetails(this.unit_id).subscribe(
      (data) => {
        console.log(data);
        this.unit_details = data;
        if (!Array.isArray(this.unit_details.layout_image)) {
          this.unit_details.layout_images.push(this.unit_details.layout_image);
        }
        if (this.unit_details.layout_images) {
          if (this.unit_details.layout_images.length) {
            this.currentSlide = 0;
          }
        }
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => (this.loading_unit_data = false)
    );
  }

  printImg(src) {
    this.projectService.printImg(src);
  }

  /**
   * Start of Unit Modal
   */

  createForm() {
    this.blockForm = this.formBuilder.group({
      time: ["", Validators.required],
      reason: ["", Validators.required],
      other: [""],
    });
  }

  actionOnOpen() {}

  unitModalOnClose() {}

  actionOnClose() {}

  requestBlockUnit(modal) {
    const formModel = this.blockForm.value;
    if (formModel.reason == "Other") {
      formModel.reason = formModel.other;
    }
    console.log(formModel);
    if (!formModel.reason) {
      swal("Oops...", "Reason can not be empty!", "error");
    } else if (!formModel.time) {
      swal("Oops...", "Time can not be empty!", "error");
    } else {
      formModel.id = this.unit_id;
      this.slimLoadingBarService.start();
      this.projectService.requestBlockUnit(formModel).subscribe(
        (data) => {
          console.log(data);
          modal.close();
          if (this.userInfo.role == "Sales Manager")
            // to do make it declarative
            swal("Woohoo!", "Blocked request sent successfully!", "success");
          else {
            swal("Woohoo!", "Blocked successfully!", "success");
            this.getUnitDetails(this.unit_id);
          }
        },
        (err) => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
    }
  }

  /**
   * End of Unit Modal
   */

  /**
   * Start reserve unit
   */
  resrveUnit() {
    if (
      this.userInfo.id == this.unit_id &&
      this.unit_details.status == "Temp Blocked"
    ) {
      this.router.navigate(["pages/reservations/add/", this.unit_id]);
    } else {
      swal({
        title: "Are you sure?",
        text: "You will reserve the unit!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reserve it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.value) {
          this.slimLoadingBarService.start();
          this.stopReservation = true;
          this.reservationService
            .blockUnitAtReservation(this.unit_id)
            .subscribe(
              (data) => {
                console.log(data);
                this.router.navigate(["pages/reservations/add/", this.unit_id]);
                this.slimLoadingBarService.complete();
                this.stopReservation = false;
              },
              (err) => {
                this.errorHandlerService.handleErorr(err);
                this.slimLoadingBarService.complete();
                this.stopReservation = false;
              }
            );
        } else if (result.dismiss) {
          swal("Cancelled", "", "error");
        }
      });
    }
  }

  /**
   * End reserve unit
   */

  /**
   * Start of unblock unit
   */

  swalBlock() {
    swal({
      title: "Are you sure?",
      text: "You will unblock this unit!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unblock it!",
      cancelButtonText: "No, keep it blocked",
    }).then((result) => {
      if (result.value) {
        console.log(this.unit_id);
        this.slimLoadingBarService.start();
        this.projectService.adminUnBlockUnit(this.unit_id).subscribe(
          (data) => {
            // to do make it declarative
            swal("Woohoo!", "Un-blocked unit successfully!", "success");
            this.slimLoadingBarService.complete();
            this.ngOnInit();
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

  /**
   * End of unblock unit
   */

  makeUnitAvailableOpenModal(modal) {
    modal.open();
  }

  openMakeUnitAvailableModal() {}

  closeMakeUnitAvailableModal() {}

  submitMakeUnitAvailableModal(modal) {
    let payload = {
      comment: this.comment,
    };
    this.slimLoadingBarService.start();
    this.projectService.makeUnitAvailable(this.unit_id, payload).subscribe(
      (data) => {
        swal({ title: "Request sent successfully", type: "success" });
        modal.close();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  makeUnitNotAvailable() {
    this.slimLoadingBarService.start();
    this.projectService.makeUnitNotAvailable(this.unit_id).subscribe(
      (data) => {
        swal("Woohoo!", "Unit is un-avilable unit!", "success");
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  /**
   * start of Block Reason Modal
   */

  reasonModalOpen() {
    console.log("reason modal open");
    this.slimLoadingBarService.start();
    this.projectService.getBlockReason(this.unit_id).subscribe(
      (data) => {
        console.log(data);
        this.blockReasonData = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  /**
   * end of Block Reason Modal
   */

  createLayoutForm() {
    this.layout_form = this.formBuilder.group({
      imgs: this.formBuilder.array([]),
      // img: [null, Validators.required],
    });
  }

  uploadLayout() {
    // console.log(this.layout_form);
    let data = this.layout_form.value;
    console.log(data);
    this.slimLoadingBarService.start();
    this.projectService.uploadSingleUnitLayout(this.unit_id, data).subscribe(
      (data) => {
        this.createForm();
        this.getUnitDetails(this.unit_id);
        this.files = [];
        swal("Unit Layout uploaded", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  openimageZoom(img) {
    this.imageZoomService.open(img);
  }

  handleLayoutImage(event) {
    let reader: any = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      this.image_name = file.name;
      reader.onload = () => {
        this.layout_form.get("img").setValue({
          img_name: file.name,
          img_value: (reader.result as any).split(",")[1],
        });
      };
    }
  }

  /*
   *
   */

  onSelect(ev) {
    console.log(ev);
    ev.addedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.layout_form.get("imgs").push(
          this.formBuilder.group({
            img_name: file.name,
            img_value: (reader.result as any).split(",")[1],
          })
        );
      };
    });
    this.files.push(...ev.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  /*
   * Open Unit Image in gallery
   */
  openGallery(unit_imgs: any[], index) {
    for (let i = 0; i < unit_imgs.length; i++) {
      const src = unit_imgs[i].url;
      const caption = " ";
      const thumb = unit_imgs[i].url;
      const album = {
        src: src,
        caption: caption,
        thumb: thumb,
      };
      this._album.push(album);
    }
    console.log("new array: >> ", this._album);
    this._lightbox.open(this._album, index);
    this._album = [];
  }
  open;
  deleteUnitImage(imgId) {
    swal({
      title: "Are you sure?",
      text: "You will delete the unit image!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.projectService.deleteUnitImage(imgId).subscribe(
          (data) => {
            console.log(data);
            swal("Done!", "Deleted successfully!", "success");
            this.getUnitDetails(this.unit_id);
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  changeSlide(n) {
    if (n > this.unit_details.layout_images.length - 1) {
      this.currentSlide = 0;
    } else if (n < 0) {
      this.currentSlide = this.unit_details.layout_images.length - 1;
    } else {
      this.currentSlide = n;
    }
  }
}
