// src/app/pages/tutor-application/tutor-application.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TutorApplicationService, TutorApplicationRequest } from '../../services/tutor-application.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-tutor-application',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tutor-application.component.html',
  styleUrl: './tutor-application.component.css'
})
export class TutorApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  currentUser: User | null = null;
  isLoading = true;
  isSubmitting = false;
  applicationSubmitted = false;
  errorMessage = '';
  cvFileName: string = '';
  fileError: string = '';
  cvFile: File | null = null;
  
  // Available subject options for multiselect
  subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'programming', label: 'Programming' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'art', label: 'Art' },
    { value: 'music', label: 'Music' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tutorApplicationService: TutorApplicationService,
    private router: Router
  ) {
    this.applicationForm = this.fb.group({
      profession: ['', [Validators.required]],
      education: ['', [Validators.required]],
      experience: ['', [Validators.required, Validators.min(0)]],
      subjects: [[], [Validators.required, Validators.minLength(1)]],
      bio: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(500)]],
      hourlyRate: [30, [Validators.required, Validators.min(10), Validators.max(200)]],
      reason: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
      additionalInfo: [''],
      contactPhone: ['', [Validators.pattern(/^[0-9\-\+\s\(\)]{7,20}$/)]], // Optional phone
      cvUpload: [null, [Validators.required]], // Required CV upload
      agreeTerms: [false, [Validators.requiredTrue]]
    });
  }
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
      
      // Redirect if user is not a student
      if (user && user.role !== 0) { // 0 = STUDENT
        this.router.navigate(['/profile']);
      }
    });
  }
  
  // Getter methods for form controls
  get profession() { return this.applicationForm.get('profession'); }
  get education() { return this.applicationForm.get('education'); }
  get experience() { return this.applicationForm.get('experience'); }
  get subjects() { return this.applicationForm.get('subjects'); }
  get bio() { return this.applicationForm.get('bio'); }
  get hourlyRate() { return this.applicationForm.get('hourlyRate'); }
  get reason() { return this.applicationForm.get('reason'); }
  get additionalInfo() { return this.applicationForm.get('additionalInfo'); }
  get contactPhone() { return this.applicationForm.get('contactPhone'); }
  get cvUpload() { return this.applicationForm.get('cvUpload'); }
  get agreeTerms() { return this.applicationForm.get('agreeTerms'); }
  
  // Toggle selection for multiselect subjects
  toggleSubjectSelection(subject: string): void {
    const currentSelections = [...this.subjects?.value] as string[];
    
    if (currentSelections.includes(subject)) {
      // Remove subject if already selected
      const index = currentSelections.indexOf(subject);
      currentSelections.splice(index, 1);
    } else {
      // Add subject if not selected
      currentSelections.push(subject);
    }
    
    this.subjects?.setValue(currentSelections);
  }
  
  isSubjectSelected(subject: string): boolean {
    return (this.subjects?.value as string[]).includes(subject);
  }
  
  // Form submission
  onSubmit(): void {
    if (this.applicationForm.invalid || !this.cvFile) {
      this.applicationForm.markAllAsTouched();
      
      if (!this.cvFile) {
        this.fileError = 'CV file is required';
        this.cvUpload?.setErrors({ 'required': true });
      }
      
      this.scrollToFirstError();
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    // Prepare application data
    const applicationData: TutorApplicationRequest = {
      profession: this.profession?.value,
      education: this.education?.value,
      experience: parseInt(this.experience?.value),
      subjects: this.subjects?.value,
      bio: this.bio?.value,
      hourlyRate: parseFloat(this.hourlyRate?.value),
      reason: this.reason?.value,
      additionalInfo: this.additionalInfo?.value || undefined,
      contactPhone: this.contactPhone?.value || undefined
    };
    
    // Send to the server
    this.tutorApplicationService.createApplication(applicationData, this.cvFile)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.applicationSubmitted = true;
          
          // Scroll to top to show success message
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'Failed to submit application. Please try again.';
          
          // Scroll to the top to show the error message
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }
  
  // Handle file change event
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';
    
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.some(type => file.name.toLowerCase().endsWith(type) || file.type === type)) {
        this.fileError = 'Invalid file type. Please upload a PDF or Word document.';
        this.cvUpload?.setErrors({ 'invalidType': true });
        this.cvFileName = '';
        this.cvFile = null;
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.fileError = 'File is too large. Maximum size is 5MB.';
        this.cvUpload?.setErrors({ 'maxSize': true });
        this.cvFileName = '';
        this.cvFile = null;
        return;
      }
      
      // Set file name for display and store the file
      this.cvFileName = file.name;
      this.cvFile = file;
      this.cvUpload?.setValue(this.cvFileName);
    }
  }
  
  // Helper method to scroll to the first error
  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.ng-invalid');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}