import { ErrorHandlerService } from "./../../services/shared/error-handler.service";
import { LeadsService } from "../../services/lead-service/lead-service.service";
import { UserServiceService } from "../../services/user-service/user-service.service";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { ReminderService } from "../../services/reminder/reminder.service";

@Component({
  selector: "app-reminder-form",
  templateUrl: "./reminder-form.component.html",
  styleUrls: ["./reminder-form.component.css"],
})
export class ReminderFormComponent {
  @Input() event;
  @Input() status: boolean | "view" = false;
  @Output() statusChange = new EventEmitter();
  @Output() refresh = new EventEmitter();
  // selects
  reminderOptions = [];
  leadsSelectController = {
    data: [],
    page: 1,
    loading: false,
    last_page: null,
    term: "",
  };

  activityActions = [];

  // form
  editId = null;
  eventForm = {
    title: "",
    datetime: "",
    desc: "",
    lead_id: null,
    action_id: null,
    user_name: null
  };
  selectedEvent;
  eventFormSubmitted = false;

  activity = {
    title: "",
    details: "",
  };
  constructor(
    private formBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private leadsService: LeadsService,
    public errorHandlerService: ErrorHandlerService,
    private userService: UserServiceService,
    private reminderService: ReminderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllRemindersOptions();
    this.getLeads();
    this.getAllActions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.currentValue !== false) {
      this.editId = this.event ? this.event.id : null;

      if (this.event) {
        this.selectedEvent = this.event;
      }
      console.log(this.event);
      this.eventForm = {
        title: this.event ? this.event.title : "",
        datetime: this.event ? this.event.datetime : "",
        desc: this.event ? this.event.desc : "",
        lead_id: this.event ? this.event.lead_id : null,
        action_id: this.event ? this.event.action_id : null,
        user_name: this.event && this.event.user ? this.event.user.name : "",
      };

      if (this.event && this.event.lead) {
        this.leadsSelectController.data = [this.event.lead];
      }
      this.status = this.event ? "view" : true;
    }
  }

  // fetch
  getAllRemindersOptions() {
    this.userService.getAllReminders().subscribe(
      (data: any) => {
        this.reminderOptions = data;
      },
      (err) => this.slimLoadingBarService.reset()
    );
  }

  getLeads(paginate = false, term?) {
    if (paginate) {
      if (
        this.leadsSelectController.page < this.leadsSelectController.last_page
      )
        this.leadsSelectController.page++;
      else return;
    }

    if (term != undefined) {
      this.leadsSelectController.term = term;
    }

    this.leadsSelectController.loading = true;

    let payload: any = {
      page: this.leadsSelectController.page,
      keyword: this.leadsSelectController.term,
    };

    this.leadsService.getLeads(payload).subscribe(
      (res: any) => {
        this.leadsSelectController.page = res.current_page;
        this.leadsSelectController.last_page = res.last_page;

        if (paginate) {
          this.leadsSelectController.data.push(...res.data);
        } else {
          this.leadsSelectController.data = res.data;
        }

        this.leadsSelectController.loading = false;
      },
      (err) => {
        console.log(err);
        this.leadsSelectController.loading = false;
      }
    );
  }

  getAllActions() {
    this.slimLoadingBarService.start();
    this.userService.getAllActivites().subscribe(
      (data: any) => {
        this.activityActions = [...data];
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  // actions
  addCampainSubmit(form) {
    this.eventFormSubmitted = true;
    if (form.invalid) return;

    let payload = Object.assign({}, this.eventForm);

    this.slimLoadingBarService.start();
    let request;
    if (this.editId) {
      request = this.reminderService.putReminders(this.editId, payload);
    } else {
      request = this.reminderService.postReminders(payload);
    }
    request.subscribe(
      (res: any) => {
        this.eventFormSubmitted = false;
        this.closeDialog(true);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  addAction(modal?, sendActivity = false) {
    let payload = sendActivity ? this.activity : {};

    this.reminderService.doneReminders(this.editId, payload).subscribe(
      (res: any) => {
        if (modal) modal.close();
        this.closeDialog(true);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  openLead(lead_id) {
    this.router.navigate(["pages", "leads", lead_id]);
  }

  // dialog
  closeDialog(refresh = false) {
    this.statusChange.emit(false);
    if (refresh) {
      this.refresh.emit();
    }
  }
}
