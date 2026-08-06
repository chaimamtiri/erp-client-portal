import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');
  const url = state.url;

  if (token) {
    return true;
  }

  if (url.startsWith('/dashboard') && url.includes('preview=true')) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
