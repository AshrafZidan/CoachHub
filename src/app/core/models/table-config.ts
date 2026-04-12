import { computed, signal } from '@angular/core';

export interface TableConfigOptions {
  defaultSortField?: string;
  defaultSortOrder?: 'ASC' | 'DESC';
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export interface PageItem {
  type: 'page' | 'ellipsis';
  value: number;
}

export class TableConfig {
  // ─── Sorting ──────────────────────────────────────────
  sortField = signal<string>('fullNameEn');
  sortOrder = signal<'ASC' | 'DESC'>('ASC');

  // ─── Pagination (UI = 1-based) ────────────────────────
  pageIndex = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizeOptions = signal<number[]>([10, 25, 50, 100]);

  // ─── Backend helpers (0-based) ───────────────────────
  backendPageIndex = computed(() => Math.max(0, this.pageIndex() - 1));

  // ─── API response ────────────────────────────────────
  totalRecords = signal<number>(0);
  pageCount = signal<number>(0);

  totalPages = computed(() => this.pageCount());

  // ─── Pagination UI ───────────────────────────────────
  pageItems = computed((): PageItem[] => {
    const total = this.pageCount();
    const current = this.pageIndex();

    if (total === 0) return [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => ({
        type: 'page',
        value: i + 1
      }));
    }

    const pageSet = new Set<number>();
    pageSet.add(1);
    pageSet.add(total);

    const from = Math.max(2, current - 2);
    const to = Math.min(total - 1, current + 2);

    for (let i = from; i <= to; i++) {
      pageSet.add(i);
    }

    const sorted = Array.from(pageSet).sort((a, b) => a - b);
    const items: PageItem[] = [];

    sorted.forEach((page, i) => {
      const prev = sorted[i - 1];

      if (prev !== undefined && page - prev > 1) {
        items.push({ type: 'ellipsis', value: 0 });
      }

      items.push({ type: 'page', value: page });
    });

    return items;
  });

  // ─── Actions ─────────────────────────────────────────
  onSort(field: string): void {
    if (this.sortField() === field) {
      this.sortOrder.update(o => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      this.sortField.set(field);
      this.sortOrder.set('ASC');
    }
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.pageIndex.set(1);
  }

  getApiParams() {
    return {
      pageIndex: this.backendPageIndex(),
      pageSize: this.pageSize(),
      sortBy: this.sortField(),
      sortDir: this.sortOrder(),
      name: '' // Placeholder for search term, can be set externally before API call
    };
  }

  constructor(options?: TableConfigOptions) {
    if (options?.defaultSortField) this.sortField.set(options.defaultSortField);
    if (options?.defaultSortOrder) this.sortOrder.set(options.defaultSortOrder);
    if (options?.defaultPageSize) this.pageSize.set(options.defaultPageSize);
    if (options?.pageSizeOptions) this.pageSizeOptions.set(options.pageSizeOptions);
  }
  
}