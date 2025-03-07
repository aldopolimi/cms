import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-content-detail-basic-information-box',
    imports: [CommonModule, MatExpansionModule],
    template: `
    <mat-accordion>
      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title> Basic information </mat-panel-title>
        </mat-expansion-panel-header>

        <table style="width: 100%">
          <tbody>
            <tr>
              <td>Slug</td>
              <td>{{ slug() }}</td>
            </tr>
            <tr>
              <td>Locale</td>
              <td>{{ flag() }} ( {{ locale() }} )</td>
            </tr>
            <tr>
              <td>Revision</td>
              <td>{{ revision() }}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td
                [ngStyle]="{
                  color: status() === 'published' ? 'lightgreen' : 'orange'
                }">
                {{ status() | uppercase }}
              </td>
            </tr>
            @if (status() === 'published') {
              <tr>
                <td>Published</td>
                <td>
                  {{ publishedAt() | date: "dd MMM yyyy '-' HH:mm:ss z" }}
                </td>
              </tr>
            }
            <tr>
              <td>Created</td>
              <td>
                {{ createdAt() | date: "dd MMM yyyy '-' HH:mm:ss z" }}
              </td>
            </tr>
            @if (updatedAt()) {
              <tr>
                <td>Updated</td>
                <td>
                  {{ updatedAt() | date: "dd MMM yyyy '-' HH:mm:ss z" }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </mat-expansion-panel>
    </mat-accordion>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentDetailBasicInformationBoxComponent {
  slug = input.required<string>();
  locale = input.required<string>();
  revision = input.required<number>();
  status = input.required<string>();
  createdAt = input.required<Date>();
  updatedAt = input<Date>();
  publishedAt = input<Date>();

  private readonly localeMap: Map<string, string> = new Map([
    ['it-IT', '🇮🇹'],
    ['en-EN', '🇬🇧'],
    ['fr-FR', '🇫🇷'],
    ['es-ES', '🇪🇸'],
    ['de-DE', '🇩🇪'],
  ]);
  flag: Signal<string | undefined> = computed(() => this.localeMap.get(this.locale()));
}
