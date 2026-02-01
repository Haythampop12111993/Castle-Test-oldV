import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Modal } from "ngx-modal";
import { Observable } from "rxjs";
import swal from "sweetalert2";
import { EmbededModal } from "../../../interfaces/embededModal";
import { Ticket } from "../../../models/ticket";
import { HelpdeskService } from "../../../services/helpdesk/helpdesk.service";
import { ReservationService } from "../../../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";

@Component({
  selector: "app-search-ticket",
  templateUrl: "./search-ticket.component.html",
  styleUrls: ["./search-ticket.component.css"],
})
export class SearchTicketComponent implements OnInit, EmbededModal {
  @ViewChild("modal") private modal: Modal;
  @Output() onSubmit = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Input() events: Observable<void>;

  searchTicketForm: FormGroup;
  ticket_sources: any;
  ticket_priorities: any;
  ticket_types: any;
  selectableLeads = [];
  dataFromSearch: any = [];
  attachments: any = [];
  reservations: any = [];
  disable_submit_btn: any;
  ticketToBeEdited: Ticket;
  isEditMode: boolean = false;
  private searchBy: "lead" | "rfid" | "unit_serial" = "lead";
  set searchMode(val: number) {
    if (val == 0) this.searchBy = "lead";
    else if (val == 1) this.searchBy = "rfid";
    else if (val == 2) this.searchBy = "unit_serial";
  }
  get searchMode() {
    if (this.searchBy == "lead") return 0;
    if (this.searchBy == "rfid") return 1;
    if (this.searchBy == "unit_serial") return 2;
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

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    private helpdeskService: HelpdeskService,
    public http: HttpClient,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getTicketTypes();
    this.getTicketSources();
    this.getTicketPriorities();

    this.createsearchTicketForm();

    this.events.subscribe((res) => {
      this.createsearchTicketForm();
    });
  }

  open(...args: any[]) {
    this.modal.open();
  }

  //#region Create Form
  createsearchTicketForm() {
    this.searchTicketForm = this.formBuilder.group({
      title: [""],
      description: [""],
      type_id: [""],
      priority_id: [""],
      source_id: [""],
      lead_id: [null],
      selected_lead: [""],
      reservation: [[]],
    });
  }

  //#endregion

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

  onLeadSelected(selectedLead: string) {
    if (!selectedLead) return;
    else if (!selectedLead.match(/#\d*/gim)) return;
    this.reservations = [];
    this.searchTicketForm.get("reservations").patchValue([]);
    //Sorry
    const theLead: any = (this.dataFromSearch as []).filter(
      (e: any) =>
        e.id == ((selectedLead as string) || "").match(/#\d*/gim)[0].substr(1)
    )[0];
    console.log("The lead...", theLead);
    if (theLead) {
      this.searchTicketForm.get("selected_lead").patchValue(selectedLead);
      this.reservations = theLead.reservations || [];
      this.searchTicketForm.get("lead_id").patchValue(theLead.id || null);
    } else {
      this.searchTicketForm.get("selected_lead").patchValue(selectedLead);
      this.reservations = [];
      this.searchTicketForm.get("lead_id").patchValue(null);
    }
  }

  getTicketTypes() {
    this.helpdeskService.getTicketTypes().subscribe((res: any) => {
      this.ticket_types = res;
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

  addTicket() {
    let formVal = this.searchTicketForm.value;
    let payload = {
      title: formVal.title,
      description: formVal.description,
      type: formVal.type_id,
      priority: formVal.priority_id,
      source: formVal.source_id,
      reservations: formVal.reservation,
    };
    this.disable_submit_btn = true;
    this.slimLoadingBarService.start();
    this.onSubmit.emit(payload);
    this.modal.close();
  }

  closeModal() {
    this.onClose.emit();
    this.modal.close();
  }
  viewReservation(id) {
    this.helpdeskService.viewReservation(id);
  }

  unselectLead() {
    this.searchTicketForm.get("lead_id").reset();
    this.searchTicketForm.get("selected_lead").reset();
    this.searchTicketForm.get("reservations").reset();
    this.reservations = [];
  }

  cancel() {
    this.router.navigateByUrl("/pages/tickets");
  }
}
