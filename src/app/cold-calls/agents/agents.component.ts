import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { ColdCallsStatusesService } from "../../services/cold-calls/cold-calls-statuses.service";
import { ColdCallsService } from "../cold-calls.service";

@Component({
  selector: "app-agents",
  templateUrl: "./agents.component.html",
  styleUrls: ["./agents.component.scss"],
})
export class AgentsComponent implements OnInit {
  contactsElements: any[];
  searchText: string = "";
  contactsRaw: any;
  currentPage: any = 0;
  searchOptions;

  statuses_list = [];
  constructor(
    private coldCallsService: ColdCallsService,
    private coldCallsStatusesService: ColdCallsStatusesService
  ) {}

  ngOnInit(): void {
    this.fetchAgentsData();
    this.fetchStatuses();
  }

  fetchStatuses() {
    this.coldCallsStatusesService.getContactStatuses().subscribe((res: any) => {
      this.statuses_list = res;
    });
  }
  fetchAgentsData(searchText = "", page?) {
    this.searchText = searchText;
    this.coldCallsService.getAgentsCardsData(searchText, page).subscribe(
      (res: any) => {
        this.contactsRaw = res;
        this.contactsElements = res.data;
      },
      (err) => {}
    );
  }

  pageChange(page) {
    this.fetchAgentsData(this.searchText, page);
  }

  export(agentId) {
    let payload = {
      user_id: agentId,
    };
    this.coldCallsService.exportExcel(payload).subscribe(
      (res: any) => {
        window.open(res.url);
      },
      (err) => {
        Swal("Failed", "Download example failed", "error");
      }
    );
  }
}
