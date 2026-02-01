import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TeamService {

  private _getaccounts = '/api/accounts';
  baseUrl: string = environment.api_base_url;
  // baseUrl: string = 'http://192.168.8.100:8000/api/';

  constructor(private http: HttpClient) { }

  getTeams(): any {
    return this.http.get(`${this.baseUrl}teams`);
  }

  getTeamsParent(): any {
    return this.http.get(`${this.baseUrl}teams?parent=true`);
  }

  getTeam(id) {
    return this.http.get(`${this.baseUrl}teams/${id}`);
  }

  getmembers(): any {
    return this.http.get(`${this.baseUrl}users/get_agents_for_teams`);
  }

  save(team) {
    return this.http.post(`${this.baseUrl}teams`, team);
  }

  update(id , team) {
    return this.http.patch(`${this.baseUrl}teams/${id}`, team);
  }

  getTreaTree(team_id) {
    return this.http.get(`${this.baseUrl}teams/${team_id}/show_team_tree`);
  }

  disableTeam(teamId){
    return this.http.put(`${this.baseUrl}teams/${teamId}/disable`, JSON.stringify({}));
  }

  enableTeam(teamId){
    return this.http.put(`${this.baseUrl}teams/${teamId}/enable`, JSON.stringify({}));
  }

  getOccasions(type) {
    return this.http.get(`${this.baseUrl}occasions?type=${type}`);
  }

  addOccasion(payload) {
    return this.http.post(`${this.baseUrl}occasions`, JSON.stringify(payload));
  }

  getSingleOccasion(id) {
    return this.http.get(`${this.baseUrl}occasions/${id}`);
  }

  editOccasion(id, payload) {
    return this.http.put(`${this.baseUrl}occasions/${id}`, JSON.stringify(payload));
  }

  changeStatusOccasion(id) {
    return this.http.put(`${this.baseUrl}occasions/${id}/change_status`, {});
  }

}
