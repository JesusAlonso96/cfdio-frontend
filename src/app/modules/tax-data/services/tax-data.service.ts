import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateTaxData } from '../models/create-tax-data.interface';
import { TaxData } from '../models/tax-data.interface';
import { TaxDataResponse } from '../models/tax-data-response.interface';

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

  /* HTTP PUT */
  private makeTaxDataDefault(taxDataId: number): Observable<void> {
    return this.http.put<void>(`${this.taxDataApi}/default`, { taxDataId });
  }

  public makeTaxDataDefaultAsync(taxDataId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.makeTaxDataDefault(taxDataId).subscribe({
        next: (response: void) => {
          resolve(response);
        },
        error: (err: HttpErrorResponse) => reject(err.error),
      });
    });
  }

  /* HTTP GET */
  private getAllTaxData(): Observable<TaxDataResponse> {
    return this.http.get<TaxDataResponse>(`${this.taxDataApi}`);
  }

  public getAllTaxDataAsync(): Promise<TaxDataResponse> {
    return new Promise<TaxDataResponse>((resolve, reject) => {
      this.getAllTaxData().subscribe({
        next: (response: TaxDataResponse) => {
          resolve(response);
        },
        error: (err: HttpErrorResponse) => reject(err.error),
      });
    });
  }
}
