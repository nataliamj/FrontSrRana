// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';
import { UserRole } from '../auth/models/user.model';

export const authRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
    },
    // Rutas de gestión de usuarios dentro de auth
    {
        path: 'usuarios',
        loadComponent: () => import('./components/users-list/users-list.component').then(m => m.UsersListComponent),
        canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR])]
    },
    {
        path: 'usuarios/nuevo',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
    },
    {
        path: 'usuarios/editar/:id',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
    }
];