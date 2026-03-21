import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import {
  ConfirmDialogOptions,
  ConfirmDialogComponent,
} from '../components/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  async confirm(options: ConfirmDialogOptions): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: options,
      disableClose: options.disableClose ?? false,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
