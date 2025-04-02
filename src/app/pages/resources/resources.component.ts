import {Component, OnInit} from '@angular/core';
import {Resources} from '../../models/resources';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {ResourceFormDialogComponent} from '../../components/resources-form/resources-form.component';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  resources: Resources[] = [];
  filteredResources: Resources[] = [];
  displayedColumns: string[] = ['id', 'name', 'year', 'color', 'pantone_value', 'actions'];
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
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.apiService.getResources(this.currentPage).subscribe({
      next: (response) => {
        this.resources = response.data;
        this.filteredResources = [...this.resources];
        this.totalPages = response.total_pages;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar recursos', 'Cerrar', {duration: 5000});
        this.loading = false;
      }
    });
  }

  goToPage(): void {
    if (this.pageToGo >= 1) {
      this.currentPage = this.pageToGo;
      this.apiService.getResources(this.pageToGo).subscribe({
        next: (response) => {
          this.resources = response.data;
          this.filteredResources = [...this.resources];
          this.totalPages = response.total_pages;
          this.currentPage = response.page;
        },
        error: () => {
          this.snackBar.open('Error al cargar recursos', 'Cerrar', {duration: 5000});
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
      this.loadResources();
    }
  }

  applyFilter(): void {
    const searchString = this.searchTerm.toLowerCase();
    this.filteredResources = this.resources.filter(resource =>
      resource.name.toLowerCase().includes(searchString) ||
      resource.color.toLowerCase().includes(searchString) ||
      resource.pantone_value?.toLowerCase().includes(searchString) ||
      resource.year.toString().includes(searchString)
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ResourceFormDialogComponent, {
      width: '500px',
      data: {mode: 'create'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadResources();
      }
    });
  }

  openEditDialog(resource: Resources): void {
    const dialogRef = this.dialog.open(ResourceFormDialogComponent, {
      width: '500px',
      data: {mode: 'edit', resource}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadResources();
      }
    });
  }

  confirmDelete(resource: Resources): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {title: 'Confirmar eliminación', message: `¿Está seguro que desea eliminar el recurso ${resource.name}?`}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteResource(Number(resource.id));
      }
    });
  }

  deleteResource(id: number): void {
    this.apiService.deleteResource(id).subscribe({
      next: () => {
        this.snackBar.open('Recurso eliminado exitosamente', 'Cerrar', {duration: 3000});
        this.loadResources();
      },
      error: () => {
        this.snackBar.open('Error al eliminar recurso', 'Cerrar', {duration: 5000});
      }
    });
  }
}
