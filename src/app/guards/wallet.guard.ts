import { Injectable } from "@angular/core";
import {
  CanActivateChild,
  ActivatedRoute,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import swal from "sweetalert2";

@Injectable()
export class WalletGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (
      userProfile.role == "Admin" ||
      userProfile.role == "Super Development" ||
      userProfile.role == "Property Consultant" ||
      userProfile.role == "Leader" ||
      userProfile.role == "Sales Manager"
    ) {
      return true;
    } else {
      swal("Insufficient Permissions, redirected to home", "", "error");
      this.router.navigate(["pages"]);
      return false;
    }
  }
}
