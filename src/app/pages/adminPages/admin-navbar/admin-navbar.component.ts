import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from '../../../services/rest-api/page-admin.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit, DoCheck {
  loading: boolean = false;
  toggleSidebar: boolean = false;
  events: string = '';
  transactions: string = '';
  reports: string = '';
  settings: string = '';
  control: string = '';
  history: string = '';
  logOut: boolean = false;
  constructor(public router: Router, public adminService: AdminService) {

  }
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  refreshPage() {
    window.location.reload();
  }
  logout() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      sessionStorage.setItem('tokenId', '');
      this.router.navigate(['/login']).then(() => {
        window.location.reload();  // This will reload the page
      });
    }, 200);
  }

  dynamicControl() {
    const tokenId = sessionStorage.getItem('tokenId') ?? '';
    this.adminService.dynamicController(tokenId).subscribe({
      next: (response: any) => {
        console.log('check');
        const events = response.events;
        const transactions = response.transactions;
        const reports = response.reports;
        const settings = response.settings;
        const control = response.control;
        const history = response.history;
        sessionStorage.setItem('events', events);
        sessionStorage.setItem('transactions', transactions);
        sessionStorage.setItem('reports', reports);
        sessionStorage.setItem('settings', settings);
        sessionStorage.setItem('control', control);
        sessionStorage.setItem('history', history);
        this.events = sessionStorage.getItem('events') ?? '';
        this.transactions = sessionStorage.getItem('transactions') ?? '';
        this.reports = sessionStorage.getItem('reports') ?? '';
        this.settings = sessionStorage.getItem('settings') ?? '';
        this.control = sessionStorage.getItem('control') ?? '';
        this.history = sessionStorage.getItem('history') ?? '';
      }

    });
  }
  ngDoCheck(): void {
    if (sessionStorage.getItem('isLoggedIn') == 'login') {
      setInterval(() => {
        this.dynamicControl();
      }, 120000);
    }
  }
  ngOnInit(): void {
    if (sessionStorage.getItem('isLoggedIn') == 'login') {
      this.dynamicControl();
    }
  }

  isSidebarVisible() {
    sessionStorage.setItem('isSidebarVisible', 'true')
    console.log('check');
  }
}