import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-coach-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './coach-layout.html',
  styleUrls: ['./coach-layout.scss'],
})
export class CoachLayout {
  private auth = inject(AuthService);
  private translate = inject(TranslateService);
  currentYear = new Date().getFullYear();
  menuOpen = false;
  language = this.translate.currentLang || 'en';

  get username() {
    return this.auth.getFullName();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  handleLogout(): void {
    this.closeMenu();
    this.auth.logout();
  }

  toggleLanguage(): void {
    this.language = this.language === 'ar' ? 'en' : 'ar';
    this.translate.use(this.language);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.closeMenu();
    }
  }
}
