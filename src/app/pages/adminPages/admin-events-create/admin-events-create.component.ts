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
  selector: 'app-admin-events-create',
  standalone: true,
  imports: [FormsModule, CommonModule, PdfViewerModule, NgxExtendedPdfViewerModule],
  templateUrl: './admin-events-create.component.html',
  styleUrl: './admin-events-create.component.css'
})
export class AdminEventsCreateComponent implements OnInit {
  errorMessage: string = '';
  isModalOpen = false;
  created: boolean = false;
  eventName: string = '';
  eventStart: string = '';
  eventEnd: string = '';
  eventDetails: string = '';
  eventImage: File | null = null;
  imageFileName: string = '';
  constructor(private router: Router, private adminService: AdminService) { }


  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.eventImage = target.files[0]; // Set the selected file
      this.imageFileName = this.eventImage.name; // Optionally store the file name
    }
  }


  openModal(event: any) { // Copy the selected event data
    this.isModalOpen = true;
  }

  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Function to handle form submission (save changes)
  onSubmit() {
    // Perform date validations
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
    formData.append('eventName', this.eventName);
    formData.append('eventStart', this.eventStart);
    formData.append('eventEnd', this.eventEnd);
    formData.append('details', this.eventDetails);
  
    // Check if image file exists and append it to the FormData
    if (this.eventImage) {
      formData.append('eventImage', this.eventImage, this.eventImage.name);
    }
  
    // Call service method to create the event
    this.adminService.createEvents(formData).subscribe({
      next: (response) => {
        console.log(response.message, response.success);
        if (response.success) {
          console.log('Event created successfully.');
          this.created=true;
        }
      },
      error: (error) => {
        this.errorMessage = 'Error submitting the event. Please try again.';
        console.error(error);
      }
    });
  }
  

  eventCreated() {
    this.created = !this.created;
    this.closeModal();
    this.eventName = '';
    this.eventStart = '';
    this.eventEnd = '';
    this.eventDetails = '';
    this.eventImage = null;
    this.imageFileName = '';
    window.location.reload();
  }



  ngOnInit(): void {
    if(sessionStorage.getItem('events')!='1'){
      this.router.navigate(['/dashboard-admin']);
    }
  }
}
