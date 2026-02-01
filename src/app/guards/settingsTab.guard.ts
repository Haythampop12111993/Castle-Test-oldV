import { Injectable } from "@angular/core";
import { CanActivate, Router, CanLoad } from "@angular/router";
import swal from "sweetalert2";

@Injectable()
export class SettingTabGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (
      userProfile.role != "Admin" &&
      userProfile.role != "Super Development"
    ) {
      swal("Insufficient Permissions, redirected to home page", "", "error");
      this.router.navigate(["pages"]);
      return false;
    } else {
      return true;
    }
  }

  canLoad(): boolean {
    const userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (userProfile.role != "Admin") {
      swal("Insufficient Permissions, redirected to home page", "", "error");
      this.router.navigate(["pages"]);
      return false;
    } else {
      return true;
    }
  }
}
