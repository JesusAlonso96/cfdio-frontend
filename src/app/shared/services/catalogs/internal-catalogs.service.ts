import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonType } from '../../models/person-type.model';

@Injectable({
  providedIn: 'root',
})
export class InternalCatalogsService {
  private readonly http = inject(HttpClient);
  private readonly internalCatalogsApi = `${environment.apiUrl}/catalogs/internal`;

  constructor() {}

  /* PERSON TYPE CATALOG */
  private getPersonTypeCatalog(): Observable<PersonType[]> {
    return this.http.get<PersonType[]>(`${this.internalCatalogsApi}/person-type`);
  }

  public getPersonTypeCatalogAsync(): Promise<PersonType[]> {
    return new Promise<PersonType[]>((resolve, reject) => {
      this.getPersonTypeCatalog().subscribe({
        next: (response: PersonType[]) => {
          resolve(response);
        },
        error: (err: HttpErrorResponse) => reject(err.error),
      });
    });
  }
}
