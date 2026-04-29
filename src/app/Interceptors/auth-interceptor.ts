import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  const router = inject(Router);

  let cloned = req;

  if (token) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(cloned).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }
    })
  );
};
