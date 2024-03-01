import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerDialogComponent } from '../components/spinner-dialog/spinner-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerDialogService {
  dialog = inject(MatDialog);

  constructor() {}

  open(): MatDialogRef<any, SpinnerDialogComponent> {
    return this.dialog.open(SpinnerDialogComponent, { disableClose: true });
  }

  close(ref: MatDialogRef<any, SpinnerDialogComponent>) {
    ref.close();
  }
}
