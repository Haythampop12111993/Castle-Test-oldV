import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { TeamService } from '../../services/settings-service/team/team.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { LeadsService } from '../../services/lead-service/lead-service.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];

  inteams = null;

  raw_teams: any;

  pageTest: any = 1;

  pagination: any[];

  last_page_url: any;

  current_page: any;

  team_tree: any;

  team_tree_branch_name: any;
  team_tree_branch_users: any;
  team_tree_name: any;
  team_tree_users: any;
  team_tree_sub_name: any;
  team_tree_sub_users: any;
  lg = 'lg';dev

  constructor(
    private router: Router,
    private teamService: TeamService,
    public leadsService: LeadsService,
    public errorHandlerService: ErrorHandlerService,
    public zone: NgZone,
    public slimLoadingBarService: SlimLoadingBarService
  ) { }

  ngOnInit() {
    this.getteams();
  }

  getteams() {
    this.teams = null;
    this.teams = this.teamService.getTeams().subscribe(
      (data: any) => {
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        let selected = true;
        for (let i = 1; i <= data.last_page; i++) {
          if (i > 1) {
            selected = false;
          }
          this.pagination.push({ number: i, selected: selected });
          console.log(i);
        }
        // this.totalRec = data.total;
        this.inteams = data.data;
        this.raw_teams = data;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  pageChange(event) {
    console.log(event);
    // this.paginate(event);
    console.log(this.last_page_url);
    const arr = this.last_page_url.split('?');
    const selectedUrl = `${arr[0]}?page=${event}`;
    // if (this.filterActive) {
    //   this.infiniteWithFilter(selectedUrl, event)
    // } else {
    //   this.infinite(selectedUrl, event);
    // }
    this.infinite(selectedUrl, event);
  }

  infinite(url, event) {
    this.leadsService.infinit(url).subscribe(
      (data: any) => {
        // this.totalRec = data.total;
        this.inteams = data.data;
        this.last_page_url = data.last_page_url;
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  edit(id) {
    this.router.navigate(['/pages/settings/teams/add/', id]);
  }

  getTeamTree(modal) {

  }

  onOpenTeamTreeModalOpen(id) {
    console.log(id);
    this.teamService.getTreaTree(id).subscribe((res: any) => {
      this.team_tree = res;
      this.team_tree_branch_name = res.branch.name;
      this.team_tree_branch_users = res.branch.users;
      this.team_tree_name = res.parentTeam.name;
      this.team_tree_users = res.parentTeam.users;
      this.team_tree_sub_users = res.subTeams
    }, err => console.log(err));
  }

  onCloseTeamTreeModalModalClose() {
    this.team_tree_branch_name = undefined;
    this.team_tree_branch_users = undefined;
    this.team_tree_name = undefined;
    this.team_tree_users = undefined;
    this.team_tree_sub_users = undefined;
  }

  disableTeam(teamID, teamName) {
    swal({
      title: 'Are you sure?',
      text: `you will disable this team ${teamName} !`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.teamService.disableTeam(teamID).subscribe(
          data => {
            this.getteams();
            swal(
              'Woohoo!',
              `Team ${teamName} disablled successfully`,
              'success'
            );
          },
          err => console.log(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal('Cancelled', '', 'error');
      }
    });
  }

  activeTeam(teamID, teamName) {
    swal({
      title: 'Are you sure?',
      text: `you will enable this team ${teamID} !`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.teamService.enableTeam(teamID).subscribe(
          data => {
            this.getteams();
            swal(
              'Woohoo!',
              `Team ${teamName} has been enabled successfully`,
              'success'
            );
          },
          err => console.log(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal('Cancelled', '', 'error');
      }
    });
  }

}
