import { Component, DoCheck, OnInit } from '@angular/core';
import { UserService } from '../../../services/rest-api/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/rest-api/page.service';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/rest-api/page-admin.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgZone } from '@angular/core';

@Component({
  imports: [FormsModule, CommonModule, PdfViewerModule, NgxExtendedPdfViewerModule],
  selector: 'app-admin-history',
  standalone: true,
  templateUrl: './admin-history.component.html',
  styleUrl: './admin-history.component.css'
})
export class AdminHistoryComponent implements OnInit {
  eventData: any[] = [];
  searchText: string = '';
  pageIndex: number = 0;  // Keeps track of the current page
  pageSize: number = 10;
  sortField: string = 'event_start'; // Default field to sort by (date)
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sorting order
  ascStart = false;
  ascEnd = false;
  ascEvent = false;
  ascDetails = false;
  ascStatus = false;
  errorMessage: string = '';
  isModalOpen = false;
  selectedEvent: any = {}; // Will hold the event to be edited
  disable:boolean=false;
  eventName: string = '';
  eventStart: string = '';
  eventStatus: string = '';
  eventEnd: string = '';
  eventDetails: string = '';
  eventId: string = '';
  eventImage: File | null = null;
  imageFileName: string = '';
  submit:string='false';
  constructor(private ngZone: NgZone, private sanitizer: DomSanitizer, private router: Router, private userService: UserService, private eventService: EventService, private adminService: AdminService) { }

  // Method to handle search text change
  onSearchChange(value: string): void {
    console.log('im changing')
    this.searchText = value;
    this.pageIndex = 0; // Reset pagination to the first page
  }
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.eventImage = target.files[0]; // Set the selected file
      this.imageFileName = this.eventImage.name; // Optionally store the file name
    }
  }

  formatDate(dateStr: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateStr)
      .toLocaleDateString('en-US', options) // Format the date
      .replace(',', ''); // Adjust formatting if needed
  }

  getEventName(eventId: number): string {
    const event = this.eventData.find(event => event.event_id == eventId);
    return event ? event.event_name : 'Unknown Event';
  }

  getEvent() {
    this.adminService.getPastEvent().subscribe((data) => {
      this.eventData = data
    });
  }

  openModal(event: any) {
    this.selectedEvent = { ...event }; // Copy the selected event data
    this.isModalOpen = true;
  }

  get eventStatusModel(): string {
    return this.eventStatus === '1' ? 'active' : this.eventStatus;
  }

  set eventStatusModel(value: string) {
    this.eventStatus = value === 'active' ? '1' : value;
  }

  onStatusChange(newStatus: string): void {
    // Optional: Handle additional logic when the status changes
    console.log('Event Status Changed:', this.eventStatus);
  }

  toLowerCaseSafe(value: string | undefined | null): string {
    return value ? value.toLowerCase() : '';
  }
  // Method to get the current page of transactions
  getEventsToDisplay(): any[] {
    // Filter transactions based on search text
    let filteredEvents = this.eventData.filter((events) =>
      this.toLowerCaseSafe(events.event_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(events.event_start).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(events.event_end).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe('active').includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(events.details).includes(this.toLowerCaseSafe(this.searchText))
    );

    // Now sort the filtered transactions
    filteredEvents = this.sortEvents(filteredEvents);

    // Apply pagination
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return filteredEvents.slice(start, end);
  }


  // Sort transactions by the chosen field and direction
  sortEvents(transactions: any[]): any[] {
    return transactions.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a[this.sortField] > b[this.sortField] ? 1 : -1;
      } else {
        return a[this.sortField] < b[this.sortField] ? 1 : -1;
      }
    });
  }
  
  onSortChange(field: string): void {
    if (this.sortField === field) {
      // Toggle sort direction if the same field is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new field to sort by and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
  // Method to load the next set of transactions
  nextTransaction(): void {
    if (this.pageIndex < (this.eventData.length)) {
      console.log(this.eventData.length / 10);
      console.log(this.pageIndex);
      this.pageIndex++;
    }
  }

  prevTransaction(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }
  isAscending(): boolean {
    return this.sortDirection === 'asc';
  }

  // Optionally, reset to the first page
  resetPage(): void {
    this.pageIndex = 0;
  }

  changeVal(){
    sessionStorage.setItem('submit','false');
    this.submit='false';
  }
  ngOnInit(): void {
    
    if(sessionStorage.getItem('history')!='1'){
      this.router.navigate(['/dashboard-admin']);
    }
    this.getEvent();

  }
}
