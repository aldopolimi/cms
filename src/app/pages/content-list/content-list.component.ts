import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { ContentManagementService } from '../../services/content-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ContentTreeService } from '../../services/content-tree.service';
import { SpinnerDialogService } from '../../services/spinner-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { ContentListNewDialogComponent } from './components/content-list-new-dialog/content-list-new-dialog.component';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
  ],
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
        <div class="content-list-table__header">
          <h1>{{ contentTreeService.activeCollection() }}</h1>
          <button mat-raised-button color="primary" (click)="onNew()">New</button>
        </div>
        <table mat-table [dataSource]="records()">
          @for (column of columns; track column) {
            <ng-container [matColumnDef]="column">
              <th mat-header-cell *matHeaderCellDef>{{ column }}</th>
              <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: `
    .locale-selector {
      display: flex;
      justify-content: flex-end;
    }
    .content-list-table {
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;

        h1 { margin: 0 }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentListComponent implements OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  // Services
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  dialog = inject(Dialog);
  contentTreeService = inject(ContentTreeService);
  contentManagementService = inject(ContentManagementService);
  spinnerDialogService = inject(SpinnerDialogService);

  // Form
  formControlLocale = new FormControl<string>(this.contentManagementService.locale());

  // Signals
  records = signal<any[]>([]);
  columns: string[] = ['title', 'slug', 'status'];

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

  async fetchRecords() {
    if (!this.contentTreeService.activeCollection()) {
      return;
    }
    const dialogRef = this.spinnerDialogService.open();
    const records = await this.contentManagementService.fetchRecords(
      this.contentTreeService.activeCollection()!
    );
    this.records.set(records);
    this.spinnerDialogService.close(dialogRef);
  }

  onNew() {
    const dialogRef = this.dialog.open(ContentListNewDialogComponent, { width: '480px' });
    dialogRef.closed.subscribe(data => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
}
