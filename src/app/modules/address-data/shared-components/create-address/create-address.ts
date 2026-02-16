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
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon.directive';
import { ExternalCatalogsService } from '../../../../shared/services/catalogs/external-catalogs.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { OnlyNumbersDirective } from '../../../../shared/directives/only-numbers.directive';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ZipCodesResponse } from '../../../../shared/models/zip-codes-response.model';
import { LoadingIconsComponent } from '../../../../shared/components/loading-icons/loading-icons';
import { LoadingIconsSize } from '../../../../shared/enums/loading-icons-size.enum';
import { LoadingColors } from '../../../../shared/enums/loading-colors.enum';
import { ADDRESS_TEXT_REGEX, HOUSE_NUMBER_REGEX, ZIP_CODE_REGEX } from '../../../../shared/regular-expresions/address.regex';
import { AddressData } from '../../models/address-data.interface';
import { AddressDataService } from '../../services/address-data.service';

@Component({
  selector: 'app-create-address',
  imports: [MatIconModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, OutlinedIconDirective, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule, MatTooltipModule, ReactiveFormsModule, OnlyNumbersDirective, LoadingIconsComponent],
  templateUrl: './create-address.html',
  styleUrl: './create-address.scss'
})
export class CreateAddressComponent extends BaseFormComponent<CreateAddress> implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateCompanyModal>);
  private _externalCatalogsService = inject(ExternalCatalogsService);
  private _formUtils = inject(FormUtilsService);
  private _toastService = inject(ToastService);
  private _addressDataService = inject(AddressDataService);
  override form!: FormGroup;
  protected formValid = signal(false);
  protected colonies = signal<string[]>([]);
  protected loadingZipCodeData = signal<boolean>(false);
  protected loadingCreation = signal<boolean>(false);
  protected LoadingIconsSize = LoadingIconsSize;
  protected LoadingColors = LoadingColors;
  constructor(private fb: FormBuilder) {
    super();
  }

  async ngOnInit() {
    this.form = this.fb.group({
      zipCode: ['', [Validators.required, Validators.pattern(ZIP_CODE_REGEX)]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      municipality: [{ value: '', disabled: true }, [Validators.required]],
      colony: ['', [Validators.required]],

      street: ['', [Validators.required, Validators.pattern(ADDRESS_TEXT_REGEX)]],
      extNumber: ['', [Validators.required, Validators.pattern(HOUSE_NUMBER_REGEX)]],
      intNumber: ['', [Validators.pattern(HOUSE_NUMBER_REGEX)]],

    })
    //form changes
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
    //zip code changes (search data)
    this.getZipCodeData();
  }

  private getZipCodeData(): void {
    this.form.get('zipCode')!.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(async (cp) => {
        if (!cp || cp.length < 5) {
          this.form.patchValue({
            colony: null,
            municipality: null,
            state: null
          }, { emitEvent: false });
          return;
        }

        if (RegExp(ZIP_CODE_REGEX).test(cp)) {
          this.loadingZipCodeData.set(true);
          const response: ZipCodesResponse = await this._externalCatalogsService.getZipCodeDataAsync(cp);
          this.setZipCodeData(response.state, response.municipality, response.neighborhoods.length === 1 ? response.neighborhoods[0] : '');
          this.colonies.set(response.neighborhoods);
          this.loadingZipCodeData.set(false);
        }

      });
  }

  setZipCodeData(state: string, municipality: string, colony: string) {
    this.form.get('state')?.setValue(state);
    this.form.get('municipality')?.setValue(municipality);
    this.form.get('colony')?.setValue(colony);

  }

  async onSubmit() {
    try {
      this.loadingCreation.set(true);
      const addressData: CreateAddress = this._formUtils.mapFormToModel<CreateAddress>(this.form);
      const addressDataCreated: AddressData = await this._addressDataService.createAddressDataAsync(addressData);
      this.loadingCreation.set(false);
      this.dialogRef.close(addressDataCreated);
    } catch (error) {
      this.loadingCreation.set(false);
      this._toastService.showError('Ocurrió un error al crear la dirección, por favor intentalo de nuevo más tarde')
    }

  }

}
