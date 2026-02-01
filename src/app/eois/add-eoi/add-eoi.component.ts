import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ProjectsService } from "../../services/projects/projects.service";

@Component({
  selector: "app-add-eoi",
  templateUrl: "./add-eoi.component.html",
  styleUrls: ["./add-eoi.component.css"],
})
export class AddEoiComponent implements OnInit {

  eoiForm: FormGroup;
  arrSearch: any;
  dataFromSearch: any;
  projects: any;
  chosenLead: any;
  constructor(
    private leadsService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private projectService: ProjectsService
  ) {
    this.createEoiForm();
  }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
      }
    );
  }

  createEoiForm() {
    this.eoiForm = this.formBuilder.group({
      lead_id: ["", Validators.required],
      paid_price: [""],
      project_id: [""],
      delivery_date: [""],
      total_budget_from: [""],
      total_budget_to: [""],
      down_payment_from: [""],
      down_payment_to: [""],
      unit_area_from: [""],
      unit_area_to: [""],
    });
  }

  observableSource = (keyword: any): any => {
    let baseUrl: string = environment.api_base_url;
    let data = {
      keyword: keyword,
    };
    if (keyword) {
      return this.http
        .get(`${baseUrl}leads?keyword=${keyword}`)
        .map((res: any) => {
          console.log(res.data.length);
          if (res.data.length == 0) {
            let arr = [];
            return arr;
          } else {
            this.arrSearch = [];
            this.dataFromSearch = res.data;
            res.data.forEach((e) => {
              this.arrSearch.push(`${e.name} / ${e.id}`);
            });
            // console.log(arr);
            return this.arrSearch;
          }
        });
    } else {
      return Observable.of([]);
    }
  }

  add() {

  }
}
