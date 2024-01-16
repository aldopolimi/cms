import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isNotLoggedInGuard: CanActivateFn = (route, segments) => {
  console.log(
    '🚀 ~ isNotLoggedInGuard ~ route.url: ',
    '/' + route.url.map(el => el.path).join('/')
  );
  const router = inject(Router);
  const authService = inject(AuthService);

  const success = !authService.isLoggedIn();
  if (success) {
    console.log('🚀 ~ isNotLoggedInGuard ~ OK');
    return true;
  }
  console.log('🚀 ~ isNotLoggedInGuard ~ KO ~ redirect to /');
  return router.navigate(['']);
};
