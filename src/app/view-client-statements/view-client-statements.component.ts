import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { LeadsService } from "../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../services/shared/error-handler.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-view-client-statements",
  templateUrl: "./view-client-statements.component.html",
  styleUrls: ["./view-client-statements.component.css"],
})
export class ViewClientStatementsComponent implements OnInit {

  client_id: number;

  client_statements: any;

  client: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private leadsService: LeadsService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.client_id = +params["id"] || 0;
      this.getClientStatements(this.client_id);
    });
  }

  getClientStatements(id) {
    this.slimLoadingBarService.start();
    this.leadsService.getClientStatements(id).subscribe((res: any) => {
      console.log(res);
      this.client = res;
      this.client_statements = res.payments;
      this.slimLoadingBarService.complete();
    }, err => {
      this.slimLoadingBarService.reset();
    });
  }

  goToUnit(project_id, unit_id) {
    this.router.navigate(["/pages/projects/view-unit"], {
      queryParams: {
        project_id: project_id,
        unit_id: unit_id,
      },
    });
  }

  export() {
    this.slimLoadingBarService.start();
    this.leadsService.getClientStatements(this.client_id, 1).subscribe((res: any) => {
      console.log(res);
      this.slimLoadingBarService.complete();
      window.open(res.url);
    }, err => {
      this.slimLoadingBarService.reset();
    });
  }
}