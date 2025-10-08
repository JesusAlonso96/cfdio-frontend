import { Component, EventEmitter, inject, input, OnDestroy, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
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
    // Lógica de cierre de sesión aquí
    console.log('Cerrar sesión');
    this.router.navigate(['/auth']); // Redirigir a la página de inicio de sesión
  }

}
