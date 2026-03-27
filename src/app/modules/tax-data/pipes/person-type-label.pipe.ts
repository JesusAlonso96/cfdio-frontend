import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personTypeLabel',
  standalone: true,
})
export class PersonTypeLabelPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'NATURAL':
        return 'Física';
      case 'LEGAL':
        return 'Moral';
      default:
        return '';
    }
  }
}
