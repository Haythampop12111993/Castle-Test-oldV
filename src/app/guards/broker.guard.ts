import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class BrokerGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem('userProfile'));
    
    // This guard allows ONLY Broker role to access the route
    if (userProfile.role == 'Broker') {
      return true;
    } else {
      // Other roles are not allowed where this guard is applied
      swal('Access Restricted', 'This area is restricted to Broker role only', 'error');
      this.router.navigate(['pages']);
      return false;
    }
  }
}