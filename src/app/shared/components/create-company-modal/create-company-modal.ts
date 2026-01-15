import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OutlinedIconDirective } from "../../directives/outlined-icon";
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseFormComponent } from '../base-form/base-form';
import { COMPANY_REGEX } from '../../regular-expresions/company';
import { FormUtilsService } from '../../services/form-utils.service';
import { CompanyData } from '../../models/company-data.model';
import { CompanyService } from '../../../modules/company/services/company.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-company-modal',
  imports: [MatDialogModule, MatButtonModule, OutlinedIconDirective, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, ReactiveFormsModule],
  templateUrl: './create-company-modal.html',
  styleUrl: './create-company-modal.scss'
})
export class CreateCompanyModal extends BaseFormComponent<CompanyData> implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateCompanyModal>);
  private _formUtils = inject(FormUtilsService);
  private _companyService = inject(CompanyService);
  private _toastService = inject(ToastService);
  private _loadingService = inject(LoadingService);
  public form!: FormGroup;
  protected formValid = signal(true);

  protected haveCompany = signal(false);


  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      haveCompany: [false],
      name: [{ value: '', disabled: true }, [Validators.pattern(COMPANY_REGEX)]]
    });
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });

    this.control('haveCompany')?.valueChanges.subscribe((haveCompany) => {
      this.haveCompany.set(haveCompany);
      this.changeNameInputProperties(haveCompany)
      this.markAllTouched();
    });
  }

  changeNameInputProperties(enable: boolean) {
    if (enable) {
      this.setEnable('name');
      this.setRequired('name');
      this.setPatternValidator('name', COMPANY_REGEX);
      return;
    }
    this.setDisable('name');
    this.removeRequired('name');
    this.removePatternValidator('name', COMPANY_REGEX);
  }

  onSubmit() {
    const companyData: CompanyData = this._formUtils.mapFormToModel<CompanyData>(this.form);
    this._loadingService.show();

    this._companyService.createCompany(companyData).subscribe({
      next: (res: any) => {
        this._loadingService.hide();
        this._toastService.showSuccess("Empresa creada con éxito", 6000);
        localStorage.removeItem('company');
        this.dialogRef.close();
      },
      error: (err: HttpErrorResponse) => this._loadingService.hide()
    });
  }

}
