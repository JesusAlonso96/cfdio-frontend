import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  public mapFormToModel<T>(form: FormGroup, excludeKeys: string[] = []): T {
    const raw = form.getRawValue();
    excludeKeys.forEach(key => delete raw[key]);
    return raw as T;
  }

  public replacePhoneMask(phone: string): string {
    return phone.replaceAll("-", "");
  }

}
