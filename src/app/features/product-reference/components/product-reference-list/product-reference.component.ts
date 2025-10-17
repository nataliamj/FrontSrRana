import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductReferenceService } from '../../services/product-reference.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductReference } from '../../models/product-reference.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Permission, UserRole } from '../../../auth/models/user.model';

@Component({
  selector: 'app-product-references-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent, HasPermissionDirective],
  template: `
<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
  <!-- Formas difuminadas de fondo -->
  <div class="absolute top-0 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl"></div>
  <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"></div>
  
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
                <h1 class="text-3xl font-bold text-white mb-2">Referencias de Productos</h1>
                <p class="text-gray-400">Administra las referencias y sus especificaciones técnicas</p>
              </div>
              
              <!-- Botón Nueva Referencia -->
              @if (hasCreatePermission()) {
                <button 
                  routerLink="/product-references/referencias/nuevo"
                  class="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Nueva Referencia</span>
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
                    class="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                  >
                  <span>Mostrar referencias inactivas</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Tabla de Referencias -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <!-- Loading State -->
            @if (loading()) {
              <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            }

            <!-- Empty State -->
            @else if (!loading() && references().length === 0) {
              <div class="text-center p-12">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-white mb-2">No hay referencias</h3>
                <p class="text-gray-400">No se encontraron referencias de productos en el sistema.</p>
              </div>
            }

            <!-- References Table -->
            @else if (!loading() && references().length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Referencia</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Medidas</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Materiales</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Registro</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700/50">
                    @for (reference of references(); track reference.id) {
                      <tr class="hover:bg-white/5 transition-colors duration-150">
                        <!-- Reference Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                              {{ reference.code.charAt(0) }}
                            </div>
                            <div>
                              <div class="text-white font-medium">{{ reference.name }}</div>
                              <div class="text-gray-400 text-sm">Código: {{ reference.code }}</div>
                              <div class="text-gray-400 text-sm">{{ reference.description || 'Sin descripción' }}</div>
                            </div>
                          </div>
                        </td>

                        <!-- Measurements -->
                        <td class="px-6 py-4">
                          <div class="text-gray-300 text-sm">
                            <div class="font-medium">{{ reference.measurements?.length || 0 }} medidas</div>
                            @if (reference.measurements && reference.measurements.length > 0) {
                              <div class="text-xs text-gray-400 mt-1">
                                {{ reference.measurements[0].attributeName }}: {{ reference.measurements[0].value }}{{ reference.measurements[0].unit }}
                                @if (reference.measurements.length > 1) {
                                  <span> +{{ reference.measurements.length - 1 }} más</span>
                                }
                              </div>
                            }
                          </div>
                        </td>

                        <!-- Materials -->
                        <td class="px-6 py-4">
                          <div class="text-gray-300 text-sm">
                            <div class="font-medium">{{ reference.materials?.length || 0 }} materiales</div>
                            @if (reference.materials && reference.materials.length > 0) {
                              <div class="text-xs text-gray-400 mt-1">
                                {{ reference.materials[0].materialName }}
                                @if (reference.materials.length > 1) {
                                  <span> +{{ reference.materials.length - 1 }} más</span>
                                }
                              </div>
                            }
                          </div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span 
                            [class]="reference.isActive 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border-red-500/30'"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          >
                            {{ reference.isActive ? 'Activo' : 'Inactivo' }}
                          </span>
                        </td>

                        <!-- Registration Date -->
                        <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {{ reference.createdAt | date:'dd/MM/yyyy' }}
                        </td>

                        <!-- Actions -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-2">
                            <!-- View Details -->
                            <button 
                              [routerLink]="['/product-references/referencias/detalle', reference.id]"
                              class="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                              title="Ver detalles"
                            >
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                            </button>

                            <!-- Edit -->
                            @if (hasEditPermission()) {
                              <button 
                                [routerLink]="['/product-references/referencias/editar', reference.id]"
                                class="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Editar referencia"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                            }

                            <!-- Activate/Deactivate (Admin only) -->
                            @if (hasManagePermission()) {
                              @if (reference.isActive) {
                                <button 
                                  (click)="deactivateReference(reference)"
                                  class="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Desactivar referencia"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                </button>
                              } @else {
                                <button 
                                  (click)="activateReference(reference)"
                                  class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Activar referencia"
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
export class ProductReferencesListComponent implements OnInit {
  private productReferenceService = inject(ProductReferenceService);
  private authService = inject(AuthService);

  references = signal<ProductReference[]>([]);
  loading = signal(true);
  includeInactive = signal(false);

  readonly UserRole = UserRole;
  readonly Permission = Permission; 

  ngOnInit(): void {
    this.loadReferences();
  }

  loadReferences(): void {
    this.loading.set(true);
    this.productReferenceService.getAllProductReferences(this.includeInactive()).subscribe({
      next: (response) => {
        this.references.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading references:', error);
        this.loading.set(false);
      }
    });
  }

  onToggleInactive(): void {
    this.includeInactive.set(!this.includeInactive());
    this.loadReferences();
  }

  hasCreatePermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR]);
  }

  hasEditPermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR]);
  }

  hasManagePermission(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }
  
  deactivateReference(reference: ProductReference): void {
    if (!reference.id || !confirm(`¿Estás seguro de que deseas desactivar la referencia ${reference.code} - ${reference.name}?`)) {
      return;
    }

    this.productReferenceService.deactivateProductReference(reference.id).subscribe({
      next: (response) => {
        this.loadReferences();
      },
      error: (error) => {
        console.error('Error deactivating reference:', error);
      }
    });
  }

  activateReference(reference: ProductReference): void {
    if (!reference.id || !confirm(`¿Estás seguro de que deseas activar la referencia ${reference.code} - ${reference.name}?`)) {
      return;
    }

    this.productReferenceService.activateProductReference(reference.id).subscribe({
      next: (response) => {
        this.loadReferences();
      },
      error: (error) => {
        console.error('Error activating reference:', error);
      }
    });
  }
}