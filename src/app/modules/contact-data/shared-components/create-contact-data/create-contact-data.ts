import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { BaseFormComponent } from '../../../../shared/components/base-form/base-form';
import { CreateContactData } from '../../models/create-contact-data.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCompanyModal } from '../../../../shared/components/create-company-modal/create-company-modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';
import { PhoneMaskDirective } from '../../../../shared/directives/phone-mask';
import { FormUtilsService } from '../../../../shared/services/form-utils.service';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-create-contact-data',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, OutlinedIconDirective, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, PhoneMaskDirective],
  templateUrl: './create-contact-data.html',
  styleUrl: './create-contact-data.scss'
})
export class CreateContactDataComponent extends BaseFormComponent<CreateContactData> implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateCompanyModal>);
  private _formUtils = inject(FormUtilsService);
  private _loadingService = inject(LoadingService);
  override form!: FormGroup;
  protected formValid = signal(false);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(12)]]
    })
    //form changes
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
  }

  onSubmit() {
    const contactData: CreateContactData = this._formUtils.mapFormToModel<CreateContactData>(this.form);
    this._loadingService.show();
    contactData.phone = this._formUtils.replacePhoneMask(contactData.phone);
    console.log(contactData);
    this._loadingService.hide();

  }
}
