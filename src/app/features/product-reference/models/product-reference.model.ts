export interface ReferenceMeasurement {
  id?: string;
  productReferenceId?: string;
  attributeName: string;
  value: number;
  unit: 'metros' | 'cm' | 'unidades';
}

export interface ReferenceMaterial {
  id?: string;
  productReferenceId?: string;
  materialId: string;
  materialName?: string;
  quantityPerUnit: number;
  unit?: string;
}

export interface ProductReference {
  id?: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  measurements?: ReferenceMeasurement[];
  materials?: ReferenceMaterial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductReferenceRequest {
  code: string;
  name: string;
  description?: string;
  measurements: Omit<ReferenceMeasurement, 'id' | 'productReferenceId'>[];
  materials: Omit<ReferenceMaterial, 'id' | 'productReferenceId' | 'materialName' | 'unit'>[];
}

export interface UpdateProductReferenceRequest {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  measurements?: Omit<ReferenceMeasurement, 'id' | 'productReferenceId'>[];
  materials?: Omit<ReferenceMaterial, 'id' | 'productReferenceId' | 'materialName' | 'unit'>[];
}

export interface ProductReferenceResponse {
  id?: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  measurements: ReferenceMeasurement[];
  materials: ReferenceMaterial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductReferencesListResponse {
  success: boolean;
  data: ProductReferenceResponse[];
  total: number;
}

export interface ProductReferenceActionResponse {
  success: boolean;
  message: string;
  data?: ProductReferenceResponse;
}