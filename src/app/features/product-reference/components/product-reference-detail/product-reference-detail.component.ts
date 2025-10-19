import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductReferenceService } from '../../services/product-reference.service';
import { ProductReference, ReferenceMeasurement, ReferenceMaterial } from '../../models/product-reference.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-reference-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
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
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">Detalle de Referencia</h1>
                <p class="text-gray-400">Información completa de la referencia de producto</p>
              </div>
              
              <button 
                routerLink="/product-references/referencias"
                class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
              >
                Volver a la lista
              </button>
            </div>
          </div>

          <!-- Loading State -->
          @if (loading()) {
            <div class="flex justify-center items-center p-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          }

          <!-- Reference Details -->
          @else if (!loading() && reference()) {
            <div class="space-y-6">
              <!-- Información Básica -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <h2 class="text-xl font-semibold text-white mb-6">Información Básica</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Código</label>
                    <p class="text-white text-lg font-medium">{{ reference()?.code }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                    <p class="text-white text-lg font-medium">{{ reference()?.name }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <p class="text-gray-300">{{ reference()?.description || 'Sin descripción' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                    <span 
                      [class]="reference()?.isActive 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border-red-500/30'"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                    >
                      {{ reference()?.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Fecha de Registro</label>
                    <p class="text-gray-300">{{ reference()?.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                </div>
              </div>

              <!-- Medidas Técnicas -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <h2 class="text-xl font-semibold text-white mb-6">Medidas Técnicas</h2>
                
                <!-- ✅ CORREGIDO: Usar computed properties -->
                @if (measurements().length > 0) {
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @for (measurement of measurements(); track measurement.id) {
                      <div class="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                        <div class="flex justify-between items-start mb-2">
                          <h3 class="text-white font-medium">{{ measurement.attributeName }}</h3>
                          <span class="text-indigo-300 text-sm bg-indigo-500/20 px-2 py-1 rounded-full">
                            {{ measurement.unit }}
                          </span>
                        </div>
                        <p class="text-2xl font-bold text-white">{{ measurement.value }}</p>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-8 text-gray-400">
                    <p>No hay medidas técnicas registradas</p>
                  </div>
                }
              </div>

              <!-- Materiales Consumibles -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <h2 class="text-xl font-semibold text-white mb-6">Materiales Consumibles</h2>
                
                <!-- ✅ CORREGIDO: Usar computed properties -->
                @if (materials().length > 0) {
                  <div class="space-y-4">
                    @for (material of materials(); track material.id) {
                      <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                        <div class="flex items-center space-x-4">
                          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {{ getMaterialInitial(material.materialName) }}
                          </div>
                          <div>
                            <h3 class="text-white font-medium">{{ material.materialName || 'Material' }}</h3>
                            <p class="text-gray-400 text-sm">{{ material.unit || 'Unidad' }}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-white text-lg font-bold">{{ material.quantityPerUnit }}</p>
                          <p class="text-gray-400 text-sm">por unidad</p>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-8 text-gray-400">
                    <p>No hay materiales consumibles registrados</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Error State -->
          @else if (!loading() && !reference()) {
            <div class="text-center p-12">
              <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-white mb-2">Referencia no encontrada</h3>
              <p class="text-gray-400">La referencia solicitada no existe o no está disponible.</p>
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
export class ProductReferenceDetailComponent implements OnInit {
  private productReferenceService = inject(ProductReferenceService);
  private route = inject(ActivatedRoute);

  reference = signal<ProductReference | null>(null);
  loading = signal(true);

  measurements = computed<ReferenceMeasurement[]>(() => 
    this.reference()?.measurements || []
  );

  materials = computed<ReferenceMaterial[]>(() => 
    this.reference()?.materials || []
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReferenceData(id);
    }
  }

  loadReferenceData(id: string): void {
    this.loading.set(true);
    this.productReferenceService.getProductReferenceById(id).subscribe({
      next: (response) => {
        this.reference.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reference:', error);
        this.loading.set(false);
      }
    });
  }

  getMaterialInitial(materialName?: string): string {
    return materialName?.charAt(0) || 'M';
  }
}