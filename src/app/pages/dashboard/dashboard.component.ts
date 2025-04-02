import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {User} from '../../models/user';
import {Resources} from '../../models/resources';
import {NgIf} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatNoDataRow, MatTableDataSource, MatTableModule} from '@angular/material/table';
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
    MatButtonModule,
    MatNoDataRow
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
    // Inicializar los datasources con arrays vacíos
    this.userDataSource = new MatTableDataSource<User>([]);
    this.resourceDataSource = new MatTableDataSource<Resources>([]);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.userDataSource.data = [];
    this.resourceDataSource.data = [];


    forkJoin({
      users: this.apiService.getUsers(this.userPage),
      resources: this.apiService.getResources(this.resourcePage)
    }).subscribe({
      next: (response) => {
        this.userDataSource.data = response.users.data || [];
        this.userTotalPages = response.users.total_pages;
        this.userPage = response.users.page;

        this.resourceDataSource.data = response.resources.data || [];
        this.resourceTotalPages = response.resources.total_pages;
        this.resourcePage = response.resources.page;

        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.userDataSource.data = [];
        this.resourceDataSource.data = [];
      }
    });
  }

  changeUserPage(page: number): void {
    if (page >= 1 && page <= this.userTotalPages) {
      this.userPage = page;
      this.loadUsers();
    }
  }

  changeResourcePage(page: number): void {
    if (page >= 1 && page <= this.resourceTotalPages) {
      this.resourcePage = page;
      this.loadResources();
    }
  }

  goToUserPage(): void {
    if (this.userPageToGo >= 1) {
      this.userPage = this.userPageToGo;
      this.loadUsers();
    }
  }

  goToResourcePage(): void {
    if (this.resourcePageToGo >= 1) {
      this.resourcePage = this.resourcePageToGo;
      this.loadResources();
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.apiService.getUsers(this.userPage).subscribe({
      next: (response) => {
        this.recentUsers = response.data;
        this.userDataSource.data = this.recentUsers;
        this.userTotalPages = response.total_pages;
        this.userPage = response.page;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.userDataSource.data = [];
      }
    });
  }

  loadResources(): void {
    this.loading = true;
    this.apiService.getResources(this.resourcePage).subscribe({
      next: (response) => {
        this.recentResources = response.data;
        this.resourceDataSource.data = this.recentResources;
        this.resourceTotalPages = response.total_pages;
        this.resourcePage = response.page;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.resourceDataSource.data = [];
      }
    });
  }
}
