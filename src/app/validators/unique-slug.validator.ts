import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ContentManagementService } from '../services/content-management.service';
import { ContentTreeService } from '../services/content-tree.service';

export function uniqueSlugValidator(
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
