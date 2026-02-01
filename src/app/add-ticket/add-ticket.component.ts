import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { HelpdeskService } from "./../services/helpdesk/helpdesk.service";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Observable } from "rxjs";
import swal from "sweetalert2";
import { ReservationService } from "../services/reservation-service/reservation.service";
import { Ticket } from "../models/ticket";

@Component({
  selector: "app-add-ticket",
  templateUrl: "./add-ticket.component.html",
  styleUrls: ["./add-ticket.component.scss"],
})
export class AddTicketComponent implements OnInit {
  @ViewChild("createOnSelect") createOnSelect;
  addTicketForm: FormGroup;
  ticket_sources: any;
  ticket_priorities: any;
  ticket_types: any;
  selectableLeads = [];
  dataFromSearch: any = [];
  attachments: any = [];
  reservations: any = [];
  disable_submit_btn: any;
  ticketToBeEdited: any;
  isEditMode: boolean = false;
  searchInputPlaceholder: string;
  searchValue: string = "";
  disabledReservations: boolean;
  createOn: string;
  disabledCreateOn: boolean;
  private searchBy: "lead" | "rfid" | "unit_serial" = "lead";
  set searchMode(val: number) {
    if (val == 0) this.searchBy = "lead";
    else if (val == 1) this.searchBy = "rfid";
    else if (val == 2) this.searchBy = "unit_serial";
  }
  get searchMode() {
    if (this.searchBy == "lead") {
      this.disabledReservations = false;
      this.searchInputPlaceholder = "Search for lead by name Or Phone";
      return 0;
    }
    if (this.searchBy == "rfid") {
      this.disabledReservations = false;
      this.searchInputPlaceholder = "Search by Reservation By ID";
      return 1;
    }
    if (this.searchBy == "unit_serial") {
      this.disabledReservations = false;
      this.searchInputPlaceholder = "Search by Unit Serial";
      return 2;
    }
  }

  reservationsDropdownSettings: any = {
    singleSelection: false,
    idField: "id",
    textField: "id",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 100,
    allowSearchFilter: false,
  };

  reservation_id: string;
  shareingLead: any;
  reservationsOptions: any[] = [];
  selectedReservations: any[] = [];
  ticket_status: any = [];
  ticket_client_requests: any = [];

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    private helpdeskService: HelpdeskService,
    public http: HttpClient,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.reservation_id) {
        this.reservation_id = queryParams.reservation_id;
        this.searchMode = 1;
      }
    });
  }

  ngOnInit() {
    this.getTicketTypes();
    this.getTicketSources();
    this.getTicketPriorities();

    this.getTicketStatus();
    this.getTicketClientRequests();

    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.helpdeskService.getTicketDetails(params.id).subscribe((ticket) => {
          this.isEditMode = true;
          this.ticketToBeEdited = ticket;
          this.ticketToBeEdited.reservations.map((r) => {
            r["selectLabel"] = `${r.id} - ${r.unit_serial}`;
          });
          this.reservations = this.ticketToBeEdited.reservations;
          this.createEditTicketForm();
          if(this.reservations.length > 0) {
            this.createOn = "rfid";
            this.searchMode = 1;
          } else {
            this.createOn = "lead";
            this.searchMode = 0;
          }
          this.selectedReservations = this.ticketToBeEdited.reservations;
          // this.disabledCreateOn = true;
          // this.disabledReservations = true;
          // this.getTicketReservations(params.id);
          this.reservation_id && this.getReservationById();
        });
      } else this.createAddTicketForm();
    });
    this.reservation_id && this.getReservationById();
  }

  getTicketStatus() {
    this.helpdeskService.getTicketStatus().subscribe(
      (res: any) => {
        this.ticket_status = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  getTicketClientRequests() {
    this.helpdeskService.getTicketClientRequests().subscribe(
      (res: any) => {
        this.ticket_client_requests = res;
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
      }
    );
  }

  resetOnTabChange() {
    this.unselectLead();
    this.changeCreateOn("");
    this.createOnSelect.nativeElement.value = "";
    this.searchValue = null;
    this.selectedReservations = [];
  }

  changeCreateOn(event) {
    this.createOn = event;
    console.log(this.createOn);
    if (this.searchValue && this.searchMode == 1 && this.createOn == "rfid") {
      this.onItemSelect(this.searchValue);
    } else {
      this.disabledReservations = false;
      return;
    }
  }

  getReservationById() {
    this.reservationService.getSingleReservation(this.reservation_id).subscribe(
      (res: any) => {
        console.log(res.data);
        this.shareingLead = res.data[0].sharing_leads[0];
        this.reservations = res.data;
        console.log(this.shareingLead);
        console.log(res.data);

        this.addTicketForm
          .get("selected_lead")
          .patchValue(
            `#${this.shareingLead.lead_id} - ${this.shareingLead.lead_name} / ${this.shareingLead.lead_phone}`
          );
        this.addTicketForm.get("lead_id").patchValue(this.shareingLead.lead_id);
        this.addTicketForm
          .get("customer_name")
          .patchValue(this.shareingLead.lead_name);
        this.addTicketForm
          .get("customer_phone")
          .patchValue(this.shareingLead.lead_phone);
        this.selectedReservations = [this.reservation_id];
        this.onItemSelect(this.reservation_id);
        this.changeCreateOn("rfid");
        this.disabledCreateOn = true;
        this.disabledReservations = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createEditTicketForm() {
    let reservations = this.ticketToBeEdited.reservations || [];
    // this.ticketToBeEdited.reservations.forEach(element => {
    //   reservations = element.id;
    // });
    const lead = this.ticketToBeEdited.lead;
    this.addTicketForm = this.formBuilder.group({
      description: [
        this.ticketToBeEdited.description || "",
        Validators.required,
      ],
      type_id: [this.ticketToBeEdited.type_id || null, Validators.required],
      priority_id: [
        this.ticketToBeEdited.priority_id || null,
        Validators.required,
      ],
      source_id: [this.ticketToBeEdited.source_id || null, Validators.required],
      status_id: [this.ticketToBeEdited.status_id || null],
      ticket_client_request_id: [
        this.ticketToBeEdited.ticket_client_request_id || null,
      ],
      lead_id: [this.ticketToBeEdited.lead_id, Validators.required],
      selected_lead: [
        lead ? `#${lead.id} - ${lead.name} / ${lead.phone}` : "",
        Validators.required,
      ],
      reservations: [reservations],
      customer_name: [
        (this.ticketToBeEdited.customer &&
          this.ticketToBeEdited.customer.name) ||
          "",
        Validators.required,
      ],
      customer_phone: [
        (this.ticketToBeEdited.customer &&
          this.ticketToBeEdited.customer.phone) ||
          "",
      ],
      customer_notes: [
        (this.ticketToBeEdited.customer &&
          this.ticketToBeEdited.customer.notes) ||
          "",
      ],
      attachments: [this.ticketToBeEdited.attachments || null],
    });
  }

  createAddTicketForm() {
    this.addTicketForm = this.formBuilder.group({
      description: ["", Validators.required],
      type_id: [null, Validators.required],
      priority_id: [null, Validators.required],
      source_id: [null, Validators.required],
      status_id: [null],
      ticket_client_request_id: [null],
      lead_id: [null, Validators.required],
      selected_lead: ["", Validators.required],
      reservations: [[]],
      customer_name: ["", Validators.required],
      customer_phone: [""],
      customer_notes: [""],
      attachments: [],
    });
  }

  getTicketReservations(ticket_id) {
    this.helpdeskService
      .getTicketReservations(ticket_id)
      .subscribe((res: any) => {
        console.log("reservations : ", res);
        this.reservations = res.reservations;
      });
  }

  selectableLeadsObservable = (keyword: any): Observable<any[]> => {
    if (keyword) {
      return this.helpdeskService
        .searchLeads(keyword, this.searchBy)
        .map((res: any) => {
          this.dataFromSearch = res.data;
          return res.data.map((e) => `#${e.id} - ${e.name} / ${e.phone}`);
        });
    } else {
      return Observable.of([]);
    }
  };

  onInputEntered(event) {
    console.log(event.target.value);
    if (this.searchMode == 1) {
      this.searchValue = event.target.value;
    } else {
      this.searchValue = null;
    }
  }

  onLeadSelected(selectedLead: string) {
    if (!selectedLead) return;
    else if (!selectedLead.match(/#\d*/gim)) return;
    this.reservations = [];
    this.addTicketForm.get("reservations").patchValue([]);
    //Sorry
    const theLead: any = (this.dataFromSearch as any[]).filter(
      (e: any) =>
        e.id == ((selectedLead as string) || "").match(/#\d*/gim)[0].substr(1)
    )[0];
    console.log("The lead...", theLead);
    if (theLead) {
      this.addTicketForm.get("selected_lead").patchValue(selectedLead);
      this.reservations = theLead.reservations || [];
      this.addTicketForm.get("lead_id").patchValue(theLead.id || null);
      this.addTicketForm.get("customer_name").patchValue(theLead.name);
      this.addTicketForm.get("customer_phone").patchValue(theLead.phone);
    } else {
      this.addTicketForm.get("selected_lead").patchValue(selectedLead);
      this.reservations = [];
      this.addTicketForm.get("lead_id").patchValue(null);
    }
  }

  getTicketTypes() {
    this.helpdeskService.getTicketTypes().subscribe((res: any) => {
      this.ticket_types = res;
      console.log(this.ticket_types);
    });
  }

  getTicketPriorities() {
    this.helpdeskService.getTicketPriority().subscribe((res: any) => {
      this.ticket_priorities = res;
    });
  }

  getTicketSources() {
    this.helpdeskService.getTicketSource().subscribe((res: any) => {
      this.ticket_sources = res;
    });
  }

  onItemSelect(item: any) {
    if (!this.selectedReservations.includes(item)) {
      console.log(this.searchValue);
      this.selectedReservations.push(item);
      this.addTicketForm
        .get("reservations")
        .patchValue(this.selectedReservations);
    } else {
      console.log("Already selected");
    }
  }

  onSelectAll(items: any) {
    this.selectedReservations = items;
    this.addTicketForm
      .get("reservations")
      .patchValue(this.selectedReservations);
  }

  addTicket() {
    let formVal = this.addTicketForm.value;
    let payload = {
      description: formVal.description,
      type_id: formVal.type_id,
      priority_id: formVal.priority_id,
      source_id: formVal.source_id,
      ticket_client_request_id: formVal.ticket_client_request_id,
      status_id: formVal.status_id,
      lead_id: formVal.lead_id,
      reservation_id: formVal.reservation_id,
      attachments: this.attachments,
      reservations: formVal.reservations,
      customer: {
        name: formVal.customer_name,
        phone: formVal.customer_phone,
        notes: formVal.customer_notes,
      },
    };
    console.log(payload);
    if (this.searchMode == 1 && this.selectedReservations.length == 0) {
      swal("Error", "Please select at least one reservation", "error");
      return;
    }
    this.disable_submit_btn = true;
    this.slimLoadingBarService.start();
    this.modifyTicket(payload, this.isEditMode);
  }

  private modifyTicket(payload, isEdit: boolean) {
    const onSuccess = (res: any) => {
      this.disable_submit_btn = false;
      this.slimLoadingBarService.complete();
      swal(
        "Success",
        `${this.isEditMode ? "Updated" : "Added"} Ticket Successfully`,
        "success"
      );
      this.router.navigateByUrl("/pages/tickets");
    };

    const onErr = (err) => {
      this.disable_submit_btn = false;
      this.slimLoadingBarService.reset();
      this.errorHandlerService.handleErorr(err);
    };
    if (isEdit)
      this.helpdeskService
        .editTicket(payload, this.ticketToBeEdited.id)
        .subscribe(onSuccess, onErr);
    else this.helpdeskService.addTicket(payload).subscribe(onSuccess, onErr);
  }

  get leadId() {
    return this.addTicketForm.value.lead_id;
  }

  async onFileChange(event) {
    let selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      let file = selectedFiles[i];
      let reader = new FileReader();
      await reader.readAsDataURL(file);
      reader.onload = async () => {
        let attach = {
          name: file.name,
          type: file.type,
          src: (reader.result as any as any).split(",")[1],
        };
        await this.attachments.push(attach);
      };
      console.log(this.attachments);
    }
  }

  viewLead() {
    this.helpdeskService.viewLead(this.leadId);
  }

  viewReservation(id) {
    this.helpdeskService.viewReservation(id);
  }

  unselectLead() {
    this.addTicketForm.get("lead_id").reset();
    this.addTicketForm.get("selected_lead").reset();
    this.addTicketForm.get("reservations").reset();
    this.addTicketForm.get("customer_name").reset();
    this.addTicketForm.get("customer_phone").reset();
    this.reservations = [];
  }

  cancel() {
    this.router.navigateByUrl("/pages/tickets");
  }
}
