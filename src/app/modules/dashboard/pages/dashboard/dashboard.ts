import { AfterViewInit, Component, OnDestroy, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header';
import { MENU_ITEMS } from '../../constants/menu.constant';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatCardModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  /* GENERAL VARS */
  readonly menuItems = MENU_ITEMS;
  /* SIDEBAR VARS */
  isCollapsed = signal(false);
  /* HEADER VARS */
  @ViewChild(MatSidenavContent) content!: MatSidenavContent;
  hasScrolled = signal(false);
  private scrollSubscription?: Subscription;
  constructor() {
  }

  /* SIDEBAR FUNCTIONS */
  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());

  }

  /* HEADER FUNCTIONS */
  ngAfterViewInit() {
    this.scrollSubscription = this.content.elementScrolled().subscribe(() => {
      console.log("entre quiii", this.content.getElementRef().nativeElement.scrollTop > 0)
      this.hasScrolled.set(this.content.getElementRef().nativeElement.scrollTop > 0);
    });
  }

  backToTop() {
    this.content.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
  }
}
