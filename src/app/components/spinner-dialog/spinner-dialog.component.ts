import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: ` <mat-progress-spinner mode="indeterminate"></mat-progress-spinner> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDialogComponent {}
