import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://mapp-thesis.infotech3c.com/services/php-files/'; // Replace with your PHP API URL
 // Adjust with your PHP server URL

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('tokenId');
    return token ? true : false;
  }

  isApplied(): boolean {
    const token = sessionStorage.getItem('tokenId');
    const userId = sessionStorage.getItem('userId');
    const eventId = sessionStorage.getItem('eventId');
    const kioskId = sessionStorage.getItem('kioskId');
    if (token && userId && eventId && kioskId) {
      return true;
    } else {
      return false;
    }
  }
  
  isSelectedEvent(): boolean {
    const token = sessionStorage.getItem('tokenId');
    const userId = sessionStorage.getItem('userId');
    const eventId = sessionStorage.getItem('eventId');
    if (token && userId && eventId) {
      return true;
    } else {
      return false;
    }
  }

  // Optionally, validate the token (if it has expiration or other checks)
  isTokenValid(): boolean {
    const token = sessionStorage.getItem('tokenId');
    if (token) {
      return true;
    }
    return false;
  }


  // Check if the user is logged in
  checkUserLogin(): boolean {
    return this.isLoggedIn() && this.isTokenValid();
  }
  

  // For user registration
  register(email: string, password: string, username: string, fname: string, lname: string, businessName: string, contactNumber: string, tokenId: string): Observable<any> {
    const userData = { email, password, username, fname, lname, businessName, contactNumber, tokenId };
    return this.http.post<{ message: string; token: string }>(`${this.apiUrl}/validation_registration.php`, userData);
  }

  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>(`${this.apiUrl}/users_authentication.php`, credentials);
  }

}

