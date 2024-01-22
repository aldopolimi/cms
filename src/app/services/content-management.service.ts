import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  and,
  addDoc,
  orderBy,
  limit,
  startAt,
  startAfter,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
  count,
  getCountFromServer,
  endBefore,
  limitToLast,
} from '@angular/fire/firestore';

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

  async fetchRecords(
    collectionName: string,
    pageSize: number,
    startAfterDocument?: QueryDocumentSnapshot<DocumentData, DocumentData>,
    endBeforeDocument?: QueryDocumentSnapshot<DocumentData, DocumentData>
  ): Promise<{ docs: QueryDocumentSnapshot<DocumentData, DocumentData>[]; count: number }> {
    console.log('🚀 ~ ContentManagementService ~ fetchRecords ~ collectionName: ', collectionName);
    const collectionRef = collection(this.firestore, collectionName);

    let baseQuery = query(
      collectionRef,
      and(where('locale', '==', this.locale()), where('active', '==', true))
    );

    let q = query(baseQuery, orderBy('createdAt', 'desc'), limit(pageSize));
    if (startAfterDocument) {
      q = query(q, startAfter(startAfterDocument));
    }
    if (endBeforeDocument) {
      q = query(q, limitToLast(pageSize), endBefore(endBeforeDocument));
    }

    const { docs } = await getDocs(q);
    const { count } = (await getCountFromServer(baseQuery)).data();

    console.log({ docs, count });

    return { docs, count };
  }

  async addRecord(
    collectionName: string,
    data: any
  ): Promise<DocumentReference<any, DocumentData>> {
    console.log(
      `🚀 ~ ContentManagementService ~ addRecord ~ collectionName: ${collectionName}, data: `,
      data
    );
    const collectionRef = collection(this.firestore, collectionName);
    const documentReference = await addDoc(collectionRef, data);
    return documentReference;
  }

  async isSlugUnique(collectionName: string, slug: string): Promise<boolean> {
    console.log(
      `🚀 ~ ContentManagementService ~ isSlugUnique ~ collectionName: ${collectionName}, slug: ${slug}`
    );
    const collectionRef = collection(this.firestore, collectionName);

    let q = query(
      collectionRef,
      and(
        where('slug', '==', slug),
        where('locale', '==', this.locale()),
        where('active', '==', true)
      )
    );

    const { count } = (await getCountFromServer(q)).data();

    const isUnique = count === 0;
    console.log(isUnique);

    return isUnique;
  }
}
