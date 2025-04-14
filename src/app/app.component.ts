import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { ngSkipHydration: 'true' }
})
export class AppComponent implements OnInit {
  title = 'StudyHelper';
  isAdminRoute: boolean = false;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Check initial route
    this.isAdminRoute = this.router.url.includes('/admin');
    
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update flag based on current URL
      this.isAdminRoute = this.router.url.includes('/admin');
      
      // Scroll to top on navigation
      window.scrollTo(0, 0);
    });
  }
}