import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentManagementService {
  locale = signal('it-IT');

  constructor() {
    let locale = localStorage.getItem('locale');
    if (locale) {
      this.setLocale(locale);
    }
  }

  setLocale(locale: string) {
    localStorage.setItem('locale', locale);
    this.locale.set(locale);
  }
}
