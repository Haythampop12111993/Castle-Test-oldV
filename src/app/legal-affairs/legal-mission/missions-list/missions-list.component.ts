import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Router } from "@angular/router";
import { LegalMissionsService } from "../../services/legal-missions.service";
import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-missions-list",
  templateUrl: "./missions-list.component.html",
  styleUrls: ["./missions-list.component.css"],
})
export class MissionsListComponent implements OnInit {
  company_name = environment.statics.projectName;
  // data
  data_list = [];
  params = {
    paginate: 1,
    page: 1,
  };

  typeMapping = {
    CRED: this.company_name,
    Lead: "عميل",
    Company: "شركة / شخص",
  };

  // pagination
  paginate = {
    last_page: undefined,
    per_page: undefined,
    total: undefined,
    to: undefined,
  };
  current_page = 1;

  constructor(
    private legalMissionsService: LegalMissionsService,
    public router: Router,
    public slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getAllMissions();
  }

  // Get Functions
  getAllMissions() {
    this.slimLoadingBarService.start();

    this.legalMissionsService.getMissions(this.params).subscribe(
      (res: any) => {
        this.data_list = res.data;
        this.paginate.last_page = res.last_page;
        this.paginate.per_page = res.per_page;
        this.paginate.to = res.to;
        this.paginate.total = res.total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        if (err.error.error) {
          this.errorHandlerService.handleErorr(err);
        }
        this.slimLoadingBarService.complete();
      }
    );
  }

  pageChange(page) {
    this.params.page++;
    this.getAllMissions();
  }

  // cache table
  columns = [
    { key: "name", name: "اسم المعاملة" },
    { key: "category", name: "نوع المعاملة" },
    { key: "status", name: "حالة المعاملة" },
    { key: "side", name: "الجهة" },
    { key: "date", name: "التاريخ" },
  ];

  manageTable = {};

  onSelectColumns(columns) {
    this.manageTable = columns;
  }
}
