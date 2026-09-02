import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { HlmSidebarService } from './hlm-sidebar.service';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

@Directive({
  selector: 'a[hlmSidebarMenuSubButton], button[hlmSidebarMenuSubButton]',
  host: {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    '[attr.data-active]': 'isActive()',
    '[attr.data-size]': 'size()',
    '(click)': 'onClick()',
  },
})
export class HlmSidebarMenuSubButton {
  private readonly _sidebarService = inject(HlmSidebarService);
  private readonly _config = injectHlmSidebarConfig();

  public readonly closeMobileSidebarOnClick = input<boolean, BooleanInput>(
    this._config.closeMobileSidebarOnMenuButtonClick,
    { transform: booleanAttribute },
  );

  public readonly size = input<'sm' | 'md'>('md');
  public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  constructor() {
    classes(
      () =>
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>ng-icon]:text-[length:--spacing(4)] flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>ng-icon]:shrink-0 [&>span:last-child]:truncate',
    );
  }

  protected onClick(): void {
    if (this.closeMobileSidebarOnClick()) {
      this._sidebarService.setOpenMobile(false);
    }
  }
}
