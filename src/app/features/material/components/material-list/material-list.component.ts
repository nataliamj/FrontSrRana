import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MaterialService } from '../../services/material.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Material } from '../../models/material.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Permission, UserRole } from '../../../auth/models/user.model';

@Component({
  selector: 'app-materials-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent, HasPermissionDirective],
  template: `
<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
  <!-- Formas difuminadas de fondo -->
  <div class="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl"></div>
  <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
  
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
                <h1 class="text-3xl font-bold text-white mb-2">Gestión de Materiales</h1>
                <p class="text-gray-400">Administra los materiales del inventario</p>
              </div>
              
              <!-- Botón Nuevo Material -->
              @if (hasCreatePermission()) {
                <button 
                  routerLink="/materials/materiales/nuevo"
                  class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Nuevo Material</span>
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
                    class="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  >
                  <span>Mostrar materiales inactivos</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Tabla de Materiales -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <!-- Loading State -->
            @if (loading()) {
              <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }

            <!-- Empty State -->
            @else if (!loading() && materials().length === 0) {
              <div class="text-center p-12">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-white mb-2">No hay materiales</h3>
                <p class="text-gray-400">No se encontraron materiales en el sistema.</p>
              </div>
            }

            <!-- Materials Table -->
            @else if (!loading() && materials().length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Material</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proveedor</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unidad</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Registro</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700/50">
                    @for (material of materials(); track material.id) {
                      <tr class="hover:bg-white/5 transition-colors duration-150">
                        <!-- Material Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                              {{ material.name.charAt(0) }}
                            </div>
                            <div>
                              <div class="text-white font-medium">{{ material.name }}</div>
                              <div class="text-gray-400 text-sm">{{ material.description || 'Sin descripción' }}</div>
                            </div>
                          </div>
                        </td>

                        <!-- Stock Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-gray-300">
                            <div class="text-sm font-medium">
                              {{ material.currentStock }} / {{ material.minStock }}
                            </div>
                            <div class="text-xs">
                              @if (material.currentStock <= material.minStock) {
                                <span class="text-red-400">Stock bajo</span>
                              } @else if (material.currentStock <= material.minStock * 2) {
                                <span class="text-yellow-400">Stock medio</span>
                              } @else {
                                <span class="text-green-400">Stock suficiente</span>
                              }
                            </div>
                          </div>
                        </td>

                        <!-- Supplier -->
                        <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {{ material.supplierName || 'Sin proveedor' }}
                        </td>

                        <!-- Unit -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {{ material.unit }}
                          </span>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span 
                            [class]="material.isActive 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border-red-500/30'"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          >
                            {{ material.isActive ? 'Activo' : 'Inactivo' }}
                          </span>
                        </td>

                        <!-- Registration Date -->
                        <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {{ material.createdAt | date:'dd/MM/yyyy' }}
                        </td>

                        <!-- Actions -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-2">

                          <!-- Ver Detalle (todos roles editar despues) -->
                              <button 
                                [routerLink]="['/materials/materiales/detalle', material.id]"
                                class="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Ver detalle del material"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                              </button>
                            <!-- Edit -->
                            @if (hasEditPermission()) {
                              <button 
                                [routerLink]="['/materials/materiales/editar', material.id]"
                                class="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Editar material"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                            }

                            <!-- Update Stock -->
                            @if (hasEditPermission()) {
                              <button 
                                (click)="updateStock(material)"
                                class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Actualizar stock"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                              </button>
                            }

                            <!-- Activate/Deactivate (Admin only) -->
                            @if (hasManagePermission()) {
                              @if (material.isActive) {
                                <button 
                                  (click)="deactivateMaterial(material)"
                                  class="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Desactivar material"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                </button>
                              } @else {
                                <button 
                                  (click)="activateMaterial(material)"
                                  class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Activar material"
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
export class MaterialsListComponent implements OnInit {
  private materialService = inject(MaterialService);
  private authService = inject(AuthService);

  materials = signal<Material[]>([]);
  loading = signal(true);
  includeInactive = signal(false);

  readonly UserRole = UserRole;
  readonly Permission = Permission; 

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading.set(true);
    this.materialService.getAllMaterials(this.includeInactive()).subscribe({
      next: (response) => {
        this.materials.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading materials:', error);
        this.loading.set(false);
      }
    });
  }

  onToggleInactive(): void {
    this.includeInactive.set(!this.includeInactive());
    this.loadMaterials();
  }

  hasCreatePermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA]);
  }

  hasEditPermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA]);
  }

  hasManagePermission(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }
  
  deactivateMaterial(material: Material): void {
    if (!material.id || !confirm(`¿Estás seguro de que deseas desactivar el material ${material.name}?`)) {
      return;
    }

    this.materialService.deactivateMaterial(material.id).subscribe({
      next: (response) => {
        this.loadMaterials();
      },
      error: (error) => {
        console.error('Error deactivating material:', error);
      }
    });
  }

  activateMaterial(material: Material): void {
    if (!material.id || !confirm(`¿Estás seguro de que deseas activar el material ${material.name}?`)) {
      return;
    }

    this.materialService.activateMaterial(material.id).subscribe({
      next: (response) => {
        this.loadMaterials();
      },
      error: (error) => {
        console.error('Error activating material:', error);
      }
    });
  }

  updateStock(material: Material): void {
    const newStock = prompt(`Actualizar stock para ${material.name} (actual: ${material.currentStock}):`, material.currentStock.toString());
    
    if (newStock && !isNaN(Number(newStock)) && material.id) {
      const stockValue = Number(newStock);
      if (stockValue < 0) {
        alert('El stock no puede ser negativo');
        return;
      }

      this.materialService.updateStock(material.id, stockValue).subscribe({
        next: (response) => {
          this.loadMaterials();
        },
        error: (error) => {
          console.error('Error updating stock:', error);
          alert('Error al actualizar el stock');
        }
      });
    }
  }
}