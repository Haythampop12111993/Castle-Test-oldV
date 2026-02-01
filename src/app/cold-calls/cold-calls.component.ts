import { Component, OnInit } from "@angular/core";
import { ColdCallsStatusesService } from "../services/cold-calls/cold-calls-statuses.service";
@Component({
  selector: "app-cold-calls",
  templateUrl: "./cold-calls.component.html",
  styleUrls: ["./cold-calls.component.scss"],
})
export class ColdCallsComponent implements OnInit {
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  statuses_list = [];
  constructor(private coldCallsStatusesService: ColdCallsStatusesService) {}

  ngOnInit(): void {
    this.fetchStatuses();
  }

  fetchStatuses() {
    this.coldCallsStatusesService.getContactStatuses().subscribe((res: any) => {
      this.statuses_list = res;
    });
  }
}
