import { Component, inject, OnInit } from '@angular/core';
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
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { TaxData } from '../../models/tax-data.interface';
import { PersonTypeLabelPipe } from '../../pipes/person-type-label.pipe';
import { MatMenuModule } from '@angular/material/menu';

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
  ],
  templateUrl: './main-tax-data.html',
  styleUrl: './main-tax-data.scss',
})
export class MainTaxData implements OnInit {
  private readonly _toastService = inject(ToastService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _taxDataService = inject(TaxDataService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  displayedColumns: string[] = ['taxData', 'personType', 'actions'];
  protected taxData: TaxData[] = [];
  constructor() {}

  ngOnInit(): void {
    this.getTaxData();
  }

  private async getTaxData() {
    try {
      this._loadingService.show();
      this.taxData = await this._taxDataService.getAllTaxDataAsync();
      console.log(this.taxData);
      this._loadingService.hide();
    } catch (error) {
      console.error('Error al obtener los datos fiscales: ', error);
      this._loadingService.hide();
      this._toastService.showError(
        'Ocurrió un error al obtener los datos fiscales, por favor intentalo de nuevo más tarde.',
      );
    }
  }

  protected openCreateTaxData(): void {
    this.router.navigate(['nuevo'], { relativeTo: this.route });
  }
}
