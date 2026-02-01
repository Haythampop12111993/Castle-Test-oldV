import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRoute,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem('userProfile'));
    if (userProfile) {
      // swal('Insufficient Permissions, redirected to home page', '', 'error');
      this.router.navigate(['pages']);
      return false;
    } else return true;
  }
}
