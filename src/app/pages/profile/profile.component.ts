import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    imports: [CommonModule],
    template: `
    <div class="app-page">
      <h1>Profile</h1>
      <p>{{ user.displayName }}</p>
      <p>{{ user.email }}</p>
    </div>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  authService = inject(AuthService);
  user = this.authService.user()!;
}
