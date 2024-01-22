import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContentTreeService } from '../../../../services/content-tree.service';
import slugify from 'slugify';
import { ContentManagementService } from '../../../../services/content-management.service';
import { Subject, takeUntil } from 'rxjs';

function uniqueSlugValidator(
  contentTreeService: ContentTreeService,
  contentManagementService: ContentManagementService
): AsyncValidatorFn {
  return async (control: AbstractControl) => {
    const collectionName = contentTreeService.activeCollection()!;
    const activeCollectionUrl = contentTreeService.activeCollectionUrl()!;
    const slug = activeCollectionUrl + '/' + control.value;

    const isSlugUnique = await contentManagementService.isSlugUnique(collectionName, slug);
    return isSlugUnique ? null : { slugDuplicated: true };
  };
}

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
          <input
            formControlName="title"
            matInput
            #title
            placeholder="title"
            maxlength="255"
            (blur)="onTitleBlur(title.value)" />
          <mat-hint align="end">{{ title.value.length }}/255</mat-hint>
          @if (titleControl.invalid) {
            <mat-error>This field is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>slug</mat-label>
          <input formControlName="slug" matInput #slug placeholder="slug" maxlength="255" />
          <span matTextPrefix>{{ contentTreeService.activeCollectionUrl() }}/</span>
          <mat-hint align="end">{{ slug.value.length }}/255</mat-hint>
          @if (slugControl.invalid && slugControl.getError('required')) {
            <mat-error>This field is required</mat-error>
          } @else if (slugControl.invalid && slugControl.getError('slugDuplicated')) {
            <mat-error>Slug already exists</mat-error>
          }
          @if (slugControl.pending) {
            <mat-hint>Checking slug . . .</mat-hint>
          }
        </mat-form-field>
        <div class="actions">
          <button mat-raised-button type="button" (click)="dialogRef.close()">CANCEL</button>
          <button mat-raised-button type="submit" color="primary" [disabled]="!contentForm.valid">
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
export class ContentListNewDialogComponent implements OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  dialogRef = inject(DialogRef);
  cdRef = inject(ChangeDetectorRef);
  contentTreeService = inject(ContentTreeService);
  contentManagementService = inject(ContentManagementService);
  fb = inject(FormBuilder);

  contentForm = this.fb.group(
    {
      title: ['', [Validators.required]],
      slug: [
        '',
        [Validators.required],
        [uniqueSlugValidator(this.contentTreeService, this.contentManagementService)],
      ],
    },
    { updateOn: 'blur' }
  );

  titleControl = this.contentForm.get('title')!;
  slugControl = this.contentForm.get('slug')!;

  constructor() {
    this.contentForm.statusChanges.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
      this.cdRef.detectChanges();
    });
  }

  onTitleBlur(title: string) {
    if (!this.slugControl.value) {
      const slug = slugify(title, { lower: true });

      this.slugControl.setValue(slug);
      this.slugControl.markAsTouched();
    }
  }

  onSubmit() {
    if (!this.contentForm.valid) {
      return;
    }

    this.dialogRef.close(this.contentForm.value);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
}
