import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';
import { UserRole } from '../auth/models/user.model';

export const suppliersRoutes: Routes = [
  {
    path: 'proveedores',
    loadComponent: () => 
      import('./components/supplier-list/supplier-list.component')
        .then(c => c.SuppliersListComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA])]
  },
  {
    path: 'proveedores/nuevo',
    loadComponent: () => 
      import('./components/supplier-form/supplier-form.component')
        .then(c => c.SupplierFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA])]
  },
  {
    path: 'proveedores/editar/:id',
    loadComponent: () => 
      import('./components/supplier-form/supplier-form.component')
        .then(c => c.SupplierFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR])]
  }
];