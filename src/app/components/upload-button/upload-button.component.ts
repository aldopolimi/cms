import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
        formControlName="file"
        [disabled]="disabled()"
        (change)="onFileSelected($event)" />
      <button
        mat-flat-button
        [color]="color"
        class="choose-file-button"
        [disabled]="disabled()"
        (click)="fileUpload.click()">
        CHOOSE FILE
      </button>
      <span class="file-name">
        {{ file()?.name || 'No file choosen' }}
      </span>
      @if (file()) {
        <button mat-mini-fab color="warn" (click)="onFileCleared()">
          <mat-icon>clear</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    .wrapper {
      display: flex;
      align-items: center;
    }
    .file-input {
      display: none;
    }
    .choose-file-button {
      margin: 2px 0;
    }
    .file-name {
      padding: 0 10px;
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
  @ViewChild('fileUpload') fileUploadElement!: ElementRef;
  @Input() color: string = 'primary';

  file = signal<File | null>(null);

  onChange = (file: File | null) => {};
  onTouched = () => {};

  disabled = signal(false);
  touched = false;

  onFileSelected(event: any) {
    this.markAsTouched();
    if (!this.disabled()) {
      const file: File = event.target.files[0];
      this.file.set(file ? file : null);
      this.onChange(file ? file : null);
    }
  }

  onFileCleared() {
    this.markAsTouched();
    if (!this.disabled()) {
      this.fileUploadElement.nativeElement.value = '';
      this.file.set(null);
      this.onChange(null);
    }
  }

  writeValue(file: File | null) {
    this.file.set(file);
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
