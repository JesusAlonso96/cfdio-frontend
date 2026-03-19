import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ApplicationRef, ComponentRef, createComponent, inject, Injectable } from '@angular/core';
import { ToastComponent } from '../components/toast/toast';
import { ToastType } from '../enums/toast-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private containerOverlayRef?: OverlayRef;
  private containerElement?: HTMLElement;
  private readonly activeToasts: { componentRef: ComponentRef<ToastComponent> }[] = [];
  private readonly overlay = inject(Overlay);
  private readonly appRef = inject(ApplicationRef);
  constructor() {}

  private show(message: string, type: ToastType, duration: number = 4000) {
    this.ensureContainer();

    // Crear el ToastComponent dinámicamente
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.appRef.injector,
    });
    this.appRef.attachView(componentRef.hostView);
    this.containerElement!.appendChild(componentRef.location.nativeElement);
    componentRef.instance.message = message;
    componentRef.instance.type = type;
    componentRef.instance.onClose = () => void this.removeToast(componentRef);

    // Añadir al contenedor
    this.containerElement!.appendChild(componentRef.location.nativeElement);

    this.activeToasts.push({ componentRef });

    this.repositionToasts();

    // Cierre automático
    setTimeout(() => componentRef.instance.close(), duration);
  }

  private ensureContainer() {
    if (!this.containerOverlayRef) {
      this.containerOverlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().top('20px').centerHorizontally(),
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });

      this.containerElement = this.containerOverlayRef.overlayElement;
      this.containerElement.style.position = 'relative';
      this.containerElement.style.display = 'flex';
      this.containerElement.style.flexDirection = 'column';
      this.containerElement.style.alignItems = 'center';
      this.containerElement.style.pointerEvents = 'none';
    }
  }

  private async removeToast(componentRef: ComponentRef<ToastComponent>) {
    await componentRef.instance.fadeOut();

    const index = this.activeToasts.findIndex((t) => t.componentRef === componentRef);
    if (index !== -1) this.activeToasts.splice(index, 1);

    if (componentRef.location.nativeElement.parentNode) {
      componentRef.location.nativeElement.parentNode.remove(componentRef.location.nativeElement);
    }
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
    this.repositionToasts();
  }

  private repositionToasts() {
    const spacing = 10;
    let currentTop = 0;

    for (const toast of this.activeToasts) {
      const el = toast.componentRef.location.nativeElement as HTMLElement;
      el.style.top = `${currentTop}px`;
      currentTop += el.offsetHeight + spacing;
    }
  }

  /* Public methods */
  public showSuccess(message: string, duration?: number) {
    this.show(message, ToastType.Success, duration);
  }

  public showError(message: string) {
    this.show(message, ToastType.Error, 8000);
  }

  public showWarning(message: string, duration?: number) {
    this.show(message, ToastType.Warning, duration);
  }

  public showInfo(message: string, duration?: number) {
    this.show(message, ToastType.Info, duration);
  }
}
