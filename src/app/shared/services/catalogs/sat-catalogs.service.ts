import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaxRegime } from '../../models/tax-regime.model';

@Injectable({
  providedIn: 'root',
})
export class SatCatalogsService {
  private readonly http = inject(HttpClient);
  private readonly satCatalogsApi = `${environment.apiUrl}/catalogs/sat`;

  constructor() {}

  /* TAX REGIME CATALOG */
  private getTaxRegimeCatalog(): Observable<TaxRegime[]> {
    return this.http.get<TaxRegime[]>(`${this.satCatalogsApi}/tax-regime`);
  }

  public getTaxRegimeCatalogAsync(): Promise<TaxRegime[]> {
    return new Promise<TaxRegime[]>((resolve, reject) => {
      this.getTaxRegimeCatalog().subscribe({
        next: (response: TaxRegime[]) => {
          resolve(response);
        },
        error: (err: HttpErrorResponse) => reject(err.error),
      });
    });
  }
}
