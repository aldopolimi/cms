import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, user, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.user());

  async initUser(): Promise<User | null> {
    console.log('🚀 ~ AuthService ~ initUser ~ get user');
    const _user = await firstValueFrom(user(this.auth));
    this.user.set(_user);

    console.log(`🚀 ~ AuthService ~ initUser ~ user: ${JSON.stringify(_user)}`);
    return _user;
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      console.log('🚀 ~ AuthService ~ loginWithGoogle ~ try log in');
      const { user } = await signInWithPopup(this.auth, new GoogleAuthProvider());
      this.user.set(user);
    } catch (error) {
      console.log(error);
      console.log('🚀 ~ AuthService ~ loginWithGoogle ~ login fail');
      return false;
    }
    console.log('🚀 ~ AuthService ~ loginWithGoogle ~ login success');
    return true;
  }

  async logout(): Promise<void> {
    console.log('🚀 ~ AuthService ~ logout ~ try log out');
    await signOut(this.auth);
    this.user.set(null);
    console.log('🚀 ~ AuthService ~ logout ~ logout success');
  }
}
