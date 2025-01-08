import { Component, DoCheck, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./pages/userPages/navbar/navbar.component";
import { FooterComponent } from './pages/userPages/footer/footer.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './pages/adminPages/admin-navbar/admin-navbar.component';
import { UserService } from './services/rest-api/user.service';
import { ElementRef, ViewChild } from '@angular/core';
import { AdminService } from './services/rest-api/page-admin.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, AdminNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, DoCheck {
  title='mapp-thesis'
  notification: any[] = [];
  @ViewChild('notifer') notifer!: ElementRef;
  @ViewChild('notifyButton') notifyButton!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('sidebarButton') sidebarButton!: ElementRef;
  showNotification: boolean = false;
  toggleNotification: boolean = false;
  userType: string | null = null;
  token: string = '';
  userData: any[] = [];
  isSidebarVisible = false; 

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  constructor(private router: Router, private userService: UserService, private adminService: AdminService) { }
  ngDoCheck(): void {
    if (sessionStorage.getItem('isLoggedIn') == 'login') {
      this.userType = sessionStorage.getItem('userType');
    }

  }
  ngOnInit(): void {

    if (sessionStorage.getItem('isLoggedIn') == 'login') {
      this.fetchUser();
      this.getNotification();
    }
  }

  // HostListener to listen for clicks outside the notification and button
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.notifer?.nativeElement &&
      this.notifyButton?.nativeElement &&
      !this.notifer.nativeElement.contains(event.target) &&
      !this.notifyButton.nativeElement.contains(event.target) &&
      this.toggleNotification === true
    ) {
      this.toggleNotification = false;

    } else {

      event.stopPropagation();
    } if (
      this.sidebar?.nativeElement &&
      this.sidebarButton?.nativeElement &&
      !this.sidebar.nativeElement.contains(event.target) &&
      !this.sidebarButton.nativeElement.contains(event.target) &&
      this.isSidebarVisible === true
    ) {
      this.isSidebarVisible = false;
    } else {
      event.stopPropagation();
    }
  }
  // Existing logic for fetching notifications and handling user data
  getNotification() {
    this.token = sessionStorage.getItem('tokenId') ?? '';
    this.adminService.getNotification(this.token).subscribe((data) => {
      this.notification = this.sortNotifications(data);
    });
  }

  sortNotifications(notifications: Notification[]): Notification[] {
    return notifications.sort((a, b) => {
      if (a.status === 'read' && b.status !== 'read') {
        return -1;
      }
      if (a.status !== 'read' && b.status === 'read') {
        return 1;
      }
      return 0;
    });
  }

  fetchUser() {
    this.token = sessionStorage.getItem('tokenId') ?? '';
    this.userService.getUser(this.token).subscribe((data) => {
      this.userData = data;
    });
  }

  toggleNotificationBar() {
    this.toggleNotification = !this.toggleNotification;
  }


  formatDate(dateStr: string, offsetHours: number = 8): string {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + offsetHours);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return date
      .toLocaleString('en-US', options) // Format the date
      .replace(',', ''); // Adjust formatting if needed
  }

  // Other methods
  shouldShowForUser(): boolean {
    return this.userType === 'user' && !this.isRoute();
  }

  isMap(): boolean {
    return this.router.url.startsWith('/map-viewer-admin');
  }


  isRoute(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register') || this.router.url.startsWith('/owner');
  }

  shouldShowForAdmin(): boolean {
    return this.userType !== 'user' && !this.isRoute();
  }

  // Notification methods
  hasUnreadMessages(): boolean {
    return this.notification.some((notif) => notif.status === 'unread');
  }

  readMessage(notificationId: number, status: string) {
    this.userService.updateMessage(notificationId, status).subscribe((data: any) => {
      if (data.success == true) {
        this.refreshPage();
      }
    });
  }


  refreshPage() {
    window.location.reload();
  }

  getUnreadCount(): number {
    return this.notification.reduce((count, notif) => (notif.status === 'unread' ? count + 1 : count), 0);
  }
}

export interface Notification {
  notification_id: string;
  message: string;
  status: string; // 'read' or 'unread'
  date_created: string;
}
