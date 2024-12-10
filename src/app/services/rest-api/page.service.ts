import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'https://mapp-thesis.infotech3c.com/services/php-files'; // Replace with your PHP API URL

  constructor(private http: HttpClient) { }
  getKioskMap(eventId:string):Observable<any[]> {
    const credential={
      eventId
    }
    return this.http.post<any>(`${this.apiUrl}/fetch-kiosk-map.php`,credential);
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/fetch-events.php');
  }

  getKiosk(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/fetch-kiosk.php`);
  }

  downloadForm(formId: string, firstName: string, lastName: string): void {
    const url = `${this.apiUrl}/create-form.php`;
  
    // Include form_id, firstName, and lastName in the request payload
    const requestData = { formId, firstName, lastName };
    this.http.post(url, requestData, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        // Create a Blob and trigger download
        const blob = new Blob([response], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${firstName}_${lastName}_application_form.pdf`; // Adjust the file extension as needed
        a.click();
        window.URL.revokeObjectURL(downloadUrl); // Clean up URL reference
      },
      (error) => {
        console.error('Error downloading the form:', error);
        alert('Failed to download the form. Please try again later.');
      }
    );
  }
  
}
