import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    if (window.localStorage.getItem('token') && window.localStorage.getItem('userProfile')) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
