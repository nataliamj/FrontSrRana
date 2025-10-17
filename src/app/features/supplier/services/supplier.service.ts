import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Supplier, 
  CreateSupplierRequest, 
  UpdateSupplierRequest, 
  SupplierResponse, 
  SuppliersListResponse,
  SupplierActionResponse 
} from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener todos los proveedores
  getAllSuppliers(includeInactive: boolean = false): Observable<SuppliersListResponse> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    
    return this.http.get<SuppliersListResponse>(`${this.apiUrl}/suppliers`, { params });
  }

  // Obtener proveedor por ID
  getSupplierById(id: string): Observable<{ success: boolean; data: SupplierResponse }> {
    return this.http.get<{ success: boolean; data: SupplierResponse }>(`${this.apiUrl}/suppliers/${id}`);
  }

  // Crear proveedor
  createSupplier(supplierData: CreateSupplierRequest): Observable<SupplierActionResponse> {
    return this.http.post<SupplierActionResponse>(`${this.apiUrl}/suppliers`, supplierData);
  }

  // Actualizar proveedor
  updateSupplier(id: string, supplierData: UpdateSupplierRequest): Observable<SupplierActionResponse> {
    return this.http.put<SupplierActionResponse>(`${this.apiUrl}/suppliers/${id}`, supplierData);
  }

  // Desactivar proveedor
  deactivateSupplier(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/suppliers/${id}/deactivate`, 
      {}
    );
  }

  // Activar proveedor
  activateSupplier(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/suppliers/${id}/activate`, 
      {}
    );
  }
}