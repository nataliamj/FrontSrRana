import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SupplierService } from '../../services/supplier.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Supplier } from '../../models/supplier.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Permission, UserRole } from '../../../auth/models/user.model';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent, HasPermissionDirective],
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
                <h1 class="text-3xl font-bold text-white mb-2">Gestión de Proveedores</h1>
                <p class="text-gray-400">Administra los proveedores del sistema Sr. Rana</p>
              </div>
              
              <!-- Botón Nuevo Proveedor -->
              @if (hasCreatePermission()) {
                <button 
                  routerLink="/suppliers/proveedores/nuevo"
                  class="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Nuevo Proveedor</span>
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
                  <span>Mostrar proveedores inactivos</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Tabla de Proveedores -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <!-- Loading State -->
            @if (loading()) {
              <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            }

            <!-- Empty State -->
            @else if (!loading() && suppliers().length === 0) {
              <div class="text-center p-12">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-white mb-2">No hay proveedores</h3>
                <p class="text-gray-400">No se encontraron proveedores en el sistema.</p>
              </div>
            }

            <!-- Suppliers Table -->
            @else if (!loading() && suppliers().length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proveedor</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Registro</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700/50">
                    @for (supplier of suppliers(); track supplier.id) {
                      <tr class="hover:bg-white/5 transition-colors duration-150">
                        <!-- Supplier Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                              {{ supplier.name.charAt(0) }}
                            </div>
                            <div>
                              <div class="text-white font-medium">{{ supplier.name }}</div>
                              <div class="text-gray-400 text-sm">{{ supplier.email || 'Sin email' }}</div>
                            </div>
                          </div>
                        </td>

                        <!-- Contact -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-gray-300">
                            <div class="text-sm">{{ supplier.contactName || 'Sin contacto' }}</div>
                            <div class="text-xs text-gray-400">{{ supplier.phone || 'Sin teléfono' }}</div>
                          </div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span 
                            [class]="supplier.isActive 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border-red-500/30'"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          >
                            {{ supplier.isActive ? 'Activo' : 'Inactivo' }}
                          </span>
                        </td>

                        <!-- Registration Date -->
                        <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {{ supplier.createdAt | date:'dd/MM/yyyy' }}
                        </td>

                        <!-- Actions -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-2">
                            <!-- Edit -->
                            @if (hasEditPermission()) {
                              <button 
                                [routerLink]="['/suppliers/proveedores/editar', supplier.id]"
                                class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Editar proveedor"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                            }

                            <!-- Activate/Deactivate (Admin only) -->
                            @if (hasManagePermission()) {
                              @if (supplier.isActive) {
                                <button 
                                  (click)="deactivateSupplier(supplier)"
                                  class="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Desactivar proveedor"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                </button>
                              } @else {
                                <button 
                                  (click)="activateSupplier(supplier)"
                                  class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Activar proveedor"
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
export class SuppliersListComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private authService = inject(AuthService);

  suppliers = signal<Supplier[]>([]);
  loading = signal(true);
  includeInactive = signal(false);

  readonly UserRole = UserRole;
  readonly Permission = Permission; 

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.supplierService.getAllSuppliers(this.includeInactive()).subscribe({
      next: (response) => {
        this.suppliers.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.loading.set(false);
      }
    });
  }


  onToggleInactive(): void {
    this.includeInactive.set(!this.includeInactive());
    this.loadSuppliers();
  }



  hasCreatePermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA]);
  }

  hasEditPermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR]);
  }

  hasManagePermission(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);

  }
  
  deactivateSupplier(supplier: Supplier): void {
    if (!supplier.id || !confirm(`¿Estás seguro de que deseas desactivar al proveedor ${supplier.name}?`)) {
      return;
    }

    this.supplierService.deactivateSupplier(supplier.id).subscribe({
      next: (response) => {
        this.loadSuppliers();
      },
      error: (error) => {
        console.error('Error deactivating supplier:', error);
      }
    });
  }

  activateSupplier(supplier: Supplier): void {
    if (!supplier.id || !confirm(`¿Estás seguro de que deseas activar al proveedor ${supplier.name}?`)) {
      return;
    }

    this.supplierService.activateSupplier(supplier.id).subscribe({
      next: (response) => {
        this.loadSuppliers();
      },
      error: (error) => {
        console.error('Error activating supplier:', error);
      }
    });
  }
}