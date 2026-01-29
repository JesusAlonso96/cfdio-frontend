import { Component, inject, OnInit, signal } from '@angular/core';
import { CreateCompanyModal } from '../../../../shared/components/create-company-modal/create-company-modal';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { BaseFormComponent } from '../../../../shared/components/base-form/base-form';
import { CreateAddress } from '../../models/create-address.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormUtilsService } from '../../../../shared/services/form-utils.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';
import { ExternalCatalogsService } from '../../../../shared/services/catalogs/external-catalogs.service';

@Component({
  selector: 'app-create-address',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, OutlinedIconDirective, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './create-address.html',
  styleUrl: './create-address.scss'
})
export class CreateAddressComponent extends BaseFormComponent<CreateAddress> implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateCompanyModal>);
  private _externalCatalogsService = inject(ExternalCatalogsService);
  private _formUtils = inject(FormUtilsService);
  private _loadingService = inject(LoadingService);
  private _toastService = inject(ToastService);
  override form!: FormGroup;
  protected formValid = signal(false);
  constructor(private fb: FormBuilder) {
    super();
  }

  async ngOnInit() {
    this.form = this.fb.group({
      street: ['', [Validators.required]],
      extNumber: ['', [Validators.required]],
      intNumber: [''],
      colony: ['', [Validators.required]],
      municipality: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]]
    })
    //form changes
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });

    const res =  await this._externalCatalogsService.getZipCodeDataAsync(20196);
    console.log(res)
  }

  onSubmit() {

  }
}
