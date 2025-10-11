
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router'; 
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
  private router = inject(Router); 
  private apiUrl = environment.apiUrl;
  
  // State management con Signals
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  
  private isAuthenticatedSignal = signal<boolean>(false); 
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  
  public isLoading = signal(false);
  public errorMessage = signal('');


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


  async login(credentials: LoginRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const url = `${this.apiUrl}/auth/login`;
      
      const response = await this.http.post<AuthResponse>(url, credentials).toPromise();
      
      if (response?.success) {
        this.currentUserSignal.set(response.user);
        this.isAuthenticatedSignal.set(true); 
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




  getAllUsers(includeInactive: boolean = false): Observable<UsersListResponse> {
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }
    
    return this.http.get<UsersListResponse>(`${this.apiUrl}/users`, { params });
  }

  getUserById(id: string): Observable<{ success: boolean; data: UserResponse }> {
    return this.http.get<{ success: boolean; data: UserResponse }>(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: CreateUserRequest): Observable<UserActionResponse> {
    return this.http.post<UserActionResponse>(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: string, userData: UpdateUserRequest): Observable<UserActionResponse> {
    return this.http.put<UserActionResponse>(`${this.apiUrl}/users/${id}`, userData);
  }

  deactivateUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/users/${id}/deactivate`, 
      {}
    );
  }

  activateUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/users/${id}/activate`, 
      {}
    );
  }

  getProfile(): Observable<{ success: boolean; data: UserResponse }> {
    return this.http.get<{ success: boolean; data: UserResponse }>(`${this.apiUrl}/users/profile/me`);
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.userRole();
    return userRole ? roles.includes(userRole) : false;
  }



  private checkStoredToken(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true); 
      } catch (error) {
        this.logout();
      }
    }
  }

  logout(): void {
    
    localStorage.removeItem('auth_token'); 
    localStorage.removeItem('user_data');
    
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false); 
    
    console.log('🔐 Sesión cerrada - Redirigiendo a login');
    

    this.router.navigate(['/auth/login']);
  }

  getAuditLogs(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    
  
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key].toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/users/audit/logs`, { params });
  }
}