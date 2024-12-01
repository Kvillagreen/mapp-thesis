
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PreventLoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.checkUserLogin()) {
      // If the user is logged in, redirect them to the dashboard
      this.router.navigate(['/dashboard']);
      return false;  // Prevent navigation to login/register pages
    }
    return true;  // Allow access to login/register pages
  }
}
