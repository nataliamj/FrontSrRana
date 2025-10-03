import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../features/auth/services/auth.service';
import { Permission } from '../features/auth/models/user.model';

export const permissionGuard = (requiredPermission: Permission): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    return authService.hasPermission(requiredPermission);
  };
};