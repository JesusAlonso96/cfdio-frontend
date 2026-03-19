import { HOME_ROUTE, TAX_DATA_ROUTE } from '../../../core/constants/main-routes.contant';

export const MENU_ITEMS = [
  { label: 'Inicio', icon: 'home_app_logo', route: HOME_ROUTE },
  { label: 'Facturación', icon: 'receipt_long', route: '/usuarios' },
  {
    label: 'Datos fiscales',
    icon: 'library_books',
    route: TAX_DATA_ROUTE,
    subroutes: [`${TAX_DATA_ROUTE}/nuevo`],
  },
  { label: 'Reportes', icon: 'bar_chart', route: '/reportes' },
];
