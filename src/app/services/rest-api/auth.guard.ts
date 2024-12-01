// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const userType = sessionStorage.getItem('userType');
    if (this.authService.checkUserLogin()&&userType=='user') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  cantLogin(): boolean {
    if (!this.authService.checkUserLogin()) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
