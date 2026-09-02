import { Component } from '@angular/core';
import { SERVER_ERROR } from './error.config';
import { ErrorShell } from './error-shell';

@Component({
  selector: 'app-server-error-page',
  imports: [ErrorShell],
  template: `<app-error-shell [config]="config" />`,
})
export class ServerErrorPage {
  protected readonly config = SERVER_ERROR;
}
