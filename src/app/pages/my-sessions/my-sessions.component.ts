// src/app/pages/my-sessions/my-sessions.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-sessions.component.html',
  styleUrl: './my-sessions.component.css'
})
export class MySessionsComponent {
  // Placeholder data for sessions
  upcomingSessions = [
    // Empty for now
  ];
  
  pastSessions = [
    // Empty for now
  ];
}