import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmSidebarHeader],hlm-sidebar-header',
  host: {
    'data-slot': 'sidebar-header',
    'data-sidebar': 'header',
  },
})
export class HlmSidebarHeader {
  constructor() {
    classes(() => 'gap-2 p-2 flex flex-col');
  }
}
