import { Component } from '@angular/core';
import { FORBIDDEN_ERROR } from './error.config';
import { ErrorShell } from './error-shell';

@Component({
  selector: 'app-forbidden-page',
  imports: [ErrorShell],
  template: `<app-error-shell [config]="config" />`,
})
export class ForbiddenPage {
  protected readonly config = FORBIDDEN_ERROR;
}
