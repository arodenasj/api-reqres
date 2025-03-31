import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Resources} from '../../models/resources';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-resources-form',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    NgIf,
    MatError,
    MatFormField,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './resources-form.component.html',
  styleUrl: './resources-form.component.css'
})
export class ResourceFormDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;
  mode: 'create' | 'edit';
  title: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ResourceFormDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', resource?: Resources }
  ) {
    this.mode = data.mode;
    this.title = this.mode === 'create' ? 'Crear nuevo recurso' : 'Actualizar recurso';

   this.form = this.fb.group({
     name: ['', Validators.required],
     year: [new Date().getFullYear(), [
       Validators.required,
       Validators.min(1900),
       Validators.max(new Date().getFullYear())
     ]],
     color: ['#3B82F6', Validators.required],
     pantone_value: ['']
   });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.data.resource) {
      this.form.patchValue({
        name: this.data.resource.name,
        year: this.data.resource.year,
        color: this.data.resource.color,
        pantone_value: this.data.resource.pantone_value || ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.mode === 'create') {
      this.apiService.createResource(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Recurso creado correctamente', 'Cerrar', {duration: 3000});
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al crear el recurso', 'Cerrar', {duration: 5000});
        }
      });
    } else if (this.mode === 'edit' && this.data.resource) {
      this.apiService.updateResource(Number(this.data.resource.id), this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Recurso actualizado correctamente', 'Cerrar', {duration: 3000});
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al actualizar el recurso', 'Cerrar', {duration: 5000});
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
