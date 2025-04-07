// src/app/components/navbar/navbar.component.ts
import { Component, HostListener, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

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
  isUserDropdownOpen = false;
  scrolled = false;
  isLoggedIn$: Observable<boolean>;
  currentUser: User | null = null;
  
  private platformId = inject(PLATFORM_ID);
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  
  ngOnInit() {
    this.checkScroll();
    
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Close dropdown when clicking outside
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu') && this.isUserDropdownOpen) {
          this.closeDropdown();
        }
      });
    }
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
  
  toggleUserDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  
  closeDropdown() {
    this.isUserDropdownOpen = false;
  }
  
  logout() {
    this.authService.logout();
    this.closeDropdown();
    this.router.navigate(['/']);
  }
}