import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { ProductReferenceService } from '../../services/product-reference.service';
import { MaterialService } from '../../../material/services/material.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CreateProductReferenceRequest, UpdateProductReferenceRequest, ReferenceMeasurement, ReferenceMaterial } from '../../models/product-reference.model';
import { Material } from '../../../material/models/material.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-reference-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
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
                <h1 class="text-3xl font-bold text-white mb-2">
                  {{ isEditMode() ? 'Editar Referencia' : 'Nueva Referencia' }}
                </h1>
                <p class="text-gray-400">
                  {{ isEditMode() ? 'Modifica la información de la referencia' : 'Crea una nueva referencia de producto con medidas y materiales' }}
                </p>
              </div>

              <!-- Form Card -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <form [formGroup]="referenceForm" (ngSubmit)="onSubmit()" class="space-y-8">
                  
                  <!-- Información Básica -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Code -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Código *</label>
                      <input 
                        type="text" 
                        formControlName="code"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Ej: BOT001, ZAP002"
                      >
                      @if (referenceForm.get('code')?.invalid && referenceForm.get('code')?.touched) {
                        <p class="text-red-400 text-sm mt-1">El código es requerido</p>
                      }
                    </div>

                    <!-- Name -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                      <input 
                        type="text" 
                        formControlName="name"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Ej: Botín Clásico, Zapato Formal"
                      >
                      @if (referenceForm.get('name')?.invalid && referenceForm.get('name')?.touched) {
                        <p class="text-red-400 text-sm mt-1">El nombre es requerido</p>
                      }
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <textarea 
                      formControlName="description"
                      rows="3"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                      placeholder="Descripción detallada del producto..."
                    ></textarea>
                  </div>

                  <!-- Medidas Técnicas -->
                  <div class="border border-gray-600 rounded-2xl p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-semibold text-white">Medidas Técnicas</h3>
                      <button 
                        type="button"
                        (click)="addMeasurement()"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span>Agregar Medida</span>
                      </button>
                    </div>

                    <div formArrayName="measurements" class="space-y-4">
                      @for (measurement of measurements.controls; track $index; let i = $index) {
                        <div [formGroupName]="i" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          <!-- Attribute Name -->
                          <div class="md:col-span-4">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Atributo</label>
                            <input 
                              type="text" 
                              formControlName="attributeName"
                              class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                              placeholder="Ej: Cuerpo, Cuello, Puntera"
                            >
                          </div>

                          <!-- Value -->
                          <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Valor</label>
                            <input 
                              type="number" 
                              formControlName="value"
                              step="0.01"
                              min="0"
                              class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                              placeholder="0.00"
                            >
                          </div>

                          <!-- Unit -->
                          <div class="md:col-span-3">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Unidad</label>
                            <select 
                              formControlName="unit"
                              class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                              <option value="metros">Metros</option>
                              <option value="cm">Centímetros</option>
                              <option value="unidades">Unidades</option>
                            </select>
                          </div>

                          <!-- Remove Button -->
                          <div class="md:col-span-2">
                            <button 
                              type="button"
                              (click)="removeMeasurement(i)"
                              class="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      }
                    </div>

                    @if (measurements.length === 0) {
                      <div class="text-center py-8 text-gray-400">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <p>No hay medidas técnicas agregadas</p>
                      </div>
                    }
                  </div>

                  <!-- Materiales Consumibles -->
                  <div class="border border-gray-600 rounded-2xl p-6">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-semibold text-white">Materiales Consumibles</h3>
                      <button 
                        type="button"
                        (click)="addMaterial()"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span>Agregar Material</span>
                      </button>
                    </div>

                    <div formArrayName="materials" class="space-y-4">
                      @for (material of materialsArray.controls; track $index; let i = $index) {
                        <div [formGroupName]="i" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          <!-- Material Selection -->
                          <div class="md:col-span-5">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Material</label>
                            <select 
                              formControlName="materialId"
                              class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                              <option value="">Selecciona un material</option>
                              @for (material of availableMaterials(); track material.id) {
                                <option [value]="material.id">{{ material.name }} ({{ material.unit }})</option>
                              }
                            </select>
                          </div>

                          <!-- Quantity -->
                          <div class="md:col-span-4">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Cantidad por unidad</label>
                            <input 
                              type="number" 
                              formControlName="quantityPerUnit"
                              step="0.01"
                              min="0"
                              class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                              placeholder="0.00"
                            >
                          </div>

                          <!-- Remove Button -->
                          <div class="md:col-span-3">
                            <button 
                              type="button"
                              (click)="removeMaterial(i)"
                              class="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      }
                    </div>

                    @if (materialsArray.length === 0) {
                      <div class="text-center py-8 text-gray-400">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p>No hay materiales consumibles agregados</p>
                      </div>
                    }
                  </div>

                  <!-- Status (solo para editar) -->
                  @if (isEditMode()) {
                    <div>
                      <label class="flex items-center space-x-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          formControlName="isActive"
                          class="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                        >
                        <span>Referencia activa</span>
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
                      routerLink="/product-references/referencias"
                      class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
                    >
                      Cancelar
                    </button>

                    <button 
                      type="submit" 
                      [disabled]="referenceForm.invalid || loading()"
                      class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      @if (loading()) {
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{{ isEditMode() ? 'Actualizando...' : 'Creando...' }}</span>
                      } @else {
                        <span>{{ isEditMode() ? 'Actualizar Referencia' : 'Crear Referencia' }}</span>
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
export class ProductReferenceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productReferenceService = inject(ProductReferenceService);
  private materialService = inject(MaterialService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  referenceForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  referenceId = signal<string | null>(null);
  availableMaterials = signal<Material[]>([]);

  constructor() {
    this.referenceForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      measurements: this.fb.array([]),
      materials: this.fb.array([]),
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadMaterials();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.referenceId.set(id);
      this.loadReferenceData(id);
    }
  }

  get measurements(): FormArray {
    return this.referenceForm.get('measurements') as FormArray;
  }

  get materialsArray(): FormArray {
    return this.referenceForm.get('materials') as FormArray;
  }

  loadMaterials(): void {
    this.materialService.getAllMaterials().subscribe({
      next: (response) => {
        this.availableMaterials.set(response.data);
      },
      error: (error) => {
        console.error('Error loading materials:', error);
      }
    });
  }

  addMeasurement(): void {
    this.measurements.push(this.fb.group({
      attributeName: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      unit: ['metros', Validators.required]
    }));
  }

  removeMeasurement(index: number): void {
    this.measurements.removeAt(index);
  }

  addMaterial(): void {
    this.materialsArray.push(this.fb.group({
      materialId: ['', Validators.required],
      quantityPerUnit: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeMaterial(index: number): void {
    this.materialsArray.removeAt(index);
  }

  loadReferenceData(id: string): void {
    this.loading.set(true);
    this.productReferenceService.getProductReferenceById(id).subscribe({
      next: (response) => {
        const reference = response.data;
        
        // Limpiar arrays existentes
        while (this.measurements.length !== 0) {
          this.measurements.removeAt(0);
        }
        while (this.materialsArray.length !== 0) {
          this.materialsArray.removeAt(0);
        }

        // Cargar datos básicos
        this.referenceForm.patchValue({
          code: reference.code,
          name: reference.name,
          description: reference.description,
          isActive: reference.isActive
        });

        // Cargar medidas
        if (reference.measurements) {
          reference.measurements.forEach(measurement => {
            this.measurements.push(this.fb.group({
              attributeName: [measurement.attributeName, Validators.required],
              value: [measurement.value, [Validators.required, Validators.min(0)]],
              unit: [measurement.unit, Validators.required]
            }));
          });
        }

        // Cargar materiales
        if (reference.materials) {
          reference.materials.forEach(material => {
            this.materialsArray.push(this.fb.group({
              materialId: [material.materialId, Validators.required],
              quantityPerUnit: [material.quantityPerUnit, [Validators.required, Validators.min(0)]]
            }));
          });
        }

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reference:', error);
        this.errorMessage.set('Error al cargar datos de la referencia');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.referenceForm.valid && this.measurements.length > 0) {
      this.loading.set(true);
      this.errorMessage.set('');

      if (this.isEditMode() && this.referenceId()) {
        this.updateReference();
      } else {
        this.createReference();
      }
    } else {
      this.errorMessage.set('Por favor completa todos los campos requeridos y agrega al menos una medida técnica');
    }
  }

  private createReference(): void {
    const referenceData: CreateProductReferenceRequest = this.referenceForm.value;
    this.productReferenceService.createProductReference(referenceData).subscribe({
      next: (response) => {
        this.router.navigate(['/product-references/referencias']);
      },
      error: (error) => {
        console.error('Error creating reference:', error);
        this.errorMessage.set(error.error?.message || 'Error al crear referencia');
        this.loading.set(false);
      }
    });
  }

  private updateReference(): void {
    const referenceData: UpdateProductReferenceRequest = this.referenceForm.value;
    this.productReferenceService.updateProductReference(this.referenceId()!, referenceData).subscribe({
      next: (response) => {
        this.router.navigate(['/product-references/referencias']);
      },
      error: (error) => {
        console.error('Error updating reference:', error);
        this.errorMessage.set(error.error?.message || 'Error al actualizar referencia');
        this.loading.set(false);
      }
    });
  }
}