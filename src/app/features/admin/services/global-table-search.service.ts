// src/app/core/services/search.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  // ─── Current search term ──────────────────────────────
  readonly searchTerm = signal<string>('');
  public searchVisible = signal(true);
  public searchPlaceholder = signal<string>('Search...');


  show() {
    this.searchVisible.set(true);
  }

  hide() {
    this.searchVisible.set(false);
  }

  // ─── Called by topbar on Enter ────────────────────────
  setSearch(term: string): void {
    this.searchTerm.set(term.trim());
  }

  // ─── Called by each page on destroy to clear search ──
  clearSearch(): void {
    this.searchTerm.set('');
  }
}