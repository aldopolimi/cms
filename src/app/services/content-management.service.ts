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
  startAfter,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
  getCountFromServer,
  endBefore,
  limitToLast,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocFromServer,
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
      `🚀 ~ ContentManagementService ~ constructor ~ retreive locale from localStorage: ${locale}`
    );
    if (locale) {
      this.setLocale(locale);
    }
  }

  setLocale(locale: string): void {
    localStorage.setItem('locale', locale);
    this.locale.set(locale);
    console.log(`🚀 ~ ContentManagementService ~ setLocale ~ locale: ${locale}`);
  }

  async find(
    collectionName: string,
    pageSize: number,
    startAfterDocument?: QueryDocumentSnapshot<DocumentData, DocumentData>,
    endBeforeDocument?: QueryDocumentSnapshot<DocumentData, DocumentData>
  ): Promise<{ docs: QueryDocumentSnapshot<DocumentData, DocumentData>[]; count: number }> {
    console.log(
      `🚀 ~ ContentManagementService ~ find ~ collectionName: ${collectionName}, pageSize: ${pageSize}, startAfterDocument: ${JSON.stringify(
        startAfterDocument
      )}, endBeforeDocument: ${endBeforeDocument}`
    );
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

  async findOneBySlug(
    collectionName: string,
    slug: string
  ): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | null> {
    console.log(
      `🚀 ~ ContentManagementService ~ findOneBySlug ~ collectionName: ${collectionName}, slug: ${slug}`
    );
    const collectionRef = collection(this.firestore, collectionName);

    let q = query(
      collectionRef,
      and(
        where('slug', '==', slug),
        where('locale', '==', this.locale()),
        where('active', '==', true)
      ),
      limit(1)
    );

    const { docs } = await getDocs(q);

    return docs[0] ? docs[0] : null;
  }

  async findLastRevisions(
    collectionName: string,
    slug: string,
    qty = 2
  ): Promise<{ docs: QueryDocumentSnapshot<DocumentData, DocumentData>[] }> {
    console.log(
      `🚀 ~ ContentManagementService ~ fetchAllRecordRevisions ~ collectionName: ${collectionName}, slug: ${slug}`
    );
    const collectionRef = collection(this.firestore, collectionName);

    let q = query(
      collectionRef,
      and(where('slug', '==', slug), where('locale', '==', this.locale())),
      orderBy('createdAt', 'asc'),
      limit(qty)
    );

    const { docs } = await getDocs(q);

    console.log({ docs });

    return { docs };
  }

  async create(collectionName: string, data: any): Promise<DocumentReference<any, DocumentData>> {
    console.log(
      `🚀 ~ ContentManagementService ~ create ~ collectionName: ${collectionName}, data: ${JSON.stringify(
        data
      )}`
    );
    const collectionRef = collection(this.firestore, collectionName);
    const documentReference = await addDoc(collectionRef, data);
    return documentReference;
  }

  async publish(
    collectionName: string,
    documentRef: DocumentReference<DocumentData, DocumentData>,
    data: any
  ): Promise<DocumentReference<any, DocumentData>> {
    console.log(
      `🚀 ~ ContentManagementService ~ publish ~ collectionName: ${collectionName}, data: ${JSON.stringify(
        data
      )}, documentRef: ${JSON.stringify(documentRef)}`
    );

    const { revision } = data;

    await updateDoc(documentRef, { active: false });
    return this.create(collectionName, {
      ...data,
      status: 'published',
      publishedAt: new Date(),
      revision: revision + 1,
      updatedAt: new Date(),
    });
  }

  async draft(
    collectionName: string,
    documentRef: DocumentReference<DocumentData, DocumentData>,
    data: any
  ): Promise<DocumentReference<any, DocumentData>> {
    console.log(
      `🚀 ~ ContentManagementService ~ draft ~ collectionName: ${collectionName}, data: ${JSON.stringify(
        data
      )}, documentRef: ${JSON.stringify(documentRef)}`
    );

    const { revision } = data;

    await updateDoc(documentRef, { active: false });
    return this.create(collectionName, {
      ...data,
      status: 'draft',
      publishedAt: null,
      revision: revision + 1,
      updatedAt: new Date(),
    });
  }

  async save(
    collectionName: string,
    documentRef: DocumentReference<DocumentData, DocumentData>,
    data: any
  ): Promise<DocumentReference<any, DocumentData>> {
    console.log(
      `🚀 ~ ContentManagementService ~ save ~ collectionName: ${collectionName}, data: ${JSON.stringify(
        data
      )}, documentRef: ${JSON.stringify(documentRef)}`
    );

    const { revision } = data;

    await updateDoc(documentRef, { active: false });
    return this.create(collectionName, {
      ...data,
      revision: revision + 1,
      updatedAt: new Date(),
    });
  }

  async update(
    documentRef: DocumentReference<DocumentData, DocumentData>,
    data: any
  ): Promise<void> {
    console.log(
      `🚀 ~ ContentManagementService ~ update ~ data: ${data}, documentRef: ${JSON.stringify(
        documentRef
      )}`
    );
    return updateDoc(documentRef, data);
  }

  async delete(documentRef: DocumentReference<DocumentData, DocumentData>): Promise<void> {
    console.log(
      `🚀 ~ ContentManagementService ~ delete ~ documentRef: ${JSON.stringify(documentRef)}`
    );
    await updateDoc(documentRef, { active: false });
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
