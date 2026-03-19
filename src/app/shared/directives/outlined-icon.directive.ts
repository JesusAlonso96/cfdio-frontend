import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[outlined]',
})
export class OutlinedIconDirective {
  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
  ) {
    this.renderer.addClass(this.el.nativeElement, 'material-symbols-outlined');
  }
}
