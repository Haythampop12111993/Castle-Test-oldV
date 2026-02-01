import { NotificationsService } from "./../../services/notifications/notifications.service";
import { UserProfileService } from "./../../services/event-bus/user-profile.service";
import { ErrorHandlerService } from "./../../services/shared/error-handler.service";
import { UserServiceService } from "./../../services/user-service/user-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { GlobalNotificationsService } from "../../services/global-notifications/global-notifications.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  envStatics = environment.statics;
  title = "header";
  userData: any;
  userPic: any;
  changePasswordForm: FormGroup;
  @Input() menuIsExpanded: boolean;
  notificationsList: any = [];
  notificationCounter = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public userService: UserServiceService,
    private errorHandlderService: ErrorHandlerService,
    private userProfileService: UserProfileService,
    private globalNotificationsService: GlobalNotificationsService
  ) {
    this.userData = JSON.parse(window.localStorage.getItem("userProfile"));
    this.createChangePasswordForm();

    this.globalNotificationsService.newNotification.subscribe(
      (notification) => {
        if (notification) {
          this.notificationsList = [
            {
              type: notification.notification.title,
              details: notification.notification.body,
              created_at: notification.created_at,
            },
            ...this.notificationsList,
          ];
          this.notificationCounter++;
        }
      }
    );
  }

  ngOnInit() {
    this.getAllReservation();
    this.userProfileService.currentImage.subscribe((img) => {
      console.log(img);
      console.log("current image subscribed");
      this.userPic = img;
      if (!this.userPic) this.userPic = 0;
    });
    this.userProfileService.currentUserProfile.subscribe((data) => {
      this.userData = data;
    });
  }

  createChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ["", Validators.required],
      new_password: ["", Validators.required],
    });
  }

  changePasswordMethod(modal) {
    const formModel = this.changePasswordForm.value;
    if (!formModel.old_password || !formModel.new_password) {
      swal("Current Password and new Password can not be empty!", "", "error");
    } else {
      this.userService.changePassword(formModel).subscribe(
        (data) => {
          console.log(data);
          modal.close();
          swal("Woohoo!", "Password Changed Successfully!", "success");
        },
        (err) => this.errorHandlderService.handleErorr(err)
      );
    }
  }

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(["login"]);
    });
  }

  addLead() {
    this.router.navigate(["./pages/addLead", 0]);
  }

  changePasswordModalActionOnOpen() {}

  changePasswordModalActionOnClose() {}

  changePassword(modal) {
    modal.close();
  }

  goToNotification(notification?) {
    if (notification) {
      if (notification.type == "Reservation") {
        let reservation = {
          id: notification.reservation_id,
        };
        window.localStorage.setItem(
          "reservationDetails",
          JSON.stringify(reservation)
        );
        this.router.navigate(["/pages/project/view-reservation"]);
        return;
      } else if (notification.type == "Unit") {
        this.router.navigate(["/pages/projects/view-unit"], {
          queryParams: {
            project_id: null,
            unit_id: notification.unit_id,
          },
        });
        return;
      } else if (notification.type == "Block Request") {
        this.router.navigate(["/pages/projects/view-unit"], {
          queryParams: {
            project_id: null,
            unit_id: notification.unit_id,
          },
        });
        return;
      }
    }
    this.router.navigate(["/pages/notifications"]);
    return;
  }

  notificationOpened() {
    this.notificationCounter = 0;
  }

  getAllReservation() {
    this.globalNotificationsService.fetchNotifications().subscribe(
      (res: any) => {
        this.notificationsList = res.data.slice(0, 9);
        console.log(this.notificationsList);
      },
      (err) => this.errorHandlderService.handleErorr(err)
    );
  }

  goToMyProfile() {
    this.router.navigateByUrl("/pages/profile");
  }
}
