// src/app/features/auth/components/user-form/user-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserRole, UserRoleLabels, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <!-- Formas difuminadas de fondo -->
      <div class="absolute top-0 left-1/4 w-72 h-72 bg-green-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
      
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Contenido principal con sidebar y main -->
      <div class="flex relative z-10">
        <app-sidebar></app-sidebar>
        
        <div class="flex-1 flex flex-col">
          <main class="flex-1 p-8">
            <div class="max-w-4xl mx-auto">
              <!-- Header -->
              <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                  {{ isEditMode() ? 'Editar Usuario' : 'Nuevo Usuario' }}
                </h1>
                <p class="text-gray-400">
                  {{ isEditMode() ? 'Modifica la información del usuario' : 'Agrega un nuevo usuario al sistema' }}
                </p>
              </div>

              <!-- Form Card -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
                  
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      formControlName="name"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Ingresa el nombre completo"
                    >
                    @if (userForm.get('name')?.invalid && userForm.get('name')?.touched) {
                      <p class="text-red-400 text-sm mt-1">El nombre es requerido</p>
                    }
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                    <input 
                      type="email" 
                      formControlName="email"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="usuario@srrana.com"
                    >
                    @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
                      <p class="text-red-400 text-sm mt-1">Email válido requerido</p>
                    }
                  </div>

                  <!-- Password (solo para crear) -->
                  @if (!isEditMode()) {
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                      <input 
                        type="password" 
                        formControlName="password"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="••••••••"
                      >
                      @if (userForm.get('password')?.invalid && userForm.get('password')?.touched) {
                        <p class="text-red-400 text-sm mt-1">La contraseña es requerida (mínimo 6 caracteres)</p>
                      }
                    </div>
                  }

                  <!-- Role -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Rol</label>
                    <select 
                      formControlName="role"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    >
                      <option value="" disabled selected>Selecciona un rol</option>
                      @for (role of userRoles; track role) {
                        <option [value]="role">{{ UserRoleLabels[role] }}</option>
                      }
                    </select>
                    @if (userForm.get('role')?.invalid && userForm.get('role')?.touched) {
                      <p class="text-red-400 text-sm mt-1">El rol es requerido</p>
                    }
                  </div>

                  <!-- Status (solo para editar) -->
                  @if (isEditMode()) {
                    <div>
                      <label class="flex items-center space-x-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          formControlName="isActive"
                          class="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        >
                        <span>Usuario activo</span>
                      </label>
                    </div>
                  }

                  <!-- Error Message -->
                  @if (errorMessage()) {
                    <div class="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                      <p class="text-red-300 text-sm">{{ errorMessage() }}</p>
                    </div>
                  }

                  <!-- Action Buttons -->
                  <div class="flex items-center justify-between pt-6">
                    <button
                      type="button"
                      routerLink="/auth/usuarios"
                      class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
                    >
                      Cancelar
                    </button>

                    <button 
                      type="submit" 
                      [disabled]="userForm.invalid || loading()"
                      class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      @if (loading()) {
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{{ isEditMode() ? 'Actualizando...' : 'Creando...' }}</span>
                      } @else {
                        <span>{{ isEditMode() ? 'Actualizar Usuario' : 'Crear Usuario' }}</span>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  userId = signal<string | null>(null);

  readonly UserRoleLabels = UserRoleLabels;
  readonly userRoles = Object.values(UserRole);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(id);
      this.loadUserData(id);
      // En modo edición, la contraseña no es requerida
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadUserData(id: string): void {
    this.loading.set(true);
    this.authService.getUserById(id).subscribe({
      next: (response) => {
        const user = response.data;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.errorMessage.set('Error al cargar datos del usuario');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      if (this.isEditMode() && this.userId()) {
        this.updateUser();
      } else {
        this.createUser();
      }
    }
  }

  private createUser(): void {
    const userData: CreateUserRequest = this.userForm.value;
    this.authService.createUser(userData).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/usuarios']);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.errorMessage.set(error.error?.message || 'Error al crear usuario');
        this.loading.set(false);
      }
    });
  }

  private updateUser(): void {
    const userData: UpdateUserRequest = this.userForm.value;
    // Si no se proporciona nueva contraseña, eliminar el campo
    if (!userData.password) {
      delete userData.password;
    }

    this.authService.updateUser(this.userId()!, userData).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/usuarios']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage.set(error.error?.message || 'Error al actualizar usuario');
        this.loading.set(false);
      }
    });
  }
}