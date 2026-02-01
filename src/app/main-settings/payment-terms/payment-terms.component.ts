import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "./../../../environments/environment";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProjectsService } from "./../../services/projects/projects.service";
import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { UserServiceService } from "../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ReservationService } from "../../services/reservation-service/reservation.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-payment-terms",
  templateUrl: "./payment-terms.component.html",
  styleUrls: ["./payment-terms.component.css"],
})
export class PaymentTermsComponent implements OnInit {
  paymentTerms: any;

  projects: any;

  paymentForm: FormGroup;
  current_units_arr: any;
  arr: any;
  methods: any;
  unit_serial = "";
  // used for fixing select bug onchange
  unit_serial_select_bug_handler_serial: any;
  separated: any;
  unit_price: any;
  project_type: any;
  type = "";
  paymet_plan: any;
  project_id: any;

  payment_term_name: any;
  current_payment_plan: any;

  finishing_types: any;

  phases: any;
  dropdownSettings: any = {
    singleSelection: false,
    idField: "id",
    textField: "serial",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  statusesDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  phasesDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "serial",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  projectsDropdownSettings: any = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  phacesOptions: any;

  filterForm: FormGroup;

  selectedFinishingTypes: any = [];
  selectedPhases: any = [];

  raw_data: any;
  last_page_url: any;
  prev_page_url: any;
  current_page: any;
  pagination: any = [];
  per_page: any;
  total: any;
  totalRec: number;
  pageTest: any = 1;
  filterData: any;
  filterActive = false;
  userData: any;
  stopUpdatingPhases: boolean = true;

  constructor(
    private userService: UserServiceService,
    private errorHandlerService: ErrorHandlerService,
    private slimLoadingBarService: SlimLoadingBarService,
    private reservationService: ReservationService,
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("userProfile"));
  }

  ngOnInit() {
    this.getAllPaymentTerms();
    this.getProjects();
    this.getAllFinishingTypes();
    this.initFilterForm();
    this.getAllPhases();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      finishing_type_id: [[]],
      phase_id: [[]],
      project_id: [""],
      status: [""],
    });
  }

  filterPaymentTerms(page) {
    console.log("this is the page", page);
    // page = this.pageTest
    // this.pageTest = 1;
    const formModel = this.filterForm.value;
    const finishing_type_id = [];
    if (this.selectedFinishingTypes.length > 0) {
      this.selectedFinishingTypes.forEach((type) => {
        finishing_type_id.push(type.id);
      });
    }
    formModel.finishing_type_id = finishing_type_id;

    const phase_id = [];
    if (this.selectedPhases.length > 0) {
      this.selectedPhases.forEach((phase) => {
        phase_id.push(phase.id);
      });
    }
    formModel.phase_id = phase_id;
    this.stopUpdatingPhases = true;
    this.slimLoadingBarService.start();
    this.paymentTerms = [];
    this.raw_data = null;
    this.userService.filterPaymentTerms(formModel, page || 1).subscribe(
      (res: any) => {
        res.data.forEach((payment) => {
          if (payment.phases) {
            payment.old_phases = JSON.parse(JSON.stringify(payment.phases));
          } else {
            payment.old_phases = [];
          }
          if (!payment.finishing_type) {
            payment.finishing_type = {};
          }
        });
        this.filterActive = true;
        this.current_page = 1;
        this.pageTest = page;
        this.raw_data = res;
        console.log(this.raw_data);
        console.log(this.raw_data.last_page);
        this.pagination = [];
        this.last_page_url = res.last_page_url;
        this.per_page = res.to;
        this.total = res.total;
        let selected = true;
        for (var i = 1; i <= res.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.totalRec = res.total;
        this.paymentTerms = res.data.map((payment) => {
          return {
            ...payment,
            project: {
              ...payment.project,
              phases: payment.phases ? payment.phases : [],
            },
            all_phases: this.getSelectedProjectPhases(payment),
          };
        });
        console.log(this.paymentTerms);
        setTimeout(() => {
          this.stopUpdatingPhases = false;
        }, 1000);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        console.log("error", err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  getAllPhases() {
    this.userService.getPhases().subscribe((res: any) => {
      this.phacesOptions = res;
      console.log("phases", this.phacesOptions);
    });
  }

  resetFilters() {
    this.filterActive = false;
    this.filterData = null;

    this.getAllPaymentTerms();
    // this.filterForm.reset();
    this.filterForm.patchValue({
      finishing_type_id: [[]],
      phase_id: [[]],
      project_id: [""],
      status: [""],
    });
    this.selectedFinishingTypes = [];
    this.selectedPhases = [];
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onItemSelect(item: any) {
    console.log(item);
  }

  getAllFinishingTypes() {
    this.slimLoadingBarService.complete();
    this.projectsService.getAllFinishingTypes().subscribe(
      (res: any) => {
        this.finishing_types = res;
        console.log("finishing types ", this.finishing_types);
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  onFinishingTypeChange(event, payment) {
    console.log(payment);
    let payload = {
      finishing_type_id: payment.finishing_type.id,
    };
    this.projectsService
      .changePaymentPlanFinishingType(payment.id, payload)
      .subscribe(
        (res: any) => {
          swal("success", "changed finishing type successfully", "success");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getAllPaymentTerms(page?) {
    this.stopUpdatingPhases = true;
    this.slimLoadingBarService.start();
    this.userService.getAllPaymentTerms(page).subscribe(
      (res: any) => {
        res.data.forEach((payment) => {
          if (payment.phases) {
            payment.old_phases = JSON.parse(JSON.stringify(payment.phases));
          } else {
            payment.old_phases = [];
          }
          if (!payment.finishing_type) {
            payment.finishing_type = {};
          }
        });

        this.raw_data = res;
        console.log(this.raw_data);
        console.log(this.raw_data.last_page);
        this.pagination = [];
        this.last_page_url = res.last_page_url;
        this.current_page = 1;
        this.per_page = res.to;
        this.total = res.total;
        let selected = true;
        for (var i = 1; i <= res.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.totalRec = res.total;
        console.log(this.reservationService);

        this.paymentTerms = res.data.map((payment) => {
          return {
            ...payment,
            project: {
              ...payment.project,
              phases: payment.phases ? payment.phases : [],
            },
            all_phases: this.getSelectedProjectPhases(payment),
          };
        });
        // const all_phases = [];
        // this.paymentTerms.map((payment) => {
        //   const phases = this.getProjectPhases(payment.phases);
        //   all_phases.push(phases);
        // });
        console.log(this.paymentTerms);
        setTimeout(() => {
          this.stopUpdatingPhases = false;
        }, 1000);
        console.log("payment terns : ", res);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  pageChange(page) {
    this.current_page = page;
    console.log(this.current_page);
    if (this.filterActive) {
      this.filterPaymentTerms(page);
    } else {
      this.getAllPaymentTerms(page);
    }
  }

  // pageChange(event) {
  //   let arr = this.last_page_url.split("?");
  //   let selectedUrl = `${arr[0]}?page=${event}`;
  //   if (this.filterActive) {
  //     this.infiniteWithFilter(selectedUrl, event);
  //   } else {
  //     this.infinite(selectedUrl, event);
  //   }
  // }

  onDropDownClose(event, phases, payment_id, payment) {
    if (this.stopUpdatingPhases) return;
    else {
      console.log("triggered");
      this.updatePhases(phases, payment_id, payment);
    }
  }

  updatePhases(phases, payment_id, payment) {
    let ids = [];
    if (phases) {
      if (phases.length > 0) {
        phases.forEach((phase) => {
          ids.push(phase.id);
        });
      }
    }
    let old_ids = [];
    payment.old_phases.forEach((phase) => {
      old_ids.push(phase.id);
    });
    let payload = {
      phases: ids,
    };
    if (JSON.stringify(old_ids) == JSON.stringify(ids)) {
      return;
    } else {
      this.projectsService
        .changePaymentPlanPhases(payment_id, payload)
        .subscribe(
          (res: any) => {
            swal("success", "Updated phases successfully", "success");
          },
          (err) => {}
        );
    }
  }

  getProjects() {
    this.slimLoadingBarService.start();
    this.reservationService.getProjects().subscribe(
      (data) => {
        console.log(data);
        this.projects = data;
        // this.projects.forEach(project => {
        //   project.is_active_bool = project.is_active == 0 ? true : false;
        // })
        console.log(this.projects);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  // get finishing type of payment
  getFinishingType(phases: []) {
    return phases.map((e) => e["serial"]).join(",");
  }

  togglePayment(event, index, id) {
    console.log(id);
    this.slimLoadingBarService.start();
    this.userService.togglePaymentTerm({ payment_plan_id: id }).subscribe(
      (res) => {
        this.paymentTerms[index].is_active =
          !this.paymentTerms[index].is_active;
        this.slimLoadingBarService.complete();
        swal("Cool!", "Chaneg payment term status successfully!", "success");
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  onChange(event, index, id) {
    this.togglePayment(event, index, id);
  }

  checkIfChanged(arr1, arr2, key) {
    if (arr1.length != arr2.length) return true;

    let hashmap = {};

    arr1.map((el) => (hashmap[el[key]] = hashmap[el[key]] + 1 || 1));

    for (let el of arr2) {
      if (!hashmap[el[key]] || hashmap[el[key]] < 1) return true;
      hashmap[el[key]]--;
    }
    return Object.values(hashmap).some((n: number) => n > 0);
  }

  select_project(changed_arr, projects, payment_term_id) {
    if (!this.checkIfChanged(changed_arr, projects, "id")) return;

    const data = {
      project_ids: changed_arr.map((el) => el.id),
      payment_term_id: payment_term_id,
    };

    this.reservationService.assign_payment_term(data).subscribe(
      (respo) => {
        swal(
          "Cool!",
          "Payment term assigned to project successfully!",
          "success"
        );
        this.getAllPaymentTerms();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  exportPaymentTerms() {
    this.slimLoadingBarService.start();
    this.projectsService.exportPaymentTerms().subscribe(
      (res: any) => {
        this.slimLoadingBarService.complete();
        window.open(res.url);
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  generateRandomPayment(payment, modal) {
    this.paymet_plan = payment;

    const unit_serial = "random",
      type = this.paymet_plan.id,
      down = this.paymet_plan.downpayment_percentage,
      slots = 0;
    let url = `${environment.api_raw_base_url}excel/${unit_serial}/${type}?project_id=${payment.project_id}&slots=${slots}`;
    window.open(url);
  }

  deletePayment(id, index) {
    swal({
      title: "Are you sure?",
      text: "You will delete this payment!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.paymentTerms.splice(index, 1);
        this.slimLoadingBarService.start();
        this.projectsService.deletePayment(id).subscribe(
          (data) => {
            console.log(data);
            this.getAllPaymentTerms();
            this.slimLoadingBarService.complete();
            swal("Delete Payment Successfully", "", "success");
          },
          (err) => {
            this.errorHandlerService.handleErorr(err);
            this.slimLoadingBarService.complete();
          }
        );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  editPaymentTermName(payment, modal) {
    console.log(payment);
    this.payment_term_name = payment.plan_name;
    this.current_payment_plan = payment;
    modal.open();
  }

  changePaymentTermNameSubmit(modal) {
    // modal.close();
    let payload = {
      plan_name: this.payment_term_name,
    };
    this.slimLoadingBarService.start();
    this.projectsService
      .changeNamePayment(this.current_payment_plan.id, payload)
      .subscribe(
        (res: any) => {
          swal("Changed Payment PLan Name successfully", "", "success");
          modal.close();
          this.getAllPaymentTerms();
          this.slimLoadingBarService.complete();
        },
        (err) => {
          swal("Error, please try again later!", "", "error");
          this.slimLoadingBarService.reset();
          console.log(err);
        }
      );
  }

  changePaymentTermModalOnClose() {}

  cloneAnnual(payment) {
    this.router.navigate(["/pages/settings/setup-payment-plan"], {
      queryParams: {
        clone_type: "annual",
        payment_id: payment.id,
      },
    });
  }

  cloneSemiAnnual(payment) {
    this.router.navigate(["/pages/settings/setup-payment-plan"], {
      queryParams: {
        clone_type: "semi-annual",
        payment_id: payment.id,
      },
    });
  }

  onProjectChange() {
    this.selectedPhases = [];
  }

  getProjectPhases(selected_phases: any) {
    const phases = [];
    const pushed_projects = [];
    selected_phases.forEach((phase) => {
      const project = this.projects.find((p) => p.id == phase.project_id);
      if (!pushed_projects.includes(project.id)) {
        pushed_projects.push(project.id);
        if (project.phases && project.phases.length > 0) {
          project.phases.forEach((p) => {
            phases.push(p);
          });
        }
      }
    });
    return phases;
  }

  getSelectedProjectPhases(payment) {
    let phases = [];
    payment.projects.forEach((project) => {
      if (project.phases && project.phases.length > 0) {
        project.phases.forEach((phase) => {
          phases.push({
            ...phase,
            serial: `${phase.serial} - ${project.name}`,
          });
        });
      }
    });
    return phases;
  }
}
