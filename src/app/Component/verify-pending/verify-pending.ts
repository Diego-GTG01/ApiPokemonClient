import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../Service/auth-service';
import { Router } from '@angular/router';
import { interval, Subject, of } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-verify-pending',
  templateUrl: './verify-pending.html',
  styleUrls: ['./verify-pending.css']
})
export class VerifyPendingComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    interval(3000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.auth.checkAuth().pipe(
            catchError((err) => {
              return of(null);
            })
          )
        )
      )
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/']);
        }

      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
