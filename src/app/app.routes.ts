import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TutorsComponent } from './pages/tutors/tutors.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'tutors',
        component: TutorsComponent
    },
    {
        // Add route with parameters for page and subject
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
        path: '**',
        redirectTo: ''
    }
];