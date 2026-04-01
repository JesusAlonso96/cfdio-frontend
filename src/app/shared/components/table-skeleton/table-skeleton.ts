import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  imports: [],
  templateUrl: './table-skeleton.html',
  styleUrl: './table-skeleton.scss',
})
export class TableSkeletonComponent {
  rows = input<number>(5);

  rowsArray = computed(() => Array.from({ length: this.rows() }));
}
