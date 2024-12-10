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
  selector: 'app-admin-events-manage',
  standalone: true,
  templateUrl: './admin-events-manage.component.html',
  styleUrl: './admin-events-manage.component.css'
})
export class AdminEventsManageComponent implements OnInit {
  eventData: any[] = [];
  searchText: string = '';
  loading: boolean = false;
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
  disable: boolean = false;
  eventName: string = '';
  eventStart: string = '';
  eventStatus: string = '';
  eventEnd: string = '';
  eventDetails: string = '';
  eventId: string = '';
  eventImage: File | null = null;
  imageFileName: string = '';
  submit: string = 'false';
  onlyOnce: boolean = false
  constructor(private ngZone: NgZone, private sanitizer: DomSanitizer, private router: Router, private userService: UserService, private eventService: EventService, private adminService: AdminService) { }

  getDynamicImagePath(imageName: string): string {
    const basePath = '/dbAssets/eventImages/';
    const timestamp = new Date().getTime(); // Generate a unique timestamp
    return `${basePath}${imageName}?t=${timestamp}`; // Add a query parameter
  }

  getSanitizedImagePath(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  eventDisable() {
    this.adminService.disableEvent(this.eventId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.closeModal();
          this.eventId = '';
          this.eventName = '';
          this.eventStart = '';
          this.eventEnd = '';
          this.eventStatus = '';
          this.eventDetails = '';
          this.eventImage = null;
          this.imageFileName = '';
          window.location.reload();
        }
      },
      error: (error) => {
        this.errorMessage = 'Error submitting the application. Please try again.';
        console.error(error);
      }
    });
  }
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
    this.adminService.getEvent().subscribe((data) => {
      this.eventData = data
    });
  }

  openModal(event: any) {
    this.selectedEvent = { ...event }; // Copy the selected event data
    this.isModalOpen = true;
  }

  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Function to handle form submission (save changes)

  onSubmit() {
    const currentDate = new Date();
    const startDate = new Date(this.eventStart);
    const endDate = new Date(this.eventEnd);

    // Check if the start and end dates are the same
    if (startDate.getTime() === endDate.getTime()) {
      this.errorMessage = 'The start and end dates cannot be the same.';
      return; // Prevent form submission
    }

    // Check if the end date is earlier than the start date
    if (endDate < startDate) {
      this.errorMessage = 'The end date must be later than the start date.';
      return; // Prevent form submission
    }

    // Check if the start date is before the current date
    if (startDate < currentDate) {
      this.errorMessage = 'The start date must be in the future.';
      return; // Prevent form submission
    }

    // Check if the end date is before the current date
    if (endDate < currentDate) {
      this.errorMessage = 'The end date must be in the future.';
      return; // Prevent form submission
    }
    const formData = new FormData();

    // Append form data (strings and numbers)
    formData.append('eventId', this.eventId);
    formData.append('eventName', this.eventName);
    formData.append('eventStart', this.eventStart);
    formData.append('eventEnd', this.eventEnd);
    formData.append('status', this.eventStatus);
    formData.append('details', this.eventDetails);
    // Check if image file exists and append it to the FormData

    if (this.eventImage) {
      formData.append('eventImage', this.eventImage, this.eventImage.name);
    }
    if (this.onlyOnce == false) {
      this.onlyOnce = true
      // Call service method to update the event
      this.loading = true;
      this.adminService.updateEvents(formData).subscribe({
        next: (response) => {

          this.loading = false;
          console.log(response.message, response.success);
          if (response.success) {
            console.log('Event updated successfully.');
            console.log('Event Name:', formData.get('eventName'));
            console.log('Event ID:', formData.get('eventId'));
            sessionStorage.setItem('submit', 'true');
            this.closeModal();
            this.eventId = '';
            this.eventName = '';
            this.eventStart = '';
            this.eventEnd = '';
            this.eventStatus = '';
            this.eventDetails = '';
            this.eventImage = null;
            this.imageFileName = '';
            this.onlyOnce = false
            window.location.reload();
          }
        },
        error: (error) => {
          this.onlyOnce = false
          this.errorMessage = 'Error submitting the application. Please try again.';
          console.error(error);
        }
      });
    }
    // Close the modal after submission
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
      this.toLowerCaseSafe(this.formatDate(events.event_start)).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(this.formatDate(events.event_end)).includes(this.toLowerCaseSafe(this.searchText)) ||
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
  updateStatus(userId: number, userStatus: string) {
    console.log(userId, userStatus)

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

  changeVal() {
    sessionStorage.setItem('submit', 'false');
    this.submit = 'false';
  }
  ngOnInit(): void {

    if (sessionStorage.getItem('events') != '1') {
      this.router.navigate(['/dashboard-admin']);
    }
    this.submit = sessionStorage.getItem('submit') ?? '';
    this.getEvent();

  }
}
