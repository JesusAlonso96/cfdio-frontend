import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  show(): boolean {
    this._loading.next(true);
    return true;
  }

  hide(): boolean {
    this._loading.next(false);
    return false;
  }
}
