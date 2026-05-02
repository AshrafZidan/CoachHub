// src/app/core/services/search.service.ts
import { Injectable, signal } from '@angular/core';
export interface SearchOption {
  label: string;
  value: string;
}
@Injectable({ providedIn: 'root' })
export class SearchService {
  // ─── Current search term ──────────────────────────────
  readonly searchTerm = signal<string>('');
  public searchVisible = signal(true);
  public searchPlaceholder = signal<string>('Search...');
  public searchOptions = signal<SearchOption[]>([]);
  public selectedField = signal<string>('');

  show() {
    this.searchVisible.set(true);
  }

  hide() {
    this.searchVisible.set(false);
  }

  // ─── Called by topbar on Enter ────────────────────────
  setSearch(term: string,field?: string): void {
    this.searchTerm.set(term.trim());
    if (field) this.selectedField.set(field);
  }

  // ─── Called by each page on destroy to clear search ──
  clearSearch(): void {
    this.searchTerm.set('');
    this.selectedField.set('');
  }
}