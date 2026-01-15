import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatSelectModule } from '@angular/material/select';
import { PersonType } from '../../../../shared/models/person-type.model';
import { BaseMultipleFormComponent } from '../../../../shared/components/base-form/base-multiple-form';
import { GeneralDataForm } from '../../models/general-data-form.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon';
import { TaxRegime } from '../../../../shared/models/tax-regime.model';
import { RFC_REGEX } from '../../../../shared/regular-expresions/rfc.regex';
import { CURP_REGEX } from '../../../../shared/regular-expresions/curp.regex';
import { ALIAS_REGEX } from '../../../../shared/regular-expresions/alias.regex';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateContactDataComponent } from '../../../contact-data/shared-components/create-contact-data/create-contact-data';
@Component({
  selector: 'app-create-tax-data',
  imports: [MatCardModule, MatStepperModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, MatTooltipModule, MatDividerModule, MatDialogModule, OutlinedIconDirective],
  templateUrl: './create-tax-data.html',
  styleUrl: './create-tax-data.scss'
})
export class CreateTaxDataComponent extends BaseMultipleFormComponent<{ generalDataForm: GeneralDataForm, contactForm: { contactId: number }, addressForm: any }> implements OnInit {
  private _catalogsService = inject(CatalogsService);
  private _formBuilder = inject(FormBuilder);
  private _loadingService = inject(LoadingService);
  private _toastService = inject(ToastService);
  readonly dialog = inject(MatDialog);
  //catalogs
  protected personTypeCatalog: PersonType[] = [];
  protected taxRegimeCatalog: TaxRegime[] = [];
  protected filteredTaxRegimeCatalog: TaxRegime[] = [];
  //forms arrays
  protected contacts = signal<any[]>([]);; //esta interfaz va a ir en la sección de contacto
  hasContacts = computed(() => this.contacts().length > 0);
  contactSelectDisabled = computed(() => !this.hasContacts());
  contactLabel = computed(() =>
    this.hasContacts()
      ? 'Seleccionar un contacto para continuar con el registro'
      : 'Crea un nuevo contacto para continuar con el registro.'
  );
  contactPlaceholder = computed(() =>
    this.hasContacts()
      ? 'Seleccionar un contacto'
      : 'No hay contactos registrados'
  );
  //forms
  override forms!: { generalDataForm: FormGroup<any>; contactForm: FormGroup<any>; addressForm: FormGroup<any>; };
  protected generalDataFormValid = signal(false);
  protected isNaturalPerson = signal(true);
  protected contactFormValid = signal(false);
  protected addressFormValid = signal(false);
  protected aliasTooltip = `Nombre opcional que te puede ayudar para identificar un conjunto de datos fiscales.\n Este campo admite:\n\n-Máximo 40 caracteres\n-Acentos\n-Digitos\n-Guión medio\n-Guión bajo\n-Punto.`;
  constructor() {
    super();
  }

  async ngOnInit() {

    try {
      this._loadingService.show();
      this.personTypeCatalog = await this._catalogsService.getPersonTypeCatalogAsync();
      this.taxRegimeCatalog = await this._catalogsService.getTaxRegimeCatalogAsync();
      this.initForms();
      this.control('generalDataForm', 'personType')?.setValue(this.personTypeCatalog.find(pt => pt.value === 'NATURAL')?.value);
      this.updateTaxRegimeCatalog();
      this.detectFormsChanges();
      this._loadingService.hide();
    } catch (error: any) {
      this._toastService.showError(error.message)
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
        personType: ['', [Validators.required]]
      }),
      contactForm: this._formBuilder.group({
        contactId: [null, [Validators.required]]
      }),
      addressForm: this._formBuilder.group({
        prueba: ['']
      })
    }
  }

  private detectFormsChanges() {

    this.forms.generalDataForm.statusChanges.subscribe(() => {
      this.generalDataFormValid.set(this.forms.generalDataForm.valid);
    });
    this.forms.contactForm.statusChanges.subscribe(() => {
      this.contactFormValid.set(this.forms.contactForm.valid);
    });
    this.forms.addressForm.statusChanges.subscribe(() => {
      this.addressFormValid.set(this.forms.addressForm.valid);
    });
    //controls changes
    this.control('generalDataForm', 'personType')?.statusChanges.subscribe(() => {
      this.isNaturalPerson.set(this.value('generalDataForm', 'personType') === 'NATURAL');
      this.updateTaxRegimeCatalog();
      this.control('generalDataForm', 'taxRegime')?.setValue('');
    })
  }

  private updateTaxRegimeCatalog(): void {
    this.filteredTaxRegimeCatalog = this.taxRegimeCatalog.filter(tr => { return this.isNaturalPerson() ? tr.naturalPerson : tr.legalPerson });
  }

  //contact form methods
  protected addContact() {
    const dialogRef = this.dialog.open(CreateContactDataComponent);
    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        console.log("si se creo")
              console.log("Cree un nuevo contacto: ", res);
      } else {
        console.log("se cerró")
      }
    })
  }
}