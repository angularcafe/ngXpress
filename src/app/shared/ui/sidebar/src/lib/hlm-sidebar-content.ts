import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmSidebarContent],hlm-sidebar-content',
  host: {
    'data-slot': 'sidebar-content',
    'data-sidebar': 'content',
  },
})
export class HlmSidebarContent {
  constructor() {
    classes(
      () =>
        'no-scrollbar gap-2 flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden',
    );
  }
}
