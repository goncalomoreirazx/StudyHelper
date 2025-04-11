// src/app/admin/components/admin-subjects/admin-subjects.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, SubSubject } from '../../../models/subject.model';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-admin-subjects',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css']
})
export class AdminSubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  selectedSubject: Subject | null = null;
  
  subjectForm: FormGroup;
  subSubjectForm: FormGroup;
  
  isAddingSubject = false;
  isEditingSubject = false;
  isAddingSubSubject = false;
  
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private subjectService: SubjectService,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      icon: ['📚', [Validators.required]]
    });
    
    this.subSubjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  
  ngOnInit(): void {
    this.loadSubjects();
  }
  
  loadSubjects(): void {
    this.loading = true;
    this.error = null;
    
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.error = 'Failed to load subjects. Please try again.';
        this.loading = false;
      }
    });
  }
  
  selectSubject(subject: Subject): void {
    this.selectedSubject = subject;
    this.resetForms();
  }
  
  startAddSubject(): void {
    this.isAddingSubject = true;
    this.isEditingSubject = false;
    this.isAddingSubSubject = false;
    this.selectedSubject = null;
    this.resetForms();
  }
  
  startEditSubject(subject: Subject): void {
    this.selectedSubject = subject;
    this.isEditingSubject = true;
    this.isAddingSubject = false;
    this.isAddingSubSubject = false;
    
    this.subjectForm.patchValue({
      name: subject.name,
      description: subject.description,
      icon: subject.icon
    });
  }
  
  startAddSubSubject(): void {
    this.isAddingSubSubject = true;
    this.isAddingSubject = false;
    this.isEditingSubject = false;
    this.subSubjectForm.reset({ name: '' });
  }
  
  saveSubject(): void {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.successMessage = null;
    
    const formData = this.subjectForm.value;
    
    if (this.isAddingSubject) {
      // Create new subject
      this.subjectService.createSubject({
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        subSubjects: []
      }).subscribe({
        next: (newSubject) => {
          this.subjects.push(newSubject);
          this.successMessage = `Subject "${newSubject.name}" created successfully.`;
          this.loading = false;
          this.isAddingSubject = false;
          this.resetForms();
        },
        error: (err) => {
          console.error('Error creating subject:', err);
          this.error = 'Failed to create subject. Please try again.';
          this.loading = false;
        }
      });
    } else if (this.isEditingSubject && this.selectedSubject) {
      // Update existing subject
      this.subjectService.updateSubject(this.selectedSubject.id, {
        name: formData.name,
        description: formData.description,
        icon: formData.icon
      }).subscribe({
        next: (updatedSubject) => {
          // Update the subject in the array
          const index = this.subjects.findIndex(s => s.id === this.selectedSubject?.id);
          if (index !== -1 && updatedSubject) {
            this.subjects[index] = updatedSubject;
          }
          this.successMessage = `Subject "${updatedSubject?.name}" updated successfully.`;
          this.loading = false;
          this.isEditingSubject = false;
          this.selectedSubject = updatedSubject;
          this.resetForms();
        },
        error: (err) => {
          console.error('Error updating subject:', err);
          this.error = 'Failed to update subject. Please try again.';
          this.loading = false;
        }
      });
    }
  }
  
  saveSubSubject(): void {
    if (this.subSubjectForm.invalid || !this.selectedSubject) {
      this.subSubjectForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.successMessage = null;
    
    const subSubjectName = this.subSubjectForm.value.name;
    
    // Create an updated list of sub-subjects
    const subSubjects = [...this.selectedSubject.subSubjects.map(ss => ss.name), subSubjectName];
    
    // Update the subject with the new sub-subject
    this.subjectService.updateSubject(this.selectedSubject.id, {
      subSubjects: subSubjects
    }).subscribe({
      next: (updatedSubject) => {
        if (updatedSubject) {
          // Update the subject in the array
          const index = this.subjects.findIndex(s => s.id === this.selectedSubject?.id);
          if (index !== -1) {
            this.subjects[index] = updatedSubject;
            this.selectedSubject = updatedSubject;
          }
          this.successMessage = `Sub-subject "${subSubjectName}" added successfully.`;
        }
        this.loading = false;
        this.isAddingSubSubject = false;
        this.resetSubSubjectForm();
      },
      error: (err) => {
        console.error('Error adding sub-subject:', err);
        this.error = 'Failed to add sub-subject. Please try again.';
        this.loading = false;
      }
    });
  }
  
  deleteSubject(subject: Subject): void {
    if (!confirm(`Are you sure you want to delete the subject "${subject.name}"? This action cannot be undone.`)) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.successMessage = null;
    
    this.subjectService.deleteSubject(subject.id).subscribe({
      next: (success) => {
        if (success) {
          this.subjects = this.subjects.filter(s => s.id !== subject.id);
          if (this.selectedSubject?.id === subject.id) {
            this.selectedSubject = null;
          }
          this.successMessage = `Subject "${subject.name}" deleted successfully.`;
        } else {
          this.error = 'Failed to delete subject. Please try again.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error deleting subject:', err);
        this.error = 'Failed to delete subject. Please try again.';
        this.loading = false;
      }
    });
  }
  
  deleteSubSubject(subSubject: SubSubject): void {
    if (!this.selectedSubject) return;
    
    if (!confirm(`Are you sure you want to delete the sub-subject "${subSubject.name}"? This action cannot be undone.`)) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.successMessage = null;
    
    // Create an updated list of sub-subjects without the one to delete
    const subSubjects = this.selectedSubject.subSubjects
      .filter(ss => ss.id !== subSubject.id)
      .map(ss => ss.name);
    
    // Update the subject without the sub-subject
    this.subjectService.updateSubject(this.selectedSubject.id, {
      subSubjects: subSubjects
    }).subscribe({
      next: (updatedSubject) => {
        if (updatedSubject) {
          // Update the subject in the array
          const index = this.subjects.findIndex(s => s.id === this.selectedSubject?.id);
          if (index !== -1) {
            this.subjects[index] = updatedSubject;
            this.selectedSubject = updatedSubject;
          }
          this.successMessage = `Sub-subject "${subSubject.name}" deleted successfully.`;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error deleting sub-subject:', err);
        this.error = 'Failed to delete sub-subject. Please try again.';
        this.loading = false;
      }
    });
  }
  
  cancelSubjectEdit(): void {
    this.isAddingSubject = false;
    this.isEditingSubject = false;
    this.resetForms();
  }
  
  cancelSubSubjectAdd(): void {
    this.isAddingSubSubject = false;
    this.resetSubSubjectForm();
  }
  
  resetForms(): void {
    this.subjectForm.reset({
      name: '',
      description: '',
      icon: '📚'
    });
    this.resetSubSubjectForm();
  }
  
  resetSubSubjectForm(): void {
    this.subSubjectForm.reset({ name: '' });
  }
  
  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }
  
  // Form getters for validation
  get subjectName() { return this.subjectForm.get('name'); }
  get subjectDescription() { return this.subjectForm.get('description'); }
  get subjectIcon() { return this.subjectForm.get('icon'); }
  get subSubjectName() { return this.subSubjectForm.get('name'); }
}