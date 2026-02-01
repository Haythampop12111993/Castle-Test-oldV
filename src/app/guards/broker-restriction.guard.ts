import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import swal from "sweetalert2";

@Injectable()
export class BrokerRestrictionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (userProfile.role == "Broker") {
      swal("Access Denied", "You don't have permission to access this area", "error");
      this.router.navigate(["pages/projects"]);
      return false;
    }
    return true;
  }
}