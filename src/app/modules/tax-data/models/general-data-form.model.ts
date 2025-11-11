export interface GeneralDataForm {
    alias: string | null;
    rfc: string | null;
    legalName: string | null; //si es fisico nombre del contribuyente, si es moral nombre de la razón social
    taxRegime: string | null;
    curp: string | null;
    personType: string | null;
}