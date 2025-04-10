// src/app/pages/my-sessions/my-sessions.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { TutorSession, SessionStatus } from '../../models/session.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-sessions.component.html',
  styleUrl: './my-sessions.component.css'
})
export class MySessionsComponent implements OnInit {
  // Tab management
  activeTab: 'upcoming' | 'past' = 'upcoming';
  
  // Sessions data
  upcomingSessions: TutorSession[] = [];
  pastSessions: TutorSession[] = [];
  
  // Loading state
  loading = false;
  
  // Search filter
  searchQuery: string = '';
  
  // Role check
  isTutor: boolean = false;
  currentUserName: string = '';
  
  constructor(
    private sessionService: SessionService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
      // Check current user and role
      const currentUser = this.authService.getCurrentUser();
      console.log('Current user:', currentUser);
      
      if (currentUser) {
        console.log('User role (raw):', currentUser.role);
        
        // Check if user is a tutor - handle string value explicitly
        // This avoids the type comparison error
        this.isTutor = currentUser.role === UserRole.TUTOR;
        console.log('isTutor flag set to:', this.isTutor);
        
        // Set user name for display
        this.currentUserName = `${currentUser.firstName} ${currentUser.lastName}`;
      }
      
      this.loadSessions();
    }
    
    loadSessions(): void {
      this.loading = true;
      
      // Load the appropriate sessions based on role
      if (this.isTutor) {
        console.log('Loading sessions for role: TUTOR');
        this.loadTutorSessions();
      } else {
        console.log('Loading sessions for role: STUDENT');
        this.loadStudentSessions();
      }
    }
    
    loadStudentSessions(): void {
      this.sessionService.getMyStudentSessions().subscribe({
        next: (sessions) => {
          console.log('Student sessions received:', sessions);
          this.processSessions(sessions);
        },
        error: (err) => {
          console.error('Error loading student sessions:', err);
          this.loading = false;
        }
      });
    }
    
    loadTutorSessions(): void {
      this.sessionService.getMyTutorSessions().subscribe({
        next: (sessions) => {
          console.log('Tutor sessions received:', sessions);
          this.processSessions(sessions);
        },
        error: (err) => {
          console.error('Error loading tutor sessions:', err);
          this.loading = false;
        }
      });
    }
  
  processSessions(sessions: TutorSession[]): void {
    // Sort sessions by date and time
    sessions.sort((a, b) => {
      const dateA = new Date(a.sessionDate + 'T' + a.startTime);
      const dateB = new Date(b.sessionDate + 'T' + b.startTime);
      return dateA.getTime() - dateB.getTime();
    });
    
    const now = new Date();
    
    // Split into upcoming and past sessions
    this.upcomingSessions = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      return (sessionDate > now || 
             (sessionDate.getDate() === now.getDate() && 
              sessionDate.getMonth() === now.getMonth() && 
              sessionDate.getFullYear() === now.getFullYear())) && 
             session.status !== SessionStatus.CANCELLED;
    });
    
    this.pastSessions = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      return sessionDate < now || session.status === SessionStatus.CANCELLED;
    });
    
    this.loading = false;
  }
  
  setActiveTab(tab: 'upcoming' | 'past'): void {
    this.activeTab = tab;
  }
  
  cancelSession(sessionId: number): void {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return;
    }
    
    this.sessionService.cancelSession(sessionId).subscribe({
      next: (result) => {
        if (result) {
          // Update the session status in our local arrays
          const sessionToUpdate = this.upcomingSessions.find(s => s.id === sessionId);
          if (sessionToUpdate) {
            sessionToUpdate.status = SessionStatus.CANCELLED;
            // Move to past sessions
            this.pastSessions.push({...sessionToUpdate});
            // Remove from upcoming sessions
            this.upcomingSessions = this.upcomingSessions.filter(s => s.id !== sessionId);
          }
        }
      },
      error: (err) => {
        console.error('Error cancelling session:', err);
        alert('Failed to cancel the session. Please try again.');
      }
    });
  }
  
  joinSession(session: TutorSession): void {
    // For this example, we'll just show an alert
    // In a real application, this would redirect to a video conferencing solution or virtual classroom
    alert(`Joining session with ${this.isTutor ? session.studentName : session.tutorName}. This would typically open a virtual classroom.`);
  }
  
  isSessionToday(session: TutorSession): boolean {
    const today = new Date();
    const sessionDate = new Date(session.sessionDate);
    
    return sessionDate.getDate() === today.getDate() &&
           sessionDate.getMonth() === today.getMonth() &&
           sessionDate.getFullYear() === today.getFullYear();
  }
  
  isSessionLive(session: TutorSession): boolean {
    if (!this.isSessionToday(session)) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinutes;
    
    const startTimeParts = session.startTime.split(':');
    const startTimeMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
    
    const endTimeParts = session.endTime.split(':');
    const endTimeMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);
    
    return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes;
  }
  
  canJoinSession(session: TutorSession): boolean {
    // Can join 10 minutes before start time until end time
    if (!this.isSessionToday(session)) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinutes;
    
    const startTimeParts = session.startTime.split(':');
    const startTimeMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
    
    const endTimeParts = session.endTime.split(':');
    const endTimeMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);
    
    return currentTimeMinutes >= (startTimeMinutes - 10) && currentTimeMinutes < endTimeMinutes;
  }
  
  // Format a date as "Month Day, Year" (e.g., "August 13, 2025")
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Get day and month for display in the session card
  getDayMonth(dateStr: string): { month: string, day: string } {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate().toString()
    };
  }
  
  // Filter sessions based on search query
  get filteredUpcomingSessions(): TutorSession[] {
    return this.filterSessions(this.upcomingSessions);
  }
  
  get filteredPastSessions(): TutorSession[] {
    return this.filterSessions(this.pastSessions);
  }
  
  private filterSessions(sessions: TutorSession[]): TutorSession[] {
    if (!this.searchQuery.trim()) {
      return sessions;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    return sessions.filter(session => 
      (this.isTutor ? session.studentName.toLowerCase() : session.tutorName.toLowerCase()).includes(query) ||
      session.subjectName.toLowerCase().includes(query) ||
      (session.subSubjectName && session.subSubjectName.toLowerCase().includes(query)) ||
      session.notes.toLowerCase().includes(query)
    );
  }
  
  // Check if there are sessions
  get hasUpcomingSessions(): boolean {
    return this.upcomingSessions.length > 0;
  }
  
  get hasPastSessions(): boolean {
    return this.pastSessions.length > 0;
  }
  
  // Format time for display (e.g., "13:00" to "1:00 PM")
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  // Role-based text helpers
  getSessionPartnerLabel(): string {
    return this.isTutor ? 'Student' : 'Tutor';
  }
  
  getSessionPartnerName(session: TutorSession): string {
    return this.isTutor ? session.studentName : session.tutorName;
  }
}