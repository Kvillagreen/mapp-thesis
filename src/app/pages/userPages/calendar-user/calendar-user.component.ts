import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/rest-api/page-admin.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calendar-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-user.component.html',
  styleUrl: './calendar-user.component.css'
})
export class CalendarUserComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  currentDay: number = new Date().getDate();
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  calendarDays: { date: number | null; checkbox: number; exactDate: Date }[] = [];
  listOfDates: string[] = []
  events: any[] = [];  // Initialize the events array
  temporaryDate: Date | null = null;
  constructor(private adminService: AdminService, private router: Router) {
    this.generateCalendarDays();
  }

  // Fetch events from the admin service and update events array


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

  // Generate calendar days with the corresponding events
  generateCalendarDays(): void {
    if (this.router.url.startsWith('/application-form')) {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      const minDate = sessionStorage.getItem('eventStart') ?? '';
      const maxDate = sessionStorage.getItem('eventEnd') ?? '';

      let startDate = new Date(minDate);
      const endDate = new Date(maxDate);

      // Delay the start date by 1 day
      startDate.setDate(startDate.getDate() - 1);

      this.calendarDays = [];

      // Add placeholders for days before the 1st
      for (let i = 0; i < firstDay; i++) {
        const currentDate = new Date(this.currentYear, this.currentMonth, i);
        this.calendarDays.push({ date: null, checkbox: 2, exactDate: currentDate });
      }

      // Add days of the month with checkboxes only between startDate and endDate
      for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(this.currentYear, this.currentMonth, i);
        const isInRange = currentDate >= startDate && currentDate <= endDate;

        // Add day with checkbox if within the date range
        if (isInRange) {
          this.calendarDays.push({
            date: i,
            checkbox: 1,
            exactDate: currentDate  // checkbox will be true for days within the range
          });
        } else {
          this.calendarDays.push({
            date: i,
            checkbox: 2,
            exactDate: currentDate
            // checkbox will be false for days outside the range
          });
        }
      }
    } 
  }




  checkDate(date: number, checkbox: number, exactDate: Date) {

    if (this.router.url.startsWith('/application-form')) {
      const foundDay = this.calendarDays.find(day => day.exactDate === exactDate);
      if (checkbox == 1) {
        if (foundDay) {
          foundDay.checkbox = 0;
        }
        this.listOfDates.push(this.formatDate(exactDate.toString()))
      }
      if (checkbox == 0) {
        if (foundDay) {
          foundDay.checkbox = 1;
        }
        const index = this.listOfDates.indexOf(exactDate.toString());
        this.listOfDates.splice(index, 1);
      }
      console.log(this.listOfDates.toString())
      sessionStorage.setItem('listOfDates', this.listOfDates.toString())
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

  ngOnInit(): void {
    sessionStorage.setItem('listOfDates', '');
  }
}
