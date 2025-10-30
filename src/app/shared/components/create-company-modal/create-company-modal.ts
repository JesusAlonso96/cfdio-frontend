import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OutlinedIconDirective } from "../../directives/outlined-icon";
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseFormComponent } from '../base-form/base-form';
interface CompanyForm {
  haveCompany: boolean;
  name: string
}
@Component({
  selector: 'app-create-company-modal',
  imports: [MatDialogModule, MatButtonModule, OutlinedIconDirective, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, ReactiveFormsModule],
  templateUrl: './create-company-modal.html',
  styleUrl: './create-company-modal.scss'
})
export class CreateCompanyModal extends BaseFormComponent<CompanyForm> implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateCompanyModal>);
  public form!: FormGroup;

  protected haveCompany = signal(false);


  constructor(private fb: FormBuilder) {
    super();


  }

  ngOnInit(): void {
    this.form = this.fb.group({
      haveCompany: [false],
      name: ['']
    });
  }

  changeHaveCompany() {
    this.haveCompany.set(Boolean(this.value('haveCompany')))
  }
}
