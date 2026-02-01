import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";

import swal from "sweetalert2";

@Injectable()
export class AddProjectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (
      userProfile.role == "Admin" ||
      userProfile.role == "Super Development" ||
      userProfile.role == "Moderator" ||
      userProfile.role == "Super Moderator" ||
      userProfile.role == "Development Director"
    ) {
      return true;
    } else {
      swal("Insufficient Permissions, redirected to home page", "", "error");
      this.router.navigate(["pages"]);
      return false;
    }
  }
}
