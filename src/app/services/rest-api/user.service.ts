import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Environment } from '../environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = Environment.userApi; // Replace with your PHP API URL

    constructor(private http: HttpClient) { }

    getUser(tokenId: string): Observable<any[]> {
        const credentials = { tokenId };
        return this.http.post<any>(`${this.apiUrl}/fetch-user.php`, credentials);
    }

    getNotification(tokenId: string): Observable<any[]> {
        const credentials = { tokenId };
        return this.http.post<any[]>(`${this.apiUrl}/fetch-notification.php`, credentials);
    }

    getTransaction(tokenId: string): Observable<any[]> {
        const credentials = { tokenId };
        return this.http.post<any>(`${this.apiUrl}/fetch-transaction.php`, credentials);
    }

    updateMessage(notificationId: number, status: string): Observable<any[]> {
        const credentials = { notificationId, status };
        return this.http.post<any>(`${this.apiUrl}/update-message.php`, credentials);
    }

    submitApplication(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/submit-application.php`, formData);
    }
    submitReference(formId: string, receiptNumber: string): Observable<any> {
        const credentials = { formId, receiptNumber };
        return this.http.post(`${this.apiUrl}/submitReferenceNumber.php`, credentials);
    }
}
