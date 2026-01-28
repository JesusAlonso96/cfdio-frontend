export interface CreateAddress {
    street: string;
    extNumber: string;
    intNumber?: string;
    colony: string;
    municipality: string;
    state: string;
    country: string; //solo Mexico por el momento
    zipCode: string;
}