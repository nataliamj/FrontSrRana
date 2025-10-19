import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';
import { UserRole } from '../auth/models/user.model';

export const materialsRoutes: Routes = [
  {
    path: 'materiales',
    loadComponent: () => 
      import('./components/material-list/material-list.component')
        .then(c => c.MaterialsListComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA])]
  },
  {
    path: 'materiales/nuevo',
    loadComponent: () => 
      import('./components/material-form/material-form.component')
        .then(c => c.MaterialFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA])]
  },
  {
    path: 'materiales/editar/:id',
    loadComponent: () => 
      import('./components/material-form/material-form.component')
        .then(c => c.MaterialFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA])]
  },

  {
    path: 'materiales/detalle/:id',
    loadComponent: () => 
      import('./components/material-detail/material-detail.component')
        .then(c => c.MaterialDetailComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA, UserRole.OPERARIO])]
  }
];