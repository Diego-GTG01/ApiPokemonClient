import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const cloned = req.clone({
    withCredentials: true
  });

  return next(cloned).pipe(
    tap({
      error: (err: HttpErrorResponse) => {

        const currentUrl = router.url;

        if ((err.status === 401 || err.status === 403) 
            && currentUrl !== '/verify-pending'
            && currentUrl !== '/login') {

          router.navigate(['/login']);
        }

      }
    })
  );
};