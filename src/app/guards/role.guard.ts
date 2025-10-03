import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../features/auth/services/auth.service';
import { UserRole } from '../features/auth/models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    return authService.hasAnyRole(allowedRoles);
  };
};