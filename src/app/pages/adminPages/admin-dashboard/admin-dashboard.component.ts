import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { AdminService } from '../../../services/rest-api/page-admin.service';
import { Router } from '@angular/router';
import { ScreenSizeService } from '../../../services/rest-api/screen-size.services';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { RouterLink } from '@angular/router';
import { Navigation, Pagination } from 'swiper/modules';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CalendarComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  events: any[] = [];
  kiosk: any[] = [];
  user: any[] = [];
  transaction: any[] = [];
  urlImage: string = 'dbAssets/eventImages/';
  constructor(private adminService: AdminService, private router: Router, private screenSizeService: ScreenSizeService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('runOnce')=='false') {
      sessionStorage.setItem('runOnce', 'true');
      window.location.reload();
    }
    this.fetchTransaction();
    this.fetchEvents();
    this.fetchUser();
    this.fetchKiosk();
  }
  getAvailableKioskCount(): number {
    return this.kiosk.filter(k => k.status === 'available').length;
  }
  getUnavailableKioskCount(): number {
    return this.kiosk.filter(k => k.status === 'unavailable').length;
  }

  fetchTransaction() {
    this.adminService.getTransaction().subscribe((data) => {
      this.transaction = data;
    });
  }
  fetchEvents() {
    this.adminService.getEvent().subscribe((data) => {
      this.events = data;
    });
  }
  fetchUser() {
    this.adminService.getUsers().subscribe((data) => {
      this.user = data;
    });
  }

  fetchKiosk() {
    this.adminService.getKiosk().subscribe((data) => {
      this.kiosk = data;
    });
  }



  ngAfterViewInit(): void {

    const swiper = new Swiper('.default-carousel', {
      loop: true,
      autoplay: {
        delay: 3000,  // 3 seconds delay
        disableOnInteraction: false,  // Ensures autoplay continues after user interaction
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swipe-next',
        prevEl: '.swipe-prev',
      },
    });
    // Autoplay trigger (optional)
    setInterval(() => {
      swiper.slideNext();
    }, 3000);
  }
}