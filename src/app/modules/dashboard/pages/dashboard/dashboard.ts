import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatCardModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {

  // Datos de ejemplo vacíos - solo para estructura
  navigationItems = ['Home', 'Manage', 'Master', 'Reports', 'Action Planning'];
  activityUsers = Array(6).fill({ name: '', type: '', category: '' });
  ongoingSurveys = Array(4).fill({ study: '', name: '' });
}
