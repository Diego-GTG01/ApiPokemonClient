import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const isApiPropia = req.url.includes('localhost:8080');
    
    //req.url.includes('127.0.0.1:8080');

  const cloned = req.clone({
    withCredentials: isApiPropia
  });

  return next(cloned).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          console.error('ERROR HTTP:', err.status, 'URL:', req.url);
          
          const currentUrl = router.url;

          if (
            (err.status === 401 || err.status === 403) &&
            !['/login', '/verify-pending'].includes(currentUrl) &&
            !req.url.includes('/auth/logout') &&
            !req.url.includes('/auth/login') 
          ) {
            router.navigate(['/login']);
          }
        }
      }
    })
  );
};