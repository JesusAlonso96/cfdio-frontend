export interface TaxData {
  id: number;
  alias: string;
  rfc: string;
  legalName: string;
  taxRegime: string;
  curp: string;
  personType: string;
  addressId: number;
  contactId: number;
  active: boolean;
  createdAt: string;
}
