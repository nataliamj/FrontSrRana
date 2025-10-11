// src/app/features/auth/components/audit-list/audit-list.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  actionType: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout';
  tableName: string;
  recordId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

interface AuditFilters {
  startDate?: string;
  endDate?: string;
  actionType?: string;
  tableName?: string;
  userId?: string;
}

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule,
    SidebarComponent, 
    HeaderComponent
  ],
  providers: [DatePipe],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <!-- Formas difuminadas de fondo -->
      <div class="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Contenido principal con sidebar y main -->
      <div class="flex relative z-10">
        <app-sidebar></app-sidebar>
        
        <div class="flex-1 flex flex-col">
          <main class="flex-1 p-8">
            <div class="max-w-7xl mx-auto">
              <!-- Header de la página -->
              <div class="mb-8">
                <div class="flex justify-between items-center">
                  <div>
                    <h1 class="text-3xl font-bold text-white mb-2">Auditoría del Sistema</h1>
                    <p class="text-gray-400">Registro de actividades y cambios en el sistema Sr. Rana</p>
                  </div>
                  
                  <!-- Botón Exportar (futura funcionalidad) -->
                  @if (hasAdminRole()) {
                    <button 
                      (click)="exportAuditLogs()"
                      class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
                      [disabled]="loading()"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span>Exportar</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Filtros -->
              <div class="mb-6">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Fecha Inicio -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Fecha Inicio</label>
                      <input 
                        type="date" 
                        [(ngModel)]="filters.startDate"
                        (change)="applyFilters()"
                        class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      >
                    </div>

                    <!-- Fecha Fin -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Fecha Fin</label>
                      <input 
                        type="date" 
                        [(ngModel)]="filters.endDate"
                        (change)="applyFilters()"
                        class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      >
                    </div>

                    <!-- Tipo de Acción -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Acción</label>
                      <select 
                        [(ngModel)]="filters.actionType"
                        (change)="applyFilters()"
                        class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      >
                        <option value="">Todos</option>
                        <option value="create">Crear</option>
                        <option value="read">Leer</option>
                        <option value="update">Actualizar</option>
                        <option value="delete">Eliminar</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                      </select>
                    </div>

                    <!-- Tabla -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Tabla</label>
                      <select 
                        [(ngModel)]="filters.tableName"
                        (change)="applyFilters()"
                        class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      >
                        <option value="">Todas</option>
                        <option value="users">Usuarios</option>
                        <option value="materials">Materiales</option>
                        <option value="production_batches">Lotes Producción</option>
                        <option value="suppliers">Proveedores</option>
                      </select>
                    </div>
                  </div>

                  <!-- Botones de acción de filtros -->
                  <div class="flex justify-between items-center mt-4">
                    <div class="text-gray-300 text-sm">
                      Mostrando {{ auditLogs().length }} registros
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        (click)="clearFilters()"
                        class="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 border border-gray-600"
                      >
                        Limpiar Filtros
                      </button>
                      <button 
                        (click)="loadAuditLogs()"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        [disabled]="loading()"
                      >
                        @if (loading()) {
                          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        }
                        <span>Actualizar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabla de Auditoría -->
              <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <!-- Loading State -->
                @if (loading()) {
                  <div class="flex justify-center items-center p-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                }

                <!-- Empty State -->
                @else if (!loading() && auditLogs().length === 0) {
                  <div class="text-center p-12">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">No hay registros de auditoría</h3>
                    <p class="text-gray-400">No se encontraron registros con los filtros aplicados.</p>
                  </div>
                }

                <!-- Audit Table -->
                @else if (!loading() && auditLogs().length > 0) {
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-700/50">
                        <tr>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acción</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tabla</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID Registro</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha/Hora</th>
                          <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-700/50">
                        @for (log of auditLogs(); track log.id) {
                          <tr class="hover:bg-white/5 transition-colors duration-150">
                            <!-- User Info -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs mr-3">
                                  {{ getUserInitial(log.userName) }}
                                </div>
                                <div>
                                  <div class="text-white font-medium text-sm">{{ log.userName || 'Usuario' }}</div>
                                  <div class="text-gray-400 text-xs">{{ log.userEmail || 'N/A' }}</div>
                                </div>
                              </div>
                            </td>

                            <!-- Action Type -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span 
                                [class]="getActionClass(log.actionType)"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                              >
                                {{ getActionLabel(log.actionType) }}
                              </span>
                            </td>

                            <!-- Table Name -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-gray-300 text-sm font-mono">
                                {{ log.tableName }}
                              </span>
                            </td>

                            <!-- Record ID -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-gray-400 text-sm font-mono">
                                {{ log.recordId ? log.recordId.substring(0, 8) + '...' : 'N/A' }}
                              </span>
                            </td>

                            <!-- IP Address -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-gray-400 text-sm">
                                {{ log.ipAddress || 'N/A' }}
                              </span>
                            </td>

                            <!-- Timestamp -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-gray-300 text-sm">
                                {{ log.timestamp | date:'dd/MM/yyyy' }}
                              </div>
                              <div class="text-gray-400 text-xs">
                                {{ log.timestamp | date:'HH:mm:ss' }}
                              </div>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center space-x-2">
                                <!-- View Details -->
                                <button 
                                  (click)="viewLogDetails(log)"
                                  class="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                  title="Ver detalles"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                </button>

                                <!-- Export (Admin only) -->
                                @if (hasAdminRole()) {
                                  <button 
                                    (click)="exportSingleLog(log)"
                                    class="text-gray-400 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                                    title="Exportar registro"
                                  >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                  </button>
                                }
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AuditListComponent implements OnInit {
  // ✅ Cambiar de private a public para que sea accesible desde el template
  authService = inject(AuthService);
  private datePipe = inject(DatePipe);

  auditLogs = signal<AuditLog[]>([]);
  loading = signal(true);
  filters: AuditFilters = {};

  readonly UserRole = UserRole;

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading.set(true);
    
    // Llamar al servicio de auditoría
    this.authService.getAuditLogs(this.filters).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.auditLogs.set(response.data);
        } else {
          console.error('Error loading audit logs:', response.message);
          this.auditLogs.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.loading.set(false);
        this.auditLogs.set([]);
      }
    });
  }

  applyFilters(): void {
    this.loadAuditLogs();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadAuditLogs();
  }

  // ✅ Método helper para obtener inicial del usuario
  getUserInitial(userName: string): string {
    return userName ? userName.charAt(0) : 'U';
  }

  getActionLabel(actionType: string): string {
    const labels: { [key: string]: string } = {
      'create': 'Crear',
      'read': 'Leer',
      'update': 'Actualizar',
      'delete': 'Eliminar',
      'login': 'Login',
      'logout': 'Logout'
    };
    return labels[actionType] || actionType;
  }

  getActionClass(actionType: string): string {
    const classes: { [key: string]: string } = {
      'create': 'bg-green-500/20 text-green-300 border-green-500/30',
      'read': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'update': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'delete': 'bg-red-500/20 text-red-300 border-red-500/30',
      'login': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'logout': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return classes[actionType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }

  // ✅ Método helper para verificar rol de admin
  hasAdminRole(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  viewLogDetails(log: AuditLog): void {
    // Aquí puedes implementar un modal o diálogo para mostrar detalles completos
    console.log('View log details:', log);
    
    // Mostrar detalles en un alert por ahora (puedes reemplazar con un modal)
    const details = `
      Usuario: ${log.userName} (${log.userEmail})
      Acción: ${this.getActionLabel(log.actionType)}
      Tabla: ${log.tableName}
      ID Registro: ${log.recordId || 'N/A'}
      IP: ${log.ipAddress || 'N/A'}
      Fecha: ${this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
      User Agent: ${log.userAgent || 'N/A'}
    `;
    
    alert(details);
  }

  exportAuditLogs(): void {
    // Implementar exportación de logs
    console.log('Exporting audit logs...');
    // Aquí puedes implementar la lógica para exportar a CSV, PDF, etc.
  }

  exportSingleLog(log: AuditLog): void {
    // Implementar exportación de un log específico
    console.log('Exporting single log:', log);
  }
}