import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-600 to-blue-700 p-8 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">Sr. Rana</h1>
          <p class="text-green-100">Sistema de Gestión de Producción</p>
        </div>

        <!-- Form -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                formControlName="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="usuario@empresa.com"
              >
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="text-red-500 text-sm mt-1">Email válido requerido</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                formControlName="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
              >
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-500 text-sm mt-1">Contraseña requerida</p>
              }
            </div>

            <!-- Error Message -->
            @if (authService.errorMessage()) {
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-600 text-sm">{{ authService.errorMessage() }}</p>
              </div>
            }

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="authService.isLoading() || loginForm.invalid"
              class="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (authService.isLoading()) {
                <span class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <!-- Información del sistema -->
          <div class="mt-6 text-center">
            <p class="text-gray-600 text-sm">
              Sistema interno • Solo personal autorizado
            </p>
            <p class="text-gray-500 text-xs mt-2">
              Contacte al administrador para obtener acceso
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const success = await this.authService.login(this.loginForm.value as LoginRequest);
      if (success) {
        this.redirectByRole();
      }
    }
  }

  private redirectByRole(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin']);
        break;
      case UserRole.SUPERVISOR:
        this.router.navigate(['/produccion']);
        break;
      case UserRole.BODEGA:
        this.router.navigate(['/inventario']);
        break;
      case UserRole.OPERARIO:
        this.router.navigate(['/produccion']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}