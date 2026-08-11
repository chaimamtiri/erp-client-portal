import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('authToken');
  const router = inject(Router);

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const profile = localStorage.getItem('userProfile');
  const router = inject(Router);

  if (!profile) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(profile);
  if (!user.roles?.includes('ROLE_ADMIN')) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
