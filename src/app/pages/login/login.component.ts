import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/rest-api/auth.service';

import { FormsModule } from '@angular/forms';
import { AdminGuard } from '../../services/rest-api/auth.adminGuard';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  password: string = '';
  errorMessage: string = '';
  signingIn = false;
  email: string = '';
  rememberMe: boolean = false;
  tokenIdTemp: string = '';
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  userId: string = '';

  userType: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  change() {
    this.rememberMe = !this.rememberMe;
  }



  goToSignup() {
    this.router.navigate(['../register']);
  }

  onLogin(): void {
    sessionStorage.setItem('runOnce', 'false');
    this.signingIn = true;
    if (this.email == '' || this.password == '') {
      this.errorMessage = 'Email and password must not be empty';
      this.signingIn = false;
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: (response: any) => {
          if (response.success && response.tokenId) {
            if (response.userType == "user" && response.status == 1) {
              this.tokenIdTemp = response.tokenId;
              this.userName = response.user.username;
              this.firstName = response.user.firstname;
              this.lastName = response.user.lastname;
              this.userId = response.user.userId;
              this.email = response.user.email;
              this.userType = response.userType;
              sessionStorage.setItem('tokenId', this.tokenIdTemp.toString());
              sessionStorage.setItem('userName', this.userName.toString());
              sessionStorage.setItem('firstName', this.firstName.toString());
              sessionStorage.setItem('lastName', this.lastName.toString());
              sessionStorage.setItem('userId', this.userId.toString());
              sessionStorage.setItem('email', this.email.toString());
              sessionStorage.setItem('userType', this.userType.toString());
              
              setInterval(() => {
                this.signingIn = false;
                sessionStorage.setItem('runOnce', 'false');
                this.router.navigate(['/dashboard']);
              }, 200);
            }
            else if (response.userType == "admin" && response.status == 1 || response.userType == "IGP" && response.status == 1 || response.userType == "EX-Director" && response.status == 1) {
              this.tokenIdTemp = response.tokenId;
              this.userName = response.user.username;
              this.firstName = response.user.firstname;
              this.lastName = response.user.lastname;
              this.userId = response.user.userId;
              this.email = response.user.email;
              this.userType = response.userType;
              
              const events =response.events;
              const transactions =response.transactions;
              const reports =response.reports;
              const settings =response.settings;
              const control =response.control;
              const history =response.history;
              sessionStorage.setItem('events', events);
              sessionStorage.setItem('transactions',transactions );
              sessionStorage.setItem('reports',reports );
              sessionStorage.setItem('settings',settings );
              sessionStorage.setItem('control',control );
              sessionStorage.setItem('history',history );
              console.log(reports,events,transactions,settings,history,control)
              sessionStorage.setItem('tokenId', this.tokenIdTemp.toString());
              sessionStorage.setItem('userName', this.userName.toString());
              sessionStorage.setItem('firstName', this.firstName.toString());
              sessionStorage.setItem('lastName', this.lastName.toString());
              sessionStorage.setItem('userId', this.userId.toString());
              sessionStorage.setItem('email', this.email.toString());
              sessionStorage.setItem('userType', this.userType.toString());
              setInterval(() => {
                this.signingIn = false;
                sessionStorage.setItem('runOnce', 'false');
                this.router.navigate(['/dashboard-admin']);
              }, 200);
            }
            else {
              setInterval(() => {
                this.signingIn = false;
                if (response.status == 0) {
                  this.errorMessage = 'Request is still pending';
                }
                else if  (response.status == 2) {
                  this.errorMessage = 'Request denied';
                }  // This triggers the next slide
              }, 200);
            }
            // Redirect to dashboard or home
          } else {
            setInterval(() => {
              this.signingIn = false;
              this.errorMessage = response.message;  // This triggers the next slide
            }, 200);
            console.log(this.errorMessage);
          }
        },
        error: (error: any) => {
          this.errorMessage = 'There was an error with the login request.';
        },
        complete: () => {

        }
      });
    }
  }

  ngOnInit(): void {

  }
}
