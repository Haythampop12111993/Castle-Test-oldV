import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "../services/projects/projects.service";
import swal from "sweetalert2";
import { environment } from "../../environments/environment";

@Component({
  selector: "add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.css"],
})
export class AddProjectComponent implements OnInit {
  environment = environment;
  sub: any;
  projectId: any;
  project: FormGroup;
  districts: any;
  phases: any = [{ serial: "", start_date: "", end_date: "" }];
  unit_excel_name: any;
  brochure_name: any;
  currentPhases: any = [];
  prePhases: any = [];
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  is_submitting: boolean = false;

  developers;

  editorConfig = {
    skin: false,
    inline_styles: false,
    base_url: `${environment.baseHREF}tinymce`,
    suffix: ".min",
    height: 300,
    directionality: "ltr",
    toolbar: `fullscreen | code |preview | formatselect | a11ycheck ltr rtl | alignleft aligncenter alignright alignjustify | undo redo | bold italic underline | outdent indent |  numlist bullist checklist | casechange permanentpen formatpainter removeformat | fullscreen  preview print | media pageembed link`,
    menubar: "custom",
  };
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public projectService: ProjectsService,
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlingservice: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getDistricts();
    this.getDevelopers();
    this.sub = this.route.params.subscribe((params) => {
      this.projectId = +params["id"];
      console.log(this.projectId);
      if (this.projectId == 0) this.createProject();
      else this.getProject();
    });
  }

  getDevelopers() {
    this.projectService.getDevelopers().subscribe((res) => {
      this.developers = res;
    });
  }

  getProject() {
    console.log("edit modeeeeeeeeeeeeeee");
    this.createProject();
    this.slimLoadingBarService.start(() => {
      console.log("Loading complete");
    });
    this.projectService.getcurrentproject(this.projectId).subscribe(
      (data: any) => {
        this.project = this.formBuilder.group({
          name: [data.name, [Validators.required]],
          district_id: [data.district_id, Validators.required],
          // 'starting_price': ['', Validators.required],
          // 'installment': ['', Validators.required],
          details: [data.details, Validators.required],
          number_of_phases: [data.phases.length, Validators.required],
          unit_excel: [null],
          brochure_file: [null],
          project_image: [null],
          installment_image: [null],
          down_payment: [data.down_payment, Validators.required],
          garage_price: [data.garage_price, Validators.required],
          slots: [data.slots, Validators.required],
          storage_slots: [data.storage_slots],
          storage_price: [data.storage_price],
          extra_outdoor_meters: [data.extra_outdoor_meters],
          extra_outdoor_meter_price: [data.extra_outdoor_meter_price],
          type: [data.type, Validators.required],
          developer_id: [data.developer_id],
          delivery_compilation: [data.delivery_compilation],
          send_reminder: [data.send_reminder],
          commission_per_million: [data.commission_per_million],
          completion_rate: [data.completion_rate, Validators.required],
          master_plan: [[]],
          land_number: [data.land_number],
          land_letter: [data.land_letter],
          region: [data.region],
          license_issuer: [data.license_issuer],
          land_owner_section: [data.land_owner_section],
          general_finishing_section: [data.general_finishing_section],
        });
        console.log(data);
        let modifiedPhase: any = [];
        data.phases.forEach((e) => {
          modifiedPhase.push({
            serial: e.serial,
            start_date: e.start_date,
            end_date: e.end_date,
          });
        });
        this.prePhases = modifiedPhase;
        this.phases = modifiedPhase;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();

        this.errorHandlingservice.handleErorr(err);
      }
    );
  }

  createProject() {
    this.project = this.formBuilder.group({
      name: ["", [Validators.required]],
      district_id: [null, Validators.required],
      // 'starting_price': ['', Validators.required],
      // 'installment': ['', Validators.required],
      details: ["", Validators.required],
      number_of_phases: ["", Validators.required],
      unit_excel: [null],
      brochure_file: [null],
      project_image: [null],
      installment_image: [null],
      down_payment: [null, Validators.required],
      garage_price: ["", Validators.required],
      slots: ["", Validators.required],
      storage_slots: [""],
      storage_price: [""],
      extra_outdoor_meters: [""],
      extra_outdoor_meter_price: [""],
      type: [null, Validators.required],
      developer_id: [null],
      delivery_compilation: [""],
      send_reminder: [""],
      commission_per_million: [""],
      completion_rate: ["", Validators.required],
      master_plan: [[]],
      land_number: [""],
      land_letter: [""],
      region: [""],
      license_issuer: [""],
      land_owner_section: [""],
      general_finishing_section: [""],
    });
  }

  getDistricts() {
    this.projectService.getDistricts().subscribe(
      (data) => {
        console.log(data);
        this.districts = data;
      },
      (err) => this.errorHandlingservice.handleErorr(err)
    );
  }

  onExcelChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.unit_excel_name = file.name;
      reader.onload = () => {
        this.project.get("unit_excel").setValue({
          unit_excel_name: file.name,
          unit_excel_filetype: file.type,
          unit_excel_value: (reader.result as any).split(",")[1],
        });
        console.log(this.project.get("unit_excel").value);
      };
    }
  }

  onProjectImage(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.unit_excel_name = file.name;
      reader.onload = () => {
        this.project.get("project_image").setValue({
          project_image_name: file.name,
          project_image_type: file.type,
          project_image_value: (reader.result as any).split(",")[1],
        });
        console.log(this.project.get("project_image").value);
      };
    }
  }

  onBrochureChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.size / 1024 / 1024 > 20) {
        swal("error", "file must be smaller than 20MB.", "error");
        return;
      }
      reader.readAsDataURL(file);
      console.log(file);
      this.brochure_name = file.name;
      reader.onload = () => {
        this.project.get("brochure_file").setValue({
          brochure_name: file.name,
          brochure_value: (reader.result as any).split(",")[1],
        });
        console.log(this.project.get("brochure_file").value);
      };
    }
  }

  onInstallmentImage(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      this.unit_excel_name = file.name;
      reader.onload = () => {
        this.project.get("installment_image").setValue({
          installment_logo_name: file.name,
          installment_logo_value: (reader.result as any).split(",")[1],
        });
        console.log(this.project.get("installment_image").value);
      };
    }
  }

  onStaticMasterPlanImage(event) {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files);
      // this.handleStaticMasterPlanImage(event.target.files).subscribe((res) => {
      //   console.log(res);
      // })
      let images = this.handleStaticMasterPlanImage(event.target.files);
      this.project.get("master_plan").setValue(images);
    }
  }

  handleStaticMasterPlanImage(imageArray) {
    let images = Object.values(imageArray);
    let imageBase46 = [];
    for (let i = 0; i < images.length; i++) {
      let img: any = images[i];
      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        let imgObject = {
          master_image_name: img.name,
          master_image_type: img.type,
          master_image_value: (reader.result as any).split(",")[1],
        };
        imageBase46.push(imgObject);
      };
    }
    return imageBase46;
  }

  save() {
    let formModel = this.project.value;
    formModel.phases = this.phases;
    console.log(formModel);
    if(formModel.down_payment > 100){
      swal('Oops... \n Down payment can not be greater than 100%', '', 'error');
      return;
    }
    formModel.down_payment = formModel.down_payment.toString();
    if (this.projectId == 0) {
      this.slimLoadingBarService.start(() => {
        console.log("Loading complete");
      });
      this.is_submitting = true;
      this.projectService.addProject(formModel).subscribe(
        (data) => {
          console.log(data);
          this.router.navigate(["/pages/projects"]);
          this.slimLoadingBarService.complete();
          this.is_submitting = false;
        },
        (err) => {
          this.is_submitting = false;
          this.errorHandlingservice.handleErorr(err);
        }
      );
    } else {
      this.slimLoadingBarService.start(() => {
        console.log("Loading complete");
      });
      this.is_submitting = true;
      this.projectService.UpdateProject(this.projectId, formModel).subscribe(
        (data) => {
          console.log(data);
          this.slimLoadingBarService.complete();
          this.router.navigate(["/pages/projects"]);
          this.is_submitting = false;
        },
        (err) => {
          this.errorHandlingservice.handleErorr(err);
          this.is_submitting = false;
        }
      );
    }
  }

  selectPhasesNumber(event) {
    let number_of_phases: any = this.project.get("number_of_phases").value;
    console.log(number_of_phases);
    if (number_of_phases >= 1 && number_of_phases < 21) {
      this.phases = [];
      for (var i = 0; i < number_of_phases; i++) {
        this.phases.push({ serial: "", start: "", end: "" });
      }
      if (this.phases.length != 0) {
        this.prePhases.forEach((e, i) => {
          if (this.phases[i]) {
            this.phases[i].serial = e.serial;
            this.phases[i].start_date = e.start_date;
            this.phases[i].end_date = e.end_date;
          }
        });
      }
      console.log(this.phases);
    } else {
      this.project.patchValue({
        number_of_phases: "",
      });
      this.phases = [{ serial: "", start_date: "", end_date: "" }];
    }
  }
  gotodashboard() {
    this.router.navigate(["/pages/projects"]);
  }
}
