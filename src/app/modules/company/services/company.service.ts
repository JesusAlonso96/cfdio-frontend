import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CompanyData } from '../../../shared/models/company-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly companiesApi = `${environment.apiUrl}/companies`;

  constructor() {}

  public createCompany(companyData: CompanyData): Observable<any> {
    return this.http.post<any>(`${this.companiesApi}`, companyData);
  }
}
