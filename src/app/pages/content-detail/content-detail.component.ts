import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContentTreeService } from '../../services/content-tree.service';
import { ContentManagementService } from '../../services/content-management.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerDialogService } from '../../services/spinner-dialog.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ContentDetailBasicInformationBoxComponent } from './components/content-detail-basic-information-box/content-detail-basic-information-box.component';
import { ContentDetailActionsBoxComponent } from './components/content-detail-actions-box/content-detail-actions-box.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-content-detail',
  template: `
    <div class="app-page">
      <button mat-flat-button type="button" (click)="onBack()">
        <mat-icon>arrow_back</mat-icon> Back to {{ contentTreeService.activeCollectionUrl() }}
      </button>
    </div>

    <div class="app-page app-page--flex">
      <div class="app-page__side">
        <app-content-detail-basic-information-box
          [slug]="content()['slug']"
          [locale]="content()['locale']"
          [revision]="content()['revision']"
          [status]="content()['status']"
          [createdAt]="content()['createdAt']?.toDate()"
          [updatedAt]="content()['updatedAt']?.toDate()"
          [publishedAt]="
            content()['publishedAt']?.toDate()
          "></app-content-detail-basic-information-box>
      </div>
      <form class="app-page__centered" [formGroup]="contentForm">
        <mat-accordion>
          <mat-expansion-panel [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title> Main information </mat-panel-title>
            </mat-expansion-panel-header>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Title</mat-label>
              <input formControlName="title" matInput #title placeholder="title" maxlength="255" />
              <mat-hint align="end">{{ title.value.length }}/255</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Internal title</mat-label>
              <input
                formControlName="internalTitle"
                matInput
                #internalTitle
                placeholder="internal title"
                maxlength="255" />
              <mat-hint align="end">{{ internalTitle.value.length }}/255</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Sitemap ID</mat-label>
              <input
                formControlName="sitemapId"
                matInput
                #sitemapId
                placeholder="sitemap id"
                maxlength="255" />
              <mat-hint align="end">{{ sitemapId.value.length }}/255</mat-hint>
            </mat-form-field>
          </mat-expansion-panel>
        </mat-accordion>
        <br />
        <mat-accordion>
          <mat-expansion-panel [expanded]="false">
            <mat-expansion-panel-header>
              <mat-panel-title> Metadata </mat-panel-title>
            </mat-expansion-panel-header>

            <mat-card>
              <mat-card-header>
                <mat-card-subtitle>Google</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>Description</mat-label>
                  <textarea
                    formControlName="metadataGoogleDescription"
                    matInput
                    #metadataGoogleDescription
                    placeholder="description"
                    maxlength="255"></textarea>
                  <mat-hint align="end">{{ metadataGoogleDescription.value.length }}/255</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>Keywords</mat-label>
                  <textarea
                    formControlName="metadataGoogleKeywords"
                    matInput
                    #metadataGoogleKeywords
                    placeholder="keywords"
                    maxlength="255"></textarea>
                  <mat-hint align="end">{{ metadataGoogleKeywords.value.length }}/255</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>Robots</mat-label>
                  <mat-select
                    formControlName="metadataGoogleRobots"
                    #metadataGoogleRobots
                    placeholder="robots">
                    <mat-option value=""></mat-option>
                    <mat-option value="index-follow">index-follow</mat-option>
                    <mat-option value="noindex-nofollow">noindex-nofollow</mat-option>
                  </mat-select>
                </mat-form-field>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-subtitle>Facebook</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>OG:Title</mat-label>
                  <input
                    formControlName="metadataFacebookTitle"
                    matInput
                    #metadataFacebookTitle
                    placeholder="title"
                    maxlength="255" />
                  <mat-hint align="end">{{ metadataFacebookTitle.value.length }}/255</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>OG:Type</mat-label>
                  <input
                    formControlName="metadataFacebookType"
                    matInput
                    #metadataFacebookType
                    placeholder="type"
                    maxlength="255" />
                  <mat-hint align="end">{{ metadataFacebookType.value.length }}/255</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>OG:Description</mat-label>
                  <textarea
                    formControlName="metadataFacebookDescription"
                    matInput
                    #metadataFacebookDescription
                    placeholder="description"
                    maxlength="255"></textarea>
                  <mat-hint align="end"
                    >{{ metadataFacebookDescription.value.length }}/255</mat-hint
                  >
                </mat-form-field>

                <mat-form-field appearance="outline" floatLabel="always">
                  <mat-label>OG:Url</mat-label>
                  <input
                    formControlName="metadataFacebookUrl"
                    matInput
                    #metadataFacebookUrl
                    placeholder="url"
                    maxlength="255" />
                  <mat-hint align="end">{{ metadataFacebookUrl.value.length }}/255</mat-hint>
                </mat-form-field>
              </mat-card-content>
            </mat-card>
          </mat-expansion-panel>
        </mat-accordion>
      </form>
      <div class="app-page__side">
        <app-content-detail-actions-box
          [contentStatus]="content()['status']"
          [contentFormStatus]="contentFormStatus()"
          (publish)="onPublish()"
          (draft)="onDraft()"
          (save)="onSave()"
          (delete)="onDelete()">
        </app-content-detail-actions-box>
      </div>
    </div>
  `,
  styles: `
    mat-expansion-panel mat-card,
    mat-expansion-panel mat-card mat-card-header {
      margin-bottom: 10px;
    }

    mat-form-field {
      width: 100%;
      margin: 10px 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ContentDetailBasicInformationBoxComponent,
    ContentDetailActionsBoxComponent,
  ],
})
export class ContentDetailComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  contentTreeService = inject(ContentTreeService);
  contentManagementService = inject(ContentManagementService);
  spinnerDialogService = inject(SpinnerDialogService);

  firebaseContent = signal<QueryDocumentSnapshot<DocumentData, DocumentData>>(
    this.activatedRoute.snapshot.data['content'] as QueryDocumentSnapshot<
      DocumentData,
      DocumentData
    >
  );
  content = computed(() => this.firebaseContent().data());

  contentForm = this.fb.group(
    {
      title: [this.content()['title'], [Validators.required]],
      internalTitle: [this.content()['internalTitle']],
      sitemapId: [this.content()['sitemapId']],

      metadataGoogleDescription: [this.content()['metadata']?.['google']?.['description']],
      metadataGoogleKeywords: [this.content()['metadata']?.['google']?.['keywords']],
      metadataGoogleRobots: [this.content()['metadata']?.['google']?.['robots']],

      metadataFacebookTitle: [this.content()['metadata']?.['facebook']?.['title']],
      metadataFacebookType: [this.content()['metadata']?.['facebook']?.['type']],
      metadataFacebookDescription: [this.content()['metadata']?.['facebook']?.['description']],
      metadataFacebookUrl: [this.content()['metadata']?.['facebook']?.['url']],
    },
    { updateOn: 'change' }
  );
  titleControl = this.contentForm.get('title')!;
  internalTitleControl = this.contentForm.get('internalTitle')!;
  sitemapIdControl = this.contentForm.get('sitemapId')!;
  metadataGoogleDescriptionControl = this.contentForm.get('metadataGoogleDescription')!;
  metadataGoogleKeywordsControl = this.contentForm.get('metadataGoogleKeywords')!;
  metadataGoogleRobotsControl = this.contentForm.get('metadataGoogleRobots')!;
  metadataFacebookTitleControl = this.contentForm.get('metadataFacebookTitle')!;
  metadataFacebookTypeControl = this.contentForm.get('metadataFacebookType')!;
  metadataFacebookDescriptionControl = this.contentForm.get('metadataFacebookDescription')!;
  metadataFacebookUrlControl = this.contentForm.get('metadataFacebookUrl')!;

  contentFormStatus = toSignal(this.contentForm.statusChanges, {
    initialValue: this.contentForm.status,
  });

  async onPublish(): Promise<void> {
    if (!this.contentForm.valid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      data: { title: 'Publish content', message: `Are you sure to publish this content ?` },
      disableClose: true,
    });
    const confirm = await lastValueFrom(dialogRef.afterClosed());
    if (confirm) {
      await this.publish({
        ...this.content(),
        title: this.titleControl.value,
        internalTitle: this.internalTitleControl.value,
        sitemapId: this.sitemapIdControl.value,
        metadata: {
          google: {
            description: this.metadataGoogleDescriptionControl.value,
            keywords: this.metadataGoogleKeywordsControl.value,
            robots: this.metadataGoogleRobotsControl.value,
          },
          facebook: {
            title: this.metadataFacebookTitleControl.value,
            type: this.metadataFacebookTypeControl.value,
            description: this.metadataFacebookDescriptionControl.value,
            url: this.metadataFacebookUrlControl.value,
          },
        },
      });
      this.reload();
    }
  }

  private async publish(record: DocumentData) {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      const collectionName = this.contentTreeService.activeCollection()!;
      await this.contentManagementService.publish(
        collectionName,
        this.firebaseContent().ref,
        record
      );
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  async onDraft() {
    if (!this.contentForm.valid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      data: { title: 'Draft content', message: `Are you sure to draft this content ?` },
      disableClose: true,
    });
    const confirm = await lastValueFrom(dialogRef.afterClosed());
    if (confirm) {
      await this.draft({
        ...this.content(),
        title: this.titleControl.value,
        internalTitle: this.internalTitleControl.value,
        sitemapId: this.sitemapIdControl.value,
        metadata: {
          google: {
            description: this.metadataGoogleDescriptionControl.value,
            keywords: this.metadataGoogleKeywordsControl.value,
            robots: this.metadataGoogleRobotsControl.value,
          },
          facebook: {
            title: this.metadataFacebookTitleControl.value,
            type: this.metadataFacebookTypeControl.value,
            description: this.metadataFacebookDescriptionControl.value,
            url: this.metadataFacebookUrlControl.value,
          },
        },
      });
      this.reload();
    }
  }

  private async draft(record: DocumentData) {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      const collectionName = this.contentTreeService.activeCollection()!;
      await this.contentManagementService.draft(collectionName, this.firebaseContent().ref, record);
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  async onSave(): Promise<void> {
    if (!this.contentForm.valid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      data: { title: 'Save content', message: `Are you sure to save this content ?` },
      disableClose: true,
    });
    const confirm = await lastValueFrom(dialogRef.afterClosed());
    if (confirm) {
      await this.save({
        ...this.content(),
        title: this.titleControl.value,
        internalTitle: this.internalTitleControl.value,
        sitemapId: this.sitemapIdControl.value,
        metadata: {
          google: {
            description: this.metadataGoogleDescriptionControl.value,
            keywords: this.metadataGoogleKeywordsControl.value,
            robots: this.metadataGoogleRobotsControl.value,
          },
          facebook: {
            title: this.metadataFacebookTitleControl.value,
            type: this.metadataFacebookTypeControl.value,
            description: this.metadataFacebookDescriptionControl.value,
            url: this.metadataFacebookUrlControl.value,
          },
        },
      });
      this.reload();
    }
  }

  private async save(record: DocumentData) {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      const collectionName = this.contentTreeService.activeCollection()!;
      await this.contentManagementService.save(collectionName, this.firebaseContent().ref, record);
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  async onDelete(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      data: { title: 'Delete content', message: `Are you sure to delete this content ?` },
      disableClose: true,
    });
    const confirm = await lastValueFrom(dialogRef.afterClosed());
    if (confirm) {
      await this.delete();

      this.snackBar.open('Content deleted successfully', '', { duration: 2000 });
      this.backToContentList(true);
    }
  }

  private async delete(): Promise<void> {
    const spinnerRef = this.spinnerDialogService.open();
    try {
      await this.contentManagementService.delete(this.firebaseContent().ref);
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  private async reload(): Promise<void> {
    const collectionName = this.contentTreeService.activeCollection()!;

    const spinnerRef = this.spinnerDialogService.open();
    try {
      const content = await this.contentManagementService.findOneBySlug(
        collectionName,
        this.content()['slug']
      );
      // TO BE IMPROVED
      if (content) {
        this.firebaseContent.set(content);
      }
    } catch (error) {
      console.log(error);
    }
    this.spinnerDialogService.close(spinnerRef);
  }

  onBack() {
    this.backToContentList();
  }

  private backToContentList(replaceUrl = false) {
    const commands = this.activatedRoute.snapshot.url.map(el => el.path).slice(1, -1);
    this.router.navigate(['content-list', ...commands], { replaceUrl });
  }
}
