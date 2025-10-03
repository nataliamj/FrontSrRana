import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen w-64 bg-gray-800/80 backdrop-blur-lg border-r border-gray-600/50 shadow-2xl">
      <!-- Logo -->
     

      <!-- Menú de navegación -->
      <nav class="p-4 space-y-2">
        <!-- Home -->
        <a 
          routerLink="/home" 
          routerLinkActive="bg-green-600/80 text-white shadow-lg"
          class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md transition-all duration-200 group"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Inicio
        </a>

        <!-- Inventario -->
        <a 
          routerLink="/inventario" 
          routerLinkActive="bg-green-600/80 text-white shadow-lg"
          class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md transition-all duration-200 group"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          Inventario
        </a>

        <!-- Producción -->
        <a 
          routerLink="/produccion" 
          routerLinkActive="bg-green-600/80 text-white shadow-lg"
          class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md transition-all duration-200 group"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          Producción
        </a>

        <!-- Auditoría -->
        <a 
          routerLink="/auditoria" 
          routerLinkActive="bg-green-600/80 text-white shadow-lg"
          class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md transition-all duration-200 group"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Auditoría
        </a>

        <!-- Usuarios -->
        <a 
          routerLink="/usuarios" 
          routerLinkActive="bg-green-600/80 text-white shadow-lg"
          class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md transition-all duration-200 group"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
          Usuarios
        </a>

        <!-- Informes -->
        <a 
          routerLink="/informes" 
          routerLinkActive="bg-green-600/80 text-white shadow-lg"
          class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md transition-all duration-200 group"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Informes
        </a>

        <!-- Información del usuario autenticado -->
        @if (authService.isAuthenticated()) {
          <div class="mt-8 p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
            <p class="text-white text-sm font-medium">Bienvenido</p>
            <p class="text-gray-400 text-xs truncate">{{ authService.currentUser()?.name }}</p>
            <button 
              (click)="logout()"
              class="w-full mt-2 text-gray-400 hover:text-green-400 text-xs transition font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        }
      </nav>
    </div>
  `,
  styles: ``
})
export class SidebarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}