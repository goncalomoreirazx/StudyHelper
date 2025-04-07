// src/app/services/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }
      
      // Store the attempted URL for redirecting after login
      return router.createUrlTree(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user && user.role === 'ADMIN') {
        return true;
      }
      
      if (authService.isLoggedIn()) {
        // User is logged in but not an admin
        return router.createUrlTree(['/unauthorized']);
      }
      
      // User is not logged in
      return router.createUrlTree(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    })
  );
};

export const tutorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user && (user.role === 'TUTOR' || user.role === 'ADMIN')) {
        return true;
      }
      
      if (authService.isLoggedIn()) {
        // User is logged in but not a tutor or admin
        return router.createUrlTree(['/unauthorized']);
      }
      
      // User is not logged in
      return router.createUrlTree(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    })
  );
};