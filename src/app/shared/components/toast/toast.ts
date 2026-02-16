import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Signal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OutlinedIconDirective } from '../../directives/outlined-icon.directive';
import { ToastType } from '../../enums/toast-type.enum';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, MatIconModule, OutlinedIconDirective],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent implements AfterViewInit {
  @Input() message = '';
  @Input() type: ToastType = ToastType.Success;
  visible = false;
  toastIcon: string = '';

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    // Espera un ciclo para asegurar que el DOM pinte el estado inicial (invisible)
    setTimeout(() => {
      this.visible = true;
      this.toastIcon = this.getCurrentIcon();
      this.cdr.detectChanges();
    }, 10);
  }

  async fadeOut(): Promise<void> {
    this.visible = false;
    this.cdr.detectChanges();

    return new Promise(resolve => setTimeout(resolve, 300)); // Duración de la animación
  }

  close() {
    this.fadeOut().then(() => this.onClose?.());
  }

  onClose?: () => void;

  private getCurrentIcon(): string {
    switch (this.type) {
      case ToastType.Success: return 'check_circle_unread';
      case ToastType.Error: return 'release_alert';
      case ToastType.Warning: return 'warning';
      case ToastType.Info: return 'info';
      default: return 'check_circle_unread';
    }
  }
}
