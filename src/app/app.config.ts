import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideClientHydration } from '@angular/platform-browser';
import { MAIN_ROUTES } from './app.routes';
import { errorInterceptor } from './shared/interceptors/error-interceptor';
import { credentialsInterceptor } from './shared/interceptors/credentials-interceptor';
import { refreshTokenInterceptor } from './modules/auth/interceptors/refresh-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([refreshTokenInterceptor])),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideHttpClient(withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(MAIN_ROUTES, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', floatLabel: 'always', subscriptSizing: 'fixed' },
    },
  ],
};
