import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentManagementService {
  locale = signal('it-IT');

  constructor() {
    let locale = localStorage.getItem('locale');
    console.log(
      '🚀 ~ ContentManagementService ~ constructor ~ retreive locale from localStorage: ',
      locale
    );
    if (locale) {
      this.setLocale(locale);
    }
  }

  setLocale(locale: string): void {
    localStorage.setItem('locale', locale);
    this.locale.set(locale);
    console.log('🚀 ~ ContentManagementService ~ setLocale ~ locale: ', locale);
  }

  fetchRecords() {}
}
