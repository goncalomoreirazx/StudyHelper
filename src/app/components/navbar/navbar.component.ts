// src/app/components/navbar/navbar.component.ts
import { Component, HostListener, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: { ngSkipHydration: 'true' }
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  scrolled = false;
  private platformId = inject(PLATFORM_ID);
  
  ngOnInit() {
    this.checkScroll();
  }

  @HostListener('window:scroll')
  checkScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > 20;
    }
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevent body scrolling when menu is open
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
  
  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    }
  }
}