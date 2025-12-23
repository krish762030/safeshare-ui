import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { tap } from 'rxjs/operators';

type TokenResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'safeshare_token';

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/register`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post<TokenResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap(res => localStorage.setItem(this.key, res.token)));
  }

  logout() {
    localStorage.removeItem(this.key);
  }

  getToken(): string | null {
    return localStorage.getItem(this.key);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
