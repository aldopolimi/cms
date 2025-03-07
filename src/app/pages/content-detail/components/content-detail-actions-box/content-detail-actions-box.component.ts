import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-content-detail-actions-box',
    imports: [MatCardModule, MatButtonModule, MatIconModule],
    template: `
    <mat-card>
      <mat-card-content>
        @if (contentStatus() === 'draft') {
          <button
            mat-flat-button
            type="button"
            color="accent"
            [disabled]="contentFormStatus() !== 'VALID'"
            (click)="publish.emit()">
            <mat-icon>publish</mat-icon> SAVE & PUBLISH
          </button>
        } @else if (contentStatus() === 'published') {
          <button
            mat-flat-button
            type="button"
            color="accent"
            [disabled]="contentFormStatus() !== 'VALID'"
            (click)="draft.emit()">
            <mat-icon>drafts</mat-icon> SAVE & DRAFT
          </button>
        }
        <button
          mat-flat-button
          type="button"
          color="primary"
          [disabled]="contentFormStatus() !== 'VALID'"
          (click)="save.emit()">
          <mat-icon>check</mat-icon> SAVE
        </button>
        <button mat-flat-button type="button" color="warn" (click)="delete.emit()">
          <mat-icon>delete_outline</mat-icon> DELETE
        </button>
      </mat-card-content>
    </mat-card>
  `,
    styles: `
    mat-card > mat-card-content > button {
      width: 100%;
    }
    mat-card > mat-card-content > button:not(:last-child) {
      margin-bottom: 10px;
    }`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentDetailActionsBoxComponent {
  contentStatus = input.required<string>();
  contentFormStatus = input.required<FormControlStatus>();

  publish = output<void>();
  draft = output<void>();
  save = output<void>();
  delete = output<void>();
}
