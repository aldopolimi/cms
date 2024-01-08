import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [],
  template: `
    <p>
      content-list works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentListComponent {

}
