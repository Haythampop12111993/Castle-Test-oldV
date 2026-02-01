import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class BrokerAccessGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    let userProfile = JSON.parse(window.localStorage.getItem('userProfile'));
    
    // List of routes that Broker role is allowed to access
    // This guard is used on routes where we want to specifically allow Broker
    // along with other roles that normally have access
    const allowedRoutes = [
      'projects',
      'payment-generator', 
      'custom-payment-generator',
      'list-custom-payments'
    ];
    
    // Allow Broker role to pass this guard
    // This guard should be used alongside other guards to specifically allow Broker access
    if (userProfile.role == 'Broker') {
      return true;
    }
    
    // For non-Broker roles, allow them to pass (other guards will handle their restrictions)
    return true;
  }
}