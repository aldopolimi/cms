import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isLoggedInGuard: CanActivateFn = (route, segments) => {
  console.log(`🚀 ~ isLoggedInGuard ~ route.url: /${route.url.map(el => el.path).join('/')}`);
  const router = inject(Router);
  const authService = inject(AuthService);

  const success = authService.isLoggedIn();
  if (success) {
    console.log('🚀 ~ isLoggedInGuard ~ OK');
    return true;
  }
  console.log('🚀 ~ isLoggedInGuard ~ KO ~ redirect to /login');
  return router.navigate(['login']);
};
