import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/rest-api/user.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit, OnInit, DoCheck {
  notification: any[] = [];
  showNotification: boolean = false;  // Controls the visibility of the notification bar
  loading: boolean = false;  // Your existing loading state
  toggleSidebar: boolean = false;
  toggleNotification: boolean = false;
  userData: any[] = [];
  userType: string = '';
  logOut: boolean = false;

  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('button') button!: ElementRef;
  @ViewChild('notifer') notifer!: ElementRef;
  @ViewChild('notifyButton') notifyButton!: ElementRef;    // Reference to the sidebar div
  @ViewChild('dropper') dropper!: ElementRef;
  @ViewChild('drop') drop!: ElementRef;
  open: boolean = false;
  isDropped: boolean = false;
  constructor(private router: Router, private renderer: Renderer2, private userService: UserService) { }

  ngAfterViewInit() {
    // Add a global click listener after the view is initialized
    this.renderer.listen('document', 'click', (event) => this.onClickOutside(event));
  }

  sortNotifications(notifications: Notification[]): Notification[] {
    return notifications.sort((a, b) => {
      // Priority: Read messages first, then unread messages
      if (a.status === 'read' && b.status !== 'read') {
        return -1; // a should come first
      }
      if (a.status !== 'read' && b.status === 'read') {
        return 1; // b should come first
      }
      return 0; // If both have the same status, maintain their order
    });
  }
  getUnreadCount(): number {
    return this.notification.reduce((count, notif) => {
      return notif.status === 'unread' ? count + 1 : count;
    }, 0);
  }
  refreshPage() {
    window.location.reload();
  }
  // Method to check if there are any "unread" notifications
  hasUnreadMessages(): boolean {
    return this.notification.some(notif => notif.status === 'unread');
  }

  isLastUnread(): boolean {
    // Find the last unread notification
    const lastUnreadIndex = this.notification
      .map((notif, index) => (notif.status === 'unread' ? index : -1))
      .filter(index => index !== -1) // Filter out -1 values
      .pop(); // Get the last unread index (last element in the filtered array)

    // Check if the last unread notification is the last element in the array
    return lastUnreadIndex === this.notification.length - 1;
  }

  toggleSettings() {
    this.isDropped = !this.isDropped;
  }

  readMessage(notificationId: number, status: string) {
    this.userService.updateMessage(notificationId, status).subscribe((data: any) => {
      if (data.success == true) {
        this.refreshPage();
      }
    });
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

  toggleSide() {
    this.toggleSidebar = !this.toggleSidebar;
  }

  toggleNotificationBar() {
    this.toggleNotification = !this.toggleNotification;
  }

  // Handle clicks outside the sidebar
  onClickOutside(event: MouseEvent) {
    if (this.sidebar && !this.sidebar.nativeElement.contains(event.target) && !this.button.nativeElement.contains(event.target) && this.toggleSidebar == true) {
      this.toggleSidebar = false;

    } else {
      event.stopPropagation();
    } if (this.notifer && !this.notifer.nativeElement.contains(event.target) && !this.notifyButton.nativeElement.contains(event.target) && this.toggleNotification == true) {
      this.toggleNotification = false;

    } else {
      event.stopPropagation();
    } if (this.dropper && !this.dropper.nativeElement.contains(event.target) && !this.drop.nativeElement.contains(event.target) && this.isDropped == true) {
      this.isDropped = false;

    } else {
      event.stopPropagation();
    }
  }

  token: string = '';
  fetchUser(): any {
    this.token = sessionStorage.getItem('tokenId') ?? '';
    this.userService.getUser(this.token).subscribe((data) => {
      this.userData = data;
    });
  }

  formatDate(dateStr: string, offsetHours: number = 8): string {
    const date = new Date(dateStr);
  
    // Adjust the time by adding the offset in milliseconds
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
  ngOnInit() {
    if (sessionStorage.getItem('userType') == 'admin') {
      this.router.navigate(['/dashboard-admin']);
    }
    this.fetchUser();
    this.getNotification();
    this.userType = sessionStorage.getItem('userType') ?? '';
  }

  ngDoCheck(): void {
    setTimeout(() => {
      this.getNotification();
    }, (60000)
    );
  }



  getNotification() {
    this.token = sessionStorage.getItem('tokenId') ?? '';
    this.userService.getNotification(this.token).subscribe((data) => {
      this.notification = this.sortNotifications(data);
    });
  }

}
export interface Notification {
  notification_id: string;
  message: string;
  status: string;  // 'read' or 'unread'
  date_created: string;
}