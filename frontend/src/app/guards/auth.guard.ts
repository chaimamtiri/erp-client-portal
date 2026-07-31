import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Core/services/auth.service';

/**
 * Guard that allows access only to authenticated users.
 * Redirects unauthenticated users to the login page ('/').
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

/**
 * Guard that allows access only to guest (unauthenticated) users.
 * Redirects already authenticated users to the dashboard ('/dashboard').
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
