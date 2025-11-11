import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PersonType } from '../models/person-type.model';
import { TaxRegime } from '../models/tax-regime.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {
  private http = inject(HttpClient);
  private readonly catalogsApi = `${environment.apiUrl}/catalogs`;

  constructor() { }

  /* PERSON TYPE CATALOG */
  private getPersonTypeCatalog(): Observable<PersonType[]> {
    return this.http.get<PersonType[]>(`${this.catalogsApi}/person-type`);
  }

  public getPersonTypeCatalogAsync(): Promise<PersonType[]> {
    return new Promise<PersonType[]>((resolve, reject) => {
      this.getPersonTypeCatalog().subscribe({
        next: (response: PersonType[]) => { resolve(response) },
        error: (err: HttpErrorResponse) => reject(err.error)
      })
    })
  }

  /* TAX REGIME CATALOG */
  private getTaxRegimeCatalog(): Observable<TaxRegime[]> {
    return this.http.get<TaxRegime[]>(`${this.catalogsApi}/tax-regime`);
  }

  public getTaxRegimeCatalogAsync(): Promise<TaxRegime[]> {
    return new Promise<TaxRegime[]>((resolve, reject) => {
      this.getTaxRegimeCatalog().subscribe({
        next: (response: TaxRegime[]) => { resolve(response) },
        error: (err: HttpErrorResponse) => reject(err.error)
      })
    })
  }
}
