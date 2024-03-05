import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  computed,
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
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerDialogService } from '../../services/spinner-dialog.service';
import { MatInputModule } from '@angular/material/input';

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
    MatInputModule,
  ],
  template: `
    <div class="app-page">
      <form [formGroup]="uploadForm">
        <app-upload-button formControlName="file" [accept]="mediaAccept()"></app-upload-button>
        <button
          mat-flat-button
          type="button"
          color="primary"
          [disabled]="!fileControl.value"
          (click)="upload()">
          UPLOAD
        </button>
      </form>
      <br />
      <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
        <mat-form-field appearance="outline" floatLabel="always" style="width: 100%">
          <mat-label>Search</mat-label>
          <input
            formControlName="search"
            matInput
            #search
            placeholder="search file..."
            maxlength="255" />
        </mat-form-field>
      </form>
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
        } @empty {
          <mat-list-item> No results found. </mat-list-item>
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
export class MediaLibraryComponent implements OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  mediaLibraryService = inject(MediaLibraryService);
  spinnerDialogService = inject(SpinnerDialogService);

  mediaType = signal<string>('');
  mediaAccept = computed(
    () =>
      ({
        images: 'image/*',
        videos: 'video/*',
        documents: '.pdf',
      })[this.mediaType()] || ''
  );
  mediaItems = signal<{ downloadUrl: string; name: string; size: number; contentType: string }[]>(
    []
  );

  fb = inject(FormBuilder);
  cdRef = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute);
  uploadForm = this.fb.group({
    file: null,
  });
  searchForm = this.fb.group({
    search: '',
  });

  fileControl = this.uploadForm.get('file')!;
  searchControl = this.searchForm.get('search')!;

  constructor() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.mediaType.set(data.get('media-type')!);
      this.init();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  async init() {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      this.fileControl.setValue(null);
      const items = await this.mediaLibraryService.findRecent(this.mediaType());
      this.mediaItems.set(items);
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  async onSearch() {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      // const searchTerm = this.mediaType() + '/' + this.searchControl.value;
      const searchTerm = this.mediaType();
      const items = await this.mediaLibraryService.findRecent(searchTerm);
      this.mediaItems.set(items);
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  async upload() {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      await this.mediaLibraryService.upload(this.fileControl.value!, this.mediaType());
      this.fileControl.setValue(null);
      this.spinnerDialogService.close(spinnerRef);

      this.init();
    } catch (error) {
      console.log(error);
      this.spinnerDialogService.close(spinnerRef);
    }
  }
}
