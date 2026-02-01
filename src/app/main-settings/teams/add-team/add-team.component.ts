import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { ErrorHandlerService } from "../../../services/shared/error-handler.service";
import { TeamService } from "../../../services/settings-service/team/team.service";
import { environment } from "../../../../environments/environment";

import swal from "sweetalert2";

@Component({
  selector: "app-add-team",
  templateUrl: "./add-team.component.html",
  styleUrls: ["./add-team.component.css"],
})
export class AddTeamComponent implements OnInit {
  teamName: string;

  teamLevel: string = "team";
  parentTeam: any;

  isEditState = false;

  teamID: number;

  salesManager: any;
  selectedSalesManager: any[] = [];

  deputySalesManager: any;
  selectedDeputySalesManager: any[] = [];

  seniorTeamLeader: any;
  selectedSeniorTeamLeader: any[] = [];

  teamLeader: any;
  selectedTeamLeader: any[] = [];

  supervisor: any;
  selectedSupervisor: any[] = [];

  propertyConsultant: any;
  selectedPropertyConsultant: any[] = [];

  admin: any;
  selectedAdmin: any[] = [];

  teamMembers: any[] = [];

  parentTeams: any[] = [];
  members = null;
  lg = "lg";

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    public errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  ngOnInit() {
    this.teamID = +this.route.snapshot.params["id"];
    this.getParentTeams();
    this.getRolesData();
    if (this.teamID > 0) {
      this.isEditState = true;
      this.getEditdata(this.teamID);
    } else {
    }
  }

  getParentTeams() {
    this.teamService.getTeamsParent().subscribe(
      (res: any) => {
        this.parentTeams = res;
      },
      (err) => console.log(err)
    );
  }

  getRolesData() {
    this.http.get(`${environment.api_base_url}teams/structure`).subscribe(
      (data: any[]) => {
        this.prepareData(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  prepareData(data: any[]) {
    data.forEach(function (v) {
      v.users.forEach(function (c) {
        delete c.is_sales_team;
      });
    });

    // second approach
    data.forEach((elm) => {
      switch (elm.roleName) {
        case "Leader":
          this.teamLeader = elm.users;
          break;
        case "Senior Leader":
          this.seniorTeamLeader = elm.users;
          break;
        case "Supervisor":
          this.supervisor = elm.users;
          break;
        case "Property Consultant":
          this.propertyConsultant = elm.users;
          break;
        case "Sales Manager":
          this.salesManager = elm.users;
          break;
        case "Admin":
          this.admin = elm.users;
          break;
        case "Deputy Sales Manager":
          this.deputySalesManager = elm.users;
          break;
      }
    });
  }

  getEditdata(id) {
    this.teamService.getTeam(id).subscribe(
      (data: any) => {
        this.teamName = data.teamName;
        this.parentTeam = data.parent_team;
        if (data.parent_team) this.teamLevel = "sub_team";
        else this.teamLevel = "team";
        console.log(this.parentTeam, this.teamLevel);
        this.handleSelected(data);
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  save() {
    if (this.teamName) {
      // this.handleTeamBeforeSubmitting();
      this.resetForm();
      if (this.isEditState === true) {
        let payload = this.handleTeamBeforeSubmitting();
        if (payload.team_level == "sub_team" && this.parentTeam == null) {
          swal("You have to select a parent team", "", "error");
          return;
        }
        this.teamService.update(this.teamID, payload).subscribe(
          (data) => {
            if (data === "Updated") {
              this.router.navigate(["/pages/settings/teams"]);
            }
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      } else {
        let payload = this.handleTeamBeforeSubmitting();
        console.log(payload);
        if (payload.team_level == "sub_team" && this.parentTeam == null) {
          swal("You have to select a parent team", "", "error");
          return;
        }
        this.teamService.save(payload).subscribe(
          (data) => {
            if (data === "Inserted") {
              this.router.navigate(["/pages/settings/teams"]);
            }
          },
          (err) => this.errorHandlerService.handleErorr(err)
        );
      }
    }
  }

  handleTeamBeforeSubmitting() {
    let payload: any = this.handleAllSelectedElements();
    console.log(payload);
    payload.name = this.teamName;
    payload.team_level = this.teamLevel;
    payload.parent_team = this.parentTeam;
    return payload;
  }

  handleAllSelectedElements() {
    const selectedSalesManager = [];
    this.selectedSalesManager.forEach((elm) => {
      selectedSalesManager.push(elm.id);
    });
    console.log({ selectedAdmin: this.selectedAdmin });
    this.selectedAdmin.forEach((elm) => {
      selectedSalesManager.push(elm.id);
    });
    const selectedDeputySalesManager = [];
    this.selectedDeputySalesManager.forEach((elm) => {
      selectedDeputySalesManager.push(elm.id);
    });
    const selectedSeniorTeamLeader = [];
    this.selectedSeniorTeamLeader.forEach((elm) => {
      selectedSeniorTeamLeader.push(elm.id);
    });
    const selectedTeamLeader = [];
    this.selectedTeamLeader.forEach((elm) => {
      selectedTeamLeader.push(elm.id);
    });
    const selectedSupervisor = [];
    this.selectedSupervisor.forEach((elm) => {
      selectedSupervisor.push(elm.id);
    });
    const selectedPropertyConsultant = [];
    this.selectedPropertyConsultant.forEach((elm) => {
      selectedPropertyConsultant.push(elm.id);
    });
    return {
      selectedSalesManager,
      selectedDeputySalesManager,
      selectedSeniorTeamLeader,
      selectedTeamLeader,
      selectedSupervisor,
      selectedPropertyConsultant,
    };
  }

  handleSelected(data) {
    this.selectedDeputySalesManager = [];
    this.selectedPropertyConsultant = [];
    this.selectedSalesManager = [];
    this.selectedSeniorTeamLeader = [];
    this.selectedSupervisor = [];
    this.selectedTeamLeader = [];
    this.selectedAdmin = [];
    data.roles["Deputy Sales Manager"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedDeputySalesManager.push(item);
    });
    data.roles["Property Consultant"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedPropertyConsultant.push(item);
    });
    data.roles["Sales Manager"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedSalesManager.push(item);
    });
    data.roles["Senior Leader"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedSeniorTeamLeader.push(item);
    });
    data.roles["Supervisor"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedSupervisor.push(item);
    });
    data.roles["Leader"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedTeamLeader.push(item);
    });
    data.roles["Admin"].forEach((elm) => {
      let item = {
        id: elm.id,
        name: elm.name,
      };
      this.selectedAdmin.push(item);
    });
  }

  resetForm() {
    if (this.teamLevel === "team") {
      this.resetTeamLevelForm();
    } else if (this.teamLevel === "sub_team") {
      this.resetSubteamLevelform();
    }
  }

  resetTeamLevelForm() {
    this.parentTeam = null;
    this.selectedPropertyConsultant = [];
    this.selectedSeniorTeamLeader = [];
    this.selectedSupervisor = [];
    this.selectedTeamLeader = [];
  }

  resetSubteamLevelform() {
    this.selectedSalesManager = [];
    this.selectedAdmin = [];
    this.selectedDeputySalesManager = [];
  }
}
