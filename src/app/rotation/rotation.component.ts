import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "../services/projects/projects.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";

import swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-rotation",
  templateUrl: "./rotation.component.html",
  styleUrls: ["./rotation.component.css"]
})
export class RotationComponent implements OnInit {
  simpleList: any = [];

  campaigns: any;
  campaign_id: any = "all";

  users: any = [];
  selected: any = [];

  can_submit: boolean = false;

  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  constructor(
    private projectService: ProjectsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.getCampaigns();
    this.getData();
  }

  getData() {
    this.users = [];
    this.selected = [];
    this.slimLoadingBarService.start();
    this.projectService.getAllRotations().subscribe(
      (res: any) => {
        this.can_submit = true;
        console.log(res);
        this.users = res.allAgents;
        res.inRotationAgents.forEach(elm => {
          this.selected.push({
            id: elm.user.id,
            name: elm.user.name,
            teams: elm.user.teams[0]
          });
        });
        console.log(this.selected);
        this.slimLoadingBarService.complete();
      },
      err => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  // getData() {
  //   this.users = [];
  //   this.selected = [];
  //   console.log(this.campaign_id);
  //   this.slimLoadingBarService.start();
  //   this.projectService.getRotations(this.campaign_id).subscribe(
  //     (res: any) => {
  //       this.can_submit = true;
  //       console.log(res);
  //       this.users = res.allAgents;
  //       res.inRotationAgents.forEach(elm => {
  //         this.selected.push({
  //           id: elm.user.id,
  //           name: elm.user.name,
  //           teams: elm.user.teams[0]
  //         });
  //       });
  //       console.log(this.selected);
  //       // this.simpleList = [[], []];
  //       // res.allAgents.forEach((agent) => {
  //       //   this.simpleList[0].push({
  //       //     name: agent.name,
  //       //     id: agent.id
  //       //   })
  //       // })
  //       // res.inRotationAgents.forEach((elm) => {
  //       //   this.simpleList[1].push({
  //       //     name: elm.user.name,
  //       //     id: elm.user.id
  //       //   })
  //       // })
  //       this.slimLoadingBarService.complete();
  //     },
  //     err => {
  //       console.log(err);
  //       this.slimLoadingBarService.reset();
  //     }
  //   );
  // }

  public removeUser(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  public removeSelected(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  getCampaigns() {
    this.slimLoadingBarService.start();
    this.projectService.getCampaigns().subscribe(
      (res: any) => {
        this.campaigns = res;
        console.log(res);
        this.slimLoadingBarService.complete();
      },
      err => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  submit() {
    swal({
      title: "Are you sure?",
      text: "You will change the current rotation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, keep it."
    }).then(result => {
      if (result.value) {
        let payload = [];
        this.selected.forEach(item => {
          payload.push(item.id);
        });
        console.log(payload);
        let ids = {
          rotationIds: payload
        };
        this.slimLoadingBarService.start();
        this.projectService
          .submitChangeToCampainAll(ids)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              swal("Woohoo!", "Changed the rotation successfully!", "success");
            },
            err => {
              console.log(err);
              this.slimLoadingBarService.reset();
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  } 

  
}
