import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/rest-api/auth.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/rest-api/user.service';
import emailjs from 'emailjs-com';
@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'] // Ensure this is correct path
})
export class ApplicationFormComponent implements OnInit {

  userName: string = '';
  eventName: string = '';
  kioskName: string = '';
  purpose: string = '';
  loiFile: File | null = null;
  loiFileName: string = '';
  dateRequested: string = '';
  successMessage = '';
  errorMessage: string = '';
  tokenId: string = '';
  userId: string = '';
  eventId: string = '';
  kioskId: string = '';

  constructor(
    private authService: AuthService,
    public router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('userType') == 'admin') {
      this.router.navigate(['/dashboard-admin']);
    }
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.eventName = sessionStorage.getItem('eventName') ?? '';
    this.kioskName = sessionStorage.getItem('kioskName') ?? '';
    this.userId = sessionStorage.getItem('userId') ?? '';
    this.kioskId = sessionStorage.getItem('kioskId') ?? '';
    this.eventId = sessionStorage.getItem('eventId') ?? '';
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.loiFile = input.files[0]; // Capture the first file
      this.loiFileName = input.files[0].name; // Update file name
    } else {
      this.loiFile = null; // No file selected
      this.loiFileName = ''; // Clear file name if no file is selected
    }
  }

  onSubmit(): void {
    // Checking if all necessary fields are filled
    if (!this.userId || !this.kioskId || !this.eventId || !this.loiFileName || !this.purpose || !this.dateRequested) {
      this.errorMessage = 'All fields are required!';
      return; // Early return to avoid unnecessary processing
    }
    // Validate if the dateRequested is in the future
    const currentDate = new Date();
    const requestedDate = new Date(this.dateRequested);

    if (requestedDate <= currentDate) {
      this.errorMessage = 'The requested date must be in the future!';
      return; 
    }
    // Prepare form data for submission
    const formData = new FormData();
    formData.append('userId', this.userId);
    formData.append('eventId', this.eventId);
    formData.append('kioskId', this.kioskId);
    formData.append('dateRequested', this.dateRequested);
    formData.append('purpose', this.purpose);

    // Add the file to the form data if it exists
    if (this.loiFile) {
      formData.append('loi', this.loiFile, this.loiFile.name);
    }

    // Log form data for debugging
    console.log(formData.get('userId'));
    console.log(formData.get('eventId'));
    console.log(formData.get('kioskId'));
    console.log(formData.get('dateRequested'));
    console.log(formData.get('purpose'));
    console.log(formData.get('loi'));

    // Call the service to submit the form
    this.userService.submitApplication(formData).subscribe({
      next: (response) => {
        console.log(response.message, response.success);
        if (response.success) {
          this.successMessage = 'success';
          emailjs.send("service_l1qrwc6", "template_bm2axpf", {
            from_name: sessionStorage.getItem('firstName') ?? '' + sessionStorage.getItem('lastName') ?? '',
            from_kiosk: this.kioskName,
            from_event: this.eventName,
            from_email: sessionStorage.getItem('email') ?? '',
            submission_date: new Date().toLocaleString(),
          }, 'Tv0xOXxLvWH60MEV_').then((result) => {
            console.log('Email sent successfully!', result.text);
          })
            .catch((error) => {
              console.error('Email sending failed:', error);
            });
          this.resetForm();
        }
      },
      error: (error) => {
        this.errorMessage = 'Error submitting the application. Please try again.';
        console.error(error);
      }
    });
  }

  // Reset form fields after successful submission
  resetForm(): void {
    // Clearing session storage and resetting form data
    sessionStorage.removeItem('eventId');
    sessionStorage.removeItem('kioskId');
    sessionStorage.removeItem('eventName');
    sessionStorage.removeItem('kioskName');

    // Resetting the form fields
    this.userName = '';
    this.eventName = '';
    this.kioskName = '';
    this.purpose = '';
    this.loiFile = null;
    this.loiFileName = '';
    this.dateRequested = '';
    this.tokenId = '';
    this.userId = '';
    this.eventId = '';
    this.kioskId = '';
  }
}
