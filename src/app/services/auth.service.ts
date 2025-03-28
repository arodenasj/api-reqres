import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {LoginCredentials, RegisterCredentials} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    this.authenticatedSubject.next(!!token);
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.authenticatedSubject.next(true);
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      })
    );
  }

  register(userData: RegisterCredentials): Observable<any> {
    return this.apiService.register(userData).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.authenticatedSubject.next(true);
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.authenticatedSubject.next(false);
    this.router.navigate(['/']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
