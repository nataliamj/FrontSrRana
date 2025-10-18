import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  ProductionBatch, 
  CreateProductionBatchRequest, 
  ProductionBatchResponse, 
  ProductionBatchesListResponse,
  ProductionBatchActionResponse
} from '../models/production-batch.model';

@Injectable({ providedIn: 'root' })
export class ProductionBatchService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener todos los lotes
  getAllProductionBatches(): Observable<ProductionBatchesListResponse> {
    return this.http.get<ProductionBatchesListResponse>(`${this.apiUrl}/production-batches`);
  }

  // Obtener lote por ID
  getProductionBatchById(id: string): Observable<{ success: boolean; data: ProductionBatchResponse }> {
    return this.http.get<{ success: boolean; data: ProductionBatchResponse }>(`${this.apiUrl}/production-batches/${id}`);
  }

  // Crear lote
  createProductionBatch(batchData: CreateProductionBatchRequest): Observable<ProductionBatchActionResponse> {
    return this.http.post<ProductionBatchActionResponse>(`${this.apiUrl}/production-batches`, batchData);
  }

  // Cancelar lote
  cancelProductionBatch(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/production-batches/${id}/cancel`, 
      {}
    );
  }

  // Iniciar lote
  startProductionBatch(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/production-batches/${id}/start`, 
      {}
    );
  }

  // Completar lote
  completeProductionBatch(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/production-batches/${id}/complete`, 
      {}
    );
  }
}