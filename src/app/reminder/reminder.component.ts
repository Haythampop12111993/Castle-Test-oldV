import { LeadsService } from "./../services/lead-service/lead-service.service";
import { UserServiceService } from "./../services/user-service/user-service.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ReminderService } from "../services/reminder/reminder.service";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.css"],
})
export class ReminderComponent {
  @ViewChild("calendarEl") calendarEl: ElementRef;
  calendar: any;

  raw_events: any;
  events: any;

  // selects
  reminderOptions = [];
  leadsSelectController = {
    data: [],
    page: 1,
    loading: false,
    last_page: null,
    term: "",
  };

  // form
  formDisplay: boolean | "view" = false;

  selectedEvent;

  // filters
  filters = {
    all_actions: true,
    action_id: {},
    is_done: "all",
  };
  constructor(
    private formBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private leadsService: LeadsService,
    private userService: UserServiceService,
    private reminderService: ReminderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getReminders(true);
    this.getAllRemindersOptions();
    this.getLeads();
    this.activatedRoute.queryParams.subscribe((res) => {
      if (res.ticket_id){
        this.openForm()
      }
    })
  }

  ngAfterViewInit() {
    this.initCalender();
  }

  // fetch
  getReminders(first = false) {
    // Handle Filters
    const payload: any = {};
    if (!first) {
      // Option type (action_id)
      let selected_actions = Object.entries(this.filters.action_id)
        .filter(([key, val]) => val)
        .map(([key, val]) => key);

      if (selected_actions.length === 0 || this.filters.is_done === null) {
        this.events = [];
        this.initCalender();
        return;
      } else {
        payload.action_id = selected_actions.join(",");
        if (this.filters.is_done !== "all")
          payload.is_done = this.filters.is_done;
      }
    }
    this.getRemindersRequest(payload);
  }

  getRemindersRequest(payload) {
    // Send Request
    this.slimLoadingBarService.start();
    this.reminderService.getReminders(payload).subscribe(
      (res: any) => {
        this.raw_events = res;
        this.events = res.map(this.ReminderToEvent);
        this.initCalender();
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
        console.log(err);
      }
    );
  }

  getAllRemindersOptions() {
    this.userService.getAllReminders().subscribe(
      (data: any) => {
        this.reminderOptions = data;
        this.filters.action_id = data.reduce((obj, option) => {
          obj[option.id] = true;
          return obj;
        }, {});
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

  // calender manage
  initCalender() {
    if (this.calendar) {
      this.calendar.destroy();
    }
    this.calendar = new Calendar(this.calendarEl.nativeElement, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
      },
      events: this.events,
      eventClick: (info) => {
        this.eventClicked(info);
      },
      eventDidMount: (doc) => {
        // Fix Calendar BUG: backgroundColor not set Correctly
        // set background color with opacity
        doc.el.style.cursor = "pointer";
        if (doc.event.backgroundColor) {
          doc.el.style.backgroundColor = doc.event.backgroundColor + 60;
        }
        if (doc.event.classNames.includes("done")) {
          doc.el.style.textDecoration = "line-through";
        }
      },
    });
    this.renderCalender();
  }

  renderCalender() {
    this.calendar.render();
  }

  // helper
  ReminderToEvent(reminder) {
    return {
      id: reminder.id,
      title: `${reminder.title ? reminder.title + ": " : " "}${
        reminder.desc ? reminder.desc + " " : ""
      }${reminder.lead ? ` (${reminder.lead.name})` : ""}`,
      start: reminder.datetime,
      backgroundColor: reminder.action ? reminder.action.color : undefined,
      classNames: reminder && reminder.is_done ? ["done"] : [],
    };
  }

  // actions
  changeFilterAction(id) {
    if (id === "all") {
      Object.keys(this.filters.action_id).map((key) => {
        this.filters.action_id[key] = !this.filters.all_actions;
      });
      this.filters.all_actions = !this.filters.all_actions;
    } else {
      this.filters.action_id[id] = !this.filters.action_id[id];
      this.filters.all_actions = Object.values(this.filters.action_id).every(
        (f: any) => f
      );
    }
    this.getReminders();
  }

  openForm(event = null, view = false) {
    this.selectedEvent = event;
    this.formDisplay = view ? "view" : true;
  }

  eventClicked(info) {
    this.raw_events.forEach((event) => {
      if (event.id == info.event.id) {
        this.openForm(event, true);
      }
    });
  }

  // destroy
  ngOnDestroy() {
    console.log(`destorying component`);
    this.calendar.destroy();
  }
}
