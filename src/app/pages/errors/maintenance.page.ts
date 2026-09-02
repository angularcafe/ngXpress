import { Component } from '@angular/core';
import { MAINTENANCE_ERROR } from './error.config';
import { ErrorShell } from './error-shell';

@Component({
  selector: 'app-maintenance-page',
  imports: [ErrorShell],
  template: `<app-error-shell [config]="config" />`,
})
export class MaintenancePage {
  protected readonly config = MAINTENANCE_ERROR;
}
