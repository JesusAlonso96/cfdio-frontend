import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';
import { AuthService } from '../../../auth/services/auth.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  private _authService = inject(AuthService);
  private _loadingService = inject(LoadingService);
  private _toastService = inject(ToastService);

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this._loadingService.show();
    this._authService.logout().subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/auth']);
          this._loadingService.hide();
          this._toastService.showSuccess('Cierre de sesión exitoso');
        }, 1000);
      },
      error: (err: HttpErrorResponse) => this._loadingService.hide()
    })
    // Redirigir a la página de inicio de sesión
  }

}
