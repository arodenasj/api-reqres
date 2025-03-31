import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {User} from '../../models/user';
import {Resources} from '../../models/resources';
import {NgIf} from '@angular/common';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    NgIf,
    MatProgressSpinner,
    MatCard,
    MatCardSubtitle,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  recentUsers: User[] = [];
  recentResources: Resources[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Cargar usuarios
    this.apiService.getUsers().subscribe({
      next: (response) => {
        this.recentUsers = response.data; // Mostrar todos los usuarios
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });

    // Cargar recursos
    this.apiService.getResources().subscribe({
      next: (response) => {
        this.recentResources = response.data; // Mostrar todos los recursos
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
