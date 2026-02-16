import { AddressType } from "../enums/address-type.enum";

export interface AddressData {
    id: number;
    type?: AddressType;
    street: string;
    extNumber: string;
    intNumber?: string;
    colony: string;
    municipality: string;
    state: string;
    country?: string;
    zipCode: string;
    fullAddress: string;
    default?: boolean;
    creationUserId?: number;
    companyId?: number;
}