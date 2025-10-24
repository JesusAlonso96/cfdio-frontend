import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterData } from '../../models/register-data.model';
import { RegisterResponse } from '../../models/register-response.model';
import { LoginForm } from '../../models/login-form.interface';
import { LoginResponse } from '../../models/login-response.model';
import { DefaultResponse } from '../../../shared/models/default-response.model';
import { BYPASS_REFRESH } from '../../../core/tokens/http-context.tokens';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly usersApi = `${environment.apiUrl}/users`;
  private readonly authApi = `${environment.apiUrl}/auth`;
  public refreshInProgress = false;
  public refreshInProgress$ = new BehaviorSubject<void>(undefined);

  constructor() { }

  public registerUser(registerData: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.usersApi}/register`, registerData);
  }

  public login(loginData: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/login`, loginData, { withCredentials: true });
  }

  public validateSession(bypass: boolean): Observable<DefaultResponse> {
    console.log(new HttpContext().set(BYPASS_REFRESH, bypass))
    return this.http.get<DefaultResponse>(`${this.authApi}/me`, { withCredentials: true, context: new HttpContext().set(BYPASS_REFRESH, bypass) })
  }

  public logout(): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(`${this.authApi}/logout`, { withCredentials: true })
  }

  public refreshToken(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.authApi}/refresh`, { withCredentials: true });
  }


  public setRefreshInProgress(state: boolean) {
    this.refreshInProgress = state;
    if (!state) this.refreshInProgress$.next();
  }


}
