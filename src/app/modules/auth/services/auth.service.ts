import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterData } from '../../models/register-data.model';
import { RegisterResponse } from '../../models/register-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersApi = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  constructor() { }

  public registerUser(registerData: RegisterData): Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.usersApi}/register`, registerData);
  }
}
