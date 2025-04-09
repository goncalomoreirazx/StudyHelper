import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, SubSubject } from '../../models/subject.model';
import { Tutor } from '../../models/tutor.model';
import { TutorSessionCreateRequest, AvailableTimeSlot } from '../../models/session.model';
import { SubjectService } from '../../services/subject.service';
import { TutorService } from '../../services/tutor.service';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  // Step management
  currentStep = 1;
  totalSteps = 3;

  // Data for each step
  subjects: Subject[] = [];
  selectedSubject: Subject | null = null;
  selectedSubSubject: SubSubject | null = null;

  tutors: Tutor[] = [];
  selectedTutor: Tutor | null = null;

  selectedDate: Date = new Date();
  availableTimeSlots: AvailableTimeSlot[] = [];
  selectedTimeSlot: AvailableTimeSlot | null = null;

  sessionNotes: string = '';

  // Loading states
  loading = {
    subjects: false,
    tutors: false,
    timeSlots: false,
    booking: false
  };

  // Error message
  error: string | null = null;

  // Calendar variables
  currentMonth: Date = new Date();
  weeks: Date[][] = [];

  constructor(
    private subjectService: SubjectService,
    private tutorService: TutorService,
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load subjects
    this.loadSubjects();

    // Check for query parameters (if coming from tutor profile)
    this.route.queryParams.subscribe(params => {
      const tutorId = params['tutorId'];
      if (tutorId) {
        this.tutorService.getTutorById(parseInt(tutorId)).subscribe(tutor => {
          if (tutor) {
            this.selectedTutor = tutor;
            // Skip to step 3 if we have a tutor
            this.currentStep = 3;
            // Initialize the calendar
            this.buildCalendar();
            // Load available time slots for today
            this.onDateSelect(this.selectedDate);
          }
        });
      }
    });
  }

  // Subject selection (Step 1)
  loadSubjects(): void {
    this.loading.subjects = true;
    this.error = null;

    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading.subjects = false;
      },
      error: (err) => {
        this.error = 'Failed to load subjects. Please try again.';
        this.loading.subjects = false;
        console.error('Error loading subjects:', err);
      }
    });
  }

  selectSubject(subject: Subject): void {
    this.selectedSubject = subject;
    this.selectedSubSubject = null;
  }

  selectSubSubject(subSubject: SubSubject): void {
    this.selectedSubSubject = subSubject;
  }

  // Tutor selection (Step 2)
  loadTutors(): void {
    if (!this.selectedSubject) return;

    this.loading.tutors = true;
    this.error = null;

    this.subjectService.getTutorsBySubject(this.selectedSubject.id).subscribe({
      next: (tutors) => {
        this.tutors = tutors;
        this.loading.tutors = false;
      },
      error: (err) => {
        this.error = 'Failed to load tutors. Please try again.';
        this.loading.tutors = false;
        console.error('Error loading tutors:', err);
      }
    });
  }

  selectTutor(tutor: Tutor): void {
    this.selectedTutor = tutor;
    // Reset time slot selection
    this.selectedTimeSlot = null;
    // Initialize calendar
    this.buildCalendar();
    // Load available time slots for the selected date
    this.onDateSelect(this.selectedDate);
  }

  // Date and time selection (Step 3)
  buildCalendar(): void {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay()); // Start from the previous Sunday

    const endDate = new Date(lastDay);
    if (endDate.getDay() < 6) {
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // End on the next Saturday
    }

    this.weeks = [];
    let currentWeek: Date[] = [];

    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
      currentWeek.push(new Date(day));

      if (currentWeek.length === 7) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
    }
  }

  changeMonth(direction: number): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + direction,
      1
    );
    this.buildCalendar();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelectedDate(date: Date): boolean {
    return date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  }

  onDateSelect(date: Date): void {
    if (this.isPastDate(date)) return;

    this.selectedDate = new Date(date);
    this.loadAvailableTimeSlots();
  }

  loadAvailableTimeSlots(): void {
    if (!this.selectedTutor) return;

    this.loading.timeSlots = true;
    this.error = null;

    const dateStr = this.selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    this.sessionService.getAvailableTimeSlots(this.selectedTutor.id, dateStr).subscribe({
      next: (slots) => {
        this.availableTimeSlots = slots;
        this.loading.timeSlots = false;
      },
      error: (err) => {
        this.error = 'Failed to load available time slots. Please try again.';
        this.loading.timeSlots = false;
        console.error('Error loading time slots:', err);
      }
    });
  }

  selectTimeSlot(slot: AvailableTimeSlot): void {
    this.selectedTimeSlot = slot;
  }

  // Form submission
  bookSession(): void {
    if (!this.isBookingFormValid()) {
      this.error = 'Please make sure all required fields are filled out.';
      return;
    }

    this.loading.booking = true;
    this.error = null;

    const bookingRequest: TutorSessionCreateRequest = {
      tutorId: this.selectedTutor!.id,
      subjectId: this.selectedSubject!.id,
      subSubjectId: this.selectedSubSubject?.id,
      sessionDate: this.selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
      startTime: this.selectedTimeSlot!.startTime,
      endTime: this.selectedTimeSlot!.endTime,
      notes: this.sessionNotes
    };

    this.sessionService.createSession(bookingRequest).subscribe({
      next: (session) => {
        this.loading.booking = false;
        // Navigate to my sessions page
        this.router.navigate(['/my-sessions']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to book the session. Please try again.';
        this.loading.booking = false;
        console.error('Error booking session:', err);
      }
    });
  }

  isBookingFormValid(): boolean {
    return !!this.selectedTutor &&
           !!this.selectedSubject &&
           !!this.selectedDate &&
           !!this.selectedTimeSlot;
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.currentStep === 1 && !this.selectedSubject) {
        this.error = 'Please select a subject to continue.';
        return;
      }

      if (this.currentStep === 2 && !this.selectedTutor) {
        this.error = 'Please select a tutor to continue.';
        return;
      }

      this.error = null;
      this.currentStep++;

      // Load data for next step
      if (this.currentStep === 2) {
        this.loadTutors();
      } else if (this.currentStep === 3) {
        this.buildCalendar();
        this.onDateSelect(this.selectedDate);
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.error = null;
      this.currentStep--;
    }
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }

  // Format a date as "Month Day, Year" (e.g., "August 13, 2025")
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format price as currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Helper function to get tutor initials
  getTutorInitials(name: string | undefined): string {
    if (!name) {
      return ''; // Or some default value if the name is undefined
    }
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}