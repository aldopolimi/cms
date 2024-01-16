import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl, CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentTreeService } from '../../services/content-tree.service';
import { ContentManagementService } from '../../services/content-management.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CdkTreeModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="app-tree-wrapper">
      <h4>Content management</h4>
      <cdk-tree [dataSource]="menuItems()" [treeControl]="treeControl">
        <cdk-nested-tree-node *cdkTreeNodeDef="let node" class="app-tree-node">
          <button mat-icon-button disabled></button>
          @if (node.path) {
            <a
              [routerLink]="'/content-list/' + contentManagementService.locale() + '/' + node.path"
              routerLinkActive="active">
              {{ node.name }}
            </a>
          } @else {
            <span>
              {{ node.name }}
            </span>
          }
        </cdk-nested-tree-node>
        <cdk-nested-tree-node *cdkTreeNodeDef="let node; when: hasChild" class="app-tree-node">
          <div class="app-tree-node-inner">
            <button mat-icon-button [attr.aria-label]="'toggle ' + node.name" cdkTreeNodeToggle>
              <mat-icon class="mat-icon-rtl-mirror">
                {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
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
  contentTreeService = inject(ContentTreeService);
  contentManagementService = inject(ContentManagementService);

  treeControl = new NestedTreeControl<any>(node => node.children);
  menuItems = computed(() =>
    this.contentTreeService.contentTree()
      ? new ArrayDataSource(this.contentTreeService.contentTree()!.data)
      : new ArrayDataSource([])
  );

  constructor() {}

  hasChild(_: number, node: any) {
    return !!node.children && node.children.length > 0;
  }
}
