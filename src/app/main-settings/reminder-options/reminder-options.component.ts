import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { UserServiceService } from "../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";

@Component({
  selector: "app-reminder-options",
  templateUrl: "./reminder-options.component.html",
  styleUrls: ["./reminder-options.component.css"],
})
export class ReminderOptionsComponent implements OnInit {
  add_reminder: any;
  add_color: any;

  reminders: any[];

  current_selected_reminder: any;

  constructor(
    private userService: UserServiceService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getAllReminders();
  }

  addReminder() {
    const actionData = {
      name: this.add_reminder,
      color: this.add_color,
    };
    this.slimLoadingBarService.start();
    this.userService.addReminder(actionData).subscribe(
      (data: any) => {
        this.getAllReminders();
        this.add_reminder = "";
        this.add_color = "";
        swal("Reminder option added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deleteReminder(id) {
    this.slimLoadingBarService.start();
    this.userService.deleteReminder(id).subscribe(
      (data: any) => {
        swal("Reminder option deleted successfully", "", "success");
        this.getAllReminders();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllReminders() {
    this.userService.getAllReminders().subscribe(
      (data: any) => {
        this.reminders = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editReminder(action) {
    this.current_selected_reminder = action;
    this.add_reminder = this.current_selected_reminder.name;
    this.add_color = this.current_selected_reminder.color;
  }

  updateReminder() {
    const actionData = {
      name: this.add_reminder,
      color: this.add_color,
    };
    this.slimLoadingBarService.start();
    this.userService
      .editReminder(this.current_selected_reminder.id, actionData)
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          this.getAllReminders();
          this.current_selected_reminder = undefined;
          this.add_reminder = "";
          this.add_color = "";
          swal("Success", "Edited reminder option successfully", "success");
        },
        (err) => {
          console.log(err);
          this.slimLoadingBarService.reset();
        }
      );
  }

  cancelUpdate() {
    this.current_selected_reminder = undefined;
    this.add_reminder = "";
    this.add_color = "";
  }
}
