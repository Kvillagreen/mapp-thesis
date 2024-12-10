import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private apiUrl = 'https://mapp-thesis.infotech3c.com/services/php-files-admin'; // Replace with your PHP API URL

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + '/fetch-user.php');
    }

    getKiosk(): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/fetch-kiosk.php`);
    }

    getEvent(): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/fetch-events.php`);
    }
    getPastEvent(): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/fetch-past-events.php`);
    }
    
    getSelectedEvent(eventId:number): Observable<any[]> {
        const credentials = { eventId }
        return this.http.post<any>(`${this.apiUrl}/fetch-selected-events.php`,credentials);
    }

    getTransaction(): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}/fetch-transaction.php`);
    }

    getNotification(tokenId: string): Observable<any[]> {
        const credentials = { tokenId }
        return this.http.post<any>(`${this.apiUrl}/fetch-notification.php`, credentials);
    }


    updateStatus(status: any, userId: number, eventId: number, kioskId: number, formId: number,dateRequested:String): Observable<any[]> {
        const credentials = { status, userId, eventId, kioskId, formId,dateRequested }
        return this.http.post<any>(`${this.apiUrl}/update-status.php`, credentials);
    }

    updateUserStatus(status: string, userId: string): Observable<any[]> {
        const credentials = { userId, status }
        return this.http.post<any>(`${this.apiUrl}/update-user-status.php`, credentials);
    }

    updateUserType(userType: string, userId: string): Observable<any[]> {
        const credentials = { userId, userType }
        return this.http.post<any>(`${this.apiUrl}/update-user-type.php`, credentials);
    }

    dynamicController(tokenId: string): Observable<any> {
        const credentials = { tokenId };
        return this.http.post<any>(`${this.apiUrl}/dynamic-control.php`, credentials);
    }

    userControl(userId: number, permission: string, value: boolean): Observable<any[]> {
        const credentials = { userId, permission, value }
        return this.http.post<any>(`${this.apiUrl}/user-control.php`, credentials);
    }

    updateEvents(formData: FormData): Observable<any> {
        console.log(formData.get('eventId'));
        console.log('checked');
        return this.http.post(`${this.apiUrl}/update-events.php`, formData).pipe(
            catchError((error) => {
                console.error('HTTP error:', error);
                return throwError(() => new Error('Submission failed.'));
            })
        );
    }

    updateKiosk(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/update-kiosk.php`, formData).pipe(
            catchError((error) => {
                console.error('HTTP error:', error);
                return throwError(() => new Error('Submission failed.'));
            })
        );
    }

    getKioskMap(eventId: string): Observable<any[]> {
        const credentials = { eventId }
        console.log(eventId);
        return this.http.post<any>(`${this.apiUrl}/fetch-kiosks-map.php`, credentials);
    }

    disableEvent(eventId: string): Observable<any[]> {
        const credentials = { eventId }
        return this.http.post<any>(`${this.apiUrl}/update-event-status.php`, credentials);
    }

    createEvents(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/add-events.php`, formData).pipe(
            catchError((error) => {
                console.error('HTTP error:', error);
                return throwError(() => new Error('Submission failed.'));
            })
        );
    }

    getEventsReport(eventId: number): Observable<any[]> {
        console.log(eventId);
        const credentials = { eventId }
        return this.http.post<any>(`${this.apiUrl}/fetch-events-report.php`, credentials);
    }

    getBusinessReport(eventId: number): Observable<any[]> {
        console.log(eventId);
        const credentials = { eventId }
        return this.http.post<any>(`${this.apiUrl}/fetch-business.php`, credentials);
    }

    getKioskReport(eventId: number): Observable<any[]> {
        console.log(eventId);
        const credentials = { eventId }
        return this.http.post<any>(`${this.apiUrl}/fetch-kiosk-business.php`, credentials);
    }

}