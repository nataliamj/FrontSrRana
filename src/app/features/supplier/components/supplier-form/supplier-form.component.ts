import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { SupplierService } from '../../services/supplier.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CreateSupplierRequest, UpdateSupplierRequest } from '../../models/supplier.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent, HeaderComponent],
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
            <div class="max-w-4xl mx-auto">
              <!-- Header -->
              <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                  {{ isEditMode() ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
                </h1>
                <p class="text-gray-400">
                  {{ isEditMode() ? 'Modifica la información del proveedor' : 'Agrega un nuevo proveedor al sistema' }}
                </p>
              </div>

              <!-- Form Card -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <form [formGroup]="supplierForm" (ngSubmit)="onSubmit()" class="space-y-6">
                  
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Proveedor *</label>
                    <input 
                      type="text" 
                      formControlName="name"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Ingresa el nombre del proveedor"
                    >
                    @if (supplierForm.get('name')?.invalid && supplierForm.get('name')?.touched) {
                      <p class="text-red-400 text-sm mt-1">El nombre es requerido</p>
                    }
                  </div>

                  <!-- Contact Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nombre de Contacto</label>
                    <input 
                      type="text" 
                      formControlName="contactName"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Persona de contacto"
                    >
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                    <input 
                      type="email" 
                      formControlName="email"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="proveedor@empresa.com"
                    >
                    @if (supplierForm.get('email')?.invalid && supplierForm.get('email')?.touched) {
                      <p class="text-red-400 text-sm mt-1">Email válido requerido</p>
                    }
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                    <input 
                      type="tel" 
                      formControlName="phone"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="+57 300 123 4567"
                    >
                  </div>

                  <!-- Address -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
                    <textarea 
                      formControlName="address"
                      rows="3"
                      class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                      placeholder="Dirección completa del proveedor"
                    ></textarea>
                  </div>

                  <!-- Status (solo para editar) -->
                  @if (isEditMode()) {
                    <div>
                      <label class="flex items-center space-x-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          formControlName="isActive"
                          class="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        >
                        <span>Proveedor activo</span>
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
                      routerLink="/proveedores"
                      class="px-6 py-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-gray-600"
                    >
                      Cancelar
                    </button>

                    <button 
                      type="submit" 
                      [disabled]="supplierForm.invalid || loading()"
                      class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      @if (loading()) {
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{{ isEditMode() ? 'Actualizando...' : 'Creando...' }}</span>
                      } @else {
                        <span>{{ isEditMode() ? 'Actualizar Proveedor' : 'Crear Proveedor' }}</span>
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
export class SupplierFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  supplierForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  supplierId = signal<string | null>(null);

  constructor() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactName: [''],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.supplierId.set(id);
      this.loadSupplierData(id);
    }
  }

  loadSupplierData(id: string): void {
    this.loading.set(true);
    this.supplierService.getSupplierById(id).subscribe({
      next: (response) => {
        const supplier = response.data;
        this.supplierForm.patchValue({
          name: supplier.name,
          contactName: supplier.contactName,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          isActive: supplier.isActive
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading supplier:', error);
        this.errorMessage.set('Error al cargar datos del proveedor');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      if (this.isEditMode() && this.supplierId()) {
        this.updateSupplier();
      } else {
        this.createSupplier();
      }
    }
  }

  private createSupplier(): void {
    const supplierData: CreateSupplierRequest = this.supplierForm.value;
    this.supplierService.createSupplier(supplierData).subscribe({
      next: (response) => {
        this.router.navigate(['/suppliers/proveedores']);
      },
      error: (error) => {
        console.error('Error creating supplier:', error);
        this.errorMessage.set(error.error?.message || 'Error al crear proveedor');
        this.loading.set(false);
      }
    });
  }

  private updateSupplier(): void {
    const supplierData: UpdateSupplierRequest = this.supplierForm.value;
    this.supplierService.updateSupplier(this.supplierId()!, supplierData).subscribe({
      next: (response) => {
        this.router.navigate(['/proveedores']);
      },
      error: (error) => {
        console.error('Error updating supplier:', error);
        this.errorMessage.set(error.error?.message || 'Error al actualizar proveedor');
        this.loading.set(false);
      }
    });
  }
}