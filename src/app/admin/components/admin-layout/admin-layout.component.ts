// src/app/admin/components/admin-layout/admin-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { User } from '../../../models/user.model';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [AdminSidebarComponent]
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