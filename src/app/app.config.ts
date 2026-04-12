import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { refreshTokenInterceptor } from './core/interceptors/Refresh token.interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
       provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,         // 1. Attach Bearer token
        refreshTokenInterceptor, // 2. Handle 401 → refresh token
        errorInterceptor         // 3. Handle other errors
      ])
    ),
    provideAnimations(),
    providePrimeNG({
      theme: {
          preset: Aura
      }
  }),

    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
