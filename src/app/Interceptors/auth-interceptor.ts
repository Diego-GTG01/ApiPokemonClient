import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);


  const SECURE_ROUTES = [
    '127.0.0.1:8080',
    'localhost:8080',
    'pokeapi.co/api/v2/pokemon',
  ];

  const isSecureRoute = SECURE_ROUTES.some(url => req.url.startsWith(url));

  let requestToForward = req;

  if (isSecureRoute) {
    requestToForward = req.clone({
      withCredentials: true
    });
  }

  return next(requestToForward).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        const currentUrl = router.url;

        if (
          (err.status === 401 || err.status === 403) &&
          currentUrl !== '/verify-pending' &&
          currentUrl !== '/login'
        ) {
          router.navigate(['/login']);
        }
      }
    })
  );
};