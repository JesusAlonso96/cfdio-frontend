import { Component, inject, OnInit, signal } from '@angular/core';
import { CreateCompanyModal } from '../../../../shared/components/create-company-modal/create-company-modal';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseFormComponent } from '../../../../shared/components/base-form/base-form';
import { CreateAddress } from '../../models/create-address.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormUtilsService } from '../../../../shared/services/form-utils.service';

@Component({
  selector: 'app-create-address',
  imports: [],
  templateUrl: './create-address.html',
  styleUrl: './create-address.scss'
})
export class CreateAddressComponent extends BaseFormComponent<CreateAddress> implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateCompanyModal>);
  private _formUtils = inject(FormUtilsService);
  private _loadingService = inject(LoadingService);
  private _toastService = inject(ToastService);
  override form!: FormGroup;
  protected formValid = signal(false);
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
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
  }
}
