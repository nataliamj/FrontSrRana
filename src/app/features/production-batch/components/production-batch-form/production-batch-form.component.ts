import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ProductionBatchService } from '../../services/production-batch.service';
import { ProductReferenceService } from '../../../product-reference/services/product-reference.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CreateProductionBatchRequest } from '../../models/production-batch.model';
import { ProductReference } from '../../../product-reference/models/product-reference.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-production-batch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
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
            <div class="max-w-4xl mx-auto">
              <!-- Header -->
              <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                  Nuevo Lote de Producción
                </h1>
                <p class="text-gray-400">
                  Crea un nuevo lote de producción con cálculo automático de materiales
                </p>
              </div>

              <!-- Form Card -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <form [formGroup]="batchForm" (ngSubmit)="onSubmit()" class="space-y-6">
                  
                  <!-- Product Reference -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Referencia de Producto *</label>
                    <select 
                      formControlName="productReferenceId"
                      (change)="onReferenceChange()"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                      <option value="">Selecciona una referencia</option>
                      @for (reference of references(); track reference.id) {
                        <option [value]="reference.id">{{ reference.code }} - {{ reference.name }}</option>
                      }
                    </select>
                    @if (batchForm.get('productReferenceId')?.invalid && batchForm.get('productReferenceId')?.touched) {
                      <p class="text-red-400 text-sm mt-1">La referencia de producto es requerida</p>
                    }
                  </div>

                  <!-- Target Quantity -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Cantidad Objetivo (unidades) *</label>
                    <input 
                      type="number" 
                      formControlName="targetQuantity"
                      min="1"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Ej: 100, 500, 1000"
                    >
                    @if (batchForm.get('targetQuantity')?.invalid && batchForm.get('targetQuantity')?.touched) {
                      <p class="text-red-400 text-sm mt-1">La cantidad objetivo es requerida y debe ser mayor a 0</p>
                    }
                  </div>

                  <!-- Expected End Date -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Fecha Esperada de Finalización</label>
                    <input 
                      type="date" 
                      formControlName="expectedEndDate"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                  </div>

                  <!-- Materiales Calculados -->
                  @if (selectedReference() && batchForm.get('targetQuantity')?.value > 0) {
                    <div class="border border-orange-500/30 rounded-2xl p-6 bg-orange-500/10">
                      <h3 class="text-lg font-semibold text-orange-300 mb-4">Materiales Requeridos (Cálculo Automático)</h3>
                      
                      <div class="space-y-3">
                        @for (material of selectedReference()!.materials; track material.materialId) {
                          <div class="flex justify-between items-center p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                            <div>
                              <div class="text-white font-medium">{{ material.materialName }}</div>
                              <div class="text-orange-200 text-sm">{{ material.quantityPerUnit }} {{ material.unit }} por unidad</div>
                            </div>
                            <div class="text-right">
                              <div class="text-white text-lg font-bold">
                                {{ calculateMaterialQuantity(material.quantityPerUnit) }} {{ material.unit }}
                              </div>
                              <div class="text-orange-200 text-sm">Total requerido</div>
                            </div>
                          </div>
                        }
                      </div>

                      <div class="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                        <div class="text-green-300 text-sm">
                          <strong>Nota:</strong> Los materiales serán reservados automáticamente al crear el lote.
                        </div>
                      </div>
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
                      routerLink="/production-batches/lotes"
                      class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
                    >
                      Cancelar
                    </button>

                    <button 
                      type="submit" 
                      [disabled]="batchForm.invalid || loading()"
                      class="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-xl hover:from-orange-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      @if (loading()) {
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creando...</span>
                      } @else {
                        <span>Crear Lote</span>
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
export class ProductionBatchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productionBatchService = inject(ProductionBatchService);
  private productReferenceService = inject(ProductReferenceService);
  private router = inject(Router);

  batchForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  references = signal<ProductReference[]>([]);
  selectedReference = signal<ProductReference | null>(null);

  constructor() {
    this.batchForm = this.fb.group({
      productReferenceId: ['', Validators.required],
      targetQuantity: [0, [Validators.required, Validators.min(1)]],
      expectedEndDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadReferences();
  }

  loadReferences(): void {
    this.productReferenceService.getAllProductReferences().subscribe({
      next: (response) => {
        this.references.set(response.data);
      },
      error: (error) => {
        console.error('Error loading references:', error);
        this.errorMessage.set('Error al cargar referencias de productos');
      }
    });
  }

  onReferenceChange(): void {
    const referenceId = this.batchForm.get('productReferenceId')?.value;
    if (referenceId) {
      const reference = this.references().find(ref => ref.id === referenceId);
      this.selectedReference.set(reference || null);
    } else {
      this.selectedReference.set(null);
    }
  }

  calculateMaterialQuantity(quantityPerUnit: number): number {
    const targetQuantity = this.batchForm.get('targetQuantity')?.value || 0;
    return targetQuantity * quantityPerUnit;
  }

  onSubmit(): void {
    if (this.batchForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const batchData: CreateProductionBatchRequest = {
        productReferenceId: this.batchForm.value.productReferenceId,
        targetQuantity: this.batchForm.value.targetQuantity,
        expectedEndDate: this.batchForm.value.expectedEndDate ? new Date(this.batchForm.value.expectedEndDate) : undefined
      };

      this.productionBatchService.createProductionBatch(batchData).subscribe({
        next: (response) => {
          this.router.navigate(['/production-batches/lotes']);
        },
        error: (error) => {
          console.error('Error creating batch:', error);
          this.errorMessage.set(error.error?.message || 'Error al crear lote de producción');
          this.loading.set(false);
        }
      });
    }
  }
}