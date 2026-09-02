import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { AuthService } from '@core/auth/auth.service';
import { APP_NAME } from '@core/config/app-brand';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NavMain, type SidebarNavItem } from './nav-main';
import { NavUser } from './nav-user';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, NgIcon, NavMain, NavUser, RouterLink],
  providers: [provideIcons({ lucideCommand })],
  template: `
    <div hlmSidebarWrapper class="bg-background min-h-svh">
      <hlm-sidebar collapsible="icon" variant="inset">
        <hlm-sidebar-header>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="lg" routerLink="/admin/dashboard">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideCommand" class="text-base" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{ appName }}</span>
                  <span class="truncate text-xs">Workspace</span>
                </div>
              </a>
            </li>
          </ul>
        </hlm-sidebar-header>

        <hlm-sidebar-content>
          <app-nav-main [items]="navItems" />
        </hlm-sidebar-content>

        @if (sidebarUser(); as user) {
          <hlm-sidebar-footer>
            <app-nav-user [user]="user" (signOut)="onSignOut()" />
          </hlm-sidebar-footer>
        }
      </hlm-sidebar>

      <ng-content />
    </div>
  `,
})
export class Sidebar {
  protected readonly appName = APP_NAME;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navItems: SidebarNavItem[] = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: 'lucideLayoutDashboard',
      exact: true,
    },
    {
      title: 'Tasks',
      url: '/admin/tasks',
      icon: 'lucideListTodo',
    },
  ];

  protected readonly sidebarUser = computed(() => {
    const session = this.auth.session();
    if (!session?.user) {
      return null;
    }

    const name = session.user.name?.trim() || session.user.email.split('@')[0];
    const email = session.user.email;
    const initials = getInitials(name || email);

    return {
      name,
      email,
      initials,
    };
  });

  protected async onSignOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/auth/login']);
  }
}

function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
}
