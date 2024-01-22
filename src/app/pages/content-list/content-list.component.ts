import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
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
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
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
          @if (contentTreeService.activeCollection()) {
            <h1>{{ contentTreeService.activeCollection() }}</h1>
            <button mat-raised-button color="primary" (click)="onNew()">New</button>
          }
        </div>
        <table mat-table [dataSource]="records()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let element">{{ element.title }}</td>
          </ng-container>
          <ng-container matColumnDef="slug">
            <th mat-header-cell *matHeaderCellDef>Slug</th>
            <td mat-cell *matCellDef="let element">{{ element.slug }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element">{{ element.status }}</td>
          </ng-container>
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Created At</th>
            <td mat-cell *matCellDef="let element">
              {{ element.createdAt.toDate() | date: 'medium' }}
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element" class="actions">
              @if (element.status === 'draft') {
                <button
                  mat-mini-fab
                  color="primary"
                  aria-label="public"
                  (click)="onPublishRecord(element)">
                  <mat-icon>public</mat-icon>
                </button>
              }
              @if (element.status === 'published') {
                <button
                  mat-mini-fab
                  color="accent"
                  aria-label="draw"
                  (click)="onDraftRecord(element)">
                  <mat-icon>draw</mat-icon>
                </button>
              }
              <button
                mat-mini-fab
                color="warn"
                aria-label="delete"
                (click)="onDeleteRecord(element)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>

        <mat-paginator
          [length]="total()"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex()"
          (page)="onPage($event)"></mat-paginator>
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
      .actions button {
        margin-right: 8px;
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
  private firebaseRecords = signal<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);
  records = computed(() => this.firebaseRecords().map(d => d.data()));
  pageIndex = signal(0);
  total = signal(0);

  readonly columns: string[] = ['title', 'slug', 'status', 'createdAt', 'actions'];
  readonly pageSize = 5;

  constructor() {
    this.formControlLocale.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(locale => {
      const urlSegments = this.activatedRoute.snapshot.url.slice(2).map(el => el.path);
      const commands = ['content-list', locale, ...urlSegments];
      this.router.navigate(commands);
    });

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
      this.init();
    });
  }

  init() {
    // Reset signals
    this.firebaseRecords.set([]);
    this.pageIndex.set(0);
    this.total.set(0);

    this.fetchRecords();
  }

  async fetchRecords(
    startAfterDocument?: QueryDocumentSnapshot<DocumentData, DocumentData>,
    endBeforeDocument?: QueryDocumentSnapshot<DocumentData, DocumentData>
  ) {
    if (!this.contentTreeService.activeCollection()) {
      return;
    }
    const spinnerRef = this.spinnerDialogService.open();

    const collectionName = this.contentTreeService.activeCollection()!;
    const { docs: records, count: total } = await this.contentManagementService.fetchRecords(
      collectionName,
      this.pageSize,
      startAfterDocument,
      endBeforeDocument
    );
    this.firebaseRecords.set(records);
    this.total.set(total);

    this.spinnerDialogService.close(spinnerRef);
  }

  private async addRecord(data: any) {
    const spinnerRef = this.spinnerDialogService.open();

    const collectionName = this.contentTreeService.activeCollection()!;

    try {
      await this.contentManagementService.addRecord(collectionName, {
        ...data,
        slug: this.contentTreeService.activeCollectionUrl() + '/' + data.slug,
        locale: this.contentManagementService.locale(),
        active: true,
        revision: 0,
        status: 'draft',
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
    }

    this.spinnerDialogService.close(spinnerRef);
  }

  async onPublishRecord(record: DocumentData) {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      const i = this.records().findIndex(el => el === record);
      const documentRef = this.firebaseRecords()[i].ref;
      await this.contentManagementService.updateRecord(documentRef, { status: 'published' });
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);

    this.init();
  }

  async onDraftRecord(record: DocumentData) {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      const i = this.records().findIndex(el => el === record);
      const documentRef = this.firebaseRecords()[i].ref;
      await this.contentManagementService.updateRecord(documentRef, { status: 'draft' });
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);

    this.init();
  }

  async onDeleteRecord(record: DocumentData) {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      const i = this.records().findIndex(el => el === record);
      const documentRef = this.firebaseRecords()[i].ref;
      await this.contentManagementService.deleteRecord(documentRef);
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);

    this.init();
  }

  onNew() {
    const dialogRef = this.dialog.open(ContentListNewDialogComponent, { width: '480px' });
    dialogRef.closed.subscribe(async (data: any) => {
      if (data) {
        await this.addRecord(data);
        this.init();
      }
    });
  }

  onPage(event: PageEvent) {
    if (event.pageIndex > event.previousPageIndex!) {
      this.onNext();
    } else {
      this.onPrev();
    }
  }

  async onNext() {
    this.pageIndex.update(p => p + 1);
    try {
      const startAfterDocument = [...this.firebaseRecords()].pop();
      await this.fetchRecords(startAfterDocument);
    } catch (error) {
      this.pageIndex.update(p => p - 1);
    }
  }

  async onPrev() {
    this.pageIndex.update(p => p - 1);
    try {
      const endBeforeDocument = [...this.firebaseRecords()].shift();
      await this.fetchRecords(undefined, endBeforeDocument);
    } catch (error) {
      this.pageIndex.update(p => p + 1);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
}
