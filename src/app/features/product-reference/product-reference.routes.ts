import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';
import { UserRole } from '../auth/models/user.model';

export const productReferencesRoutes: Routes = [
  {
    path: 'referencias',
    loadComponent: () => 
      import('./components/product-reference-list/product-reference.component')
        .then(c => c.ProductReferencesListComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA])]
  },
  {
    path: 'referencias/nuevo',
    loadComponent: () => 
      import('./components/product-reference-form/product-reference-form.component')
        .then(c => c.ProductReferenceFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR])]
  },
  {
    path: 'referencias/editar/:id',
    loadComponent: () => 
      import('./components/product-reference-form/product-reference-form.component')
        .then(c => c.ProductReferenceFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR])]
  },
  {
    path: 'referencias/detalle/:id',
    loadComponent: () => 
      import('./components/product-reference-detail/product-reference-detail.component')
        .then(c => c.ProductReferenceDetailComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA, UserRole.OPERARIO])]
  }
];