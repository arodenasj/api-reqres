import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgIf,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose
  ],
  template: `
    <h2 mat-dialog-title>Registro</h2>
    <mat-dialog-content>
      <form [formGroup]="registerForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="user@example.com">
          <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email es requerido</mat-error>
          <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Email inválido</mat-error>
        </mat-form-field>

        <div class="name-container">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="first_name">
            <mat-error *ngIf="registerForm.get('first_name')?.hasError('required')">Nombre es requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="last_name">
            <mat-error *ngIf="registerForm.get('last_name')?.hasError('required')">Apellido es requerido</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Contraseña</mat-label>
          <input matInput formControlName="password" type="password">
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Contraseña es requerida</mat-error>
          <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>URL Avatar (Opcional)</mat-label>
          <input matInput formControlName="avatar" placeholder="https://example.com/avatar.jpg">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="registerForm.invalid || loading"
              (click)="onRegister()">
        <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
        <span *ngIf="!loading">Registrarse</span>
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './register-dialog.component.css',
})
export class RegisterDialogComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDialogComponent>
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: ['']
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.dialogRef.close(this.registerForm.value);
    }
  }
}
