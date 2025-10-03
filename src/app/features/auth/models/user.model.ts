export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  registerDate: Date;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
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
