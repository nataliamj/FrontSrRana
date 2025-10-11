// src/app/features/auth/services/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router'; // ← Agregar esta importación
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { 
  User, 
  LoginRequest, 
  AuthResponse, 
  UserRole, 
  Permission, 
  ROLE_PERMISSIONS,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UsersListResponse,
  UserActionResponse
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router); // ← Inyectar Router aquí
  private apiUrl = environment.apiUrl;
  
  // State management con Signals
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  
  private isAuthenticatedSignal = signal<boolean>(false); // ← Signal separado para autenticación
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  
  public isLoading = signal(false);
  public errorMessage = signal('');

  // Computed values para permisos y roles
  public userPermissions = computed(() => {
    const user = this.currentUser();
    const role = user?.role as UserRole;
    return role ? ROLE_PERMISSIONS[role] : [];
  });

  public userRole = computed(() => {
    return this.currentUser()?.role as UserRole || null;
  });

  constructor() {
    this.checkStoredToken();
  }

  // ========== MÉTODOS DE AUTENTICACIÓN ==========

  async login(credentials: LoginRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const url = `${this.apiUrl}/auth/login`;
      
      const response = await this.http.post<AuthResponse>(url, credentials).toPromise();
      
      if (response?.success) {
        this.currentUserSignal.set(response.user);
        this.isAuthenticatedSignal.set(true); // ← Actualizar signal de autenticación
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        return true;
      } else {
        this.errorMessage.set(response?.message || 'Error en el login');
        return false;
      }
    } catch (error: any) {
      if (error.status === 401) {
        this.errorMessage.set('Credenciales incorrectas');
      } else if (error.status === 0) {
        this.errorMessage.set('Error de conexión con el servidor');
      } else {
        this.errorMessage.set(error.error?.message || 'Error en el servidor');
      }
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  // ========== MÉTODOS DE GESTIÓN DE USUARIOS ==========

  // Obtener todos los usuarios
  getAllUsers(includeInactive: boolean = false): Observable<UsersListResponse> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    
    return this.http.get<UsersListResponse>(`${this.apiUrl}/users`, { params });
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<{ success: boolean; data: UserResponse }> {
    return this.http.get<{ success: boolean; data: UserResponse }>(`${this.apiUrl}/users/${id}`);
  }

  // Crear usuario
  createUser(userData: CreateUserRequest): Observable<UserActionResponse> {
    return this.http.post<UserActionResponse>(`${this.apiUrl}/users`, userData);
  }

  // Actualizar usuario
  updateUser(id: string, userData: UpdateUserRequest): Observable<UserActionResponse> {
    return this.http.put<UserActionResponse>(`${this.apiUrl}/users/${id}`, userData);
  }

  // Desactivar usuario
  deactivateUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/users/${id}/deactivate`, 
      {}
    );
  }

  // Activar usuario
  activateUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/users/${id}/activate`, 
      {}
    );
  }

  // Obtener perfil del usuario actual
  getProfile(): Observable<{ success: boolean; data: UserResponse }> {
    return this.http.get<{ success: boolean; data: UserResponse }>(`${this.apiUrl}/users/profile/me`);
  }

  // ========== MÉTODOS DE VERIFICACIÓN ==========

  // Verificar permisos
  hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Verificar rol
  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.userRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // ========== MÉTODOS PRIVADOS ==========

  private checkStoredToken(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true); // ← Actualizar autenticación
      } catch (error) {
        this.logout();
      }
    }
  }

  logout(): void {
    // Limpiar datos de autenticación
    localStorage.removeItem('auth_token'); // ← Corregir nombre de la key
    localStorage.removeItem('user_data');
    
    // Limpiar el estado actual - CORREGIDO
    this.currentUserSignal.set(null); // ← Usar el signal directamente
    this.isAuthenticatedSignal.set(false); // ← Usar el signal directamente
    
    console.log('🔐 Sesión cerrada - Redirigiendo a login');
    
    // ✅ Redirigir a la página de login
    this.router.navigate(['/auth/login']);
  }
}