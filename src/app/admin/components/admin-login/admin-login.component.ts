// src/app/admin/components/admin-login/admin-login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/admin/dashboard';
  
  constructor(
    private fb: FormBuilder,
    private adminAuthService: AdminAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    // Check if user is already logged in
    if (this.adminAuthService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    
    // Get return URL from route parameters or default to '/admin/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }
  
  // Getter methods for easy access to form controls
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  
  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  /**
   * Submit login form
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const loginData = {
      email: this.email?.value,
      password: this.password?.value
    };
    
    this.adminAuthService.login(loginData).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Invalid email or password';
        this.isSubmitting = false;
      }
    });
  }
}