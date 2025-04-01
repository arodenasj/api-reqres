import {Component, OnInit} from '@angular/core';
import {Resources} from '../../models/resources';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ResourceFormDialogComponent} from '../../components/resources-form/resources-form.component';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
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
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatInput} from '@angular/material/input';

export function CustomPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Items por página:';
  paginatorIntl.nextPageLabel = 'Siguiente';
  paginatorIntl.previousPageLabel = 'Anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
  return paginatorIntl;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatFormField,
    MatCard,
    MatInput,
    FormsModule,
    NgIf,
    MatIconButton,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatLabel,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatProgressSpinner,
    MatPaginatorModule,
    MatSuffix
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css',
  providers: [
    {provide: MatPaginatorIntl, useValue: CustomPaginatorIntl()}
  ]
})

export class ResourcesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'year', 'color', 'pantone_value', 'actions'];
  dataSource = new MatTableDataSource<Resources>();
  resources: Resources[] = [];
  totalItems = 0;
  pageSize = 6;
  currentPage = 1;
  totalPages = 0;
  pageToGo = 1;
  loading = false;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  applyFilter(): void {
    if (!this.resources) return;

    const searchString = this.searchTerm.toLowerCase();
    const filtered = this.resources.filter(resource =>
      resource.name.toLowerCase().includes(searchString) ||
      resource.color.toLowerCase().includes(searchString) ||
      resource.pantone_value?.toLowerCase().includes(searchString) ||
      resource.year.toString().includes(searchString)
    );
    this.dataSource.data = filtered;
  }

  loadResources(): void {
    this.loading = true;
    this.apiService.getResources(this.currentPage).subscribe({
      next: (response) => {
        this.resources = response.data;
        this.dataSource.data = this.resources;
        this.totalItems = response.total;
        this.totalPages = response.total_pages;
        this.currentPage = response.page;
        this.pageToGo = response.page;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar recursos', 'Cerrar', {duration: 5000});
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageToGo = page;
      this.loadResources();
    }
  }

  goToPage(): void {
    if (this.pageToGo >= 1) {
      this.changePage(this.pageToGo);
    }
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
        this.snackBar.open('Resource deleted successfully', 'Close', {duration: 3000});
        this.loadResources();
      },
      error: (error) => {
        this.snackBar.open('Failed to delete resource', 'Close', {duration: 5000});
      }
    });
  }
}
