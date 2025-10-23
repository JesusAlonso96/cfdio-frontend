import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginForm } from '../../../models/login-form.interface';
import { BaseFormComponent } from '../../../../shared/components/base-form/base-form';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingIconsSize } from '../../../../shared/enums/loading-icons-size.enum';
import { LoadingColors } from '../../../../shared/enums/loading-colors.enum';
import { FormUtilsService } from '../../../../shared/services/form-utils';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../../models/login-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../../../../shared/models/error-response.model';
import { LoadingIconsComponent } from '../../../../shared/components/loading-icons/loading-icons';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, LoadingIconsComponent],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['login.scss', '../auth/auth.scss']
})
export class LoginComponent extends BaseFormComponent<LoginForm> implements OnInit {
  @Output() clicked = new EventEmitter<void>();
  private _formUtils = inject(FormUtilsService);
  private _authService = inject(AuthService);
  private _toastService = inject(ToastService);
  public form!: FormGroup;
  protected formValid = signal(false);
  protected loading = signal(false);
  protected LoadingIconsSize = LoadingIconsSize;
  protected LoadingColors = LoadingColors;

  constructor(private fb: FormBuilder) {
    super();
  }

  changeForm() {
    this.clicked.emit();
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]

    });
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid)
    });
  }

  login() {
    const loginData: LoginForm = this._formUtils.mapFormToModel<LoginForm>(this.form);
    console.log(loginData)
    this._authService.login(loginData).subscribe({
      next: (res: LoginResponse) => {
        if (loginData.rememberMe) {
          localStorage.setItem('accessToken', res.token);
        } else {
          sessionStorage.setItem('accessToken', res.token);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const error: ErrorResponse = err.error;
        this._toastService.showError(error.message, 6000);
      }
    })
  }
}
