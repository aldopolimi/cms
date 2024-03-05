import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="wrapper">
      <input
        type="file"
        class="file-input"
        #fileUpload
        [accept]="accept()"
        [disabled]="disabled()"
        (change)="onFileSelected($event)" />
      <button
        mat-flat-button
        type="button"
        [color]="color()"
        class="choose-file-button"
        [disabled]="disabled()"
        (click)="fileUpload.click()">
        CHOOSE FILE
      </button>
      <span class="file-name">
        {{ file()?.name || 'No file choosen' }}
      </span>
      @if (file()) {
        <button mat-mini-fab color="warn" class="remove-file-button" (click)="onFileClearClick()">
          <mat-icon>clear</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    .wrapper {
      display: inline-flex;
      align-items: center;
    }
    .file-input {
      display: none;
    }
    .file-name {
      padding: 0 10px;
    }
    .remove-file-button {
      margin-right: 10px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UploadButtonComponent,
    },
  ],
})
export class UploadButtonComponent implements ControlValueAccessor {
  private readonly ONE_MEGABYTE = 1048576;

  snackBar = inject(MatSnackBar);

  fileUploadElement = viewChild.required<ElementRef>('fileUpload');

  accept = input<string>();
  maxSize = input<number>(this.ONE_MEGABYTE);
  color = input<string>('primary');

  file = signal<File | null>(null);

  disabled = signal(false);
  touched = false;
  onChange = (file: File | null) => {};
  onTouched = () => {};

  onFileSelected(event: any) {
    this.markAsTouched();
    if (!this.disabled()) {
      const f: File = event.target.files[0];

      if (f && f.size > this.maxSize()) {
        this.snackBar.open(`Exceeded max file size (${this.maxSize()} bytes)`, '', {
          duration: 2000,
        });
        this.onFileClearClick();
        return;
      }

      this.file.set(f ? f : null);
      this.onChange(f ? f : null);
    }
  }

  onFileClearClick() {
    this.markAsTouched();
    if (!this.disabled()) {
      this.fileUploadElement().nativeElement.value = '';
      this.file.set(null);
      this.onChange(null);
    }
  }

  writeValue(f: File | null) {
    if (f) {
      throw new Error('Cannot set a file using writeValue');
    }
    this.file.set(null);
    this.fileUploadElement().nativeElement.value = '';
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled.set(disabled);
  }
}
