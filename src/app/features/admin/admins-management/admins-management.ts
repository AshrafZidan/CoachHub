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
import { ToastModule } from 'primeng/toast';
import { SearchService } from '../services/global-table-search.service';
import { TableConfig } from '../../../core/models/table-config';
import { ToastService } from '../../../core/services/toast.service';
import { Adminservice } from './services/admins-management.service';
import { Admin, AdminsQuery } from './admins.model';
import { ConfirmationService } from 'primeng/api';
import {  TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


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
    TooltipModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './admins-management.html',
  styleUrls: ['./admins-management.scss']
})
export class AdminsManagement implements OnInit, OnDestroy {
  private adminsService = inject(Adminservice);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);

  // ─── State ────────────────────────────────────────────
  admins = signal<Admin[]>([]);
  isLoading = signal(false);
  selectedRows = signal<Admin[]>([]);

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

  trackByAdminId = (_: number, admin: Admin) => admin.id;
  trackByPageItem = (_: number, item: { type: string; value: number }) =>
    `${item.type}-${item.value}`;

  isAllSelected = computed(() =>
    this.admins().length > 0 && this.selectedRows().length === this.admins().length
  );
constructor() {
  toObservable(this.searchService.searchTerm)
    .pipe(
      debounceTime(400)
    )
    .subscribe(term => {
      this.loadAdmins();
    });
}

  // ─── Lifecycle ────────────────────────────────────────
  ngOnInit(): void {
    this.searchService.searchPlaceholder.set('Search By Name or Email...');
    this.loadAdmins();
  }

  ngOnDestroy(): void {
    this.searchService.clearSearch();
  }
  openCreateAdmin(): void {
    this.router.navigateByUrl('admin/admins-List/create');
  }
  // ─── Load coupons ─────────────────────────────────────
  loadAdmins(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const query: AdminsQuery = {
      pageIndex: this.tableConfig.backendPageIndex(), // 0-based for API
      pageSize: this.tableConfig.pageSize(),
      sortBy: 'fullName', // default sort field
      sortDir: this.tableConfig.sortOrder(),
      search: this.searchService.searchTerm()?.trim() || ''
    };
    
    this.adminsService.getAdmins(query)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.admins.set(res.data);
          this.tableConfig.totalRecords.set(res.count);
          this.tableConfig.pageCount.set(res.pageCount);
          this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1); // keep UI 1-based
        }
      });
  }
  sendForgetPasswordMail(admin:Admin){
    this.confirmationService.confirm({
    message: `Are you sure you want to send reset password email to <strong>${admin.fullName}</strong>?`,
    header: 'Reset Password',
    acceptLabel: 'Send Mail',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'no-radius p-button-primary p-button-sm',
    rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',

    accept: () => {
      this.adminsService.sendForgetPasswordMail(admin.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.show('success','Email Sent',`Reset password email sent to ${admin.fullName}`
            );
          }
        });
    }
  });
  }


  deleteAdmin(admin: Admin) {
  this.confirmationService.confirm({
    message: `Are you sure you want to delete <strong>${admin.fullName}</strong>?`,
    header: 'Delete Admin',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'no-radius p-button-danger p-button-sm',
    rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',

    accept: () => {
      this.isLoading.set(true);

      this.adminsService.deleteAdmin(admin.id)
        .pipe(
          finalize(() => this.isLoading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.toast.show(
              'success',
              'Deleted',
              'Admin has been deleted successfully'
            );
            setTimeout(() => {
              
              this.loadAdmins();
            }, 10);

            this.selectedRows.update(rows =>
              rows.filter(r => r.id !== admin.id)
            );
          }
        });
    }
  });
}
toggleAdminStatus(admin: Admin) {
  const action = admin.enabled ? 'deactivate' : 'activate';
  const actionLabel = admin.enabled ? 'Deactivate' : 'Activate';

  const request$ = admin.enabled
    ? this.adminsService.deactivate(admin.id)
    : this.adminsService.activate(admin.id);

  this.confirmationService.confirm({
    message: `Are you sure you want to ${action} <strong>${admin.fullName}</strong>?`,
    header: `${actionLabel} Admin`,
    acceptLabel: actionLabel,
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'no-radius p-button-primary p-button-sm',
    rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',

    accept: () => {
      this.isLoading.set(true);

      request$
        .pipe(
          finalize(() => this.isLoading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.toast.show(
              'success',
              actionLabel,
              `Admin has been ${action}d successfully`
            );

            // ✅ Optimistic update
            this.admins.update(list =>
              list.map(a =>
                a.id === admin.id
                  ? { ...a, enabled: !a.enabled }
                  : a
              )
            );
          }
        });
    }
  });
}
  // ─── Sorting ──────────────────────────────────────────
  onSort(field: string): void {
    this.tableConfig.onSort(field);
    this.loadAdmins();
  }

  // ─── Pagination ───────────────────────────────────────
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.tableConfig.onPageChange(page);
    this.loadAdmins();
  }

  onPageSizeChange(size: number): void {
    this.tableConfig.onPageSizeChange(size);
    this.loadAdmins();
  }

  // ─── Row selection ────────────────────────────────────
  toggleSelectAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.admins()] : []);
  }

  toggleRow(admin: Admin, checked: boolean): void {
    if (checked) {
      this.selectedRows.update(rows => [...rows, admin]);
    } else {
      this.selectedRows.update(rows => rows.filter(r => r.id !== admin.id));
    }
  }

  isRowSelected(admin: Admin): boolean {
    return this.selectedRows().some(r => r.id === admin.id);
  }


}