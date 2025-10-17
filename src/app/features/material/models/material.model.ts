export interface Material {
  id?: string;
  name: string;
  description?: string;
  currentStock: number;
  minStock: number;
  unit: 'metros' | 'unidades' | 'pares' | 'kilogramos';
  supplierId?: string;
  supplierName?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMaterialRequest {
  name: string;
  description?: string;
  currentStock: number;
  minStock: number;
  unit: 'metros' | 'unidades' | 'pares' | 'kilogramos';
  supplierId?: string;
}

export interface UpdateMaterialRequest {
  name?: string;
  description?: string;
  currentStock?: number;
  minStock?: number;
  unit?: 'metros' | 'unidades' | 'pares' | 'kilogramos';
  supplierId?: string;
  isActive?: boolean;
}

export interface MaterialResponse {
  id?: string;
  name: string;
  description?: string;
  currentStock: number;
  minStock: number;
  unit: 'metros' | 'unidades' | 'pares' | 'kilogramos';
  supplierId?: string;
  supplierName?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MaterialsListResponse {
  success: boolean;
  data: MaterialResponse[];
  total: number;
}

export interface MaterialActionResponse {
  success: boolean;
  message: string;
  data?: MaterialResponse;
}

export interface StockCheckRequest {
  materialId: string;
  requiredQuantity: number;
}

export interface StockCheckResponse {
  success: boolean;
  data: {
    isAvailable: boolean;
    materialId: string;
    requiredQuantity: number;
  };
}