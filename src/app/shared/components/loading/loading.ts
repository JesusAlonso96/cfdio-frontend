import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../../services/loading.service';
import { LoadingIconsComponent } from '../loading-icons/loading-icons';
import { LoadingColors } from '../../enums/loading-colors.enum';
import { LoadingIconsSize } from '../../enums/loading-icons-size.enum';

@Component({
  selector: 'app-loading',
  imports: [CommonModule, MatIconModule, LoadingIconsComponent],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class LoadingComponent {
  LoadingColors = LoadingColors;
  LoadingIconsSize = LoadingIconsSize;
  protected _loadingService = inject(LoadingService);

  constructor() {}
}
