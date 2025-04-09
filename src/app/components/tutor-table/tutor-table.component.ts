// src/app/components/tutor-table/tutor-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tutor-table.component.html',
  styleUrl: './tutor-table.component.css'
})
export class TutorTableComponent {
  @Input() tutors: Tutor[] = [];
  @Input() loading: boolean = false;
  @Output() viewDetails = new EventEmitter<Tutor>();
  @Output() bookSession = new EventEmitter<Tutor>();
  
  /**
   * Return initials for tutors without photos
   */
  getTutorInitials(name: string): string {
    return name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2);
  }
  
  /**
   * Handle view details click
   */
  onViewDetails(tutor: Tutor, event: Event): void {
    event.preventDefault();
    this.viewDetails.emit(tutor);
  }
  
  /**
   * Handle book session click
   */
  onBookSession(tutor: Tutor, event: Event): void {
    event.preventDefault();
    this.bookSession.emit(tutor);
  }
  
  /**
   * Truncate text with ellipsis
   */
  truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}