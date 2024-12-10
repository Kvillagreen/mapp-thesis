import { Component, DoCheck, OnInit } from '@angular/core';
import { UserService } from '../../../services/rest-api/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/rest-api/page.service';
import { FormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';
@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {
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
  reference: string = '';
  checkerReference: boolean = false;
  ascPurpose = false;
  ascDate = false;
  referenceNumber: boolean = false;
  formId: string = '';
  errorMessage: string = '';
  constructor(private router: Router, private userService: UserService, private eventService: EventService) { }

  submitReference() {
    if (!this.formId || !this.reference) {
      this.errorMessage = 'error';
    } else {
      this.userService.submitReference(this.formId, this.reference).subscribe((data) => {
        if (data.success) {
          this.errorMessage = 'none';
          emailjs.send("service_yb4nng9", "template_5dtjkq9", {
            referenceNumber: this.reference,
            from_name: sessionStorage.getItem('firstName') ?? '' + sessionStorage.getItem('lastName') ?? '',
            submission_date: new Date().toLocaleString(),
          }, '02COKKG2ReUMrf5Ks').then((result) => {
            console.log('Email sent successfully!', result.text);
            window.location.reload();
          })

        }

      },


      );
    }
  }

  getTransaction() {
    this.token = sessionStorage.getItem('tokenId') ?? '';
    this.userService.getTransaction(this.token).subscribe((data) => {
      this.userTransaction = data;
    });
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


  dateVerifier(dateStr: string) {
    const currentDate = new Date();
    const date = new Date(dateStr);
    const datePlus3 = new Date(date);
    datePlus3.setDate(datePlus3.getDate() + 3);
    return currentDate > datePlus3;

  }
  toLowerCaseSafe(value: string | undefined | null): string {
    return value ? value.toLowerCase() : '';
  }
  // Method to get the current page of transactions
  getTransactionsToDisplay(): any[] {

    // Filter transactions based on search text
    let filteredTransactions = this.userTransaction.filter((transac) =>
      this.toLowerCaseSafe(this.formatDate(transac.date_created)).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.event_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.status).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.kiosk_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(transac.purpose).includes(this.toLowerCaseSafe(this.searchText))
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
  
  statusViewer(status:string){
    if(status=='approved'){
      return 'approved'
    }
    else if (status=='pending'){
      return 'booked'
    }
    else if (status=='finished'){
      return 'completed'
    }
    else if (status=='paid'){
      return status
    }
    else {
      return 'cancelled'
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('userType') == 'admin') {
      this.router.navigate(['/dashboard-admin']);
    }
    this.getEvent();
    this.getKiosk();
    this.getTransaction();

  }
}
