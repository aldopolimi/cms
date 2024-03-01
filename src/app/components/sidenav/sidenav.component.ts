import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ContentTreeService } from '../../services/content-tree.service';
import { ContentManagementService } from '../../services/content-management.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ContentElement } from '../../models/content-tree';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="app-tree-wrapper">
      <h3>CONTENT MANAGEMENT</h3>

      <mat-tree [dataSource]="menuItems()" [treeControl]="treeControl">
        <!-- This is the tree node template for leaf nodes -->
        <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
          <button mat-icon-button disabled></button>
          @if (node.path) {
            <a
              [routerLink]="'/content-list/' + contentManagementService.locale() + '/' + node.path"
              routerLinkActive="active"
              >{{ node.name }}
            </a>
          } @else {
            {{ node.name }}
          }
        </mat-tree-node>

        <!-- This is the tree node template for expandable nodes -->
        <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
          <button mat-icon-button matTreeNodeToggle [attr.aria-label]="'Toggle ' + node.name">
            <mat-icon class="mat-icon-rtl-mirror">
              {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
            </mat-icon>
          </button>
          {{ node.name }}
        </mat-tree-node>
      </mat-tree>

      <br />

      <h3>MEDIA LIBRARY</h3>

      <ul class="link-list">
        <li>
          <a routerLink="/media-library/images" routerLinkActive="active"> Images </a>
        </li>
        <li>
          <a routerLink="/media-library/videos" routerLinkActive="active"> Videos </a>
        </li>
        <li>
          <a routerLink="/media-library/documents" routerLinkActive="active"> Documents </a>
        </li>
      </ul>
    </div>
  `,
  styles: `

    .app-tree-wrapper {
      padding: 40px 80px 40px 20px;
    }

    a {
      color: inherit;
      text-decoration: none;
      &:hover,
      &.active {
        color: #ef4e8d;
      }
    }

    .link-list {
      list-style: none;
      margin: 0;
      padding-left: 48px;
      li {
        padding: 14px 0;
      }
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  contentTreeService = inject(ContentTreeService);
  contentManagementService = inject(ContentManagementService);

  private _transformer = (node: ContentElement, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      path: node.path,
    };
  };
  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  menuItems = computed(() =>
    this.contentTreeService.contentTree()
      ? new MatTreeFlatDataSource(
          this.treeControl,
          this.treeFlattener,
          this.contentTreeService.contentTree()!.data
        )
      : new MatTreeFlatDataSource(this.treeControl, this.treeFlattener, [])
  );

  constructor() {}

  hasChild = (_: number, node: any) => node.expandable;
}
