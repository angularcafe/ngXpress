import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: 'button[hlmSidebarGroupAction]',
  host: {
    'data-slot': 'sidebar-group-action',
    'data-sidebar': 'group-action',
  },
})
export class HlmSidebarGroupAction {
  constructor() {
    classes(
      () =>
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute end-3 top-3.5 w-5 rounded-md p-0 focus-visible:ring-2 [&>ng-icon]:text-[length:--spacing(4)] flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>ng-icon]:shrink-0',
    );
  }
}
