import { Component, effect, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OutlinedIconDirective } from '../../directives/outlined-icon.directive';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-input-table-search',
  imports: [MatInputModule, MatIconModule, OutlinedIconDirective, ReactiveFormsModule],
  templateUrl: './input-table-search.html',
  styleUrl: './input-table-search.scss',
})
export class InputTableSearchComponent implements OnInit {
  searchEvent = output<string | null>();
  searchControl = new FormControl('');
  total = input.required<number>();

  constructor() {
    // efecto reactivo: si el total es 0 la busqueda se deshabilita
    effect(() => {
      if (this.total() === 0) {
        this.searchControl.disable({ emitEvent: false });
      } else {
        this.searchControl.enable({ emitEvent: false });
      }
    });
  }
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // espera 300ms tras el último tecleo
        distinctUntilChanged(), // solo dispara si el valor cambió
      )
      .subscribe((searchValue) => {
        this.searchEvent.emit(searchValue);
      });
  }

  clearSearch() {
    this.searchControl.setValue('');
  }
}
