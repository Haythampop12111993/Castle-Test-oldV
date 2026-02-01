import { Component, OnInit } from "@angular/core";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";

import { UserServiceService } from "../../services/user-service/user-service.service";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";

@Component({
  selector: "app-activity-options",
  templateUrl: "./activity-options.component.html",
  styleUrls: ["./activity-options.component.css"],
})
export class ActivityOptionsComponent implements OnInit {
  add_action: any;

  actions: any[];

  add_action_status: any[];

  statuses: any[] = [
    { id: 1, name: "New" },
    { id: 2, name: "Interested" },
    { id: 3, name: "Closed" },
    { id: 4, name: "Not Interested" },
    { id: 5, name: "Freeze" },
    { id: 6, name: "No Answer" },
    { id: 7, name: "Not Reachable" },
  ];

  current_selected_action: any;

  constructor(
    private userService: UserServiceService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.getAllActivites();
  }

  addActionToActivity() {
    const actionData = {
      name: this.add_action,
      status: this.add_action_status,
    };
    this.slimLoadingBarService.start();
    this.userService.addActionToActivity(actionData).subscribe(
      (data: any) => {
        this.getAllActivites();
        this.add_action = "";
        this.add_action_status = null;
        swal("Action added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  deleteAction(id) {
    this.slimLoadingBarService.start();
    this.userService.deleteAction(id).subscribe(
      (data: any) => {
        swal("Action deleted successfully", "", "success");
        this.getAllActivites();
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  getAllActivites() {
    this.userService.getAllActivites().subscribe(
      (data: any) => {
        this.actions = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editAction(action) {
    this.current_selected_action = action;
    this.add_action = this.current_selected_action.name;
    this.add_action_status = this.current_selected_action.status;
  }

  updateActivity() {
    const actionData = {
      name: this.add_action,
      status: this.add_action_status,
    };
    this.slimLoadingBarService.start();
    this.userService
      .editActionToAcitivity(this.current_selected_action.id, actionData)
      .subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          this.getAllActivites();
          this.current_selected_action = undefined;
          this.add_action = "";
          this.add_action_status = null;
          swal("Success", "Edited activity successfully", "success");
        },
        (err) => {
          console.log(err);
          this.slimLoadingBarService.reset();
        }
      );
  }

  cancelUpdate() {
    this.current_selected_action = undefined;
  }
}
