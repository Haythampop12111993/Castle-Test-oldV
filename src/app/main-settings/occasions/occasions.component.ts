import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { TeamService } from "../../services/settings-service/team/team.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";

@Component({
  selector: "app-occasions",
  templateUrl: "./occasions.component.html",
  styleUrls: ["./occasions.component.css"],
})
export class OccasionsComponent implements OnInit {
  occasions: any[] = [];

  constructor(
    private router: Router,
    private teamService: TeamService,
    public leadsService: LeadsService,
    public errorHandlerService: ErrorHandlerService,
    public slimLoadingBarService: SlimLoadingBarService
  ) {}

  ngOnInit() {
    this.getOccasions();
  }

  getOccasions() {
    this.slimLoadingBarService.start();
    this.teamService.getOccasions("system").subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        this.occasions = res;
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  // addOccasion() {
  //   this.router.navigateByUrl('/pages/settings/add-occasion', {
  //     queryParams: {
  //       type: 'system'
  //     }
  //   });
  // }

  edit(id) {
    this.router.navigate(["/pages/settings/add-occasion"], {
      queryParams: {
        type: "system",
        id: id,
      },
    });
  }

  disableOccasion(id) {
    this.slimLoadingBarService.start();
    this.teamService.changeStatusOccasion(id)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.getOccasions();
        swal('Success', 'Disabled Occassion Successfully', 'success');
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  enableOccasion(id) {
    this.slimLoadingBarService.start();
    this.teamService.changeStatusOccasion(id)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.getOccasions();
        swal('Success', 'Enabled Occassion Successfully', 'success');
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }
}
