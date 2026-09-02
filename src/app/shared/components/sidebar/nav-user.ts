import { Component, computed, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

export type SidebarUser = {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
};

@Component({
  selector: 'app-nav-user',
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideSparkles,
      lucideBadgeCheck,
      lucideCreditCard,
      lucideBell,
      lucideLogOut,
    }),
  ],
  template: `
    @let currentUser = user();
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <button hlmSidebarMenuButton size="lg" [hlmDropdownMenuTrigger]="menu" [side]="menuSide()" align="end">
          <hlm-avatar class="rounded-lg">
            @if (currentUser.avatar) {
              <img [src]="currentUser.avatar" [alt]="currentUser.name" hlmAvatarImage />
            }
            <span class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground" hlmAvatarFallback>
              {{ currentUser.initials }}
            </span>
          </hlm-avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">{{ currentUser.name }}</span>
            <span class="truncate text-xs">{{ currentUser.email }}</span>
          </div>
          <ng-icon name="lucideChevronsUpDown" class="ml-auto text-base" />
        </button>
      </li>
    </ul>

    <ng-template #menu>
      <hlm-dropdown-menu class="min-w-56 rounded-lg">
        <hlm-dropdown-menu-label>
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <hlm-avatar class="rounded-lg">
              @if (currentUser.avatar) {
                <img [src]="currentUser.avatar" [alt]="currentUser.name" hlmAvatarImage />
              }
              <span class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground" hlmAvatarFallback>
                {{ currentUser.initials }}
              </span>
            </hlm-avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ currentUser.name }}</span>
              <span class="truncate text-xs">{{ currentUser.email }}</span>
            </div>
          </div>
        </hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem type="button">
            <ng-icon name="lucideSparkles" />
            Upgrade to Pro
          </button>
        </hlm-dropdown-menu-group>
        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem type="button">
            <ng-icon name="lucideBadgeCheck" />
            Account
          </button>
          <button hlmDropdownMenuItem type="button">
            <ng-icon name="lucideCreditCard" />
            Billing
          </button>
          <button hlmDropdownMenuItem type="button">
            <ng-icon name="lucideBell" />
            Notifications
          </button>
        </hlm-dropdown-menu-group>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem type="button" (click)="signOut.emit()">
          <ng-icon name="lucideLogOut" />
          Log out
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class NavUser {
  private readonly sidebarService = inject(HlmSidebarService);

  readonly user = input.required<SidebarUser>();
  readonly signOut = output<void>();

  protected readonly menuSide = computed(() => (this.sidebarService.isMobile() ? 'top' : 'right'));
}
