import { HttpClient } from '@angular/common/http';
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

  public createContactData(contactData: CreateContactData): Observable<ContactData> {
    return this.http.post<ContactData>(`${this.contactDataApi}`, contactData);
  }

}
