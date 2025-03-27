// src/app/pages/tutors/tutors.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TutorService } from '../../services/tutor.service';
import { Tutor } from '../../models/tutor.model';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [CommonModule, RouterModule, TutorCardComponent],
  templateUrl: './tutors.component.html',
  styleUrl: './tutors.component.css'
})
export class TutorsComponent implements OnInit {
  tutors: Tutor[] = [];
  totalTutors = 0;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  subjects: string[] = [];
  selectedSubject: string | null = null;
  loading = true;

  constructor(private tutorService: TutorService) { }

  ngOnInit(): void {
    this.loadTutors();
  }

  /**
   * Load tutors with pagination and optional filtering
   */
  loadTutors(): void {
    this.loading = true;
    this.tutorService.getTutorsPaginated(this.currentPage, this.pageSize, this.selectedSubject).subscribe({
      next: (data) => {
        this.tutors = data.tutors;
        this.totalTutors = data.total;
        this.totalPages = Math.ceil(this.totalTutors / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tutors', error);
        this.loading = false;
      }
    });

    // Get all tutors to extract unique subjects (in a real app, you'd have a dedicated endpoint for this)
    if (this.subjects.length === 0) {
      this.tutorService.getAllTutors().subscribe(allTutors => {
        const subjectSet = new Set<string>();
        allTutors.forEach(tutor => {
          tutor.subjects.forEach(subject => subjectSet.add(subject));
        });
        this.subjects = Array.from(subjectSet).sort();
      });
    }
  }

  /**
   * Navigate to the next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadTutors();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Navigate to the previous page
   */
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTutors();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to a specific page
   */
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTutors();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Get array of page numbers for pagination
   */
  getPageNumbers(): number[] {
    // Create array of page numbers from 0 to totalPages-1
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  /**
   * Filter tutors by subject
   */
  filterBySubject(subject: string | null): void {
    this.selectedSubject = subject;
    this.currentPage = 0; // Reset to first page when filtering
    this.loadTutors();
  }
}