import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductionBatchService } from '../../services/production-batch.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductionBatch } from '../../models/production-batch.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Permission, UserRole } from '../../../auth/models/user.model';

@Component({
  selector: 'app-production-batches-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent, HasPermissionDirective],
  template: `
<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
  <!-- Formas difuminadas de fondo -->
  <div class="absolute top-0 left-1/4 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/25 rounded-full blur-3xl"></div>
  <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
  
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
                <h1 class="text-3xl font-bold text-white mb-2">Gestión de Lotes de Producción</h1>
                <p class="text-gray-400">Administra los lotes de producción del sistema</p>
              </div>
              
              <!-- Botón Nuevo Lote -->
              @if (hasCreatePermission()) {
                <button 
                  routerLink="/production-batches/lotes/nuevo"
                  class="bg-gradient-to-r from-orange-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Nuevo Lote</span>
                </button>
              }
            </div>
          </div>

          <!-- Tabla de Lotes -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <!-- Loading State -->
            @if (loading()) {
              <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            }

            <!-- Empty State -->
            @else if (!loading() && batches().length === 0) {
              <div class="text-center p-12">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-white mb-2">No hay lotes</h3>
                <p class="text-gray-400">No se encontraron lotes de producción en el sistema.</p>
              </div>
            }

            <!-- Batches Table -->
            @else if (!loading() && batches().length > 0) {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lote</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Referencia</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cantidad</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Inicio</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creado por</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700/50">
                    @for (batch of batches(); track batch.id) {
                      <tr class="hover:bg-white/5 transition-colors duration-150">
                        <!-- Batch Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                              {{ batch.batchNumber.charAt(0) }}
                            </div>
                            <div>
                              <div class="text-white font-medium">{{ batch.batchNumber }}</div>
                              <div class="text-gray-400 text-sm">
                                {{ batch.createdAt | date:'dd/MM/yyyy' }}
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Reference -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-gray-300">
                            <div class="text-sm font-medium">{{ batch.productReferenceName }}</div>
                            <div class="text-xs text-gray-400">{{ batch.productReferenceCode }}</div>
                          </div>
                        </td>

                        <!-- Quantity -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-gray-300 text-lg font-semibold">
                            {{ batch.targetQuantity }}
                          </div>
                          <div class="text-xs text-gray-400">unidades</div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span 
                            [class]="getStatusClass(batch.status)"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          >
                            {{ getStatusText(batch.status) }}
                          </span>
                        </td>

                        <!-- Start Date -->
                        <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {{ batch.startDate ? (batch.startDate | date:'dd/MM/yyyy') : 'No iniciado' }}
                        </td>

                        <!-- Created By -->
                        <td class="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                          {{ batch.createdByName || 'Sistema' }}
                        </td>

                        <!-- Actions -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center space-x-2">
                            <!-- View Details -->
                            <button 
                              [routerLink]="['/production-batches/lotes/detalle', batch.id]"
                              class="text-gray-400 hover:text-orange-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                              title="Ver detalles del lote"
                            >
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                            </button>

                            <!-- Start Batch (solo para lotes planificados) -->
                            @if (hasManagePermission() && batch.status === 'planificado') {
                              <button 
                                (click)="startBatch(batch)"
                                class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Iniciar lote"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                              </button>
                            }

                            <!-- Complete Batch (solo para lotes en proceso) -->
                            @if (hasManagePermission() && batch.status === 'en_proceso') {
                              <button 
                                (click)="completeBatch(batch)"
                                class="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                title="Completar lote"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                              </button>
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
export class ProductionBatchesListComponent implements OnInit {
  private productionBatchService = inject(ProductionBatchService);
  private authService = inject(AuthService);

  batches = signal<ProductionBatch[]>([]);
  loading = signal(true);

  readonly UserRole = UserRole;
  readonly Permission = Permission; 

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.loading.set(true);
    this.productionBatchService.getAllProductionBatches().subscribe({
      next: (response) => {
        this.batches.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading batches:', error);
        this.loading.set(false);
      }
    });
  }

  hasCreatePermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR]);
  }

  hasManagePermission(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISOR]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'planificado':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'en_proceso':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completado':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelado':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'planificado': return 'Planificado';
      case 'en_proceso': return 'En Proceso';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  }

  startBatch(batch: ProductionBatch): void {
    if (!batch.id || !confirm(`¿Estás seguro de que deseas iniciar el lote ${batch.batchNumber}?`)) {
      return;
    }

    this.productionBatchService.startProductionBatch(batch.id).subscribe({
      next: (response) => {
        this.loadBatches();
      },
      error: (error) => {
        console.error('Error starting batch:', error);
        alert('Error al iniciar el lote');
      }
    });
  }

  completeBatch(batch: ProductionBatch): void {
    if (!batch.id || !confirm(`¿Estás seguro de que deseas marcar como completado el lote ${batch.batchNumber}?`)) {
      return;
    }

    this.productionBatchService.completeProductionBatch(batch.id).subscribe({
      next: (response) => {
        this.loadBatches();
      },
      error: (error) => {
        console.error('Error completing batch:', error);
        alert('Error al completar el lote');
      }
    });
  }
}