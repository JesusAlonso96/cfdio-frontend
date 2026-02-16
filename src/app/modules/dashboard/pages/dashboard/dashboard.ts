import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header';
import { MENU_ITEMS } from '../../constants/menu.constant';
import { Subscription } from 'rxjs/internal/Subscription';
import { OutlinedIconDirective } from '../../../../shared/directives/outlined-icon.directive';
import { RouterOutlet, Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { CreateCompanyModal } from '../../../../shared/components/create-company-modal/create-company-modal';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatCardModule, OutlinedIconDirective, RouterOutlet],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  /* GENERAL VARS */
  readonly menuItems = MENU_ITEMS;
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  /* SIDEBAR VARS */
  isCollapsed = signal(false);
  currentModule = signal('');
  /* HEADER VARS */
  @ViewChild(MatSidenavContent) content!: MatSidenavContent;
  hasScrolled = signal(false);
  private scrollSubscription?: Subscription;

  constructor() {
    this.initCurrentModule();
  }

  async ngOnInit() {
    const existCompany: string | null = localStorage.getItem('company');
    if(!existCompany) return;
    if (existCompany === 'NO-EXIST') this.openCreateCompanyModal();
  }



  /* SIDEBAR FUNCTIONS */
  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());

  }

  private initCurrentModule(): void {
    const currentRoute = this.router.url;
    const currentModule = this.menuItems.find(i => i.route.includes(currentRoute) || i.subroutes?.includes(currentRoute));
    if (currentModule) this.setCurrentModule(currentModule);
  }

  protected redirectToModule(itemMenu: { label: string, icon: string, route: string }) {
    this.router.navigate([itemMenu.route]);
    this.setCurrentModule(itemMenu);
  }

  private setCurrentModule(itemMenu: { label: string, icon: string, route: string }) {
    this.currentModule.set(itemMenu.label);
  }

  /* HEADER FUNCTIONS */
  ngAfterViewInit() {
    this.scrollSubscription = this.content.elementScrolled().subscribe(() => {
      this.hasScrolled.set(this.content.getElementRef().nativeElement.scrollTop > 0);
    });
  }

  backToTop() {
    this.content.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* CHECK COMPANY */
  openCreateCompanyModal(): void {
    this.dialog.open(CreateCompanyModal, {
      width: '500px',
      height: '350px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      disableClose: true
    });
  }


  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
  }
}
