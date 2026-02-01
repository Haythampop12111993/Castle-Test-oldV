import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-call-center-scripts",
  templateUrl: "./call-center-scripts.component.html",
  styleUrls: ["./call-center-scripts.component.css"],
})
export class CallCenterScriptsComponent implements OnInit {
  //#region Definitions
  scripts: any = {
    call_center_script: "",
    sales_script: "",
  };

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
  //#region
  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private leadService: LeadsService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getScripts();
  }

  getScripts() {
    this.leadService.getCallCenterScript().subscribe(
      (data: any) => {
        this.scripts = data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        console.log(err);
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  save() {
    this.slimLoadingBarService.start();
    this.leadService.setCallCenterScript(this.scripts).subscribe(
      (data) => {
        swal("Saved Successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
}
