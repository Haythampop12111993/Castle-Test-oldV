import { Router } from "@angular/router";
import { LeadsService } from "./../services/lead-service/lead-service.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Component, OnInit } from "@angular/core";
import { GlobalNotificationsService } from "../services/global-notifications/global-notifications.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  notifications;
  pageTest: any = 1;
  lg: string = "lg";
  notifications_raw_data: any;
  last_page_url: any;

  current_page: any;
  totalRec: number;
  per_page: any;
  total: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private globalNotificationsService: GlobalNotificationsService,
    private leadsService: LeadsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllNotifications();
  }

  goToReservation(id) {}

  goToPage(notification) {
    console.log(notification);
    if (notification.type == "Reservation") {
      this.router.navigate([
        "/pages/project/view-reservation",
        notification.reservation_id,
      ]);
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
    } else if (notification.type == "Lead") {
      this.router.navigateByUrl(
        `/pages/leads?lead_id=${notification.lead_id}`
      );
      return;
    }
  }

  getAllNotifications() {
    this.slimLoadingBarService.start();
    this.globalNotificationsService.fetchNotifications().subscribe(
      (res: any) => {
        this.notifications_raw_data = res;
        this.notifications = res.data;
        this.last_page_url = res.last_page_url;
        this.notifications = res.data;
        this.current_page = 1;
        this.totalRec = res.total;
        this.per_page = res.to;
        this.total = res.total;
      },
      (err) => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }
  

  pageChange(event) {
    let arr = this.last_page_url.split("?");
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl, event);
  }

  infinite(url, number) {
    this.slimLoadingBarService.start();
    this.leadsService.infinit(url).subscribe(
      (res: any) => {
        this.notifications_raw_data = res;
        this.last_page_url = res.last_page_url;
        this.notifications = res.data;
        this.totalRec = res.total;
        this.per_page = res.to;
        this.total = res.total;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.errorHandlerService.handleErorr(err);
        this.slimLoadingBarService.complete();
      }
    );
  }

  onScroll() {
    // let arr = this.last_page_url.split('?');
    // let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(this.last_page_url, "ev");
  }
}
