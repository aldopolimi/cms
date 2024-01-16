import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ContentManagementService } from '../../services/content-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ContentTreeService } from '../../services/content-tree.service';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  template: `
    <div class="app-page">
      <div class="locale-selector">
        <mat-form-field>
          <mat-label>i18n</mat-label>
          <mat-select [formControl]="formControlLocale">
            <mat-option value="it-IT">Italiano</mat-option>
            <mat-option value="en-EN">English</mat-option>
            <mat-option value="fr-FR">Française</mat-option>
            <mat-option value="de-DE">Deutsch</mat-option>
            <mat-option value="es-ES">Español</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="content-list-table">
        <h1>{{ contentTreeService.activeCollection() }}</h1>
      </div>
    </div>
  `,
  styles: `
    .locale-selector {
      display: flex;
      justify-content: flex-end;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentListComponent implements OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  // Services
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  contentTreeService = inject(ContentTreeService);
  contentManagementService = inject(ContentManagementService);

  formControlLocale = new FormControl<string>(this.contentManagementService.locale());

  constructor() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      const locale = data.get('locale')!;
      this.contentManagementService.setLocale(locale);

      const url =
        '/' +
        this.activatedRoute.snapshot.url
          .slice(2)
          .map(el => el.path)
          .join('/');
      this.contentTreeService.activeCollectionUrl.set(url);
      this.fetchRecords();
    });

    this.formControlLocale.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(locale => {
      const urlSegments = this.activatedRoute.snapshot.url.slice(2).map(el => el.path);
      const commands = ['content-list', locale, ...urlSegments];
      this.router.navigate(commands);
    });
  }

  fetchRecords() {
    this.contentManagementService.fetchRecords();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
}
