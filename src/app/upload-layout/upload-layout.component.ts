import { ProjectsService } from "./../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";

@Component({
  selector: "app-upload-layout",
  templateUrl: "./upload-layout.component.html",
  styleUrls: ["./upload-layout.component.css"],
})
export class UploadLayoutComponent implements OnInit {
  layoutForm: any;
  floors: any = [0, 1, 2, 3, 4, 5, 6, 7];
  image: any;
  types: any = [];
  designTypes: any = [];
  projects: any;

  files: File[] = []; // for multi imgs plugin

  constructor(
    private formBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private projectService: ProjectsService,
    private errorHandleService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getAllProjects();
    this.createForms();
  }

  createForms() {
    this.layoutForm = this.formBuilder.group({
      floor: [""],
      building: [""],
      area: [""],
      block: [""],
      imgs: this.formBuilder.array([]),
      type: [""],
      design_type: ["", Validators.required],
      project_id: ["", Validators.required],
      apartment_number: [""],
    });
  }

  handleUnitLayout(event) {
    let reader: any = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let image = event.target.files[0];
      reader.readAsDataURL(image);
      console.log(image);
      this.image = image.name;
      reader.onload = () => {
        this.layoutForm.get("img").setValue({
          img_name: image.name,
          img_value: (reader.result as any).split(",")[1],
        });
        console.log(this.layoutForm.value);
      };
    }
  }
  getUnitTypes() {
    this.slimLoadingBarService.start();
    this.types = [];
    this.layoutForm.get("type").setValue("");
    this.projectService
      .getUnitTypes(this.layoutForm.get("project_id").value)
      .subscribe(
        (data) => {
          this.types = data;
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandleService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }
  getdesignTypes() {
    this.slimLoadingBarService.start();
    this.layoutForm.get("design_type").setValue("");
    this.designTypes = [];

    this.projectService
      .getDesignTypes(this.layoutForm.get("project_id").value)
      .subscribe(
        (data) => {
          this.designTypes = data;
          console.log(this.designTypes);
          this.slimLoadingBarService.complete();
        },
        (err) => {
          this.errorHandleService.handleErorr(err);
          this.slimLoadingBarService.complete();
        }
      );
  }

  onSelect(ev) {
    ev.addedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.layoutForm.get("imgs").push(
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
    this.files.splice(this.files.indexOf(event), 1);
  }
  uploadLayout() {
    console.log(this.layoutForm.value);
    this.slimLoadingBarService.start();
    const layout_data = this.layoutForm.value;
    console.log(layout_data);
    this.projectService.uploadUnitLayout(layout_data).subscribe(
      (data: any) => {
        swal("Success", "Uploaded unit layout successfully", "success");
        this.createForms();
      },
      (err) => this.errorHandleService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        console.log("projects", data);
        this.projects = data.data;
        console.log(this.projects);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandleService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }
}
