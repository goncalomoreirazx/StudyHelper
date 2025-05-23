// src/app/pages/tutors/tutors.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TutorService } from '../../services/tutor.service';
import { Tutor } from '../../models/tutor.model';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';
import { TutorTableComponent } from '../../components/tutor-table/tutor-table.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    TutorCardComponent,
    TutorTableComponent
  ],
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.css']
})
export class TutorsComponent implements OnInit {
  tutors: Tutor[] = [];
  totalTutors: number = 0;
  currentPage: number = 0;
  pageSize: number = 6;
  totalPages: number = 0;
  pageArray: number[] = [];
  subjects: string[] = [];
  selectedSubject: string | null = null;
  loading: boolean = true;
  viewMode: 'cards' | 'table' = 'cards';
  isLoggedIn: boolean = false;

  constructor(
    private tutorService: TutorService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check login status
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    
    // Load all subjects first
    this.tutorService.getAllTutors().subscribe(allTutors => {
      const subjectSet = new Set<string>();
      allTutors.forEach(tutor => {
        tutor.subjects.forEach(subject => subjectSet.add(subject));
      });
      this.subjects = Array.from(subjectSet).sort();
    });

    // React to route parameter changes
    this.route.paramMap.subscribe(params => {
      // Get page from route parameters
      const pageParam = params.get('page');
      if (pageParam) {
        this.currentPage = parseInt(pageParam, 10) - 1; // Convert to 0-based index
      } else {
        this.currentPage = 0;
      }

      // Get subject filter from route parameters
      const subjectParam = params.get('subject');
      this.selectedSubject = subjectParam;

      // Load tutors based on route parameters
      this.loadTutors();
    });
  }

  loadTutors(): void {
    this.loading = true;
    
    this.tutorService.getTutorsPaginated(this.currentPage + 1, this.pageSize, this.selectedSubject).subscribe({
      next: (data) => {
        this.tutors = data.tutors;
        this.totalTutors = data.total;
        this.totalPages = Math.ceil(this.totalTutors / this.pageSize);
        this.pageArray = Array(this.totalPages).fill(0).map((_, i) => i);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tutors', error);
        this.loading = false;
      }
    });
  }

  // Navigation methods - these update the URL instead of component state
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      if (this.selectedSubject) {
        this.router.navigate(['/tutors/subject', this.selectedSubject, 'page', page + 1]);
      } else {
        this.router.navigate(['/tutors/page', page + 1]);
      }
    }
  }

  nextPage(): void {
    const nextPage = this.currentPage + 1;
    if (nextPage < this.totalPages) {
      this.goToPage(nextPage);
    }
  }

  prevPage(): void {
    const prevPage = this.currentPage - 1;
    if (prevPage >= 0) {
      this.goToPage(prevPage);
    }
  }

  filterBySubject(subject: string | null): void {
    if (subject) {
      this.router.navigate(['/tutors/subject', subject]);
    } else {
      this.router.navigate(['/tutors']);
    }
  }
  
  // Toggle view mode between cards and table
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'cards' ? 'table' : 'cards';
  }
  
  // Handle view details from table
  onViewDetails(tutor: Tutor): void {
    this.router.navigate(['/tutors', tutor.id]);
  }
  
  // Handle book session from table
  onBookSession(tutor: Tutor): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/book'], { 
        queryParams: { tutorId: tutor.id } 
      });
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/book?tutorId=${tutor.id}` } 
      });
    }
  }
}