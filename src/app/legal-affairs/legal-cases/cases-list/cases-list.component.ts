import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Router } from "@angular/router";
import { LegalCasesService } from "./../../services/legal-cases.service";
import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-cases-list",
  templateUrl: "./cases-list.component.html",
  styleUrls: ["./cases-list.component.css"],
})
export class CasesListComponent implements OnInit {
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
    private legalCasesService: LegalCasesService,
    public router: Router,
    public slimLoadingBarService: SlimLoadingBarService,
    public errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getAllCases();
  }

  // Get Functions
  getAllCases() {
    this.slimLoadingBarService.start();

    this.legalCasesService.getCases(this.params).subscribe(
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
    this.getAllCases();
  }

  // cache table
  columns = [
    { key: "case_no", name: "رقم القضية" },
    { key: "case_file_no", name: "رقم الملف" },
    { key: "status", name: "الحالة" },
    { key: "plaintiff_type", name: "نوع المدعي" },
    { key: "plaintiff_name", name: "اسم المدعي" },
    { key: "plaintiff_lawyer", name: "محامي المدعي" },
    { key: "accused_type", name: "نوع المتهم" },
    { key: "accused_name", name: "اسم المتهم" },
    { key: "accused_lawyer", name: "محامي المتهم" },

    { key: "receive_date", name: "تاريخ الإستلام" },
    { key: "filing_date", name: "تاريخ الإيداع" },
    { key: "hearing_date", name: "تاريخ الإستماع" },
    { key: "judgement_date", name: "تاريخ الحكم" },
  ];

  manageTable = {};

  onSelectColumns(columns) {
    this.manageTable = columns;
  }
}
