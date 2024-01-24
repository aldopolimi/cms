import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentManagementService } from '../services/content-management.service';
import { ContentTreeService } from '../services/content-tree.service';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { SpinnerDialogService } from '../services/spinner-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const contentDetailResolver: ResolveFn<
  QueryDocumentSnapshot<DocumentData, DocumentData>
> = async (route, state) => {
  const contentManagementService = inject(ContentManagementService);
  const contentTreeService = inject(ContentTreeService);
  const spinnerDialogService = inject(SpinnerDialogService);
  const snackBar = inject(MatSnackBar);

  const url =
    '/' +
    route.url
      .slice(2, -1)
      .map(el => el.path)
      .join('/');
  const collectionName = contentTreeService.getActiveCollection(url);

  if (!collectionName) {
    snackBar.open('Something went wrong, please try again', '', { duration: 2000 });
    throw new Error(`🚀 ~ contentDetailResolver ~ Invalid collection: ${collectionName}`);
  }

  const slug =
    '/' +
    route.url
      .slice(2)
      .map(el => el.path)
      .join('/');

  const dialogRef = spinnerDialogService.open();
  let result;
  try {
    result = await contentManagementService.findOneBySlug(collectionName!, slug);
  } catch (error) {
    snackBar.open('Something went wrong, please try again', '', { duration: 2000 });
    throw error;
  }

  spinnerDialogService.close(dialogRef);

  if (!result) {
    snackBar.open('Content not found', '', { duration: 2000 });
    throw new Error(`🚀 ~ contentDetailResolver ~ Content not found`);
  }

  return result;
};
