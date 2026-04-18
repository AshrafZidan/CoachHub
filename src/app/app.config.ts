import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { MessageService } from 'primeng/api';
import { PermissionService } from './core/services/permission.service';
import { StorageService } from './core/services/storage.service';
import { AuthService } from './core/services/auth.service';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ─── Core Services ────────────────────────────────────────
    MessageService,
    PermissionService,  // ✅ Add PermissionService
    StorageService,     // ✅ Add StorageService
    AuthService,        // ✅ Add AuthService

    // ─── Browser Error Handling ───────────────────────────────
    provideBrowserGlobalErrorListeners(),

    // ─── HTTP Client with Interceptors ────────────────────────
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,         // 1️⃣ Attach Bearer token to requests
        refreshTokenInterceptor, // 2️⃣ Handle 401 → refresh token
        errorInterceptor         // 3️⃣ Handle other errors & show toasts
      ])
    ),

    // ─── Animations ────────────────────────────────────────────
    provideAnimations(),

    // ─── PrimeNG Theme ────────────────────────────────────────
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),

    // ─── Routing ───────────────────────────────────────────────
    provideRouter(routes),

    // ─── Client Hydration (SSR) ────────────────────────────────
    provideClientHydration(withEventReplay())
  ]
};