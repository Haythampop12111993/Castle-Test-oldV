import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  userProfile: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (
      this.userProfile.role == "Legal Head" ||
      this.userProfile.role == "Legal and Technical" || 
      this.userProfile.role == "Facility"
    ) {
      this.router.navigate(["pages/reservations"]);
    } else if (this.userProfile.role == "Engineer" || this.userProfile.role == "Broker") {
      this.router.navigate(["pages/projects"]);
    }
  }
}
