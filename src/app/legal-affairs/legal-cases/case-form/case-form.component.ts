import { LeadsService } from "./../../../services/lead-service/lead-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LegalCasesService } from "./../../services/legal-cases.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ErrorHandlerService } from "./../../../services/shared/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-case-form",
  templateUrl: "./case-form.component.html",
  styleUrls: ["./case-form.component.css"],
})
export class CaseFormComponent implements OnInit {
  company_name = environment.statics.projectName;
  // flags
  submitted = false;
  is_submitting: boolean = false;

  // data
  case_id;

  // form
  form_data: any = {
    category_id: null,
    status_id: null,
    court_id: null,

    case_no: "",
    case_file_no: "",
    description: "",

    plaintiff_type: null,
    plaintiff_name: "",
    plaintiff_lead_id: null,
    plaintiff_lawyer_name: "",
    plaintiff_lawyer_phone: "",

    accused_type: null,
    accused_name: "",
    accused_lead_id: "",
    accused_lawyer_name: null,
    accused_lawyer_phone: "",

    receive_date: "",
    filing_date: "",
    hearing_date: "",
    judgement_date: "",

    files: [],
  };

  // selects
  categoriesArray = [];
  StatusesArray = [];
  courtsArray = [];

  plaintiffLeadSearch = {
    data: [],
    keyword: "",
    page: 1,
    loading: false,
    last_page: null,
  };

  accusedLeadSearch = {
    data: [],
    keyword: "",
    page: 1,
    loading: false,
    last_page: null,
  };

  errors = {};

  editorConfig = {
    skin: false,
    inline_styles: false,
    base_url: `${environment.baseHREF}tinymce`,
    suffix: ".min",
    height: 300,
    directionality: "rtl",
    toolbar: `fullscreen | code |preview | formatselect | a11ycheck ltr rtl | alignleft aligncenter alignright alignjustify | undo redo | bold italic underline | outdent indent |  numlist bullist checklist | casechange permanentpen formatpainter removeformat | fullscreen  preview print | media pageembed link`,
    menubar: "custom",
  };
  constructor(
    private legalCasesService: LegalCasesService,
    private leadsService: LeadsService,
    private router: Router,
    private route: ActivatedRoute,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlingservice: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.case_id = params["id"];
      if (this.case_id) {
        this.getCase();
      }
    });
    this.loadSelectsData();
  }

  getCase() {
    this.slimLoadingBarService.start();
    this.legalCasesService
      .getCase(this.case_id)
      .subscribe(
        (res: any) => {
          this.case_id = res.id;
          const {
            category_id,
            status_id,
            court_id,
            case_no,
            case_file_no,
            description,
            plaintiff_type,
            plaintiff_name,
            plaintiff_lead_id,
            plaintiff_lawyer_name,
            plaintiff_lawyer_phone,
            accused_type,
            accused_name,
            accused_lead_id,
            accused_lawyer_name,
            accused_lawyer_phone,
            receive_date,
            filing_date,
            hearing_date,
            judgement_date,
          } = res;
          this.form_data = {
            category_id,
            status_id,
            court_id,

            case_no,
            case_file_no,
            description,

            plaintiff_type,
            plaintiff_name,
            plaintiff_lead_id,
            plaintiff_lawyer_name,
            plaintiff_lawyer_phone,

            accused_type,
            accused_name,
            accused_lead_id,
            accused_lawyer_name,
            accused_lawyer_phone,

            receive_date: receive_date ? receive_date.split(" ")[0] : "",
            filing_date: filing_date ? filing_date.split(" ")[0] : "",
            hearing_date: hearing_date ? hearing_date.split(" ")[0] : "",
            judgement_date: judgement_date ? judgement_date.split(" ")[0] : "",
          };
        },
        (err) => {
          if (err.error.error) {
            this.errorHandlingservice.handleErorr(err);
          }
        }
      )
      .add(() => {
        this.slimLoadingBarService.complete();
      });
  }

  loadSelectsData() {
    this.getCategories();
    this.getStatuses();
    this.getCourts();
  }

  getCategories() {
    this.legalCasesService.getCaseCategories().subscribe((res: any) => {
      this.categoriesArray = res;
    });
  }

  getStatuses() {
    this.legalCasesService.getCaseStatuses().subscribe((res: any) => {
      this.StatusesArray = res;
    });
  }

  getCourts() {
    this.legalCasesService.getCourts().subscribe((res: any) => {
      this.courtsArray = res;
    });
  }

  getLeadsTimeOut;
  getLeads(type: "plaintiff" | "accused", paginate = false, keyword?) {
    if (paginate) {
      if (this[type + "LeadSearch"].page < this[type + "LeadSearch"].last_page)
        this[type + "LeadSearch"].page++;
      else return;
    } else {
      this[type + "LeadSearch"].page = 1;
      this[type + "LeadSearch"].data = [];
    }

    if (keyword != undefined) {
      this[type + "LeadSearch"].keyword = keyword;
    }

    const payload: any = {
      keyword: this[type + "LeadSearch"].keyword,
      paginate: 1,
      page: this[type + "LeadSearch"].page,
    };
    this[type + "LeadSearch"].loading = true;

    if (this.getLeadsTimeOut) {
      clearTimeout(this.getLeadsTimeOut);
    }
    this.getLeadsTimeOut = setTimeout(() => {
      this.leadsService
        .getLeads(payload)
        .subscribe((res: any) => {
          if (paginate) {
            this[type + "LeadSearch"].data.push(...res.data);
          } else {
            this[type + "LeadSearch"].data = res.data;
          }

          this[type + "LeadSearch"].last_page = res.last_page;
        })
        .add(() => {
          this[type + "LeadSearch"].loading = false;
        });
    }, 1000);
  }

  // inputs handlers
  plaintiffOrAccusedChanged(type: "plaintiff" | "accused", value) {
    this.form_data[type + "_name"] = value === "CRED" ? this.company_name : "";
    this.form_data[type + "_lead_id"] = null;
  }

  onSelectLead(type: "plaintiff" | "accused", lead_id) {
    if (lead_id) {
      this.form_data[type + "_name"] = this[type + "LeadSearch"].data.find(
        (lead) => lead.id === lead_id
      ).name;
    } else {
      this.form_data[type + "_name"] = "";
    }
  }

  handleUploadFiles(event) {
    this.form_data.files = [];
    if (event.target.files && event.target.files.length) {
      for (let file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form_data.files.push({
            file_name: file.name,
            file_type: file.type,
            file_value: (reader.result as any).split(",")[1],
          });
        };
      }
    }
  }

  save() {
    this.submitted = true;
    let request;

    if (this.case_id) {
      request = this.legalCasesService.updateCase(this.case_id, this.form_data);
    } else {
      request = this.legalCasesService.postCase(this.form_data);
    }
    this.is_submitting = true;
    request
      .subscribe(
        (res) => {
          if (res.errors) {
            this.errors = res.errors;
          } else {
            this.router.navigate(["/", "pages", "legal-affairs", "cases"]);
          }
        },
        (err) => {
          if (err.error.error) {
            this.errorHandlingservice.handleErorr(err);
          }
        }
      )
      .add(() => {
        this.is_submitting = false;
      });
  }
}
