import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-pending',
  templateUrl: './verify-pending.html',
  styleUrls: ['./verify-pending.css']
})
export class VerifyPendingComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {

    setInterval(() => {

      this.auth.checkAuth().subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
        }
      });

    }, 3000);

  }
}