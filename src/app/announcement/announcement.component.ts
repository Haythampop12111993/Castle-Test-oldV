import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-announcement",
  templateUrl: "./announcement.component.html",
  styleUrls: ["./announcement.component.css"],
})
export class AnnouncementComponent implements OnInit {
  environment = environment;
  constructor() {}

  ngOnInit() {}
}
