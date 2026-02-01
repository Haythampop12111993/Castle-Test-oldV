import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { default as Swal, default as swal } from "sweetalert2";
import { ColdCallsStatusesService } from "../../services/cold-calls/cold-calls-statuses.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { ColdCallsService } from "../cold-calls.service";

@Component({
  selector: "app-view-cold-calls-status",
  templateUrl: "./view-cold-calls-status.component.html",
  styleUrls: ["./view-cold-calls-status.component.scss"],
})
export class ViewColdCallsStatusComponent implements OnInit {
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  //#region Definitions
  status_id;

  contactsElements: any[];
  checked: boolean = false;
  contactsRaw: any;
  searchKeyword;
  currentPage: any = 1;

  statuses_list = [];
  users_list = [];

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
    private leadsService: LeadsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      this.status_id = id;
      this.fetchContactsData();
    });
    this.fetchStatuses();
    this.fetchUsers();
  }

  // fetchers
  fetchContactsData(searchKeyword?, page = 1) {
    if (searchKeyword) this.searchKeyword = searchKeyword;

    this.coldCallsService
      .getAllContacts({
        status: this.status_id,
        name: this.searchKeyword || "",
        page,
      })
      .subscribe(
        (res: any) => {
          this.contactsElements = res.data;
          this.contactsRaw = res;
        },
        (err) => {}
      );
  }

  fetchStatuses() {
    this.coldCallsStatusesService.getContactStatuses().subscribe((res: any) => {
      this.statuses_list = res;
    });
  }

  fetchUsers() {
    this.leadsService.getAgents().subscribe((res: any) => {
      this.users_list = res;
    });
  }

  // table actions
  isAllSelected() {
    this.checked = this.contactsElements.every((contact) => contact.checked);
  }

  mainCheckboxOnChange(isChecked) {
    this.checked = isChecked;
    this.contactsElements.forEach((contact) => {
      contact.checked = isChecked;
    });
  }

  OnContactClick(index, isChecked): void {
    this.contactsElements[index].checked = isChecked;
  }

  pageChange(page) {
    this.fetchContactsData(this.searchKeyword, page);
  }

  // actions
  export() {
    this.coldCallsService
      .exportExcel({
        status: this.status_id,
        name: this.searchKeyword || "",
      })
      .subscribe(
        (res: any) => {
          window.open(res.url);
        },
        (err) => {
          Swal("Failed", "Download example failed", "error");
        }
      );
  }

  deleteAction(id) {
    this.coldCallsService.deleteContact(id).subscribe(
      (res: any) => {
        Swal("Success", "Delete contact Success", "success");
        this.fetchContactsData();
      },
      (err) => {
        Swal("Failed", "Delete contact Failed", "error");
      }
    );
  }

  // reassign
  @ViewChild("reassignModal") reassignModal;
  reassign_form = {
    contacts: [],
    user_id: null,
  };
  reassign_submitting = false;
  assignAgent() {
    let selected = this.contactsElements
      .filter((contact) => contact.checked)
      .map((contact) => contact.id);
    if (selected.length === 0) {
      swal({
        type: "error",
        title: "Select Contact",
      });
    } else {
      this.reassign_form = {
        contacts: selected,
        user_id: null,
      };
      this.reassignModal.open();
    }
  }

  assignSingleAgent(contact) {
    this.reassign_form = {
      contacts: [contact.id],
      user_id: null,
    };
    this.reassignModal.open();
  }

  submitReassign(modal) {
    this.reassign_submitting = true;
    this.coldCallsService
      .reAssign(this.reassign_form)
      .subscribe(
        (res: any) => {
          Swal("Success", "Reassigned Successfully", "success");
          this.fetchContactsData();
          modal.close();
        },
        (err) => {
          Swal("Failed", "Reassigned Failed", "error");
        }
      )
      .add(() => {
        this.reassign_submitting = false;
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
        this.fetchContactsData();

        Swal("Success", "Converted to Not Interested Successfully", "success");
      },
      (err) => {
        Swal("Failed", "Converted to Not Interested Failed", "error");
      }
    );
  }
}
