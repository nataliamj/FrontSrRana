import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Material, 
  CreateMaterialRequest, 
  UpdateMaterialRequest, 
  MaterialResponse, 
  MaterialsListResponse,
  MaterialActionResponse,
  StockCheckRequest,
  StockCheckResponse
} from '../models/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener todos los materiales
  getAllMaterials(includeInactive: boolean = false): Observable<MaterialsListResponse> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    
    return this.http.get<MaterialsListResponse>(`${this.apiUrl}/materials`, { params });
  }

  // Obtener material por ID
  getMaterialById(id: string): Observable<{ success: boolean; data: MaterialResponse }> {
    return this.http.get<{ success: boolean; data: MaterialResponse }>(`${this.apiUrl}/materials/${id}`);
  }

  // Crear material
  createMaterial(materialData: CreateMaterialRequest): Observable<MaterialActionResponse> {
    return this.http.post<MaterialActionResponse>(`${this.apiUrl}/materials`, materialData);
  }

  // Actualizar material
  updateMaterial(id: string, materialData: UpdateMaterialRequest): Observable<MaterialActionResponse> {
    return this.http.put<MaterialActionResponse>(`${this.apiUrl}/materials/${id}`, materialData);
  }

  // Actualizar stock
  updateStock(id: string, newStock: number): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/materials/${id}/stock`, 
      { newStock }
    );
  }

  // Verificar disponibilidad de stock
  checkStockAvailability(request: StockCheckRequest): Observable<StockCheckResponse> {
    return this.http.post<StockCheckResponse>(`${this.apiUrl}/materials/check-stock`, request);
  }

  // Desactivar material
  deactivateMaterial(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/materials/${id}/deactivate`, 
      {}
    );
  }

  // Activar material
  activateMaterial(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/materials/${id}/activate`, 
      {}
    );
  }
}