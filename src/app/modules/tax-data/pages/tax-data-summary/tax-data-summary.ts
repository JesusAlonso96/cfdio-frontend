import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tax-data-summary',
  imports: [],
  templateUrl: './tax-data-summary.html',
  styleUrl: './tax-data-summary.scss',
})
export class TaxDataSummaryComponent implements OnInit {
  ngOnInit(): void {
    const taxData = JSON.parse(sessionStorage.getItem('draft.datosFiscales') || '');
    console.log(taxData);
    console.log('DATOS GENERALES: ', taxData.general);
    console.log('DATOS CONTACTO: ', taxData.contact);
    console.log('DATOS DIRECCIÓN: ', taxData.address);
    // if(!taxData)
  }
}
