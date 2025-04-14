// src/app/admin/components/admin-layout/admin-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Import RouterOutlet
import { AdminAuthService } from '../../services/admin-auth.service';
import { User } from '../../../models/user.model';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-admin-layout',
  standalone: true, // Mark as standalone
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [AdminSidebarComponent, RouterOutlet, CommonModule] // Import RouterOutlet and CommonModule
})
export class AdminLayoutComponent implements OnInit {
  currentAdmin: User | null = null;
  isSidebarCollapsed = false;

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminAuthService.currentAdmin$.subscribe(admin => {
      this.currentAdmin = admin;
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.adminAuthService.logout();
    this.router.navigate(['/admin/login']);
  }
}