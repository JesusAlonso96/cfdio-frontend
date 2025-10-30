import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();
  loading = signal(false);

  show() {
    this.loading.set(true);
    this._loading.next(true);
  }

  hide() {
    this.loading.set(false);
    this._loading.next(false);
  }
}
