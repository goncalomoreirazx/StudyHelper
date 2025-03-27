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
        path: 'tutors/:id',
        component: TutorsComponent // You can create a TutorDetailComponent for individual tutor profiles
    },
    {
        path: '**',
        redirectTo: ''
    }
];
