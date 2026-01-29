export interface CreateAddress {
    street: string;
    extNumber: string;
    intNumber?: string;
    colony: string;
    municipality: string;
    state: string;
    zipCode: string;
}