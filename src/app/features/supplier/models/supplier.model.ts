export interface Supplier {
  id?: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSupplierRequest {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

export interface SupplierResponse {
  id?: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SuppliersListResponse {
  success: boolean;
  data: SupplierResponse[];
  total: number;
}

export interface SupplierActionResponse {
  success: boolean;
  message: string;
  data?: SupplierResponse;
}