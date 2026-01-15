import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseFormComponent } from '../../../../shared/components/base-form/base-form';
import { RegisterForm } from '../../models/register-form.interface';
import { PhoneMaskDirective } from '../../../../shared/directives/phone-mask';
import { MatIconModule } from '@angular/material/icon';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';
import { PASSWORD_REGEX } from '../../../../shared/regular-expresions/password';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterData } from '../../models/register-data.model';
import { FormUtilsService } from '../../../../shared/services/form-utils.service';
import { AuthService } from '../../services/auth.service';
import { RegisterResponse } from '../../models/register-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingIconsComponent } from '../../../../shared/components/loading-icons/loading-icons';
import { LoadingColors } from '../../../../shared/enums/loading-colors.enum';
import { LoadingIconsSize } from '../../../../shared/enums/loading-icons-size.enum';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, PhoneMaskDirective, MatIconModule, MatTooltipModule, OutlinedIconDirective, LoadingIconsComponent],
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss', '../../pages/auth/auth.scss']
})
export class RegisterComponent extends BaseFormComponent<RegisterForm> implements OnInit {
  @Output() clicked = new EventEmitter<void>();
  private _formUtils = inject(FormUtilsService);
  private _authService = inject(AuthService);
  private _toastService = inject(ToastService);
  public form!: FormGroup;
  protected formValid = signal(false);
  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);
  protected tooltip = `-Mínimo 8 caracteres.\n-Usa al menos una minúscula.\n-Usa al menos una mayúscula.\n-Usa al menos un número.\n-Usa al menos un símbolo.`;
  protected loading = signal(false);
  protected LoadingIconsSize = LoadingIconsSize;
  protected LoadingColors = LoadingColors;

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
    const registerData: RegisterData = this._formUtils.mapFormToModel<RegisterData>(this.form, ['confirmPassword']);
    registerData.cellphone = this._formUtils.replacePhoneMask(registerData.cellphone);
    this.loading.set(true);
    this._authService.registerUser(registerData).subscribe({
      next: (res: RegisterResponse) => {
        this.loading.set(false);
        this._toastService.showSuccess("Registro exitoso, bienvenido!", 6000);
        this.changeForm();
      },
      error: (err: HttpErrorResponse) => this.loading.set(false)
    });
  }

}
