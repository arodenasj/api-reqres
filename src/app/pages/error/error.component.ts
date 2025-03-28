import { Component } from '@angular/core';
    import { RouterLink } from '@angular/router';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';

    @Component({
      selector: 'app-error',
      standalone: true,
      imports: [
        RouterLink,
        MatButtonModule,
        MatIconModule
      ],
      template: `
        <div class="container">
          <div class="error-content">
            <mat-icon class="error-icon">error_outline</mat-icon>
            <h1>404</h1>
            <h2>Página no encontrada</h2>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <button mat-raised-button color="primary" routerLink="/">
              <mat-icon>home</mat-icon>
              Volver al inicio
            </button>
          </div>
        </div>
      `
    })
    export class ErrorComponent {}
