import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { ColdCallsStatusesService } from "../../services/cold-calls/cold-calls-statuses.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import { ColdCallsService } from "../cold-calls.service";

@Component({
  selector: "app-agents-contacts",
  templateUrl: "./agents-contacts.component.html",
  styleUrls: ["./agents-contacts.component.scss"],
})
export class AgentsContactsComponent implements OnInit {
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  //#region Definitions
  contactsElements: any = [];
  checked: boolean = false;
  can_delete = false;
  contactsRaw: any;
  is_delete_bulk: boolean = false;
  searchKeyword;
  currentPage: number = 1;

  statuses_list = [];
  statuses_cards = [];

  //#endregion
  activeAccordionIndex: number | null = null;

  toggleAccordion(index: number): void {
    if (this.activeAccordionIndex === index) {
      this.activeAccordionIndex = null;
    } else {
      this.activeAccordionIndex = index;
    }
  }

  constructor(
    private coldCallsService: ColdCallsService,
    private coldCallsStatusesService: ColdCallsStatusesService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.getAgentsContacts();
    this.fetchStatuses();
    this.getStatusesCards();
  }

  //#endregion
  isAllSelected() {
    this.checked = this.contactsElements.every((contact) => contact.checked);
  }

  //#region CRUD
  getAgentsContacts(keyword = "", page?) {
    this.checked = false;
    if (keyword) this.searchKeyword = keyword;
    this.coldCallsService.getAgentCard(this.searchKeyword, page).subscribe(
      (res: any) => {
        this.contactsElements = res.data;
        this.contactsRaw = res;
        this.mainCheckboxOnChange(false);
      },
      (err) => {}
    );
  }

  fetchStatuses() {
    this.coldCallsStatusesService.getContactStatuses().subscribe((res: any) => {
      this.statuses_list = res;
    });
  }

  getStatusesCards() {
    this.coldCallsService.getStatusesCards().subscribe((res: any) => {
      this.statuses_cards = Object.entries(res);
    });
  }

  deleteContact(id) {
    this.coldCallsService.deleteContact(id).subscribe(
      (res: any) => {
        this.getAgentsContacts();
        Swal("Success", "Deleted Successfully", "success");
      },
      (err) => {
        Swal("Failed", "Deleted Failed", "error");
      }
    );
  }

  //#endregion

  //#region Actions
  pageChange(page) {
    this.getAgentsContacts(this.searchKeyword, page);
  }

  mainCheckboxOnChange(isChecked) {
    this.checked = isChecked;
    this.contactsElements.forEach((contact) => {
      contact.checked = isChecked;
    });
  }

  OnContactClick(index, isChecked): void {
    this.contactsElements[index].checked = isChecked;
    if (isChecked) {
      this.can_delete = true;
    } else {
      this.checkDeleteActionActivation();
    }
  }

  checkDeleteActionActivation() {
    this.can_delete = this.contactsElements.some((contact) => contact.checked);
  }

  deleteFunc() {
    this.is_delete_bulk = true;
    let payload = {
      contacts: this.contactsElements
        .filter((contact) => contact.checked)
        .map((contact) => contact.id),
    };

    Swal({
      type: "warning",
      title: "Waring",
      text: "Are you sure, you want to delete ?",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.value) {
        this.coldCallsService
          .bulkDelete(payload)
          .subscribe(
            (res: any) => {
              Swal({
                type: "success",
                title: "Success",
                text: "Deleted Contact Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              this.getAgentsContacts();
            },
            (err) => {
              Swal({
                type: "error",
                title: "Failed",
                text: "Failed",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          )
          .add(() => {
            this.is_delete_bulk = false;
          });
      }
    });
  }

  // table actions
  checkBeforeConvert(contact) {
    this.coldCallsService
      .checkBeforeConvertToInterest(contact.id, {})
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.router.navigateByUrl(
              `/pages/addLead/${contact.id}?screen=cold-contact`
            );
          } else if (res.status == 202) {
            Swal({
              title: "Warning",
              html:
                "Contact has already lead inactive with info <br> <br> <strong>Name: </strong>" +
                res.body.name +
                "<strong> Phone:</strong>" +
                res.body.phone1,
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
        this.getAgentsContacts();

        Swal("Success", "Converted to Not Interested Successfully", "success");
      },
      (err) => {
        Swal("Failed", "Converted to Not Interested Failed", "error");
      }
    );
  }

  deleteAction(id) {
    Swal({
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

  export() {
    let payload = {
      name: this.searchKeyword || "",
    };
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
