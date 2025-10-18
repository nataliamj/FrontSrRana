import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';
import { UserRole } from '../auth/models/user.model';

export const productionBatchesRoutes: Routes = [
  {
    path: 'lotes',
    loadComponent: () => 
      import('./components/production-batch/production-batch-list.component')
        .then(c => c.ProductionBatchesListComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.BODEGA, UserRole.OPERARIO])]
  },
  {
    path: 'lotes/nuevo',
    loadComponent: () => 
      import('./components/production-batch-form/production-batch-form.component')
        .then(c => c.ProductionBatchFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SUPERVISOR])]
  }
];