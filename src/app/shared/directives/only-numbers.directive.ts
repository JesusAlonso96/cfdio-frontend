import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]',
})
export class OnlyNumbersDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replaceAll(/\D/g, '');

    if (input.value !== cleanValue) {
      input.value = cleanValue;
      input.dispatchEvent(new Event('input'));
    }
  }
}
