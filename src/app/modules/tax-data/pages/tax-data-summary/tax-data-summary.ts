import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { RouterLink, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon.directive';
import { TaxDataStep } from '../../enums/tax-data-step.enum';
import { PersonTypeLabelPipe } from '../../pipes/person-type-label.pipe';
import { PersonType } from '../../enums/person-type.enum';

@Component({
  selector: 'app-tax-data-summary',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    OutlinedIconDirective,
    PersonTypeLabelPipe,
  ],
  templateUrl: './tax-data-summary.html',
  styleUrl: './tax-data-summary.scss',
})
export class TaxDataSummaryComponent implements OnInit {
  TaxDataStep = TaxDataStep;
  private readonly _confirmService = inject(ConfirmService);
  protected emptyForm = signal(false);
  private readonly requiredFields = [
    'general.rfc',
    'general.legalName',
    'general.taxRegime',
    'general.personType',
    'contact',
    'address',
  ];
  protected taxData: any = {};
  protected isNaturalPerson = signal(true);

  ngOnInit(): void {
    const draft = sessionStorage.getItem('draft.datosFiscales');
    this.taxData = draft ? JSON.parse(sessionStorage.getItem('draft.datosFiscales') || '') : null;
    if (!this.taxData) {
      this.emptyForm.set(true);
      return;
    }
    const isValidDraft = this.requiredFields.every((path) =>
      path.split('.').reduce((obj, key) => obj?.[key], this.taxData),
    );
    if (!isValidDraft) {
      this.emptyForm.set(true);
      return;
    }
    this.normalizeEmptyStrings(this.taxData);
    this.isNaturalPerson.set(this.taxData.general.personType === PersonType.NATURAL);
    console.log(this.isNaturalPerson());
  }

  private normalizeEmptyStrings(obj: any): any {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (typeof value === 'string' && value.trim() === '') {
        obj[key] = null;
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.normalizeEmptyStrings(value);
      }
    });

    return obj;
  }

  protected saveTaxData(): void {
    console.log(this.taxData);
    const taxDataToSave: any = {
      alias: this.taxData.general.alias,
      personType: this.taxData.general.personType,
      rfc: this.taxData.general.rfc,
      legalName: this.taxData.general.legalName,
      curp: this.taxData.general.curp,
      taxRegime: this.taxData.general.taxRegime,
      contactId: this.taxData.contact,
      addressId: this.taxData.address,
    };
    console.log(taxDataToSave);
  }
}
