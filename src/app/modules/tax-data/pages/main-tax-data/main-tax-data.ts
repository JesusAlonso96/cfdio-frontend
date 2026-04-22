import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon.directive';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxDataService } from '../../services/tax-data.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { TaxData } from '../../models/tax-data.interface';
import { PersonTypeLabelPipe } from '../../pipes/person-type-label.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { EmptyComponent } from '../../../../shared/components/empty/empty';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableSkeletonComponent } from '../../../../shared/components/table-skeleton/table-skeleton';
import { ItemsPerPagePaginator } from '../../../../shared/enums/items-per-page-paginator.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTableSearchComponent } from '../../../../shared/components/input-table-search/input-table-search';

@Component({
  selector: 'app-main-tax-data',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    OutlinedIconDirective,
    PersonTypeLabelPipe,
    MatTooltipModule,
    EmptyComponent,
    TableSkeletonComponent,
    ReactiveFormsModule,
    InputTableSearchComponent,
  ],
  templateUrl: './main-tax-data.html',
  styleUrl: './main-tax-data.scss',
})
export class MainTaxData {
  private readonly _toastService = inject(ToastService);
  private readonly _taxDataService = inject(TaxDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  //PAGINATOR
  @ViewChild('paginator') paginator!: MatPaginator;
  ItemsPerPagePaginator = ItemsPerPagePaginator;
  protected pageIndex = signal(0);
  protected pageSize = signal(5);
  protected totalFiltered = signal(0);
  protected total = signal(0);

  //FILTER
  private readonly searchValue = signal('');
  protected readonly displayedColumns: string[] = ['taxData', 'personType', 'actions'];
  protected filteredTaxData = signal<TaxData[]>([]);
  protected isLoading = signal<boolean>(false);
  constructor() {
    // efecto reactivo: si cambia pageIndex o pageSize, recarga automáticamente
    effect(() => {
      const _ = this.pageIndex(); // leer para reaccionar
      const __ = this.pageSize();
      this.loadData(this.searchValue());
    });
  }

  async loadData(searchTerm: string | null) {
    try {
      this.isLoading.set(true);
      const page = this.pageIndex() + 1;
      const size = this.pageSize();
      const response = await this._taxDataService.getAllTaxDataAsync(page, size, searchTerm);
      this.totalFiltered.set(response.totalFiltered);
      this.total.set(response.total);
      this.filteredTaxData.set(response.data);
      setTimeout(() => {
        this.isLoading.set(false);
      }, 300);
    } catch (error) {
      console.error('Error al obtener los datos fiscales: ', error);
      this.isLoading.set(false);
      this._toastService.showError(
        'Ocurrió un error al obtener los datos fiscales, por favor intentalo de nuevo más tarde.',
      );
    }
  }

  protected openCreateTaxData(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route });
  }

  /* Make tax data default method */
  protected async makeDefault(id: number): Promise<void> {
    try {
      await this._taxDataService.makeTaxDataDefaultAsync(id);
      this.setDefault(id);
    } catch (error) {
      console.error(error);
      this._toastService.showError(
        'Ocurrió un error al cambiar el estado de los datos fiscales, por favor intentalo de nuevo más tarde.',
      );
    }
  }

  async setDefault(id: number) {
    this.filteredTaxData.update((items) =>
      items.map((item) => ({
        ...item,
        default: item.id === id,
      })),
    );
  }

  /* PAGINATOR FUNCTIONS */
  onPageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  /* SEARCH FUNCTIONS */
  searchEvent(e: any) {
    this.pageIndex.set(0);
    this.searchValue.set(e);
    this.loadData(e);
  }
}
