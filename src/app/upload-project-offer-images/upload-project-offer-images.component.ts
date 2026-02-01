import { ProjectsService } from "../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

const convertURLTOFile = async (url: string) => {
  let blob = await fetch(url).then((r) => r.blob());
  return blob;
};

@Component({
  selector: "app-upload-project-offer-images",
  templateUrl: "./upload-project-offer-images.component.html",
  styleUrls: ["./upload-project-offer-images.component.css"],
})
export class UploadProjectOfferImagesComponent implements OnInit {
  project_id;
  imageForm: any = {};
  imageView: any = {};
  mainImages: any = {};
  images: any;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private projectService: ProjectsService,
    private errorHandleService: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (!params.project_id) {
        this.location.back();
      }
      this.project_id = params.project_id;
      this.fetchProjectOfferImages();
    });
  }

  fetchProjectOfferImages() {
    this.slimLoadingBarService.start();
    this.projectService.getProjectOfferImages(this.project_id).subscribe(
      (data: any) => {
        this.images = data;
      },
      (err) => this.errorHandleService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  onSelect(ev, key) {
    const file = ev.addedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageForm[key] = {
        img_name: file.name,
        img_value: (reader.result as any).split(",")[1],
      };
    };
    this.imageView[key] = file;
  }

  onRemoveImage(key) {
    if (this.imageForm[key]) {
      this.imageForm[key] = null;
      this.imageView[key] = this.mainImages[key];
    } else if (this.imageView[key]) {
      this.deleteImage(key);
      this.imageView[key] = null;
    }
  }
  send() {
    this.slimLoadingBarService.start();
    const layout_data = Object.assign({}, this.imageForm);
    this.projectService
      .postProjectOfferImages(this.project_id, layout_data)
      .subscribe(
        (data: any) => {
          swal("Success", "Uploaded unit layout successfully", "success");
          this.fetchProjectOfferImages();
          this.location.back();
        },
        (err) => this.errorHandleService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  deleteImage(key) {
    this.slimLoadingBarService.start();
    this.projectService.deleteProjectOfferImage(this.project_id, key).subscribe(
      (data: any) => {
        this.mainImages[key] = null;
        swal("Success", "Uploaded unit layout successfully", "success");
      },
      (err) => this.errorHandleService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
}
