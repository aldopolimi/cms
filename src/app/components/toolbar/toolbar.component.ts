import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar>
      <button mat-icon-button aria-label="menu">
        <mat-icon>menu</mat-icon>
      </button>
      <span routerLink="/">CMS</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button aria-label="person" routerLink="/profile">
        <mat-icon>person</mat-icon>
      </button>
      <button mat-icon-button aria-label="settings" routerLink="/settings">
        <mat-icon>settings</mat-icon>
      </button>
      <button mat-icon-button aria-label="logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: `
    .toolbar-spacer {
      flex: 1 1 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {}
