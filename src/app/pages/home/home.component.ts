import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {RegisterDialogComponent} from '../../components/register-dialog/register-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  loginForm: FormGroup;
  loginLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.loginLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loginLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loginLoading = false;
        this.snackBar.open(error.message || 'Error al iniciar sesión', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.register(result).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
            this.snackBar.open('Registro exitoso', 'Cerrar', {duration: 5000});
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Error al registrarse', 'Cerrar', {
              duration: 5000
            });
          }
        });
      }
    });
  }
}
