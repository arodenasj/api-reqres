import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {User} from '../../models/user';
import {Resources} from '../../models/resources';
import {NgIf} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {forkJoin} from 'rxjs';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  recentUsers: User[] = [];
  recentResources: Resources[] = [];
  userPage = 1;
  resourcePage = 1;
  userTotalPages = 0;
  resourceTotalPages = 0;
  userPageToGo = 1;
  resourcePageToGo = 1;

  // Definir columnas para las tablas
  userColumns: string[] = ['id', 'email', 'name'];
  resourceColumns: string[] = ['id', 'name', 'color'];

  // Agregar fuentes de datos para las tablas
  userDataSource = new MatTableDataSource<User>();
  resourceDataSource = new MatTableDataSource<Resources>();

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      users: this.apiService.getUsers(this.userPage),
      resources: this.apiService.getResources(this.resourcePage)
    }).subscribe({
      next: (response) => {
        this.recentUsers = response.users.data;
        this.userDataSource.data = this.recentUsers;
        this.userTotalPages = response.users.total_pages;
        this.userPage = response.users.page;

        this.recentResources = response.resources.data;
        this.resourceDataSource.data = this.recentResources;
        this.resourceTotalPages = response.resources.total_pages;
        this.resourcePage = response.resources.page;

        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  changeUserPage(page: number): void {
    if (page >= 1 && page <= this.userTotalPages) {
      this.userPage = page;
      this.userPageToGo = page;
      this.apiService.getUsers(page).subscribe({
        next: (response) => {
          this.recentUsers = response.data;
          this.userDataSource.data = this.recentUsers; // Actualizar dataSource
          this.userTotalPages = response.total_pages;
          this.userPage = response.page;
        },
        error: (error) => {
          this.error = error.message;
        }
      });
    }
  }

  changeResourcePage(page: number): void {
    if (page >= 1 && page <= this.resourceTotalPages) {
      this.resourcePage = page;
      this.resourcePageToGo = page;
      this.apiService.getResources(page).subscribe({
        next: (response) => {
          this.recentResources = response.data;
          this.resourceDataSource.data = this.recentResources; // Actualizar dataSource
          this.resourceTotalPages = response.total_pages;
          this.resourcePage = response.page;
        },
        error: (error) => {
          this.error = error.message;
        }
      });
    }
  }

  goToUserPage(): void {
    if (this.userPageToGo >= 1) {
      this.changeUserPage(this.userPageToGo);
    }
  }

  goToResourcePage(): void {
    if (this.resourcePageToGo >= 1) {
      this.changeResourcePage(this.resourcePageToGo);
    }
  }
}
