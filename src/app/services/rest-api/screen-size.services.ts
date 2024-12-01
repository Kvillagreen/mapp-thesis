import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  constructor() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('window:resize')
  private onResize() {
    location.reload();
  }
}


