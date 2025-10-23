import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  template: `<app-loading></app-loading> <router-outlet />`
})
export class App {
  protected readonly title = signal('cfdio-frontend');
}
