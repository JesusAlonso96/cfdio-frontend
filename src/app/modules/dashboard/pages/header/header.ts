import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, OutlinedIconDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  isCollapsed = input.required<boolean>();
  hasScrolled = input.required<boolean>();
  private router = inject(Router);
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.router.navigate(['/auth']); // Redirigir a la página de inicio de sesión
  }

}
