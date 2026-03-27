import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatSelectModule } from '@angular/material/select';
import { PersonType } from '../../../../shared/models/person-type.model';
import { BaseMultipleFormComponent } from '../../../../shared/components/base-form/base-multiple-form';
import { GeneralDataForm } from '../../models/general-data-form.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon.directive';
import { TaxRegime } from '../../../../shared/models/tax-regime.model';
import { RFC_REGEX } from '../../../../shared/regular-expresions/rfc.regex';
import { CURP_REGEX } from '../../../../shared/regular-expresions/curp.regex';
import { ALIAS_REGEX } from '../../../../shared/regular-expresions/alias.regex';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateContactDataComponent } from '../../../contact-data/shared-components/create-contact-data/create-contact-data';
import { ContactData } from '../../../contact-data/models/contact-data.interface';
import { ContactDataService } from '../../../contact-data/services/contact-data.service';
import { CreateAddressComponent } from '../../../address-data/shared-components/create-address/create-address';
import { InternalCatalogsService } from '../../../../shared/services/catalogs/internal-catalogs.service';
import { SatCatalogsService } from '../../../../shared/services/catalogs/sat-catalogs.service';
import { AddressData } from '../../../address-data/models/address-data.interface';
import { AddressDataService } from '../../../address-data/services/address-data.service';
import { debounceTime, filter, merge, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxDataStep } from '../../enums/tax-data-step.enum';
type DraftStatus = 'preloaded' | 'pristine' | 'saving' | 'saved';

@Component({
  selector: 'app-create-tax-data',
  imports: [
    MatCardModule,
    MatStepperModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    OutlinedIconDirective,
    DatePipe,
  ],
  templateUrl: './create-tax-data.html',
  styleUrl: './create-tax-data.scss',
})
export class CreateTaxDataComponent
  extends BaseMultipleFormComponent<{
    generalDataForm: GeneralDataForm;
    contactForm: { contactId: number };
    addressForm: { addressId: number };
  }>
  implements OnInit
{
  private readonly _internalCatalogsService = inject(InternalCatalogsService);
  private readonly _satCatalogsService = inject(SatCatalogsService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _loadingService = inject(LoadingService);
  private readonly _toastService = inject(ToastService);
  readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  //catalogs
  protected personTypeCatalog: PersonType[] = [];
  protected taxRegimeCatalog: TaxRegime[] = [];
  protected filteredTaxRegimeCatalog: TaxRegime[] = [];
  //forms arrays
  //contact vars
  private readonly _contactDataService = inject(ContactDataService);
  protected contacts = signal<ContactData[]>([]); //esta interfaz va a ir en la sección de contacto
  hasContacts = computed(() => this.contacts().length > 0);
  contactSelectDisabled = computed(() => !this.hasContacts());
  contactLabel = computed(() =>
    this.hasContacts()
      ? 'Selecciona un contacto para continuar con el registro'
      : 'Crea un nuevo contacto para continuar con el registro.',
  );
  contactPlaceholder = computed(() =>
    this.hasContacts() ? 'Seleccionar un contacto' : 'No hay contactos registrados',
  );
  //address vars
  private readonly _addressDataService = inject(AddressDataService);
  protected addresses = signal<AddressData[]>([]); //esta interfaz va a ir en la sección de contacto
  hasAddresses = computed(() => this.addresses().length > 0);
  addressLabel = computed(() =>
    this.hasAddresses()
      ? 'Selecciona una dirección para continuar con el registro'
      : 'Crea una nueva dirección para continuar con el registro',
  );
  addressPlaceholder = computed(() =>
    this.hasAddresses() ? 'Seleccionar una dirección' : 'No hay direcciones registradas',
  );

  //forms
  override forms!: {
    generalDataForm: FormGroup<any>;
    contactForm: FormGroup<any>;
    addressForm: FormGroup<any>;
  };
  protected generalDataFormValid = signal(false);
  protected isNaturalPerson = signal(true);
  protected contactFormValid = signal(false);
  protected addressFormValid = signal(false);
  protected aliasTooltip = `Nombre opcional que te puede ayudar para identificar un conjunto de datos fiscales.\n Este campo admite:\n\n-Máximo 40 caracteres\n-Acentos\n-Digitos\n-Guión medio\n-Guión bajo\n-Punto.`;

  protected draftStatus = signal<DraftStatus>('pristine');
  protected lastSaved = signal<Date | null>(null);
  //stepper controls
  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild(MatStepper)
  set matStepper(stepper: MatStepper) {
    if (stepper) {
      this.stepper = stepper;
      Promise.resolve().then(() => {
        this.moveToStepFromQuery();
      });
    }
  }
  currentStep = signal(0);
  currentStepValid = computed(() => {
    const step = this.currentStep();
    switch (step) {
      case TaxDataStep.GENERAL:
        return this.generalDataFormValid();
      case TaxDataStep.CONTACT:
        return this.contactFormValid();
      case TaxDataStep.ADDRESS:
        return this.addressFormValid();
      default:
        return false;
    }
  });
  private isProgrammaticReset: boolean = false;
  protected isEditMode = signal(false);
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  moveToStepFromQuery() {
    const step: number = Number(this.route.snapshot.queryParamMap.get('step'));
    if (step) {
      const index = step;
      this.stepper.steps.forEach((s, i) => {
        if (i < index) {
          s.completed = true;
        }
      });
      this.stepper.selectedIndex = index;
      this.isEditMode.set(true);
    }
  }

  async loadData(): Promise<void> {
    try {
      this._loadingService.show();
      this.personTypeCatalog = await this._internalCatalogsService.getPersonTypeCatalogAsync();
      this.taxRegimeCatalog = await this._satCatalogsService.getTaxRegimeCatalogAsync();
      /* CONTACT DATA */
      const contactData: ContactData[] = await this._contactDataService.getAllContactDataAsync();
      this.contacts.update((c) => [...c, ...contactData]);
      /* ADDRESSES DATA */
      const addresses: AddressData[] = await this._addressDataService.getAllAddressesAsync();
      this.addresses.update((a) => [...a, ...addresses]);

      this.initForms();
      this.control('generalDataForm', 'personType')?.setValue(
        this.personTypeCatalog.find((pt) => pt.value === 'NATURAL')?.value,
      );
      this.updateTaxRegimeCatalog();
      const draft = sessionStorage.getItem('draft.datosFiscales');

      if (draft) {
        this.loadDraft(draft);
      }
      this.detectFormsChanges();
      this._loadingService.hide();
    } catch (error: any) {
      this._toastService.showError(error.message);
      this._loadingService.hide();
    }
  }

  private initForms() {
    this.forms = {
      generalDataForm: this._formBuilder.group({
        alias: ['', [Validators.pattern(ALIAS_REGEX)]],
        rfc: ['', [Validators.required, Validators.pattern(RFC_REGEX)]],
        legalName: ['', [Validators.required]], //si es fisico nombre del contribuyente, si es moral nombre de la razón social
        taxRegime: ['', [Validators.required]],
        curp: ['', [Validators.pattern(CURP_REGEX)]],
        personType: ['', [Validators.required]],
      }),
      contactForm: this._formBuilder.group({
        contactId: [null, [Validators.required]],
      }),
      addressForm: this._formBuilder.group({
        addressId: [null, [Validators.required]],
      }),
    };
  }

  private detectFormsChanges() {
    this.generalDataFormValid.set(this.forms.generalDataForm.valid);
    this.contactFormValid.set(this.forms.contactForm.valid);
    this.addressFormValid.set(this.forms.addressForm.valid);

    this.forms.generalDataForm.statusChanges.subscribe(() => {
      this.generalDataFormValid.set(this.forms.generalDataForm.valid);
    });
    this.forms.contactForm.statusChanges.subscribe(() => {
      this.contactFormValid.set(this.forms.contactForm.valid);
    });
    this.forms.addressForm.statusChanges.subscribe(() => {
      this.addressFormValid.set(this.forms.addressForm.valid);
    });

    merge(
      this.forms.generalDataForm.valueChanges,
      this.forms.contactForm.valueChanges,
      this.forms.addressForm.valueChanges,
    )
      .pipe(
        filter(() => this.anyFormDirty()),
        filter(() => !this.isProgrammaticReset),
        tap(() => this.draftStatus.set('saving')),
        debounceTime(400),
      )
      .subscribe(() => {
        this.saveDraft();
        this.draftStatus.set('saved');
        this.lastSaved.set(new Date());
      });

    //controls changes
    this.control('generalDataForm', 'personType')?.statusChanges.subscribe(() => {
      this.isNaturalPerson.set(this.value('generalDataForm', 'personType') === 'NATURAL');
      this.updateTaxRegimeCatalog();
      this.control('generalDataForm', 'taxRegime')?.setValue('');
    });
  }

  private anyFormDirty(): boolean {
    return Object.values(this.forms).some((form) => form.dirty);
  }

  private saveDraft() {
    const selectedAddress = this.addresses().find(
      (a) => a.id === this.forms.addressForm.value.addressId,
    );
    const draft: any = {
      general: {
        ...this.forms.generalDataForm.value,
        taxRegimeText: this.taxRegimeCatalog.find(
          (t) => t.key === this.forms.generalDataForm.value.taxRegime,
        ),
      },
      contact: this.forms.contactForm.value.contactId,
      address: this.forms.addressForm.value.addressId,
      addressFirstLine: selectedAddress
        ? `${selectedAddress.street} ${selectedAddress.extNumber}${selectedAddress.intNumber ?? ' -' + selectedAddress.intNumber}`
        : null,
      addressSecondLine: selectedAddress ? `${selectedAddress.colony}` : null,
      addressThirdLine: selectedAddress
        ? `${selectedAddress.municipality}, ${selectedAddress.state}`
        : null,
      addressFourLine: selectedAddress ? `C.P: ${selectedAddress.zipCode}` : null,
      contactPhone: this.contacts().find((c) => c.id === this.forms.contactForm.value.contactId)
        ?.phone,
      contactEmail: this.contacts().find((c) => c.id === this.forms.contactForm.value.contactId)
        ?.email,
    };

    sessionStorage.setItem('draft.datosFiscales', JSON.stringify(draft));
  }

  private updateTaxRegimeCatalog(): void {
    this.filteredTaxRegimeCatalog = this.taxRegimeCatalog.filter((tr) => {
      return this.isNaturalPerson() ? tr.naturalPerson : tr.legalPerson;
    });
  }

  //contact form methods
  protected addContact() {
    const dialogRef = this.dialog.open(CreateContactDataComponent);
    dialogRef.afterClosed().subscribe((newContact: ContactData) => {
      if (newContact) {
        this.contacts.update((contacts) => [newContact, ...contacts]);
        this._toastService.showSuccess('¡Contacto creado exitosamente!');
      }
    });
  }

  //address form methods
  protected addAddress() {
    const dialogRef = this.dialog.open(CreateAddressComponent);
    dialogRef.afterClosed().subscribe((newAddress: any) => {
      if (newAddress) {
        this.addresses.update((addresses) => [newAddress, ...addresses]);
        this._toastService.showSuccess('¡Dirección creada exitosamente!');
      }
    });
  }

  /* DRAFT METHODS */
  loadDraft(draft: any) {
    const parsed = JSON.parse(draft);
    this.draftStatus.set('preloaded');
    this.forms.generalDataForm.patchValue(parsed.general || {});
    this.forms.contactForm.patchValue({ contactId: parsed.contact ?? null });
    this.forms.addressForm.patchValue({ addressId: parsed.address ?? null });
    this.isNaturalPerson.set(this.value('generalDataForm', 'personType') === 'NATURAL');
    this.updateTaxRegimeCatalog();

    this.forms.generalDataForm.markAllAsTouched();
    this.forms.contactForm.markAllAsTouched();
    this.forms.addressForm.markAllAsTouched();
    this.forms.generalDataForm.markAllAsDirty();
    this.forms.contactForm.markAllAsDirty();
    this.forms.addressForm.markAllAsDirty();
  }

  discardDraft(stepper: MatStepper) {
    this.isProgrammaticReset = true;
    stepper.reset();

    sessionStorage.removeItem('draft.datosFiscales');
    this.forms.generalDataForm.reset(
      { personType: this.personTypeCatalog.find((pt) => pt.value === 'NATURAL')?.value },
      { emitEvent: false },
    );
    this.isNaturalPerson.set(true);
    this.updateTaxRegimeCatalog();
    this.draftStatus.set('pristine');
    this.isProgrammaticReset = false;
  }

  nextStep() {
    if (this.isEditMode()) {
      this.router.navigate(['/dashboard/datos-fiscales/nuevo/resumen']);
      return;
    }

    if (this.currentStep() === 2) {
      this.router.navigate(['/dashboard/datos-fiscales/nuevo/resumen']);
      return;
    }
    this.stepper.next();
    this.currentStep.set(this.stepper.selectedIndex);
  }
}
