import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterData } from '../../models/register-data.model';
import { RegisterResponse } from '../../models/register-response.model';
import { LoginForm } from '../../models/login-form.interface';
import { LoginResponse } from '../../models/login-response.model';
import { DefaultResponse } from '../../../shared/models/default-response.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersApi = `${environment.apiUrl}/users`;
  private readonly authApi = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  constructor() { }

  public registerUser(registerData: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.usersApi}/register`, registerData);
  }

  public login(loginData: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/login`, loginData, { withCredentials: true });
  }

  public validateSession(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.authApi}/me`, { withCredentials: true })
  }

  public logout(): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(`${this.authApi}/logout`, { withCredentials: true })
  }


}
