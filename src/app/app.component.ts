import { ChangeDetectionStrategy, Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarComponent,
    MatSidenavModule,
    SidenavComponent,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="app-container" autosize>
      <mat-sidenav #sidenav mode="side">
        @if (authService.isLoggedIn()) {
          <app-sidenav></app-sidenav>
        }
      </mat-sidenav>
      <mat-sidenav-content>
        @if (authService.isLoggedIn()) {
          <app-toolbar (menuClick)="sidenav.toggle()" (logoutClick)="logout()"></app-toolbar>
        }

        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild(MatSidenav) matSideNav?: MatSidenav;

  authService = inject(AuthService);
  router = inject(Router);

  async logout() {
    if (this.matSideNav) {
      this.matSideNav.close();
    }
    await this.authService.logout();
    this.router.navigate(['login']);
  }
}
