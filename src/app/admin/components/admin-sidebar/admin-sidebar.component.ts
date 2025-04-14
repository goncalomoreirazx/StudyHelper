// src/app/admin/components/admin-sidebar/admin-sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // Import RouterModule
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true, // Mark as standalone
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'],
  imports: [RouterModule, CommonModule] // Import RouterModule and CommonModule
})
export class AdminSidebarComponent implements OnInit {
  activeRoute: string = '/admin/dashboard';

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
    { label: 'Users', route: '/admin/users', icon: '👥' },
    { label: 'Tutors', route: '/admin/tutors', icon: '👨‍🏫' },
    { label: 'Sessions', route: '/admin/sessions', icon: '📅' },
    { label: 'Subjects', route: '/admin/subjects', icon: '📚' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.url;
    });

    // Set active route initially
    this.activeRoute = this.router.url;
  }

  isRouteActive(route: string): boolean {
    return this.activeRoute === route;
  }
}