import {Component, OnInit} from '@angular/core';
import {Resources} from '../../models/resources';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ResourceFormDialogComponent} from '../../components/resources-form/resources-form.component';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {
  MatCell,MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-resources',
  imports: [
    MatButton,
    MatIcon,
    MatFormField,
    MatCard,
    MatInput,
    FormsModule,
    NgIf,
    MatSuffix,
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
    MatProgressSpinner
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent implements OnInit {
  resources: Resources[] = [];
  filteredResources: Resources[] = [];
  displayedColumns: string[] = ['id', 'name', 'year', 'color', 'pantone_value', 'actions'];
  loading = true;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.apiService.getResources().subscribe({
      next: (response: { data: Resources[] }) => {
        this.resources = response.data;
        this.filteredResources = [...this.resources];
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load resources', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const searchString = this.searchTerm.toLowerCase();
    this.filteredResources = this.resources.filter(resource =>
      resource.name.toLowerCase().includes(searchString) ||
      resource.pantone_value?.toLowerCase().includes(searchString) ||
      resource.year.toString().includes(searchString)
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ResourceFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
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
      data: { mode: 'edit', resource }
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
      data: { title: 'Confirmar eliminación', message: `¿Está seguro que desea eliminar el recurso ${resource.name}?` }
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
        this.snackBar.open('Resource deleted successfully', 'Close', { duration: 3000 });
        this.loadResources();
      },
      error: (error) => {
        this.snackBar.open('Failed to delete resource', 'Close', { duration: 5000 });
      }
    });
  }
}
