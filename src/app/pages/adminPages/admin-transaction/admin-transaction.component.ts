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
import emailjs from 'emailjs-com';
import { CalendarUserComponent } from '../../userPages/calendar-user/calendar-user.component';
@Component({
  imports: [FormsModule, CommonModule, PdfViewerModule, NgxExtendedPdfViewerModule, CalendarUserComponent],
  selector: 'app-admin-transaction',
  standalone: true,
  templateUrl: './admin-transaction.component.html',
  styleUrl: './admin-transaction.component.css'
})

export class AdminTransactionComponent implements OnInit {
  userTransaction: any[] = [];
  eventData: any[] = [];
  kioskData: any[] = [];
  token: string = '';
  firstName: string = '';
  lastName: string = '';
  searchText: string = '';
  pageIndex: number = 0;  // Keeps track of the current page
  pageSize: number = 10;
  sortField: string = 'date_req'; // Default field to sort by (date)
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sorting order
  ascStatus = false;
  ascEvent = false;
  ascKiosk = false;
  ascRefNum = false;
  ascUsername = false;
  reference: string = '';
  checkerReference: boolean = false;
  ascPurpose = false;
  ascDate = false;
  ascReq = false;
  referenceNumber: boolean = false;
  errorMessage: string = '';
  viewPdf: boolean = false;
  selectorDate: boolean = false;
  loading: boolean = false;
  updatedRequestedDate: boolean = false;
  viewUser: boolean = false;
  statusOptions = ['pending', 'approved', 'denied', 'finished', 'paid'];
  pdfError: boolean = false;
  dateRequested: string = '';
  maxDate: string = '';
  minDate: string = '';
  status: string = '';
  userId: number = 0;
  eventId: number = 0;
  kioskId: number = 0;
  formId: number = 0;
  viewUserName: string = '';
  viewDate: string = '';
  viewEvent: string = '';
  viewKiosk: string = '';
  viewPurpose: string = '';
  viewThings: string = '';
  viewReceipt: string = '';
  viewDateRequested: string = '';
  viewMayors: string = '';
  viewSanitary: string = '';
  viewBusiness: string = '';
  userEmail: string = '';
  pdfUrl: SafeResourceUrl = '';
  counter: number = 0
  constructor(private sanitizer: DomSanitizer, private router: Router, private userService: UserService, private eventService: EventService, private adminService: AdminService) { }
  selectedOption: string = '';

  /*if (this.selectedOption == 'approved') {
              emailjs.send("service_yb4nng9", "template_xgi9te4", {
                from_name: sessionStorage.getItem('firstName') ?? '' + sessionStorage.getItem('lastName') ?? '',
                to_email: userEmail,
                message: 'Note: From ' + dateRequest + ' (requested date) you only have 3 days to comply with the requirements, Failure to comply within 3 days will result in your reservation being CANCELLED',
                status: this.selectedOption,
                submission_date: new Date().toLocaleString(),
              }, '02COKKG2ReUMrf5Ks').then((result) => {
                console.log('Email sent successfully!', result.text);
                window.location.reload();
              })
            } else { */

  onOptionSelected(status: any, userId: number, eventId: number, kioskId: number, formId: number, userEmail: string, dateRequested: string) {
    console.log(new Date())
    this.selectedOption = status.target.value;
    if (!this.dateRequested && this.selectedOption != 'approved') {
      dateRequested = '0000-00-00 00:00:00';
      if (this.selectedOption == 'finished') {
        dateRequested = dateRequested;
      }
      this.loading = true;
      this.adminService.updateStatus(this.selectedOption, userId, eventId, kioskId, formId, dateRequested).subscribe((data: any) => {
        if (data.success) {
          this.loading = false;
          emailjs.send("service_yb4nng9", "template_xgi9te4", {
            from_name: sessionStorage.getItem('firstName') ?? '' + sessionStorage.getItem('lastName') ?? '',
            to_email: userEmail,
            status: this.selectedOption,
            submission_date: new Date().toLocaleString(),
          }, '02COKKG2ReUMrf5Ks').then((result) => {
            console.log('Email sent successfully!', result.text);
            window.location.reload();
          })

        }
      });
    }
    else if (this.dateRequested && this.selectedOption == 'approved') {
      this.loading = true;
      const date = new Date(dateRequested)
      console.log(date);
      this.adminService.updateStatus(this.selectedOption, userId, eventId, kioskId, formId, dateRequested).subscribe((data: any) => {
        if (data.success) {
          this.counter = 0;
          this.selectorDate = !this.selectorDate;
          this.updatedRequestedDate = !this.updatedRequestedDate;
          sessionStorage.setItem('updatedRequestedDate', this.updatedRequestedDate.toString())
          this.loading = false;
          emailjs.send("service_yb4nng9", "template_xgi9te4", {
            from_name: sessionStorage.getItem('firstName') ?? '' + sessionStorage.getItem('lastName') ?? '',
            to_email: userEmail,
            message: 'Note: From ' + this.formatDate(dateRequested) + ' (requested date) you only have 3 days to comply with the requirements, Failure to comply within 3 days will result in your reservation being CANCELLED',
            status: this.selectedOption,
            submission_date: new Date().toLocaleString(),
          }, '02COKKG2ReUMrf5Ks').then((result) => {
            console.log('Email sent successfully!', result.text);
            this.dateRequested = '';
            window.location.reload();
          })

        }
      });
    }

    else if (!this.dateRequested && this.selectedOption == 'approved') {
      this.loading = true;
      this.counter += 1;
      if (this.counter == 1) {
        this.adminService.getSelectedEvent(eventId).subscribe((data: any) => {
          if (data.success == true) {
            this.loading = false;
            const currentDate = new Date()
            this.maxDate = this.formatDateRemove(data.endDate.toString());
            this.minDate = this.formatDateRemove(currentDate.toString());
            console.log(this.minDate, this.maxDate)
            this.selectorDate = true;
            this.userId = userId;
            this.eventId = eventId;
            this.kioskId = kioskId;
            this.formId = formId;
            this.userEmail = userEmail;
          }
        });
      }
    }

  }

  toSentenceCase(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
  }
  formatDateRemove(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  dateVerifier(dateStr: string) {
    const currentDate = new Date();
    const date = new Date(dateStr);
    const datePlus3 = new Date(date);
    datePlus3.setDate(datePlus3.getDate() + 3);
    return currentDate > datePlus3;

  }
  getTransaction() {
    this.token = sessionStorage.getItem('tokenId') ?? '';
    this.adminService.getTransaction().subscribe((data) => {
      this.userTransaction = data;
    });
  }

  selectDate() {
  }


  viewPdfFile(pdfUrl: string) {
    let checkPdfUrl = 'https://mapp-thesis.infotech3c.com/public/dbAssets/userImages/' + pdfUrl;
    this.viewPdf = true;
    console.log(this.pdfUrl);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(checkPdfUrl);
  }
  onPdfError() {
    this.pdfError = true; // Set error flag if PDF fails to load
  }
  // Method to handle search text change
  onSearchChange(value: string): void {
    console.log('im changing')
    this.searchText = value;
    this.pageIndex = 0; // Reset pagination to the first page
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

  statusViewer(status: string) {
    if (status == 'approved') {
      return 'approved'
    }
    else if (status == 'pending') {
      return 'booked'
    }
    else if (status == 'finished') {
      return 'completed'
    }
    else if (status == 'paid') {
      return status
    }
    else if (status == 'denied') {
      return 'cancelled'
    }
    else {
      return 'cancelled'
    }
  }
  getEventName(eventId: number): string {
    const event = this.eventData.find(event => event.event_id == eventId);
    return event ? event.event_name : 'Unknown Event';
  }

  getKioskName(kioskId: number): string {
    const kiosk = this.kioskData.find(kiosk => kiosk.kiosk_id == kioskId);
    return kiosk ? kiosk.kiosk_name : 'Unknown Kiosk';
  }

  getKiosk() {
    this.eventService.getKiosk().subscribe((data) => {
      this.kioskData = data
    });
  }

  getEvent() {
    this.eventService.getEvents().subscribe((data) => {
      this.eventData = data
    });
  }

  counterPaid(transactions: any[]): number {
    let paidCount = 0;
    // Loop through the transactions and count 'paid' statuses
    for (let transac of transactions) {
      if (transac.status === 'paid') {
        paidCount += 1;
      }
    }
    return paidCount;
  }

  removeLastComma(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input.replace(/,\s*$/, ''); // Matches the last comma and any trailing spaces, replacing them with nothing
  }
  toLowerCaseSafe(value: string | undefined | null): string {
    return value ? value.toLowerCase() : '';
  }
  // Method to get the current page of transactions
  getTransactionsToDisplay(): any[] {

    // Filter transactions based on search text
    let filteredTransactions = this.userTransaction.filter((transac) =>
      this.toLowerCaseSafe(transac.status).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.kiosk_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.receipt_number).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(this.formatDate(transac.date_created)).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.status+'(over due)').includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.First_name+' '+transac.Last_name).includes(this.toLowerCaseSafe(this.searchText))
    );

    // Now sort the filtered transactions
    filteredTransactions = this.sortTransactions(filteredTransactions);

    // Apply pagination
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return filteredTransactions.slice(start, end);
  }


  // Sort transactions by the chosen field and direction
  sortTransactions(transactions: any[]): any[] {
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
    if (this.pageIndex < (this.userTransaction.length)) {
      console.log(this.userTransaction.length / 10);
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

  counterFinished(transactions: any[]): number {
    let paidCount = 0;
    // Loop through the transactions and count 'paid' statuses
    for (let transac of transactions) {
      if (transac.status === 'finished') {
        paidCount += 1;
      }
    }
    return paidCount;
  }
  downloadForm(form_id: string): void {
    this.firstName = sessionStorage.getItem('firstName') ?? '';
    this.lastName = sessionStorage.getItem('lastName') ?? '';
    this.eventService.downloadForm(form_id, this.firstName, this.lastName);
  }
  changeVal() {
    sessionStorage.setItem('updatedRequestedDate', 'false')
  }
  ngOnInit(): void {

    if (sessionStorage.getItem('transactions') != '1') {
      this.router.navigate(['/dashboard-admin']);
    }
    this.updatedRequestedDate = sessionStorage.getItem('updatedRequestedDate') === 'true'
    this.getEvent();
    this.getKiosk();
    this.getTransaction();

  }
}
