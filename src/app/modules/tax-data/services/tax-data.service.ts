import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateTaxData } from '../models/create-tax-data.interface';
import { TaxData } from '../models/tax-data.interface';

@Injectable({
  providedIn: 'root',
})
export class TaxDataService {
  private readonly http = inject(HttpClient);
  private readonly taxDataApi = `${environment.apiUrl}/tax-data`;

  constructor() {}

  /* HTTP POST */
  private createTaxData(taxData: CreateTaxData): Observable<TaxData> {
    return this.http.post<TaxData>(`${this.taxDataApi}`, taxData);
  }

  public createTaxDataAsync(taxData: CreateTaxData): Promise<TaxData> {
    return new Promise<TaxData>((resolve, reject) => {
      this.createTaxData(taxData).subscribe({
        next: (response: TaxData) => {
          resolve(response);
        },
        error: (err: HttpErrorResponse) => reject(err.error),
      });
    });
  }
}
