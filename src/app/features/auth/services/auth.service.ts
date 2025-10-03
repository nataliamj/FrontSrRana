import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User, LoginRequest, AuthResponse, UserRole, Permission, ROLE_PERMISSIONS } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  // State management con Signals
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  public isLoading = signal(false);
  public errorMessage = signal('');

  // Computed values para permisos y roles
  public userPermissions = computed(() => {
    const user = this.currentUser();
    return user ? user.permissions : [];
  });

  public userRole = computed(() => {
    return this.currentUser()?.role || null;
  });

  public isAuthenticated = computed(() => {
    return this.currentUser() !== null;
  });

  constructor(private http: HttpClient) {
    this.checkStoredToken();
  }

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

  // Login REAL con HTTP - Listo para tu backend
  async login(credentials: LoginRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const url = `${this.apiUrl}${environment.endpoints.auth.login}`;
      
      // ✅ LLAMADA HTTP REAL a tu backend Express
      const response = await this.http.post<AuthResponse>(url, credentials).toPromise();
      
      if (response?.success) {
        this.currentUserSignal.set(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        return true;
      } else {
        this.errorMessage.set(response?.message || 'Error en el login');
        return false;
      }
    } catch (error: any) {
      // Manejo de errores HTTP reales
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

  // Verificar token almacenado
  private checkStoredToken(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.currentUserSignal.set(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}