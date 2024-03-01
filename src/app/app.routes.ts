import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { isNotLoggedInGuard } from './guards/is-not-logged-in.guard';
import { contentDetailResolver } from './resolvers/content-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'settings',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/settings/settings.component').then(c => c.SettingsComponent),
  },
  {
    path: 'profile',
    canActivate: [isLoggedInGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent),
  },
  {
    path: 'content-list/:locale/:group1',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(c => c.ContentListComponent),
  },
  {
    path: 'content-list/:locale/:group1/:group2',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(c => c.ContentListComponent),
  },
  {
    path: 'content-list/:locale/:group1/:group2/:group3',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(c => c.ContentListComponent),
  },
  {
    path: 'content-list/:locale/:group1/:group2/:group3/:group4',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/content-list/content-list.component').then(c => c.ContentListComponent),
  },
  {
    path: 'content-detail/:locale/:group1/:id',
    canActivate: [isLoggedInGuard],
    resolve: { content: contentDetailResolver },
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(c => c.ContentDetailComponent),
  },
  {
    path: 'content-detail/:locale/:group1/:group2/:id',
    canActivate: [isLoggedInGuard],
    resolve: { content: contentDetailResolver },
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(c => c.ContentDetailComponent),
  },
  {
    path: 'content-detail/:locale/:group1/:group2/:group3/:id',
    canActivate: [isLoggedInGuard],
    resolve: { content: contentDetailResolver },
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(c => c.ContentDetailComponent),
  },
  {
    path: 'content-detail/:locale/:group1/:group2/:group3/:group4/:id',
    canActivate: [isLoggedInGuard],
    resolve: { content: contentDetailResolver },
    loadComponent: () =>
      import('./pages/content-detail/content-detail.component').then(c => c.ContentDetailComponent),
  },
  {
    path: 'media-library/:media-type',
    canActivate: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/media-library/media-library.component').then(c => c.MediaLibraryComponent),
  },
  {
    path: 'login',
    canActivate: [isNotLoggedInGuard],
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
  },
];
