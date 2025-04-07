
// src/app/pages/booking/booking.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  currentStep = 1;
  totalSteps = 3;
  
  // Move to next step
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  
  // Move to previous step
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  // Check if step is active
  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }
}