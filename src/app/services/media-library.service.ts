import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  list,
  listAll,
  getDownloadURL,
  getMetadata,
  FullMetadata,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class MediaLibraryService {
  private storage: Storage = inject(Storage);
  private rootRef = ref(this.storage, '');

  constructor() {}

  async findRecent(): Promise<
    { downloadUrl: string; name: string; size: number; contentType: string }[]
  > {
    console.log('🚀 ~ MediaLibraryService ~ find ~ get media');

    const { items } = await list(this.rootRef, { maxResults: 10 });

    const promises = [];
    for (const item of items) {
      const p1 = getDownloadURL(item);
      const p2 = getMetadata(item);
      promises.push(p1, p2);
    }

    const info = await Promise.all(promises);

    const response = [];
    for (let i = 0; i < info.length; i = i + 2) {
      response.push({
        downloadUrl: info[i] as string,
        name: (info[i + 1] as FullMetadata).name,
        size: (info[i + 1] as FullMetadata).size,
        contentType: (info[i + 1] as FullMetadata).contentType!,
      });
    }

    console.log('🚀 ~ MediaLibraryService ~ find ~ get media success');
    return response;
  }
}
