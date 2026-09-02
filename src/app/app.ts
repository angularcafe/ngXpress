import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  imports: [RouterOutlet, HlmToasterImports],
  selector: 'app-root',
  template: `
    <router-outlet />
    <hlm-toaster richColors closeButton />
  `,
})
export class App {}
