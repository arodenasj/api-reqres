import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from '../../services/api.service';
import {User} from '../../models/user';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    MatDialogTitle
  ],
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  mode: 'create' | 'edit';
  title: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', user?: User }
  ) {
    this.mode = data.mode;
    this.title = this.mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario';

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      avatar: ['']
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.data.user) {
      this.form.patchValue(this.data.user);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const request = this.mode === 'create'
      ? this.apiService.createUser(this.form.value)
      : this.apiService.updateUser(this.data.user!.id, this.form.value);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.mode === 'create' ? 'Usuario creado con éxito' : 'Usuario actualizado con éxito',
          'Cerrar',
          {duration: 3000}
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(
          this.mode === 'create' ? 'Error al crear usuario' : 'Error al actualizar usuario',
          'Cerrar',
          {duration: 5000}
        );
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
