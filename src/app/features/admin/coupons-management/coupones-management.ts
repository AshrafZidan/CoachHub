import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  DestroyRef,
  effect
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CouponsService } from './services/coupones.service';
import { SearchService } from '../services/global-table-search.service';
import { TableConfig } from '../../../core/models/table-config';
import { Coupon, CouponQuery } from './coupones.model';
import { ToastService } from '../../../core/services/toast.service';
import { CreateCouponComponent } from './create-coupon/create-coupon/create-coupon.component';


@Component({
  selector: 'app-coupons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [],
  templateUrl: './coupones-management.html',
  styleUrls: ['./coupones-management.scss']
})
export class CouponsManagement implements OnInit, OnDestroy {
  private couponsService = inject(CouponsService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  // ─── State ────────────────────────────────────────────
  coupons = signal<Coupon[]>([]);
  isLoading = signal(false);
  selectedRows = signal<Coupon[]>([]);

  // ─── Table config ─────────────────────────────────────
  tableConfig = new TableConfig({
    defaultSortField: 'fullNameEn',
    defaultSortOrder: 'ASC',
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100]
  });

  pageSizeOptions = computed(() =>
    this.tableConfig.pageSizeOptions().map(size => ({ label: size.toString(), value: size }))
  );

  pageItems = this.tableConfig.pageItems;
  totalPages = this.tableConfig.totalPages;

  trackByCouponId = (_: number, coupon: Coupon) => coupon.id;
  trackByPageItem = (_: number, item: { type: string; value: number }) =>
    `${item.type}-${item.value}`;

  isAllSelected = computed(() =>
    this.coupons().length > 0 && this.selectedRows().length === this.coupons().length
  );
constructor() {
  toObservable(this.searchService.searchTerm)
    .pipe(
      debounceTime(400)
    )
    .subscribe(term => {
      this.loadCoupons();
    });
}

  // ─── Lifecycle ────────────────────────────────────────
  ngOnInit(): void {
    this.loadCoupons();
    this.searchService.searchPlaceholder.set('Search By Coupon Code...');
  }

  ngOnDestroy(): void {
    this.searchService.clearSearch();
  }
  openCreateCoupon(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }
  // ─── Load coupons ─────────────────────────────────────
  loadCoupons(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const query: CouponQuery = {
      pageIndex: this.tableConfig.backendPageIndex(), // 0-based for API
      pageSize: this.tableConfig.pageSize(),
      sortBy: 'expiryDate', // default sort field
      sortDir: this.tableConfig.sortOrder(),
      name: this.searchService.searchTerm()?.trim() || ''
    };

    this.couponsService.getCoupons(query)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.coupons.set(res.data);
          this.tableConfig.totalRecords.set(res.count);
          this.tableConfig.pageCount.set(res.pageCount);
          this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1); // keep UI 1-based
        }
      });
  }

  // ─── Sorting ──────────────────────────────────────────
  onSort(field: string): void {
    this.tableConfig.onSort(field);
    this.loadCoupons();
  }

  // ─── Pagination ───────────────────────────────────────
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.tableConfig.onPageChange(page);
    this.loadCoupons();
  }

  onPageSizeChange(size: number): void {
    this.tableConfig.onPageSizeChange(size);
    this.loadCoupons();
  }

  // ─── Row selection ────────────────────────────────────
  toggleSelectAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.coupons()] : []);
  }

  toggleRow(coupon: Coupon, checked: boolean): void {
    if (checked) {
      this.selectedRows.update(rows => [...rows, coupon]);
    } else {
      this.selectedRows.update(rows => rows.filter(r => r.id !== coupon.id));
    }
  }

  isRowSelected(coupon: Coupon): boolean {
    return this.selectedRows().some(r => r.id === coupon.id);
  }


}