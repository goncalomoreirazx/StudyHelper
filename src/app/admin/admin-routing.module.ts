// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminSessionsComponent } from './components/admin-sessions/admin-sessions.component';
import { AdminTutorsComponent } from './components/admin-tutors/admin-tutors.component';
//import { AdminSubjectsComponent } from './components/admin-subjects/admin-subjects.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  {
    path: 'login', // This defines the /admin/login route
    component: AdminLoginComponent
  },
  {
    path: '', // This matches the /admin path after the module is loaded
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'users',
        component: AdminUsersComponent
      },
      {
        path: 'sessions',
        component: AdminSessionsComponent
      },
      {
        path: 'tutors',
        component: AdminTutorsComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }