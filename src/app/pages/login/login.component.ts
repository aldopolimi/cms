import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ContentTreeService } from '../../services/content-tree.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="app-container app-center">
      @if (status() === 'idle') {
        <button mat-raised-button (click)="login()">
          Login with Google <mat-icon>login</mat-icon>
        </button>
      } @else if (status() === 'pending') {
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  authService = inject(AuthService);
  contentTreeService = inject(ContentTreeService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  status = signal('idle');

  async login() {
    this.status.set('pending');
    let success = await this.authService.loginWithGoogle();
    if (!success) {
      this.status.set('idle');
      this.snackBar.open('Something went wrong, please try again', '', { duration: 2000 });
      return;
    }

    try {
      await this.contentTreeService.fetchContentTree();
    } catch (error) {
      this.status.set('idle');
      this.snackBar.open('Something went wrong, please try again', '', { duration: 2000 });
      return;
    }

    this.status.set('done');
    this.router.navigate(['']);
  }
}
