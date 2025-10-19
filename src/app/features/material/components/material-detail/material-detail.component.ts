import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

interface MaterialBatch {
  id: string;
  batchNumber: string;
  targetQuantity: number;
  status: string;
  startDate?: Date;
  expectedEndDate?: Date;
  product_reference_code: string;
  product_reference_name: string;
  reserved_quantity: number;
  consumed_quantity?: number;
  reservation_status: string;
}

@Component({
  selector: 'app-material-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  template: `
<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
  <!-- Formas difuminadas de fondo -->
  <div class="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl"></div>
  <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>
  
  <!-- Header -->
  <app-header></app-header>
  
  <!-- Contenido principal con sidebar y main -->
  <div class="flex relative z-10">
    <app-sidebar></app-sidebar>
    
    <div class="flex-1 flex flex-col">
      <main class="flex-1 p-8">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">Detalle de Material</h1>
                <p class="text-gray-400">Información completa del material y lotes asociados</p>
              </div>
              
              <button 
                routerLink="/materials/materiales"
                class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
              >
                Volver a la lista
              </button>
            </div>
          </div>

          <!-- Loading State -->
          @if (loading()) {
            <div class="flex justify-center items-center p-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }

          <!-- Material Details -->
          @else if (!loading() && material()) {
            <div class="space-y-6">
              <!-- Información Básica del Material -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <h2 class="text-xl font-semibold text-white mb-6">Información del Material</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                    <p class="text-white text-lg font-medium">{{ material()?.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Código/Referencia</label>
                    <p class="text-white text-lg font-medium">{{ material()?.id?.substring(0, 8) }}...</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Unidad</label>
                    <p class="text-white text-lg font-medium">{{ material()?.unit }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Proveedor</label>
                    <p class="text-white text-lg font-medium">{{ material()?.supplierName || 'No asignado' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <p class="text-gray-300">{{ material()?.description || 'Sin descripción' }}</p>
                  </div>
                </div>
              </div>

              <!-- Estado de Stock -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <h2 class="text-xl font-semibold text-white mb-6">Estado de Inventario</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Stock Total -->
                  <div class="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-white font-medium">Stock Total</h3>
                      <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-white">{{ material()?.currentStock | number:'1.2-2' }}</p>
                    <p class="text-gray-400 text-sm">Cantidad física en bodega</p>
                  </div>

                  <!-- Stock Reservado -->
                  <div class="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-white font-medium">Stock Reservado</h3>
                      <div class="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-yellow-300">{{ material()?.reservedStock | number:'1.2-2' }}</p>
                    <p class="text-yellow-400 text-sm">En lotes planificados</p>
                  </div>

                  <!-- Stock Disponible -->
                  <div class="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-white font-medium">Stock Disponible</h3>
                      <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-green-300">{{ material()?.availableStock | number:'1.2-2' }}</p>
                    <p class="text-green-400 text-sm">Para nuevos lotes</p>
                  </div>
                </div>

                <!-- Alerta de Stock Mínimo -->
               @if ((material()?.availableStock ?? 0) <= (material()?.minStock ?? 0)) {
                  <div class="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <span class="text-red-300">Stock disponible por debajo del mínimo ({{ material()?.minStock }})</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Lotes que Usan este Material -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-white">Lotes con este Material</h2>
                  <span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {{ batches().length }} lote(s) activo(s)
                  </span>
                </div>

                @if (batches().length > 0) {
                  <div class="space-y-4">
                    @for (batch of batches(); track batch.id) {
                      <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-colors">
                        <div class="flex items-center space-x-4">
                          <div [class]="getBatchStatusClass(batch.status)" class="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {{ batch.batchNumber.substring(0, 3) }}
                          </div>
                          <div>
                            <h3 class="text-white font-medium">{{ batch.batchNumber }}</h3>
                            <p class="text-gray-400 text-sm">
                              {{ batch.product_reference_name }} ({{ batch.product_reference_code }})
                            </p>
                            <div class="flex items-center space-x-4 mt-1">
                              <span class="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                                {{ batch.targetQuantity }} unidades
                              </span>
                              <span [class]="getStatusBadgeClass(batch.status)" class="text-xs px-2 py-1 rounded-full">
                                {{ getStatusText(batch.status) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="text-right">
                          <div class="text-white text-lg font-bold">
                            {{ batch.reserved_quantity | number:'1.2-2' }} {{ material()?.unit }}
                          </div>
                          <div class="text-gray-400 text-sm">
                            @if (batch.consumed_quantity && batch.consumed_quantity > 0) {
                              <span class="text-green-400">{{ batch.consumed_quantity | number:'1.2-2' }} consumidos</span>
                            } @else {
                              <span>Reservado</span>
                            }
                          </div>
                          <div class="text-gray-500 text-xs mt-1">
                            {{ batch.startDate ? (batch.startDate | date:'dd/MM/yyyy') : 'No iniciado' }}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-12 text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <h3 class="text-lg font-medium text-white mb-2">No hay lotes activos</h3>
                    <p>Este material no está siendo utilizado en lotes de producción activos.</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Error State -->
          @else if (!loading() && !material()) {
            <div class="text-center p-12">
              <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-white mb-2">Material no encontrado</h3>
              <p class="text-gray-400">El material solicitado no existe o no está disponible.</p>
            </div>
          }
        </div>
      </main>
    </div>
  </div>
</div>
  `,
  styles: ``
})
export class MaterialDetailComponent implements OnInit {
  private materialService = inject(MaterialService);
  private route = inject(ActivatedRoute);

  material = signal<Material | null>(null);
  batches = signal<MaterialBatch[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMaterialData(id);
    }
  }

  loadMaterialData(id: string): void {
    this.loading.set(true);
    
    // Cargar material
    this.materialService.getMaterialById(id).subscribe({
      next: (response) => {
        this.material.set(response.data);
        
        // Cargar lotes del material
        this.materialService.getMaterialBatches(id).subscribe({
          next: (batchResponse) => {
            this.batches.set(batchResponse.data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error loading material batches:', error);
            this.loading.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error loading material:', error);
        this.loading.set(false);
      }
    });
  }

  getBatchStatusClass(status: string): string {
    switch (status) {
      case 'planificado': return 'bg-blue-500';
      case 'en_proceso': return 'bg-yellow-500';
      case 'completado': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'planificado': return 'bg-blue-500/20 text-blue-300';
      case 'en_proceso': return 'bg-yellow-500/20 text-yellow-300';
      case 'completado': return 'bg-green-500/20 text-green-300';
      case 'cancelado': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
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
}