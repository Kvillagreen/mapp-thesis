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

@Component({
  imports: [FormsModule, CommonModule, PdfViewerModule, NgxExtendedPdfViewerModule],
  selector: 'app-admin-user-control',
  standalone: true,
  templateUrl: './admin-user-control.component.html',
  styleUrl: './admin-user-control.component.css'
})

export class AdminUserControlComponent implements OnInit {
  userData: any[] = [];
  token: string = '';
  firstName: string = '';
  lastName: string = '';
  searchText: string = '';
  pageIndex: number = 0;  // Keeps track of the current page
  pageSize: number = 10;
  sortField: string = 'date_req'; // Default field to sort by (date)
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sorting order
  ascDate = false;
  ascType=false;
  constructor(private sanitizer: DomSanitizer, private router: Router, private userService: UserService, private eventService: EventService, private adminService: AdminService) { }


  getUser() {
    this.adminService.getUsers().subscribe((data) => {
      this.userData = data.filter(user => user.User_type !== 'user');
    });
  }

  // Method to handle search text change
  onSearchChange(value: string): void {
    console.log('im changing')
    this.searchText = value;
    this.pageIndex = 0; // Reset pagination to the first page
  }

  onPermissionChange(userId: number, permission: string, value: boolean) {
    console.log(value);
    this.adminService.userControl(userId, permission, value).subscribe({
      next: (response) => {
        console.log(response);
      },

    });
  }

  toLowerCaseSafe(value: string | undefined | null): string {
    return value ? value.toLowerCase() : '';
  }
  // Method to get the current page of transactions

  getUserToDisplay(): any[] {

    // Filter transactions based on search text
    let filteredTransactions = this.userData.filter((transac) =>
      this.toLowerCaseSafe(transac.First_name).includes(this.toLowerCaseSafe(this.searchText))
    );

    // Now sort the filtered transactions
    filteredTransactions = this.sortTransactions(filteredTransactions);

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


  ngOnInit(): void {
    if(sessionStorage.getItem('control')!='1'){
      this.router.navigate(['/dashboard-admin']);
    }
    this.getUser();

  }
}
