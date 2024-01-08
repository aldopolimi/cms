import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-content-detail',
  standalone: true,
  imports: [],
  template: `
    <p>
      content-detail works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentDetailComponent {

}
