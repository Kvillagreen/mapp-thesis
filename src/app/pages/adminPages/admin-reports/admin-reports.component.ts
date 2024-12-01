import { Component, OnInit, DoCheck } from '@angular/core';
import { AdminService } from '../../../services/rest-api/page-admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPrintModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css'], // Note: Use "styleUrls" for multiple stylesheets
})
export class AdminReportsComponent implements OnInit, DoCheck {
  eventData: any[] = [];
  userData: any[] = [];
  kioskData: any[] = [];
  eventReportData: any[] = [];
  transactionData: any[] = [];
  businessData: any[] = [];
  kioskReportData: any[] = [];
  finishedTransaction: number = 0;
  approvedUser: number = 0;
  activeEvents: number = 0;
  selectedEventId: string = '';
  itemsPerPage: number = 5;
  pageOptions: number[] = [5, 10, 15, 20];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is authorized to view this page
    if (sessionStorage.getItem('reports') !== '1') {
      this.router.navigate(['/dashboard-admin']);
      return;
    }

    // Fetch all required data
    this.loadAllData();
  }

  ngDoCheck(): void {
    // Placeholder for additional checks if needed
  }

  // Consolidated method to load all data
  private loadAllData(): void {
    combineLatest([
      this.adminService.getEvent(),
      this.adminService.getTransaction(),
      this.adminService.getUsers(),
      this.adminService.getKiosk(),
    ]).subscribe(
      ([events, transactions, users, kiosks]) => {
        // Handle event data
        this.eventData = events.map(event => ({
          event_id: event.event_id,
          event_name: event.event_name,
          status: event.status,
        }));
        this.activeEvents = this.eventData.filter(event => event.status === '1').length;

        // Handle transaction data
        this.transactionData = transactions;
        this.finishedTransaction = this.transactionData.filter(
          transaction => transaction.status === 'finished'
        ).length;

        // Handle user data
        this.userData = users;
        this.approvedUser = this.userData.filter(user => user.status === '1').length;

        // Handle kiosk data
        this.kioskData = kiosks;
      },
      error => console.error('Error loading data:', error)
    );

    this.getBusinessReport();
    this.getEventReport();
    this.getKioskBusiness();
  }

  // Handle event selection
  onEventSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEventId = selectElement.value;

    // Store the selected event ID and name in sessionStorage
    const selectedEvent = this.eventData.find(event => event.event_id === selectedEventId);
    if (selectedEvent) {
      sessionStorage.setItem('eventIdMap', selectedEventId);
      sessionStorage.setItem('eventNameMap', selectedEvent.event_name);
      sessionStorage.setItem('eventIdReport', selectedEventId);
    } else {
      console.log('Event not found.');
    }

    // Reload the page to reflect the selected event
    window.location.reload();
  }

  // Helper to get the stored event ID
  private getStoredEventId(): number | null {
    const eventId = sessionStorage.getItem('eventIdReport');
    return eventId ? parseInt(eventId, 10) : null;
  }

  // Fetch business report data
  getBusinessReport(): void {
    const eventId = this.getStoredEventId();
    if (eventId) {
      this.adminService.getBusinessReport(eventId).subscribe(data => {
        this.businessData = data;
      });
    }
  }

  // Fetch kiosk business data
  getKioskBusiness(): void {
    const eventId = this.getStoredEventId();
    if (eventId) {
      this.adminService.getKioskReport(eventId).subscribe(data => {
        this.kioskReportData = data;
      });
    }
  }

  // Fetch event report data
  getEventReport(): void {
    const eventId = this.getStoredEventId();
    if (eventId) {
      this.adminService.getEventsReport(eventId).subscribe(data => {
        this.eventReportData = data;
      });
    }
  }

  // Format date to a readable format
  formatDate(dateStr: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateStr)
      .toLocaleDateString('en-US', options)
      .replace(',', ''); // Adjust formatting if needed
  }

  // Get event name for the dropdown placeholder
  getEventName(): string {
    return sessionStorage.getItem('eventNameMap') ?? 'Select events';
  }
}
