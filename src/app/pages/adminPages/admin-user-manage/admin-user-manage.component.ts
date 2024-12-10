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
@Component({
  imports: [FormsModule, CommonModule, PdfViewerModule, NgxExtendedPdfViewerModule],
  selector: 'app-admin-user-manage',
  standalone: true,
  templateUrl: './admin-user-manage.component.html',
  styleUrl: './admin-user-manage.component.css'
})
export class AdminUserManageComponent implements OnInit {
  userData: any[] = [];
  token: string = '';
  firstName: string = '';
  lastName: string = '';
  searchText: string = '';
  pageIndex: number = 0;  // Keeps track of the current page
  pageSize: number = 10;
  sortField: string = 'date_req'; // Default field to sort by (date)
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sorting order
  ascFName = false;
  ascLName = false;
  ascCompany = false;
  ascEmail = false;
  ascContact: string = '';
  ascStatus: boolean = false;
  ascUserType = false;
  ascDate = false;
  ascUsername = false;
  referenceNumber: boolean = false;
  formId: string = '';
  errorMessage: string = '';
  contact: string = 'Contact#'
  viewPdf: boolean = false;
  statusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Denied' }
  ];
  userTypeOptions = ['user', 'admin', 'EX-Director', 'IGP'];
  pdfError: boolean = false;
  pdfUrl: SafeResourceUrl = '';
  constructor(private sanitizer: DomSanitizer, private router: Router, private userService: UserService, private eventService: EventService, private adminService: AdminService) { }
  selectedOption: string = '';
  selectedUserType: string = '';

  onUserTypeChange(userType: any, userId: string,) {
    this.selectedUserType = userType.target.value;
    console.log(this.selectedUserType);
    this.adminService.updateUserType(this.selectedUserType, userId).subscribe((data: any) => {
      if (data.success) {
        window.location.reload();
      }
    });

  }

  onStatusChange(status: any, userId: string, userEmail: string) {
    this.selectedOption = status.target.value;
    console.log(this.selectedOption);
    this.adminService.updateUserStatus(this.selectedOption, userId).subscribe((data: any) => {
      if (data.success) {
        if (this.selectedOption == '1' || this.selectedOption == '2') {
          let approve = '';
          if (this.selectedOption == '1') {
            approve = 'Approved';
          } else {
            approve = 'Denied';
          }
          emailjs.send("service_yb4nng9", "template_xgi9te4", {
            from_name: sessionStorage.getItem('firstName') ?? '' + sessionStorage.getItem('lastName') ?? '',
            to_email: userEmail,
            status: approve,
            submission_date: new Date().toLocaleString(),
          }, '02COKKG2ReUMrf5Ks').then((result) => {
            console.log('Email sent successfully!', result.text);
            window.location.reload();
          })
        }

      }
    });
  }

  getUser() {
    this.adminService.getUsers().subscribe((data) => {
      this.userData = data;
    });
  }
  viewPdfFile(pdfUrl: string) {
    let checkPdfUrl = 'dbAssets/userImages/' + pdfUrl;
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


  toLowerCaseSafe(value: string | undefined | null): string {
    return value ? value.toLowerCase() : '';
  }
  // Method to get the current page of transactions

  getUserToDisplay(): any[] {

    // Filter transactions based on search text
    let filteredTransactions = this.userData.filter((user) =>
      this.toLowerCaseSafe(this.formatDate(user.date_registered)).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.First_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.Last_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.contact + '#').includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.Email).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.Company_name).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.status).includes(this.toLowerCaseSafe(this.searchText)) ||
      this.toLowerCaseSafe(user.User_type).includes(this.toLowerCaseSafe(this.searchText))
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
    if (this.pageIndex < (this.userData.length)) {
      console.log(this.userData.length / 10);
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

  ngOnInit(): void {

    if (sessionStorage.getItem('settings') != '1') {
      this.router.navigate(['/dashboard-admin']);
    }
    this.getUser();

  }
}
