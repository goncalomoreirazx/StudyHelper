// src/app/components/tutor-card/tutor-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tutor-card.component.html',
  styleUrl: './tutor-card.component.css'
})
export class TutorCardComponent {
  @Input() tutor!: Tutor;
  
  showFullBio = false;
  
  /**
   * Generates initials from tutor name for the avatar
   */
  get tutorInitials(): string {
    if (!this.tutor || !this.tutor.name) return '';
    
    return this.tutor.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2);
  }
  
  /**
   * Gets an array of filled stars based on the rating
   */
  get filledStars(): number[] {
    return Array(Math.floor(this.tutor.rating)).fill(0);
  }
  
  /**
   * Gets an array of empty stars based on the rating
   */
  get emptyStars(): number[] {
    return Array(5 - Math.ceil(this.tutor.rating)).fill(0);
  }
  
  /**
   * Checks if there should be a half star
   */
  get hasHalfStar(): boolean {
    return this.tutor.rating % 1 >= 0.5;
  }
  
  /**
   * Toggle bio visibility
   */
  toggleBio(): void {
    this.showFullBio = !this.showFullBio;
  }
}