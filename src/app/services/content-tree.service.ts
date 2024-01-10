import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContentTreeService {
  firestore: Firestore = inject(Firestore);
  collectionName = 'content-tree';
  contentTreeCollection = collection(this.firestore, this.collectionName);

  constructor() {}

  async createContentTree(data: any): Promise<any> {
    const documentReference = await addDoc(this.contentTreeCollection, data);
    return documentReference;
  }

  async getContentTree(): Promise<any[]> {
    const q = query(this.contentTreeCollection, limit(1));
    const results = (await getDocs(q)).docs;
    const data = results[0]?.data()['data'] || [];
    return data;
  }
}
