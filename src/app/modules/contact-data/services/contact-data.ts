import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateContactData } from '../models/create-contact-data.interface';
import { ContactData } from '../models/contact-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {
  private http = inject(HttpClient);
  private readonly contactDataApi = `${environment.apiUrl}/contact`;

  constructor() { }

  /* HTTP POST */
  private createContactData(contactData: CreateContactData): Observable<ContactData> {
    return this.http.post<ContactData>(`${this.contactDataApi}`, contactData);
  }

  public createContactDataAsync(contactData: CreateContactData): Promise<ContactData> {
    return new Promise<ContactData>((resolve, reject) => {
      this.createContactData(contactData).subscribe({
        next: (response: ContactData) => { resolve(response) },
        error: (err: HttpErrorResponse) => reject(err.error)
      });
    })
  }

  /* HTTP GET */
  private getAllContactData(): Observable<ContactData[]> {
    return this.http.get<ContactData[]>(`${this.contactDataApi}`);
  }

  public getAllContactDataAsync(): Promise<ContactData[]> {
    return new Promise<ContactData[]>((resolve, reject) => {
      this.getAllContactData().subscribe({
        next: (response: ContactData[]) => { resolve(response) },
        error: (err: HttpErrorResponse) => reject(err.error)
      });
    })
  }
}
