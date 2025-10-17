import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { MaterialService } from '../../services/material.service';
import { SupplierService } from '../../../supplier/services/supplier.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CreateMaterialRequest, UpdateMaterialRequest } from '../../models/material.model';
import { Supplier } from '../../../supplier/models/supplier.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
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
            <div class="max-w-4xl mx-auto">
              <!-- Header -->
              <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                  {{ isEditMode() ? 'Editar Material' : 'Nuevo Material' }}
                </h1>
                <p class="text-gray-400">
                  {{ isEditMode() ? 'Modifica la información del material' : 'Agrega un nuevo material al inventario' }}
                </p>
              </div>

              <!-- Form Card -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <form [formGroup]="materialForm" (ngSubmit)="onSubmit()" class="space-y-6">
                  
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Material *</label>
                    <input 
                      type="text" 
                      formControlName="name"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ej: Cuero premium, Agujetas, Suela"
                    >
                    @if (materialForm.get('name')?.invalid && materialForm.get('name')?.touched) {
                      <p class="text-red-400 text-sm mt-1">El nombre es requerido</p>
                    }
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <textarea 
                      formControlName="description"
                      rows="3"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      placeholder="Descripción detallada del material"
                    ></textarea>
                  </div>

                  <!-- Stock Fields -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Current Stock -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Stock Actual *</label>
                      <input 
                        type="number" 
                        formControlName="currentStock"
                        min="0"
                        step="0.01"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="0.00"
                      >
                      @if (materialForm.get('currentStock')?.invalid && materialForm.get('currentStock')?.touched) {
                        <p class="text-red-400 text-sm mt-1">El stock actual es requerido y debe ser positivo</p>
                      }
                    </div>

                    <!-- Minimum Stock -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Stock Mínimo *</label>
                      <input 
                        type="number" 
                        formControlName="minStock"
                        min="0"
                        step="0.01"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="0.00"
                      >
                      @if (materialForm.get('minStock')?.invalid && materialForm.get('minStock')?.touched) {
                        <p class="text-red-400 text-sm mt-1">El stock mínimo es requerido y debe ser positivo</p>
                      }
                    </div>
                  </div>

                  <!-- Unit and Supplier -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Unit -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Unidad de Medida *</label>
                      <select 
                        formControlName="unit"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="">Selecciona una unidad</option>
                        <option value="metros">Metros</option>
                        <option value="unidades">Unidades</option>
                        <option value="pares">Pares</option>
                        <option value="kilogramos">Kilogramos</option>
                      </select>
                      @if (materialForm.get('unit')?.invalid && materialForm.get('unit')?.touched) {
                        <p class="text-red-400 text-sm mt-1">La unidad es requerida</p>
                      }
                    </div>

                    <!-- Supplier -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Proveedor</label>
                      <select 
                        formControlName="supplierId"
                        class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="">Selecciona un proveedor</option>
                        @for (supplier of suppliers(); track supplier.id) {
                          <option [value]="supplier.id">{{ supplier.name }}</option>
                        }
                      </select>
                    </div>
                  </div>

                  <!-- Status (solo para editar) -->
                  @if (isEditMode()) {
                    <div>
                      <label class="flex items-center space-x-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          formControlName="isActive"
                          class="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        >
                        <span>Material activo</span>
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
                      routerLink="/materials/materiales"
                      class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
                    >
                      Cancelar
                    </button>

                    <button 
                      type="submit" 
                      [disabled]="materialForm.invalid || loading()"
                      class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      @if (loading()) {
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{{ isEditMode() ? 'Actualizando...' : 'Creando...' }}</span>
                      } @else {
                        <span>{{ isEditMode() ? 'Actualizar Material' : 'Crear Material' }}</span>
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
export class MaterialFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialService);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  materialForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  materialId = signal<string | null>(null);
  suppliers = signal<Supplier[]>([]);

  constructor() {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      supplierId: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.materialId.set(id);
      this.loadMaterialData(id);
    }
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (response) => {
        this.suppliers.set(response.data);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  loadMaterialData(id: string): void {
    this.loading.set(true);
    this.materialService.getMaterialById(id).subscribe({
      next: (response) => {
        const material = response.data;
        this.materialForm.patchValue({
          name: material.name,
          description: material.description,
          currentStock: material.currentStock,
          minStock: material.minStock,
          unit: material.unit,
          supplierId: material.supplierId,
          isActive: material.isActive
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading material:', error);
        this.errorMessage.set('Error al cargar datos del material');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      if (this.isEditMode() && this.materialId()) {
        this.updateMaterial();
      } else {
        this.createMaterial();
      }
    }
  }

  private createMaterial(): void {
    const materialData: CreateMaterialRequest = this.materialForm.value;
    this.materialService.createMaterial(materialData).subscribe({
      next: (response) => {
        this.router.navigate(['/materials/materiales']);
      },
      error: (error) => {
        console.error('Error creating material:', error);
        this.errorMessage.set(error.error?.message || 'Error al crear material');
        this.loading.set(false);
      }
    });
  }

  private updateMaterial(): void {
    const materialData: UpdateMaterialRequest = this.materialForm.value;
    this.materialService.updateMaterial(this.materialId()!, materialData).subscribe({
      next: (response) => {
        this.router.navigate(['/materials/materiales']);
      },
      error: (error) => {
        console.error('Error updating material:', error);
        this.errorMessage.set(error.error?.message || 'Error al actualizar material');
        this.loading.set(false);
      }
    });
  }
}