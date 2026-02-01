import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ProjectsService } from "../services/projects/projects.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-building-slots",
  templateUrl: "./building-slots.component.html",
  styleUrls: ["./building-slots.component.css"],
})
export class BuildingSlotsComponent implements OnInit {
  buildings: any[];
  project_id: any;

  constructor(
    private projectService: ProjectsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.project_id = params['id'];
    })
  }

  ngOnInit() {
    this.getBuildingSlots();
  }

  getBuildingSlots() {
    this.slimLoadingBarService.start()
    this.projectService
      .getBuildingSlots(this.project_id).subscribe(
        (res: any) =>{
          this.slimLoadingBarService.complete();
          this.buildings = res;
          console.log(this.buildings);
        },
        (err) => {
          this.slimLoadingBarService.complete();
          this.errorHandlerService.handleErorr(err)
        }
      )
  }

  saveChanges() {
    this.slimLoadingBarService.start();
    let payload = {
      building_slots: this.buildings
    }
    this.projectService.saveBuildingSlots(this.project_id, payload).subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.getBuildingSlots();
      },
      (err) => {
        this.slimLoadingBarService.complete();
        this.errorHandlerService.handleErorr(err)
      }
    )
  }
}
