import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.error('Unauthorized - redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Optional: window.location.href = '/login';
      }
      if (err.status === 400 && err.error?.error) {
        console.error('Validation error:', err.error.error);
      }
      return throwError(() => err);
    })
  );
};
