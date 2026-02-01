import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import swal from "sweetalert2";

@Injectable()
export class BlockRequestListGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (
      userProfile.role != "Admin" &&
      userProfile.role != "Super Development"
    ) {
      swal("Insufficient Permissions, redirected to home page", "", "error");
      this.router.navigate(["pages"]);
      return false;
    } else return true;
  }
}
