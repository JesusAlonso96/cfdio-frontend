import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ZipCodesResponse } from "../../models/zip-codes-response.model";

@Injectable({
  providedIn: 'root'
})
export class ExternalCatalogsService {
  private http = inject(HttpClient);
  private readonly satCatalogsApi = `${environment.apiUrl}/catalogs/external`;
  // zip-codes
  constructor() { }

  /* ZIP CODE CATALOG */
  private getZipCodeData(zipCode: number): Observable<ZipCodesResponse> {
    return this.http.get<ZipCodesResponse>(`${this.satCatalogsApi}/zip-codes/${zipCode}`);
  }

  public getZipCodeDataAsync(zipCode: number): Promise<ZipCodesResponse> {
    return new Promise<ZipCodesResponse>((resolve, reject) => {
      this.getZipCodeData(zipCode).subscribe({
        next: (response: ZipCodesResponse) => { resolve(response) },
        error: (err: HttpErrorResponse) => reject(err.error)
      })
    })
  }
}