import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ColdCallsService } from "../cold-calls.service";

import Swal from "sweetalert2";

import swal from "sweetalert2";
import { ColdCallsStatusesService } from "../../services/cold-calls/cold-calls-statuses.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";

@Component({
  selector: "app-cold-calls-view",
  templateUrl: "./cold-calls-view.component.html",
  styleUrls: ["./cold-calls-view.component.scss"],
})
export class ColdCallsViewComponent implements OnInit {
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  //#region Definitions
  users;
  contactsElements = [];
  assignForm: FormGroup;
  interestedForm: FormGroup;
  id;
  pageParams: any;
  is_submitting;
  agentId: any;
  openedScreen: string;
  agentContacts = [];
  currentPage: number = 1;
  contactsElementsRaw;
  searchKeyword;
  agentsElementsRaw;
  agentSearchKeyword;

  statuses_list = [];

  //#endregion
  activeAccordionIndex: number | null = null;
  agentActiveAccordionIndex: number | null = null;

  toggleAccordion(index: number): void {
    if (this.activeAccordionIndex === index) {
      this.activeAccordionIndex = null;
    } else {
      this.activeAccordionIndex = index;
    }
  }

  agentToggleAccordion(index: number): void {
    if (this.agentActiveAccordionIndex === index) {
      this.agentActiveAccordionIndex = null;
    } else {
      this.agentActiveAccordionIndex = index;
    }
  }
  constructor(
    private fb: FormBuilder,
    private leadsService: LeadsService,
    private coldCallsService: ColdCallsService,
    private coldCallsStatusesService: ColdCallsStatusesService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.checkScreen();
    this.route.queryParams.subscribe(
      (qParams) => (this.pageParams = qParams.data)
    );
    this.fetchContactDetails();
    this.fetchAgentContacts();
    this.iniForm();
    this.fetchUsers();
    this.fetchStatuses();
  }

  //#endregion

  // fetchers

  fetchContactDetails(keyword = "", page?) {
    this.searchKeyword = keyword;
    this.coldCallsService
      .getSingleContactData(this.id, keyword, page)
      .subscribe(
        (res: any) => {
          this.contactsElements = res.data;
          this.contactsElementsRaw = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  fetchAgentContacts(keyword?, page?) {
    if (keyword) this.agentSearchKeyword = keyword.trim();

    this.coldCallsService
      .getSingleAgentData(this.agentId, keyword, page)
      .subscribe(
        (res: any) => {
          this.agentContacts = res.data;
          this.agentsElementsRaw = res;
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
        }
      );
  }

  fetchUsers() {
    this.leadsService.getAgents().subscribe((res) => {
      this.users = res;
    });
  }

  fetchStatuses() {
    this.coldCallsStatusesService.getContactStatuses().subscribe((res: any) => {
      this.statuses_list = res;
    });
  }

  // view-actions
  pageChange(page) {
    this.fetchContactDetails(this.searchKeyword, page);
  }

  agentPageChange(page) {
    this.fetchAgentContacts(this.agentSearchKeyword, page);
  }

  checkScreen() {
    this.route.params.subscribe((res) => {
      this.agentId = this.id = +res.id;
      this.openedScreen = res.screen.toLowerCase();
    });
  }

  iniForm() {
    this.assignForm = this.fb.group({
      users: [[], Validators.required],
      number: ["", Validators.required],
    });
  }

  submit() {
    let payload = this.assignForm.value;
    this.is_submitting = true;
    this.coldCallsService.assingContactData(this.id, payload).subscribe(
      (res: any) => {
        this.is_submitting = false;
        if (res.message == "Success") {
          this.assignForm.reset();
          swal("Success", "Assinged successfully", "success");
          this.refreshData();
        }
      },
      (err) => {
        this.is_submitting = false;
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  refreshData() {
    if (this.openedScreen == "card") {
      this.fetchContactDetails();
    } else {
      this.fetchAgentContacts();
    }
  }

  // table actions
  checkBeforeConvert(contact) {
    this.coldCallsService
      .checkBeforeConvertToInterest(contact.id, {})
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let screen =
              this.openedScreen == "agent" ? "cold-agent" : "cold-all";
            this.router.navigateByUrl(
              `/pages/addLead/${contact.id}?screen=${screen}`
            );
          } else if (res.status == 202) {
            Swal({
              title: "Warning",
              html:
                "Contact has already lead inactive with info <br> <br> <strong>Name: </strong>" +
                res.body.name +
                "<strong> Phone:</strong>" +
                res.body.phone,
              type: "warning",
              showCancelButton: false,
              confirmButtonText: "View Lead",
              confirmButtonColor: "#013da5",
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl(
                  `/pages/leads?lead_id=${res.body.id}`
                );
              }
            });
          }
        },
        (err) => console.log("error", err)
      );
  }

  convertStatusAction(id, status) {
    Swal({
      title: "Are you sure?",
      text: `You will convert it to ${status.name}`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, convert it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.convertToStatus(id, status.id);
      } else {
      }
    });
  }

  convertToStatus(id, status_id) {
    this.coldCallsService.convertToStatus(id, status_id).subscribe(
      (res: any) => {
        this.refreshData();

        Swal("Success", "Converted to Not Interested Successfully", "success");
      },
      (err) => {
        Swal("Failed", "Converted to Not Interested Failed", "error");
      }
    );
  }

  deleteAction(id) {
    swal({
      title: "Are you sure?",
      text: "You will delete it",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        this.deleteContact(id);
      } else {
      }
    });
  }

  deleteContact(id) {
    this.coldCallsService.deleteContact(id).subscribe(
      (res: any) => {
        this.refreshData();
        Swal("Success", "Deleted Successfully", "success");
      },
      (err) => {
        Swal("Failed", "Deleted Failed", "error");
      }
    );
  }

  export() {
    let payload;
    if (this.openedScreen == "agent") {
      payload = {
        user_id: this.agentId,
        name: this.agentSearchKeyword || "",
      };
    } else {
      payload = {
        card_id: this.id,
        name: this.searchKeyword || "",
      };
    }
    this.coldCallsService.exportExcel(payload).subscribe(
      (res: any) => {
        window.open(res.url);
      },
      (err) => {
        Swal("Failed", "Download example failed", "error");
      }
    );
  }
}
