import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        c => c.SettingsComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(c => c.ProfileComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
