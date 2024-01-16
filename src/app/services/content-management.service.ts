import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, getDocs, query, where, and } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContentManagementService {
  private firestore: Firestore = inject(Firestore);

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

  async fetchRecords(collectionName: string) {
    console.log('🚀 ~ ContentManagementService ~ fetchRecords ~ collectionName: ', collectionName);
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(
      collectionRef,
      and(where('locale', '==', this.locale()), where('active', '==', true))
    );
    const results = (await getDocs(q)).docs.map(d => d.data());
    return results;
  }
}
