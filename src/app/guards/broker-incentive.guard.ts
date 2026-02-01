import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivate, Router } from "@angular/router";
import swal from "sweetalert2";

@Injectable()
export class BrokerIncentiveGuard implements CanActivate {
  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem("userProfile"));
    console.log(this._activatedRoute.url);
    if (userProfile.role == "Broker Incentive") {
      this.router.navigate(["pages/addLead/0"]);
      return false;
    } else return true;
  }
}
