// src/app/features/auth/components/users-list/users-list.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User, UserRole, UserRoleLabels } from '../../models/user.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
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
            <div class="max-w-7xl mx-auto">
              <!-- Header de la página -->
              <div class="mb-8">
                <div class="flex justify-between items-center">
                  <div>
                    <h1 class="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h1>
                    <p class="text-gray-400">Administra los usuarios del sistema Sr. Rana</p>
                  </div>
                  
                  <!-- Botón Nuevo Usuario -->
                  @if (authService.hasRole(UserRole.ADMIN)) {
                    <button 
                      routerLink="/auth/usuarios/nuevo"
                      class="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>Nuevo Usuario</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Filtros -->
              <div class="mb-6">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center space-x-2 text-gray-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        [checked]="includeInactive()"
                        (change)="onToggleInactive()"
                        class="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                      >
                      <span>Mostrar usuarios inactivos</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Tabla de Usuarios -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <!-- Loading State -->
                @if (loading()) {
                  <div class="flex justify-center items-center p-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                }

                <!-- Empty State -->
                @else if (!loading() && users().length === 0) {
                  <div class="text-center p-12">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">No hay usuarios</h3>
                    <p class="text-gray-400">No se encontraron usuarios en el sistema.</p>
                  </div>
                }

                <!-- Users Table -->
                @else if (!loading() && users().length > 0) {
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-700/50">
                        <tr>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Registro</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-700/50">
                        @for (user of users(); track user.id) {
                          <tr class="hover:bg-white/5 transition-colors duration-150">
                            <!-- User Info -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                                  {{ user.name.charAt(0) }}
                                </div>
                                <div>
                                  <div class="text-white font-medium">{{ user.name }}</div>
                                  <div class="text-gray-400 text-sm">{{ user.email }}</div>
                                </div>
                              </div>
                            </td>

                            <!-- Role -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {{ getRoleLabel(user.role) }}
                              </span>
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span 
                                [class]="user.isActive 
                                  ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                  : 'bg-red-500/20 text-red-300 border-red-500/30'"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                              >
                                {{ user.isActive ? 'Activo' : 'Inactivo' }}
                              </span>
                            </td>

                            <!-- Registration Date -->
                            <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                              {{ user.registerDate | date:'dd/MM/yyyy' }}
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center space-x-2">
                                <!-- View Details -->
                                <button 
                                  [routerLink]="['/auth/usuarios/detalles', user.id]"
                                  class="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Ver detalles"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                </button>

                                <!-- Edit (Admin only) -->
                                @if (authService.hasRole(UserRole.ADMIN)) {
                                  <button 
                                    [routerLink]="['/auth/usuarios/editar', user.id]"
                                    class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                    title="Editar usuario"
                                  >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                  </button>
                                }

                                <!-- Activate/Deactivate (Admin only) -->
                                @if (authService.hasRole(UserRole.ADMIN)) {
                                  @if (user.isActive) {
                                    <button 
                                      (click)="deactivateUser(user)"
                                      class="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                      title="Desactivar usuario"
                                    >
                                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                      </svg>
                                    </button>
                                  } @else {
                                    <button 
                                      (click)="activateUser(user)"
                                      class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                      title="Activar usuario"
                                    >
                                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                      </svg>
                                    </button>
                                  }
                                }
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class UsersListComponent implements OnInit {
  authService = inject(AuthService);

  users = signal<User[]>([]);
  loading = signal(true);
  includeInactive = signal(false);

  readonly UserRole = UserRole;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.authService.getAllUsers(this.includeInactive()).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  onToggleInactive(): void {
    this.includeInactive.set(!this.includeInactive());
    this.loadUsers();
  }

  getRoleLabel(role: UserRole): string {
    return UserRoleLabels[role] || role;
  }

  deactivateUser(user: User): void {
    if (!user.id || !confirm(`¿Estás seguro de que deseas desactivar al usuario ${user.name}?`)) {
      return;
    }

    this.authService.deactivateUser(user.id).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
      }
    });
  }

  activateUser(user: User): void {
    if (!user.id || !confirm(`¿Estás seguro de que deseas activar al usuario ${user.name}?`)) {
      return;
    }

    this.authService.activateUser(user.id).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error activating user:', error);
      }
    });
  }
}