import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthResponse, LoginCredentials, RegisterCredentials} from '../models/auth';
import {catchError, Observable, throwError} from 'rxjs';
import {User} from '../models/user';
import {Resources} from '../models/resources';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }



  // Métodos de autenticación
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  register(userData: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para usuarios
  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  getUser(id: number): Observable<{ data: User }> {
    return this.http.get<{ data: User }>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para recursos
  getResources(): Observable<{ data: Resources[] }> {
    return this.http.get<{ data: Resources[] }>(`${this.apiUrl}/resources`).pipe(
      catchError(this.handleError)
    );
  }

  getResource(id: number): Observable<{ data: Resources }> {
    return this.http.get<{ data: Resources }>(`${this.apiUrl}/resources/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createResource(resourceData: Partial<Resources>): Observable<Resources> {
    return this.http.post<Resources>(`${this.apiUrl}/resources`, resourceData).pipe(
      catchError(this.handleError)
    );
  }

  updateResource(id: number, resourceData: Partial<Resources>): Observable<Resources> {
    return this.http.put<Resources>(`${this.apiUrl}/resources/${id}`, resourceData).pipe(
      catchError(this.handleError)
    );
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/resources/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

}
