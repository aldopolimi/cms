import { Injectable, inject } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { SpinnerDialogComponent } from '../components/spinner-dialog/spinner-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerDialogService {
  dialog = inject(Dialog);
  constructor() {}

  open(): DialogRef<any, SpinnerDialogComponent> {
    return this.dialog.open(SpinnerDialogComponent, { disableClose: true });
  }

  close(ref: DialogRef<any, SpinnerDialogComponent>) {
    ref.close();
  }
}
