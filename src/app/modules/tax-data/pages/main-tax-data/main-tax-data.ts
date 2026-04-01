import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxDataService } from '../../services/tax-data.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { TaxData } from '../../models/tax-data.interface';
import { PersonTypeLabelPipe } from '../../pipes/person-type-label.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { EmptyComponent } from '../../../../shared/components/empty/empty';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableSkeletonComponent } from '../../../../shared/components/table-skeleton/table-skeleton';

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
  ],
  templateUrl: './main-tax-data.html',
  styleUrl: './main-tax-data.scss',
})
export class MainTaxData implements OnInit {
  private readonly _toastService = inject(ToastService);
  private readonly _taxDataService = inject(TaxDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly displayedColumns: string[] = ['taxData', 'personType', 'actions'];
  protected initialTaxData = signal<TaxData[]>([]);
  protected hasTaxData = computed(() => this.initialTaxData().length > 0);
  protected filteredTaxData = signal<TaxData[]>([]);
  protected isLoading = signal<boolean>(false);
  protected total: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.getTaxData();
  }

  private async getTaxData() {
    try {
      this.isLoading.set(true);
      const response = await this._taxDataService.getAllTaxDataAsync();
      this.initialTaxData.set(response.data);
      this.total = response.total;
      this.filteredTaxData.set(this.initialTaxData()); //temporal
      this.isLoading.set(false);
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
      const res = await this._taxDataService.makeTaxDataDefaultAsync(id);
      this.setDefault(id);
      console.log(res);
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
}
