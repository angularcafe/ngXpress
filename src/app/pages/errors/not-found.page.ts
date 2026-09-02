import { Component } from '@angular/core';
import { NOT_FOUND_ERROR } from './error.config';
import { ErrorShell } from './error-shell';

@Component({
  selector: 'app-not-found-page',
  imports: [ErrorShell],
  template: `<app-error-shell [config]="config" />`,
})
export class NotFoundPage {
  protected readonly config = NOT_FOUND_ERROR;
}
