import { ContactType } from "../enums/contact-type.enum";

export interface ContactData {
    id: number;
    type?: ContactType;
    email: string;
    phone: string;
    default?: false;
    createdAt?: string;
    updatedAt?: string;
    creationUserId?: number;
    companyId?: number;
}