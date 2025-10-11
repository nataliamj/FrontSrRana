// src/app/features/auth/models/user.model.ts
export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  registerDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  registerDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsersListResponse {
  success: boolean;
  data: UserResponse[];
  total: number;
}

export interface UserActionResponse {
  success: boolean;
  message: string;
  data?: UserResponse;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  success: boolean;
  message: string;
}

// Roles del sistema Sr. Rana
export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  OPERARIO = 'operario',
  BODEGA = 'bodega'
}

// Permisos específicos para Sr. Rana
export enum Permission {
  // Inventario - RF1, RF2
  MATERIAL_READ = 'material:read',
  MATERIAL_WRITE = 'material:write',
  MATERIAL_DELETE = 'material:delete',
  
  // Producción - RF3, RF4, RF5
  PRODUCTION_READ = 'production:read',
  PRODUCTION_WRITE = 'production:write',
  PRODUCTION_UPDATE = 'production:update',
  
  // Reportes - RF6, RF7
  REPORTS_READ = 'reports:read',
  REPORTS_EXPORT = 'reports:export',
  
  // Auditoría - RF8
  AUDIT_READ = 'audit:read',
  
  // Administración
  USER_MANAGE = 'user:manage',
  SYSTEM_CONFIG = 'system:config'
}

// Labels para mostrar en la interfaz
export const UserRoleLabels: { [key in UserRole]: string } = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.SUPERVISOR]: 'Supervisor',
  [UserRole.OPERARIO]: 'Operario',
  [UserRole.BODEGA]: 'Bodega'
};

// Mapeo de roles a permisos para Sr. Rana
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.MATERIAL_READ, Permission.MATERIAL_WRITE, Permission.MATERIAL_DELETE,
    Permission.PRODUCTION_READ, Permission.PRODUCTION_WRITE, Permission.PRODUCTION_UPDATE,
    Permission.REPORTS_READ, Permission.REPORTS_EXPORT,
    Permission.AUDIT_READ,
    Permission.USER_MANAGE, Permission.SYSTEM_CONFIG
  ],
  [UserRole.SUPERVISOR]: [
    Permission.MATERIAL_READ, Permission.MATERIAL_WRITE,
    Permission.PRODUCTION_READ, Permission.PRODUCTION_WRITE, Permission.PRODUCTION_UPDATE,
    Permission.REPORTS_READ, Permission.REPORTS_EXPORT,
    Permission.AUDIT_READ
  ],
  [UserRole.BODEGA]: [
    Permission.MATERIAL_READ, Permission.MATERIAL_WRITE,
    Permission.PRODUCTION_READ
  ],
  [UserRole.OPERARIO]: [
    Permission.PRODUCTION_READ, Permission.PRODUCTION_WRITE
  ]
};