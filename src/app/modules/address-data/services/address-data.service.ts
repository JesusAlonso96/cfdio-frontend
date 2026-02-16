import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { CreateAddress } from "../models/create-address.interface";
import { Observable } from "rxjs";
import { AddressData } from "../models/address-data.interface";



@Injectable({
    providedIn: 'root'
})
export class AddressDataService {
    private http = inject(HttpClient);
    private readonly addressDataApi = `${environment.apiUrl}/address`;

    constructor() { }

    /* HTTP POST */
    private createAddress(addressData: CreateAddress): Observable<AddressData> {
        return this.http.post<AddressData>(`${this.addressDataApi}`, addressData);
    }

    public createAddressDataAsync(addressData: CreateAddress): Promise<AddressData> {
        return new Promise<AddressData>((resolve, reject) => {
            this.createAddress(addressData).subscribe({
                next: (response: AddressData) => { resolve(response) },
                error: (err: HttpErrorResponse) => reject(err.error)
            });
        })
    }

    /* HTTP GET */
    private getAllAddresses(): Observable<AddressData[]> {
        return this.http.get<AddressData[]>(`${this.addressDataApi}`);
    }

    public getAllAddressesAsync(): Promise<AddressData[]> {
        return new Promise<AddressData[]>((resolve, reject)=> {
            this.getAllAddresses().subscribe({
                next: (response: AddressData[]) => {resolve(response)},
                error: (err: HttpErrorResponse)=>reject(err.error)
            })
        })
    }
}