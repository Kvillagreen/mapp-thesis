import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/rest-api/page-admin.service';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  calendarDays: { date: number | null; events: any[] }[] = [];

  events: any[] = [];  // Initialize the events array

  constructor(private adminService: AdminService) {
    this.generateCalendarDays();
  }

  // Fetch events from the admin service and update events array
  fetchEvents(): void {
    this.adminService.getEvent().subscribe((data) => {
      // Assuming the fetched data has fields event_name, event_start, event_end
      this.events = data.map(event => {
        const startDate = new Date(event.event_start);
        startDate.setDate(startDate.getDate() - 1); // Subtract one day from startDate
  
        return {
          title: event.event_name,
          startDate: startDate,
          endDate: new Date(event.event_end),
          color: 'bg-blue-500' // You can assign colors based on the event or leave it static
        };
      });
      this.generateCalendarDays(); // Regenerate calendar days with the fetched events
    });
  }
  

  // Generate calendar days with the corresponding events
  generateCalendarDays(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    this.calendarDays = [];

    // Add placeholders for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ date: null, events: [] });
    }

    // Add days of the month with corresponding events
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(this.currentYear, this.currentMonth, i);
      const dayEvents = this.events.filter(
        (event) => currentDate >= event.startDate && currentDate <= event.endDate
      );
      this.calendarDays.push({ date: i, events: dayEvents });
    }
  }

  // Navigate to the previous month
  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendarDays();
  }

  // Navigate to the next month
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendarDays();
  }

  // Handle day click
  handleDayClick(date: number | null): void {
    if (!date) return;
    console.log(`Clicked date: ${this.currentYear}-${this.currentMonth + 1}-${date}`);
  }
  getEventCenterPosition(date: number | null, event: any): number | null {
    if (!date) return null;
    const startDate = event.startDate.getDate();
    const endDate = event.endDate.getDate();
    return date % 2 === 0 ? (startDate + endDate)/2 : null;
  }

  // Check if a date is the middle of an event
  isEventMiddle(date: number | null, event: any): boolean {
    if (!date) return false;
    const startDate = event.startDate.getDate();
    const endDate = event.endDate.getDate();
    const middleDate = Math.floor((startDate + endDate) / 2);
    return middleDate === date;
  }
  

  ngOnInit(): void {
    this.fetchEvents(); // Fetch events when the component initializes
  }
}
