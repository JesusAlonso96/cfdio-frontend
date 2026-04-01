import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OutlinedIconDirective } from '../../directives/outlined-icon.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty',
  imports: [MatButtonModule, MatIconModule, OutlinedIconDirective, RouterModule],
  templateUrl: './empty.html',
  styleUrl: './empty.scss',
})
export class EmptyComponent {
  title = input.required<string>();
  message = input.required<string>();
  secondaryMessage = input<string>();
  routeToRedirect = input.required<string>();
  bigTittle = input.required<boolean>();
  note = input<string>('');
  actionLabel = input.required<string>();
  actionIcon = input<string>('arrow_forward');
}
