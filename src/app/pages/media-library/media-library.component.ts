import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MediaLibraryService } from '../../services/media-library.service';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    NgOptimizedImage,
    UploadButtonComponent,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  template: `
    <div class="app-page">
      <form [formGroup]="uploadForm">
        <app-upload-button formControlName="file"></app-upload-button>
      </form>
      <br />
      <button mat-flat-button color="primary" [disabled]="!fileControl.value" (click)="upload()">
        UPLOAD
      </button>
      <mat-list>
        @for (item of mediaItems(); track item.name) {
          <mat-list-item>
            @if (item.contentType && item.contentType.indexOf('image') !== -1) {
              <div matListItemAvatar style="position: relative; width: 40px; height: 40px">
                <img [alt]="item.name" [ngSrc]="item.downloadUrl" fill style="object-fit: cover" />
              </div>
            } @else if (item.contentType && item.contentType.indexOf('video') !== -1) {
              <mat-icon matListItemIcon>videocam</mat-icon>
            } @else {
              <mat-icon matListItemIcon>insert_drive_file</mat-icon>
            }
            <div matListItemTitle>
              <a class="download-link" [href]="item.downloadUrl" target="_blank">{{ item.name }}</a>
            </div>
            <div matListItemLine>
              {{
                item.size < 1048576
                  ? item.size < 1024
                    ? item.size + ' bytes'
                    : (item.size / 1024).toFixed(2) + ' kb'
                  : (item.size / 1024 / 1024).toFixed(2) + ' Mb'
              }}
              [ {{ item.contentType }} ]
            </div>
          </mat-list-item>
        }
      </mat-list>
    </div>
  `,
  styles: `
    .mat-mdc-list-item-avatar {
      border-radius: 0;
      background-color: rgba(255, 255, 255, 0.7);
    }

    .download-link {
      color: inherit;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaLibraryComponent {
  mediaLibraryService = inject(MediaLibraryService);
  mediaItems = signal<{ downloadUrl: string; name: string; size: number; contentType: string }[]>(
    []
  );

  fb = inject(FormBuilder);
  cdRef = inject(ChangeDetectorRef);
  uploadForm = this.fb.group({
    file: null,
  });

  fileControl = this.uploadForm.get('file')!;

  constructor() {
    this.init();
  }

  async init() {
    const items = await this.mediaLibraryService.findRecent();
    this.mediaItems.set(items);
  }

  upload() {}
}
