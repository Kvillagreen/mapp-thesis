import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner.component.html',
  styleUrl: './owner.component.css'
})
export class OwnerComponent {
  constructor(private router: Router) { }

  ngOnInit() {
    window.location.assign('http://kmv-portfolio.web.app/');
  }
}
