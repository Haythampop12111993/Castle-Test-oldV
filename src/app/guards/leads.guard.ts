import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";

import swal from "sweetalert2";

@Injectable()
export class LeadsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (
      userProfile.role == "G.L Accountant" ||
      userProfile.role == "Treasury Accountant" ||
      userProfile.role == "Contractor"
    ) {
      swal("Insufficient Permissions, redirected to home page", "", "error");
      this.router.navigate(["pages"]);
      return false;
    } else return true;
  }
}
