import { Injectable, computed, inject, signal } from '@angular/core';
import { Firestore, collection, getDocs, limit, query } from '@angular/fire/firestore';
import { ContentElement, ContentTree } from '../models/content-tree';

@Injectable({
  providedIn: 'root',
})
export class ContentTreeService {
  private firestore: Firestore = inject(Firestore);
  private collectionName = 'content-tree';
  private contentTreeCollection = collection(this.firestore, this.collectionName);

  contentTree = signal<ContentTree | null>(null);
  activeCollectionUrl = signal<string | null>(null);
  activeCollection = computed(() => this.getActiveCollection(this.activeCollectionUrl()));

  constructor() {}

  async fetchContentTree(): Promise<void> {
    console.log('🚀 ~ ContentTreeService ~ fetchContentTree ~ get content tree');
    const q = query(this.contentTreeCollection, limit(1));
    const results = (await getDocs(q)).docs;
    this.contentTree.set(results[0]?.data() as ContentTree);
    console.log('🚀 ~ ContentTreeService ~ fetchContentTree ~ get content success');
  }

  private getActiveCollection(url: string | null): string | null {
    console.log('🚀 ~ ContentTreeService ~ getActiveCollection ~ url: ', url);
    if (!url) {
      console.log('🚀 ~ ContentTreeService ~ getActiveCollection ~ activeCollection: null');
      return null;
    }

    const contentElements = this.contentTree()?.data;
    if (!contentElements) {
      console.log('🚀 ~ ContentTreeService ~ getActiveCollection ~ activeCollection: null');
      return null;
    }
    for (let element of contentElements) {
      const collection = this.getCollectionByUrl(element, url);
      if (collection) {
        console.log(
          `🚀 ~ ContentTreeService ~ getActiveCollection ~ activeCollection: ${collection}`
        );
        return collection;
      }
    }
    console.log('🚀 ~ ContentTreeService ~ getActiveCollection ~ activeCollection: null');
    return null;
  }

  private getCollectionByUrl(element: ContentElement, url: string): string | null {
    if (element.path === url) {
      return element.collection ? element.collection : null;
    }
    if (element.children) {
      for (const child of element.children) {
        const collection = this.getCollectionByUrl(child, url);
        if (collection) {
          return collection;
        }
      }
    }
    return null;
  }
}
