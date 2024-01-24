import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-content-detail',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>{{ content() | json }}</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentDetailComponent implements OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  route = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  firebaseContent: Signal<QueryDocumentSnapshot<DocumentData, DocumentData>> = toSignal(
    this.route.data.pipe(map(({ content }) => content))
  );
  content = computed(() => this.firebaseContent().data());

  contentForm = this.fb.group(
    {
      title: ['', [Validators.required]],
      slug: ['', [Validators.required], []],
    },
    { updateOn: 'blur' }
  );
  titleControl = this.contentForm.get('title')!;
  slugControl = this.contentForm.get('slug')!;

  constructor() {
    this.contentForm.statusChanges.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
}
