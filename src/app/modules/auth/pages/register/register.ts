import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseFormComponent } from '../../../../shared/components/base-form/base-form';
import { RegisterFormModel } from '../../../models/register-form.interface';
import { PhoneMaskDirective } from '../../../../shared/directives/phone-mask';
import { MatIconModule } from '@angular/material/icon';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';
import { PASSWORD_REGEX } from '../../../../shared/regular-expresions/password';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterData } from '../../../models/register-data.model';
import { FormUtilsService } from '../../../../shared/services/form-utils';
import { AuthService } from '../../services/auth.service';
import { RegisterResponse } from '../../../models/register-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../../../../shared/models/error-response.model';
import { AlertsService } from '../../../../shared/services/toastr.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, PhoneMaskDirective, MatIconModule, MatTooltipModule, OutlinedIconDirective],
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss', '../auth/auth.scss']
})
export class RegisterComponent extends BaseFormComponent<RegisterFormModel> implements OnInit {
  @Output() clicked = new EventEmitter<void>();
  private formUtils = inject(FormUtilsService);
  private _authService = inject(AuthService);
  private _alertsService = inject(AlertsService);
  public form!: FormGroup;
  protected formValid = signal(false);
  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);
  protected tooltip = `-Mínimo 8 caracteres.\n-Usa al menos una minúscula.\n-Usa al menos una mayúscula.\n-Usa al menos un número.\n-Usa al menos un símbolo.`;
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]]

    });
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid)
    });
  }



  /* FORM METHODS */
  changeForm() {
    this.clicked.emit();
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  protected changePassword(): void {
    this.control('confirmPassword')?.setValue('');
  }

  protected changeConfirmPassword(): void {
    const password: string = String(this.value('password'));
    const confirmPassword: string = String(this.value('confirmPassword'));
    if (!PASSWORD_REGEX.test(confirmPassword)) return;
    if (password !== confirmPassword) this.control('confirmPassword')?.setErrors({ diferent: true });
    else this.control('confirmPassword')?.setErrors(null);
  }

  protected registerClient(): void {
    const registerData: RegisterData = this.formUtils.mapFormToModel<RegisterData>(this.form, ['confirmPassword']);
    registerData.cellphone = registerData.cellphone.replaceAll("-", "");
    console.log(registerData)
    this._authService.registerUser(registerData).subscribe({
      next: (res: RegisterResponse) => console.log('Registrado con éxito', res),
      error: (err: HttpErrorResponse) => {
        const error: ErrorResponse = err.error;
        console.error('Error al registrar: ', error.message)
      }
    });
  }

test(){
  this._alertsService.showSuccessToast("holaaa");
}

}
