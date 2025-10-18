export interface BatchMaterial {
  id?: string;
  batchId?: string;
  materialId: string;
  materialName?: string;
  reservedQuantity: number;
  consumedQuantity?: number;
  unit?: string;
  status?: 'reserved' | 'partially_consumed' | 'consumed' | 'cancelled';
}

export interface ProductionBatch {
  id?: string;
  batchNumber: string;
  productReferenceId: string;
  productReferenceCode?: string;
  productReferenceName?: string;
  targetQuantity: number;
  startDate?: Date;
  expectedEndDate?: Date;
  actualEndDate?: Date;
  status: 'planificado' | 'en_proceso' | 'completado' | 'cancelado';
  createdBy?: string;
  createdByName?: string;
  materials?: BatchMaterial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductionBatchRequest {
  productReferenceId: string;
  targetQuantity: number;
  expectedEndDate?: Date;
}

export interface ProductionBatchResponse {
  id?: string;
  batchNumber: string;
  productReferenceId: string;
  productReferenceCode: string;
  productReferenceName: string;
  targetQuantity: number;
  startDate?: Date;
  expectedEndDate?: Date;
  actualEndDate?: Date;
  status: 'planificado' | 'en_proceso' | 'completado' | 'cancelado';
  createdBy?: string;
  createdByName?: string;
  materials: BatchMaterial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductionBatchesListResponse {
  success: boolean;
  data: ProductionBatchResponse[];
  total: number;
}

export interface ProductionBatchActionResponse {
  success: boolean;
  message: string;
  data?: ProductionBatchResponse;
}