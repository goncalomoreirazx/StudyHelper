import { Routes, provideRouter, withRouterConfig } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TutorsComponent } from './pages/tutors/tutors.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard, tutorGuard, adminGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'tutors',
        component: TutorsComponent
    },
    {
        path: 'tutors/page/:page',
        component: TutorsComponent
    },
    {
        path: 'tutors/subject/:subject',
        component: TutorsComponent
    },
    {
        path: 'tutors/subject/:subject/page/:page',
        component: TutorsComponent
    },
    {
        path: 'tutors/:id',
        component: TutorsComponent // Change this to a detail component later if needed
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'my-sessions',
        loadComponent: () => import('./pages/my-sessions/my-sessions.component').then(m => m.MySessionsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'book',
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
        canActivate: [authGuard]
    },
    /*{
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [adminGuard]
    },*/
    {
        path: 'unauthorized',
        loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];