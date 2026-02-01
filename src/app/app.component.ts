import { environment } from "./../environments/environment";
import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import * as $ from "jquery";
import swal from "sweetalert2";
import { NotificationsService } from "./services/notifications/notifications.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(
    private notificationsService: NotificationsService,
    private title: Title
  ) {
    this.detectNetworkOffline();
    this.title.setTitle(environment.statics.title);
  }

  ngOnInit(): void {
    this.notificationsService.initPush().then(console.log).catch(console.log);
  }

  detectNetworkOffline() {
    window.addEventListener("offline", () => {
      swal(
        "You are offline, please check your internet connection",
        "",
        "error"
      );
    });
  }

  detectNetworkOnline() {
    window.addEventListener("online", () => {
      console.log("network online now...");
    });
  }
}
