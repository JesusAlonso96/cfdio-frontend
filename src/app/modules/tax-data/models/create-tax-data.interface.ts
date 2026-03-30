export interface CreateTaxData {
  alias?: string;
  personType: string;
  rfc: string;
  legalName: string;
  curp?: string;
  taxRegime: string;
  contactId: number;
  addressId: number;
}
