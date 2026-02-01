import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class RolesService {
  _role: BehaviorSubject<any> = new BehaviorSubject(null);
  role$: Observable<any> = this._role.asObservable();

  constructor(private http: HttpClient) {}

  getListingRoles(name?) {
    let url = '';
    url = name ? `/users/roles?name=${name}` : `/users/roles`;
    return this.http.get(url);
  }
  getRoles() {
    return this.http.get(`/users/getRoles`);
  }
  getRole(id) {
    return this.http.get(`/users/roles/${id}`);
  }
  getPermissions(name?) {
    // return  this.http.get(`/users/permissions`);
    let url = '';
    url = name ? `/users/permissions?name=${name}` : `/users/permissions`;
    return this.http.get(url);
  }
  saveRole(payload) {
    return this.http.post(`/users/roles `, payload);
  }
  deleteRole(id) {
    return this.http.delete(`/users/roles/${id}`);
  }
  editRole(id, payload) {
    return this.http.put(`/users/roles/${id}`, payload);
  }

  setCurrentRole(data: any) {
    this._role.next(data);
  }
}
