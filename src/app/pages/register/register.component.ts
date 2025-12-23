import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  error = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        this.message = 'Account created. Please login.';
        setTimeout(() => this.router.navigateByUrl('/login'), 1000);
      },
      error: (e) => this.error = e?.error?.message ?? 'Registration failed',
    });
  }
}
