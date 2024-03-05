import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  list,
  getDownloadURL,
  getMetadata,
  FullMetadata,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class MediaLibraryService {
  private storage: Storage = inject(Storage);

  constructor() {}

  async upload(file: File, path: string) {
    console.log('🚀 ~ MediaLibraryService ~ upload ~ upload file');
    const reference = ref(this.storage, `${path}/${file.name}`);
    await uploadBytes(reference, file);
    console.log('🚀 ~ MediaLibraryService ~ find ~ upload file success');
  }

  async findRecent(
    path: string
  ): Promise<{ downloadUrl: string; name: string; size: number; contentType: string }[]> {
    console.log('🚀 ~ MediaLibraryService ~ findRecent ~ get media');

    const reference = ref(this.storage, path);
    const { items } = await list(reference, { maxResults: 10 });

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

    console.log('🚀 ~ MediaLibraryService ~ findRecent ~ get media success');
    return response;
  }
}
