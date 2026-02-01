import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

@Component({
  selector: "app-manage-blocklist",
  templateUrl: "./manage-blocklist.component.html",
  styleUrls: ["./manage-blocklist.component.css"],
})
export class ManageBlocklistComponent implements OnInit {
  blocklist: FormGroup;
  mode: "add" | "edit";
  bloklist_data: any;
  blocklist_id: number;
  is_submitting: boolean = false;
  pageTest: any = 1;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private slimLoadingBarService: SlimLoadingBarService
  ) {
    this.route.paramMap.subscribe((res: any) => {
      console.log(res);
      if (res.params && +res.params.id > 0) {
        this.mode = "edit";
        this.blocklist_id = +res.params.id;
        this.bloklist_data = JSON.parse(
          window.localStorage.getItem("bloklist_data")
        );
        this.createBlocklistForm(this.bloklist_data);
      } else {
        this.mode = "add";
        this.createBlocklistForm();
      }
    });
  }

  ngOnInit() {}

  createBlocklistForm(data: any = {}) {
    console.log(data);
    this.blocklist = this.formBuilder.group({
      name: [data.name || ""],
      id_number: [data.id_number || ""],
      phone1: [data.phone1 || ""],
      phone2: [data.phone2 || ""],
      phone3: [data.phone3 || ""],
    });
  }

  back() {
    this.location.back();
  }

  save() {
    if (this.mode === "edit") this.edit();
    else this.add();
  }

  add() {
    const payload = this.blocklist.value;
    this.slimLoadingBarService.start();
    this.leadsService.addNewBlockList(payload).subscribe(
      (res) => {
        this.slimLoadingBarService.complete();
        swal("Success", "added blocklist successfully", "success");
        this.back();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  edit() {
    const payload = this.blocklist.value;
    this.slimLoadingBarService.start();
    this.leadsService.editBlockList(this.blocklist_id, payload).subscribe(
      (res) => {
        this.slimLoadingBarService.complete();
        swal("Success", "edited blocklist successfully", "success");
        this.back();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }
}
