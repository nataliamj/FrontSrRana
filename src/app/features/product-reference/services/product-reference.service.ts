import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  ProductReference, 
  CreateProductReferenceRequest, 
  UpdateProductReferenceRequest, 
  ProductReferenceResponse, 
  ProductReferencesListResponse,
  ProductReferenceActionResponse
} from '../models/product-reference.model';

@Injectable({ providedIn: 'root' })
export class ProductReferenceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener todas las referencias
  getAllProductReferences(includeInactive: boolean = false): Observable<ProductReferencesListResponse> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    
    return this.http.get<ProductReferencesListResponse>(`${this.apiUrl}/product-references`, { params });
  }

  // Obtener referencia por ID
  getProductReferenceById(id: string): Observable<{ success: boolean; data: ProductReferenceResponse }> {
    return this.http.get<{ success: boolean; data: ProductReferenceResponse }>(`${this.apiUrl}/product-references/${id}`);
  }

  // Crear referencia
  createProductReference(referenceData: CreateProductReferenceRequest): Observable<ProductReferenceActionResponse> {
    return this.http.post<ProductReferenceActionResponse>(`${this.apiUrl}/product-references`, referenceData);
  }

  // Actualizar referencia
  updateProductReference(id: string, referenceData: UpdateProductReferenceRequest): Observable<ProductReferenceActionResponse> {
    return this.http.put<ProductReferenceActionResponse>(`${this.apiUrl}/product-references/${id}`, referenceData);
  }

  // Desactivar referencia
  deactivateProductReference(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/product-references/${id}/deactivate`, 
      {}
    );
  }

  // Activar referencia
  activateProductReference(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/product-references/${id}/activate`, 
      {}
    );
  }
}