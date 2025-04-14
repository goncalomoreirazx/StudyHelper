import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { CommonModule } from '@angular/common';
import { User, UserRole } from '../../../models/user.model'; // Import User and UserRole

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/admin/dashboard';

  // Hardcoded credentials (DEMO ONLY - REMOVE FOR PRODUCTION!)
  private readonly DEMO_EMAIL = 'admin@demo.com';
  private readonly DEMO_PASSWORD = 'password123';

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
    if (this.adminAuthService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

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

    // DEMO AUTHENTICATION (REPLACE WITH REAL AUTH!)
    if (loginData.email === this.DEMO_EMAIL && loginData.password === this.DEMO_PASSWORD) {
      // Simulate successful login (replace with your actual auth logic)
      const demoAdmin: User = {
        id: 1,
        email: this.DEMO_EMAIL,
        role: UserRole.ADMIN, // Use UserRole.ADMIN (which is 2)
        firstName: 'Demo',
        lastName: 'Admin',
        createdAt: new Date() // Provide a dummy date
      };
      this.adminAuthService.setAdmin(demoAdmin);
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.errorMessage = 'Invalid email or password';
      this.isSubmitting = false;
    }
  }
}