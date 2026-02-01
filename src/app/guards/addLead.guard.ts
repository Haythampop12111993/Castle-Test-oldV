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
export class AddLeadGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    if (
      userProfile.role == "A.R Accountant" ||
      userProfile.role == "Treasury Accountant" ||
      userProfile.role == "Marketing" ||
      userProfile.role == "Contractor"
    ) {
      swal("Insufficient Permissions, redirected to home", "", "error");
      this.router.navigate(["pages"]);
      return false;
    } else return true;
  }
}
