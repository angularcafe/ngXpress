import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { Sidebar } from '@components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HlmSidebarImports, Sidebar],
  template: `
    <app-sidebar>
      <main hlmSidebarInset>
        <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <button hlmSidebarTrigger type="button">
            <span class="sr-only">Toggle sidebar</span>
          </button>
        </header>

        <div class="flex min-w-0 flex-1 flex-col p-6">
          <router-outlet />
        </div>
      </main>
    </app-sidebar>
  `,
})
export class AdminLayout {}
