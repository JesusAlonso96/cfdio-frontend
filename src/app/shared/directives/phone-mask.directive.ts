import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[phoneMask]'
})
export class PhoneMaskDirective {

  constructor(private el: ElementRef<HTMLInputElement>, private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    let value = this.el.nativeElement.value.replace(/\D/g, ''); // solo dígitos
    if (value.length > 10) value = value.slice(0, 10);
 

    // Formato con guiones: 123-456-7890
    let formatted = '';
    if (value.length <= 3) {
      formatted = value;
    } else if (value.length <= 6) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    }

    this.el.nativeElement.value = formatted;
    const control = this.ngControl?.control;
    if (control) {
      control.setValue(formatted, { emitEvent: false });
    }
    event.stopPropagation();
  }

}
