// src/app/admin/guards/admin-auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);

  return adminAuthService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }
      
      // Redirect to admin login page
      return router.createUrlTree(['/admin/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    })
  );
};