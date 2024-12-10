import { Component, OnInit, ElementRef, DoCheck, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { AuthService } from '../../../services/rest-api/auth.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/rest-api/user.service';
import emailjs from 'emailjs-com';
import { CalendarUserComponent } from '../calendar-user/calendar-user.component';
@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [FormsModule, CommonModule, CalendarUserComponent],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'] // Ensure this is correct path
})

export class ApplicationFormComponent implements OnInit, DoCheck, AfterViewInit {

  userName: string = '';
  eventName: string = '';
  kioskName: string = '';
  purpose: string = '';
  loiFile: File | null = null;
  loiFileName: string = 'initial';
  mayorsPermit: File | null = null;
  mayorsPermitName: string = 'initial';
  businessPermit: File | null = null;
  businessPermitName: string = 'initial';
  sanitaryPermit: File | null = null;
  sanitaryPermitName: string = 'initial';
  dateRequested: string = '';
  successMessage = '';
  errorMessage: string = '';
  tokenId: string = '';
  userId: string = '';
  eventId: string = '';
  kioskId: string = '';
  othersValue: string = '';
  startDate: string = '';
  endDate: string = '';
  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  check4: boolean = false;
  others: boolean = false;
  fileChecker: boolean = false;
  load: boolean = false;
  calendarVisible: boolean = false;
  minDate: string = '';
  maxDate: string = '';
  numberOfDates: number = 0;
  listOfDates: string = '';
  listOfRequirements: string[] = [];

  @ViewChild('calendar') calendar!: ElementRef;

  ngAfterViewInit() {
    // Add a global click listener after the view is initialized
    this.renderer.listen('document', 'click', (event) => this.onClickOutside(event));
  }
  constructor(
    private authService: AuthService,
    public router: Router,
    private userService: UserService, 
    private renderer: Renderer2
  ) { }

  dateFormatter(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month and pad
    const day = String(date.getDate()).padStart(2, '0'); // Use getDate for day of the month
    return `${year}-${month}-${day}`;
  }

  onClickOutside(event: MouseEvent) {
    if (this.calendar && !this.calendar.nativeElement.contains(event.target) && this.calendarVisible == true) {
      this.calendarVisible = false;

    } else {
      event.stopPropagation();
    }
  }
  ngOnInit(): void {
    
    sessionStorage.setItem('listOfDates', '');
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.eventName = sessionStorage.getItem('eventName') ?? '';
    this.kioskName = sessionStorage.getItem('kioskName') ?? '';
    this.userId = sessionStorage.getItem('userId') ?? '';
    this.kioskId = sessionStorage.getItem('kioskId') ?? '';
    this.eventId = sessionStorage.getItem('eventId') ?? '';
    this.startDate = sessionStorage.getItem('eventStart') ?? '';
    this.endDate = sessionStorage.getItem('eventEnd') ?? '';
    this.minDate = this.dateFormatter(this.startDate);
    this.maxDate = this.dateFormatter(this.endDate);
  }

  handleFileChange(event: Event, checkerNumber: string): void {
    const input = event.target as HTMLInputElement;
    console.log(checkerNumber)
    if (input && input.files && input.files.length > 0) {
      if (checkerNumber == '1') {
        this.loiFile = input.files[0]; // Capture the first file
        this.loiFileName = input.files[0].name; // Update file name
        console.log('loiFileName')
      } if (checkerNumber == '2') {
        this.businessPermit = input.files[0]; // Capture the first file
        this.businessPermitName = input.files[0].name; // Update file name
        console.log('businessPermit')
      } if (checkerNumber == '3') {
        this.mayorsPermit = input.files[0]; // Capture the first file
        this.mayorsPermitName = input.files[0].name; // Update file name
        console.log('mayorsPermit')
      } if (checkerNumber == '4') {
        this.sanitaryPermit = input.files[0]; // Capture the first file
        this.sanitaryPermitName = input.files[0].name; // Update file name
        console.log('sanitaryPermit')
      }
    }

    this.fileChecker = false;
  }



  ngDoCheck() {
    if (this.calendarVisible) {
      this.listOfDates = sessionStorage.getItem('listOfDates') ?? '';
      if (this.listOfDates) {
        this.numberOfDates = this.listOfDates.split(',').length;
      }
      else {
        this.numberOfDates = 0
      }
    }

  }
  checkBox(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    if (isChecked && input.value != 'others') {
      this.listOfRequirements.push(input.value)
    }
    if (!isChecked && input.value != 'others') {
      const index = this.listOfRequirements.indexOf(input.value);
      this.listOfRequirements.splice(index, 1);
    }

    console.log(this.listOfRequirements.toString())
    this.fileChecker = false;
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


  formatSelectDate(dateStr: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    return new Date(dateStr)
      .toLocaleDateString('en-US', options) // Format the date
      .replace(',', ''); // Adjust formatting if needed
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.listOfDates = sessionStorage.getItem('listOfDates') ?? '';
    if (this.fileChecker == false) {
      // Checking if all necessary fields are filled
      if (!this.userId || !this.kioskId || !this.eventId || !this.loiFileName || !this.purpose || !this.listOfDates || this.others && !this.othersValue) {
        this.errorMessage = 'All fields are required!';
        this.load = false;
        return;
      }

      // Validate if the dateRequested is in the future
      const currentDate = new Date();
      const requestedDate = new Date(this.dateRequested);
      const eventStart = new Date(this.startDate);
      const eventEnd = new Date(this.endDate);

      if (requestedDate < currentDate) {
        this.errorMessage = 'The requested date must be in the future!';
        this.load = false;
        return;
      }

      console.log(eventStart)
      console.log(requestedDate >= eventEnd)
      console.log(requestedDate <= eventStart)
      if (requestedDate <= eventStart || requestedDate >= eventEnd) {
        this.errorMessage = 'The requested date must between ' + this.formatDate(this.startDate).toString() + ' and ' + this.formatDate(this.endDate).toString();
        this.load = false; return;
      }


      // Prepare form data for submission
      this.listOfRequirements.push(this.othersValue);
      const formData = new FormData();

      formData.append('userId', this.userId);
      formData.append('eventId', this.eventId);
      formData.append('userName', this.userName);
      formData.append('kioskName', this.kioskName);
      formData.append('kioskId', this.kioskId);
      formData.append('rentDate', this.listOfDates);
      formData.append('requirements', this.listOfRequirements.toString());
      formData.append('purpose', this.purpose);

      // Add the file to the form data if it exists
      if (this.loiFile) {
        formData.append('loi', this.loiFile, this.loiFile.name);
      }
      if (this.businessPermit) {
        formData.append('businessPermit', this.businessPermit, this.businessPermit.name);
      }
      if (this.mayorsPermit) {
        formData.append('mayorsPermit', this.mayorsPermit, this.mayorsPermit.name);
      }
      if (this.sanitaryPermit) {
        formData.append('sanitaryPermit', this.sanitaryPermit, this.sanitaryPermit.name);
      }

      this.load = true;
      this.userService.submitApplication(formData).subscribe({
        next: (response) => {
          this.load = false;
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
  }

  backMap() {
    sessionStorage.removeItem('kioskId');
    sessionStorage.removeItem('kioskName');
    this.router.navigate(['/map-viewer']);
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
