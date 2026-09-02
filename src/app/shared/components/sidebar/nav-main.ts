import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideListTodo } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: string;
  exact?: boolean;
};

@Component({
  selector: 'app-nav-main',
  imports: [HlmSidebarImports, NgIcon, RouterLink, RouterLinkActive],
  providers: [provideIcons({ lucideLayoutDashboard, lucideListTodo })],
  template: `
    <hlm-sidebar-group>
      <div hlmSidebarGroupLabel>Platform</div>
      <ul hlmSidebarMenu>
        @for (item of items(); track item.url) {
          <li hlmSidebarMenuItem>
            <a
              hlmSidebarMenuButton
              [routerLink]="item.url"
              routerLinkActive
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              #rla="routerLinkActive"
              [isActive]="rla.isActive"
            >
              <ng-icon [name]="item.icon" />
              <span>{{ item.title }}</span>
            </a>
          </li>
        }
      </ul>
    </hlm-sidebar-group>
  `,
})
export class NavMain {
  readonly items = input.required<SidebarNavItem[]>();
}
