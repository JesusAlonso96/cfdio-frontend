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
import { ContactDataService } from '../../services/contact-data';
import { ContactData } from '../../models/contact-data.interface';
import { ToastService } from '../../../../shared/services/toast.service';

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
  private _contactDataService = inject(ContactDataService);
  private _toastService = inject(ToastService);
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
    this.createContactData(contactData);
    this._loadingService.hide();
  }

  private async createContactData(contactData: CreateContactData) {
    try {
      this._loadingService.show();
      const contactDataCreated: ContactData = await this._contactDataService.createContactDataAsync(contactData);
      this._loadingService.hide();
      this.dialogRef.close(contactDataCreated);
    } catch (error) {
      this._loadingService.hide();
      this._toastService.showError('Ocurrió un error al crear los datos de contacto, por favor intentalo de nuevo más tarde')
    }
  }
}
