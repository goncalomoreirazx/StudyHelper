// src/app/admin/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';

interface DashboardCard {
  title: string;
  value: number;
  icon: string;
  change: number;
  route: string;
}

interface RecentSession {
  id: number;
  studentName: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Sample data for dashboard cards
  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Users',
      value: 120,
      icon: '👥',
      change: 12,
      route: '/admin/users'
    },
    {
      title: 'Tutors',
      value: 25,
      icon: '👨‍🏫',
      change: 5,
      route: '/admin/tutors'
    },
    {
      title: 'Sessions Today',
      value: 8,
      icon: '📅',
      change: 2,
      route: '/admin/sessions'
    },
    {
      title: 'Active Subjects',
      value: 15,
      icon: '📚',
      change: 0,
      route: '/admin/subjects'
    }
  ];
  
  // Sample data for recent sessions
  recentSessions: RecentSession[] = [
    {
      id: 1,
      studentName: 'Alex Johnson',
      tutorName: 'Maria Garcia',
      subject: 'Mathematics - Calculus',
      date: '2025-04-11',
      time: '10:00 - 11:00',
      status: 'SCHEDULED'
    },
    {
      id: 2,
      studentName: 'Emma Wilson',
      tutorName: 'James Brown',
      subject: 'Science - Physics',
      date: '2025-04-10',
      time: '14:00 - 15:00',
      status: 'COMPLETED'
    },
    {
      id: 3,
      studentName: 'Oliver Taylor',
      tutorName: 'Maria Garcia',
      subject: 'English - Literature',
      date: '2025-04-10',
      time: '16:30 - 17:30',
      status: 'CANCELLED'
    },
    {
      id: 4,
      studentName: 'Sophie Martinez',
      tutorName: 'David Wilson',
      subject: 'Languages - Spanish',
      date: '2025-04-09',
      time: '11:00 - 12:00',
      status: 'COMPLETED'
    },
    {
      id: 5,
      studentName: 'Jacob Anderson',
      tutorName: 'James Brown',
      subject: 'Computer Science - Programming',
      date: '2025-04-09',
      time: '13:00 - 14:00',
      status: 'NO_SHOW'
    }
  ];
  
  constructor() {}
  
  ngOnInit(): void {
    // In a real application, you would fetch this data from a service
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      case 'NO_SHOW': return 'status-no-show';
      default: return '';
    }
  }
}