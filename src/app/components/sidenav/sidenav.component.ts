import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl, CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CdkTreeModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="app-tree-wrapper">
      <h4>Content management</h4>
      <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
        <cdk-nested-tree-node *cdkTreeNodeDef="let node" class="app-tree-node">
          <button mat-icon-button disabled></button>
          @if (node.routerLink) {
            <a [routerLink]="node.routerLink" routerLinkActive="active">
              {{ node.name }}
            </a>
          } @else {
            <span>
              {{ node.name }}
            </span>
          }
        </cdk-nested-tree-node>
        <cdk-nested-tree-node
          *cdkTreeNodeDef="let node; when: hasChild"
          class="app-tree-node">
          <div class="app-tree-node-inner">
            <button
              mat-icon-button
              [attr.aria-label]="'toggle ' + node.name"
              cdkTreeNodeToggle>
              <mat-icon class="mat-icon-rtl-mirror">
                {{
                  treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'
                }}
              </mat-icon>
            </button>
            {{ node.name }}
          </div>
          <div [class.app-tree-invisible]="!treeControl.isExpanded(node)">
            <ng-container cdkTreeNodeOutlet></ng-container>
          </div>
        </cdk-nested-tree-node>
      </cdk-tree>
    </div>
  `,
  styles: `

    .app-tree-wrapper {
      width: 240px;
      padding: 40px 80px 40px 20px;
    }

    .app-tree-invisible {
      display: none;
    }

    .app-tree ul,
    .app-tree li {
      margin-top: 0;
      margin-bottom: 0;
      list-style-type: none;
    }
    .app-tree-node {
      display: block;
    }
    .app-tree-node-inner {
      display: flex;
      align-items: center;
    }

    .app-tree-node .app-tree-node {
      padding-left: 20px;
      word-break: break-all;
    }

    .app-tree-node > a {
      text-decoration: none;
      color: inherit;
    }

    .app-tree-node > a.active {
      color: #c2185b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  treeControl = new NestedTreeControl<any>(node => node.children);
  hasChild = (_: number, node: any) =>
    !!node.children && node.children.length > 0;
  dataSource = new ArrayDataSource([
    {
      name: 'Auto',
      children: [
        { name: 'Pages', routerLink: '/content-list/it-IT/auto/pages' },
        { name: 'Cards', routerLink: '/content-list/it-IT/auto/cards' },
        {
          name: 'Owners Club',
          routerLink: '/content-list/it-IT/auto/owners-club',
        },
      ],
    },
    {
      name: 'Racing',
      children: [
        {
          name: 'Hypercar',
          routerLink: '/content-list/it-IT/racing/hypercar',
        },
        {
          name: 'Scuderia',
          children: [
            {
              name: 'F1',
              routerLink: '/content-list/it-IT/racing/scuderia/f1',
            },
            {
              name: 'News',
              children: [
                {
                  name: '2022',
                  routerLink: '/content-list/it-IT/racing/news/2022',
                },
                {
                  name: '2023',
                  routerLink: '/content-list/it-IT/racing/news/2023',
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
}
