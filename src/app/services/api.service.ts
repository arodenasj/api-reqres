import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthResponse, LoginCredentials, RegisterCredentials} from '../models/auth';
import {catchError, forkJoin, map, Observable, of, switchMap, throwError} from 'rxjs';
import {User, UserResponse} from '../models/user';
import {ResourceResponse, Resources} from '../models/resources';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }


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
  getUsers(page: number = 1): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users?page=${page}&per_page=6`).pipe(
      catchError(this.handleError)
    );
  }


  getUser(id: number): Observable<User> {
    return this.http.get<{ data: User }>(`${this.apiUrl}/users/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<{ data: User }>(`${this.apiUrl}/users`, userData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<{ data: User }>(`${this.apiUrl}/users/${id}`, userData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para recursos
getResources(page: number = 1): Observable<ResourceResponse> {
  return this.http.get<ResourceResponse>(`${this.apiUrl}/resources?page=${page}&per_page=6`).pipe(
    catchError(this.handleError)
  );
}
  getResource(id: number): Observable<Resources> {
    return this.http.get<{ data: Resources }>(`${this.apiUrl}/resources/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  createResource(resourceData: Partial<Resources>): Observable<Resources> {
    return this.http.post<{ data: Resources }>(`${this.apiUrl}/resources`, resourceData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }


  updateResource(id: number, resourceData: Partial<Resources>): Observable<Resources> {
    return this.http.put<{ data: Resources }>(`${this.apiUrl}/resources/${id}`, resourceData).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/resources/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

}
