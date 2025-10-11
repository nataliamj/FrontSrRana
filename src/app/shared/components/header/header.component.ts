import { Component, inject } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="w-full bg-gray-800/80 backdrop-blur-lg border-b border-gray-600/50 shadow-lg">
      <div class="flex items-center justify-between p-4">
        <!-- Título de página -->
        <div>
          <h2 class="text-xl font-semibold text-white">Sr. Rana - Sistema de Gestión</h2>
        </div>

        <!-- User menu -->
        <div class="flex items-center space-x-4">
          @if (isAuthenticated()) {
            <div class="relative">
              <!-- Botón del menú desplegable -->
              <button 
                (click)="toggleDropdown()"
                class="flex items-center space-x-3 bg-gray-700/60 px-4 py-2 rounded-lg border border-gray-600/50 hover:bg-gray-600/70 transition-all duration-200"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <span class="text-white text-sm font-medium">
                    {{ currentUser()?.name?.charAt(0) }}
                  </span>
                </div>
                <span class="text-white text-sm font-medium">{{ currentUser()?.name }}</span>
                <!-- Flecha indicadora -->
                <svg 
                  [class.rotate-180]="isDropdownOpen" 
                  class="w-4 h-4 text-gray-400 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Menú desplegable -->
              @if (isDropdownOpen) {
                <div class="absolute right-0 mt-2 w-48 bg-gray-700/95 backdrop-blur-lg rounded-lg shadow-xl border border-gray-600/50 z-50 py-1">
                  <!-- Opción Perfil -->
                  <button 
                    (click)="goToProfile()"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600/50 hover:text-white transition-colors duration-150"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Mi Perfil
                  </button>

                  <!-- Separador -->
                  <div class="border-t border-gray-600/50 my-1"></div>

                  <!-- Opción Cerrar Sesión -->
                  <button 
                    (click)="logout()"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-600/50 hover:text-white transition-colors duration-150"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              }
            </div>

            <!-- Overlay para cerrar el menú al hacer clic fuera -->
            @if (isDropdownOpen) {
              <div 
                class="fixed inset-0 z-40" 
                (click)="closeDropdown()"
              ></div>
            }
          } @else {
            <!-- Botón de login cuando no está autenticado -->
            <a 
              routerLink="/auth/login"
              class="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span>Iniciar Sesión</span>
            </a>
          }
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class HeaderComponent {
  authService = inject(AuthService);
  isDropdownOpen = false;

  // ✅ Exponer las signals del servicio
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  goToProfile() {
    console.log('Navegar al perfil');
    this.closeDropdown();
  }

  logout() {
    this.authService.logout();
    this.closeDropdown();
  }
}