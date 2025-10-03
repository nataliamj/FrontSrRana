import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AuthService } from '../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <!-- Formas difuminadas de fondo más visibles -->
      <div class="absolute top-0 left-1/4 w-72 h-72 bg-green-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
      
      <!-- Header primero, ocupa todo el ancho -->
      <app-header></app-header>
      
      <!-- Contenido principal con sidebar y main -->
      <div class="flex relative z-10">
        <app-sidebar></app-sidebar>
        <div class="flex-1 flex flex-col">
          <main class="flex-1 p-8">
            <div class="max-w-6xl mx-auto">
              <!-- Mensaje de bienvenida para usuarios autenticados -->
              @if (authService.isAuthenticated()) {
                <div class="text-center mb-12">
                  <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg mb-6">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <h1 class="text-4xl font-bold text-white mb-4">
                    ¡Bienvenido, {{ authService.currentUser()?.name }}!
                  </h1>
                  <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    Sistema de gestión integral para optimizar tus procesos empresariales
                  </p>
                </div>

                <!-- Accesos rápidos a módulos -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  <!-- Inventario -->
                  <a 
                    routerLink="/inventario" 
                    class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-green-400/30"
                  >
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                      <h3 class="text-white text-xl font-semibold mb-2">Inventario</h3>
                      <p class="text-gray-300">Gestiona stock y productos</p>
                    </div>
                  </a>

                  <!-- Producción -->
                  <a 
                    routerLink="/produccion" 
                    class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-green-400/30"
                  >
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                      <h3 class="text-white text-xl font-semibold mb-2">Producción</h3>
                      <p class="text-gray-300">Control de procesos productivos</p>
                    </div>
                  </a>

                  <!-- Auditoría -->
                  <a 
                    routerLink="/auditoria" 
                    class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-green-400/30"
                  >
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                      </div>
                      <h3 class="text-white text-xl font-semibold mb-2">Auditoría</h3>
                      <p class="text-gray-300">Sistema de control y verificación</p>
                    </div>
                  </a>

                  <!-- Usuarios -->
                  <a 
                    routerLink="/usuarios" 
                    class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-green-400/30"
                  >
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                        </svg>
                      </div>
                      <h3 class="text-white text-xl font-semibold mb-2">Usuarios</h3>
                      <p class="text-gray-300">Administración de usuarios</p>
                    </div>
                  </a>

                  <!-- Informes -->
                  <a 
                    routerLink="/informes" 
                    class="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-green-400/30"
                  >
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <h3 class="text-white text-xl font-semibold mb-2">Informes</h3>
                      <p class="text-gray-300">Reportes y estadísticas</p>
                    </div>
                  </a>
                </div>

                <!-- Panel de resumen -->
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h3 class="text-2xl font-bold text-white mb-6">Resumen del Sistema</h3>
                  <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center p-4 bg-green-600/20 rounded-xl border border-green-500/30">
                      <div class="text-3xl font-bold text-green-400 mb-2">12</div>
                      <p class="text-gray-300">Productos en stock</p>
                    </div>
                    <div class="text-center p-4 bg-blue-600/20 rounded-xl border border-blue-500/30">
                      <div class="text-3xl font-bold text-blue-400 mb-2">8</div>
                      <p class="text-gray-300">Órdenes activas</p>
                    </div>
                    <div class="text-center p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
                      <div class="text-3xl font-bold text-purple-400 mb-2">5</div>
                      <p class="text-gray-300">Usuarios activos</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class HomeComponent {
  authService = inject(AuthService);
}