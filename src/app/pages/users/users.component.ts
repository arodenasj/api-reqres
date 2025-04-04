import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {User} from '../../models/user';
import {UserFormComponent} from '../../components/user-form/user-form.component';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['id', 'avatar', 'first_name', 'last_name', 'email', 'actions'];
  loading = true;
  searchTerm = '';
  currentPage = 1;
  totalPages = 0;
  pageToGo = 1;


  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.apiService.getUsers(this.currentPage).subscribe({
      next: (response) => {
        this.users = response.data;
        this.filteredUsers = [...this.users];
        this.totalPages = response.total_pages;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {duration: 5000});
        this.loading = false;
      }
    });
  }

  goToPage(): void {
    if (this.pageToGo >= 1) {
      this.currentPage = this.pageToGo;
      this.apiService.getUsers(this.pageToGo).subscribe({
        next: (response) => {
          this.users = response.data;
          this.filteredUsers = [...this.users];
          this.totalPages = response.total_pages;
          this.currentPage = response.page;
        },
        error: () => {
          this.snackBar.open('Error al cargar usuarios', 'Cerrar', {duration: 5000});
        }
      });
    } else {
      this.snackBar.open('Por favor ingrese un número mayor o igual a 1', 'Cerrar', {
        duration: 3000
      });
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  applyFilter(): void {
    const searchString = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.email.toLowerCase().includes(searchString) ||
      user.first_name.toLowerCase().includes(searchString) ||
      user.last_name.toLowerCase().includes(searchString)
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: {mode: 'create'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: {mode: 'edit', user}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar el usuario ${user.first_name} ${user.last_name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: number): void {
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {duration: 3000});
        this.loadUsers();
      },
      error: () => {
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', {duration: 5000});
      }
    });
  }
}
