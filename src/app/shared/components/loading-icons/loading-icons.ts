import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoadingColors } from '../../enums/loading-colors.enum';
import { LoadingIconsSize } from '../../enums/loading-icons-size.enum';

@Component({
  selector: 'app-loading-icons',
  imports: [CommonModule, MatIconModule],
  templateUrl: './loading-icons.html',
  styleUrl: './loading-icons.scss'
})
export class LoadingIconsComponent {
  @Input() size: LoadingIconsSize = LoadingIconsSize.Normal;
  @Input() color: LoadingColors = LoadingColors.Primary;
  icons: {class: string, name: string}[] = [
    {class:'icon1', name: 'cloud_done'},
    {class:'icon2', name: 'receipt_long'},
    {class:'icon3', name: 'desktop_mac'},
    {class:'icon4', name: 'paid'}
  ]

}
