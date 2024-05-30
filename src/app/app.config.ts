import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment.development';
import { AuthService } from './services/auth.service';
import { ContentTreeService } from './services/content-tree.service';

async function initializeUserData(
  authService: AuthService,
  contentTreeService: ContentTreeService
): Promise<void> {
  console.log('🚀 ~ App ~ initializeUserData ~ check if user is logged in');
  const user = await authService.initUser();
  if (!user) {
    console.log('🚀 ~ App ~ initializeUserData ~ user is not logged in');
  } else {
    console.log('🚀 ~ App ~ initializeUserData ~ user is logged in');
    console.log('🚀 ~ App ~ initializeUserData ~ fetching content tree');
    await contentTreeService.fetchContentTree();
  }
  console.log('🚀 ~ App ~ initializeUserData ~ application is now initialized');
}

export function initializeAppFactory(
  authService: AuthService,
  contentTreeService: ContentTreeService
): () => Promise<void> {
  return () => initializeUserData(authService, contentTreeService);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [AuthService, ContentTreeService],
    },
  ],
};
