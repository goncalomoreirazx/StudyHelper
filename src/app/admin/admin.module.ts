// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
// Import the standalone components
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminSessionsComponent } from './components/admin-sessions/admin-sessions.component';
import { AdminTutorsComponent } from './components/admin-tutors/admin-tutors.component';
//import { AdminSubjectsComponent } from './components/admin-subjects/admin-subjects.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

@NgModule({
  declarations: [
    // Remove the standalone components from declarations
    // AdminLoginComponent,
    // AdminDashboardComponent,
    // AdminSidebarComponent,
    // AdminUsersComponent,
    // AdminSessionsComponent,
    // AdminTutorsComponent,
    // AdminUsersComponent, // You had this duplicated
    // AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    // Optionally import the standalone components if this module uses them in its template
    // AdminLoginComponent,
    // AdminDashboardComponent,
    // AdminSidebarComponent,
    // AdminUsersComponent,
    // AdminSessionsComponent,
    // AdminTutorsComponent,
    // AdminLayoutComponent
  ]
})
export class AdminModule { }