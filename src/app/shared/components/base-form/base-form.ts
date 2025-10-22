import { FormGroup, AbstractControl } from '@angular/forms';

export abstract class BaseFormComponent<T extends { [key: string]: any }> {
  // Cada componente que extienda debe definir su FormGroup tipado
  abstract form: FormGroup;

  // Devuelve el control de un campo
  control<K extends keyof T>(name: K): AbstractControl | null {
    return this.form.get(name as string);
  }

  // Devuelve el valor de un campo
  value<K extends keyof T>(name: K): T[K] | null {
    return this.form.get(name as string)?.value ?? null;
  }

  // Verifica si un campo tiene un error específico y ha sido tocado
  hasError<K extends keyof T>(name: K, error: string): boolean {
    const ctrl = this.control(name);
    return !!ctrl && ctrl.hasError(error) && ctrl.touched;
  }

  // Marca todos los controles como tocados (útil al hacer submit)
  markAllTouched(): void {
    this.form.markAllAsTouched();
  }

  // Valida si el control esta habilitado
  isEnabled<K extends keyof T>(name: K): boolean {
    const ctrl = this.control(name);
    return !!ctrl && ctrl.enabled;
  }

  // Habilita el control
  setEnable<K extends keyof T>(name: K): void {
    this.control(name)?.enable({ onlySelf: true });
  }

  // Deshabilita el control
  setDisable<K extends keyof T>(name: K): void {
    this.control(name)?.disable({ onlySelf: true });
  }

}
