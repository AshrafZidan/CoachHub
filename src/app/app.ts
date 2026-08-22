import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('coachHub');

  constructor(translate: TranslateService) {
    const supported = ['en', 'ar', 'nl'];
    translate.addLangs(supported);
    translate.setDefaultLang('en');

    // Determine language safely (guard against SSR where window/localStorage are undefined)
    let lang = 'en';
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage?.getItem('lang');
        if (saved && supported.includes(saved)) {
          lang = saved;
        } else if (typeof navigator !== 'undefined' && navigator.language) {
          const nav = navigator.language.split('-')[0];
          if (supported.includes(nav)) lang = nav;
        }
      } catch {
        // ignore storage access errors
      }
    }

    translate.use(lang);

    // handle RTL for Arabic (only touch document in browser)
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }
}

