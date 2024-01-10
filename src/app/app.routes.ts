import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent),
  },
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
    path: 'content-list/:locale/:group1',
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(
        c => c.ContentListComponent
      ),
  },
  {
    path: 'content-list/:locale/:group1/:group2',
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(
        c => c.ContentListComponent
      ),
  },
  {
    path: 'content-list/:locale/:group1/:group2/:group3',
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(
        c => c.ContentListComponent
      ),
  },
  {
    path: 'content-list/:locale/:group1/:group2/:group3/:group4',
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(
        c => c.ContentListComponent
      ),
  },
  {
    path: 'content-detail/:locale/:group1/:id',
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(
        c => c.ContentDetailComponent
      ),
  },
  {
    path: 'content-detail/:locale/:group1/:group2/:id',
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(
        c => c.ContentDetailComponent
      ),
  },
  {
    path: 'content-detail/:locale/:group1/:group2/:group3/:id',
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(
        c => c.ContentDetailComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        c => c.NotFoundComponent
      ),
  },
];
