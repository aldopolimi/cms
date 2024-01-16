import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-content-list-new-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  template: `
    <mat-card>
      <form [formGroup]="contentForm" (ngSubmit)="onSubmit()">
        <h1>Create new content</h1>
        <mat-form-field appearance="outline">
          <mat-label>title</mat-label>
          <input formControlName="title" matInput #title placeholder="title" maxlength="255" />
          <mat-hint align="end">{{ title.value.length }}/255</mat-hint>
          @if (contentForm.get('title')!.invalid) {
            <mat-error>This field is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>slug</mat-label>
          <input formControlName="slug" matInput #slug placeholder="slug" maxlength="255" />
          <span matTextPrefix>racing/hypercar/</span>
          <mat-hint align="end">{{ slug.value.length }}/255</mat-hint>
          @if (contentForm.get('slug')!.invalid) {
            <mat-error>This field is required</mat-error>
          }
        </mat-form-field>
        <div class="actions">
          <button mat-raised-button type="button" (click)="dialogRef.close()">CANCEL</button>
          <button mat-raised-button type="submit" color="primary" [disabled]="contentForm.invalid">
            SAVE
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: `
    form {
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    mat-form-field {
      margin-bottom: 10px;
    }

    .actions > button {
      margin-right: 8px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentListNewDialogComponent {
  dialogRef = inject(DialogRef);
  fb = inject(FormBuilder);

  contentForm = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
  });

  onSubmit() {
    if (this.contentForm.invalid) {
      return;
    }

    this.dialogRef.close(this.contentForm.value);
  }
}
