import { Component, OnInit, AfterViewInit,HostListener  } from '@angular/core';
import { EventService } from '../../../services/rest-api/page.service';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Router } from '@angular/router';
import { ScreenSizeService } from '../../../services/rest-api/screen-size.services';
Swiper.use([Navigation, Pagination]);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  events: any[] = [];
  loading = false;
  urlImage: string = 'https://mapp-thesis.infotech3c.com/public/dbAssets/eventImages/';
  isEvent: boolean = false;
  constructor(private eventService: EventService, private router: Router ) { }
  runOnce = false;
  ngOnInit() {
    if(sessionStorage.getItem('userType')=='admin'){
      this.router.navigate(['/dashboard-admin']);
    }
    this.fetchEvents();
    sessionStorage.setItem('eventName', '') ;
    sessionStorage.setItem('kioskName', '') ;
    sessionStorage.setItem('eventId', '') ;
    sessionStorage.setItem('kioskId', '') ;

    if (sessionStorage.getItem('runOnce') == 'false') {
      window.location.reload();
      sessionStorage.setItem('runOnce', 'true');
    }
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe((data) => {
      this.events = data;
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
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  formatDate(dateStr: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateStr)
      .toLocaleDateString('en-US', options) // Format the date
      .replace(',', ''); // Adjust formatting if needed
  }
  toggleKiosk() {
    this.isEvent = !this.isEvent;
  }
  eventSelected(event_id: string, event_name: string, status: string, event_start: string, event_end: string) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      sessionStorage.setItem('eventId', event_id);
      sessionStorage.setItem('eventName', event_name);
      sessionStorage.setItem('status', status);
      sessionStorage.setItem('eventStart', event_start);
      sessionStorage.setItem('eventEnd', event_end);
      this.router.navigate(['/map-viewer']).then(() => {
        window.location.reload();  // This will reload the page
      });
    }, 200);

  }

}
