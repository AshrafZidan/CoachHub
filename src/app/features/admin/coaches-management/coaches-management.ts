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
import { Router } from '@angular/router';
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

// App imports
import { CoachesService } from './services/Coaches.service';
import { Coach, CoachesQuery } from './Coaches.model';
import { TableConfig } from '../../../core/models/table-config';
import { ApproveCoachDialogComponent } from './approve-coach-dialog/approve-coach-dialog.component';
import { SearchService } from '../services/global-table-search.service';
import { CoachDetailsDialogComponent } from './coache-details-modal/coache-details-modal';

@Component({
  selector: 'app-coaches',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    DialogModule,
    InputTextModule,
    ApproveCoachDialogComponent,
    CoachDetailsDialogComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './coaches-management.html',
  styleUrls: ['./coaches-management.scss']
})
export class CoachesManagement implements OnInit, OnDestroy {
  private coachesService = inject(CoachesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private searchService = inject(SearchService);

  // ─── State ────────────────────────────────────────────
  coaches = signal<Coach[]>([]);
  isLoading = signal(false);
  selectedRows = signal<Coach[]>([]);

  detailsVisible = signal(false);
selectedCoachId = signal<number | null>(null);
  approvalDialogVisible = signal(false);
  selectedCoachForApproval = signal<Coach | null>(null);

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

  trackByCoachId = (_: number, coach: Coach) => coach.id;
  trackByPageItem = (_: number, item: { type: string; value: number }) =>
    `${item.type}-${item.value}`;

  isAllSelected = computed(() =>
    this.coaches().length > 0 && this.selectedRows().length === this.coaches().length
  );
constructor() {
  toObservable(this.searchService.searchTerm)
    .pipe(
      debounceTime(400)
    )
    .subscribe(term => {
      this.loadCoaches();
    });
}

  // ─── Lifecycle ────────────────────────────────────────
  ngOnInit(): void {
    this.loadCoaches();
    this.searchService.searchPlaceholder.set('Search By Name or Email...');
  }

  ngOnDestroy(): void {
    this.searchService.clearSearch();
  }

  // ─── Load coaches ─────────────────────────────────────
  loadCoaches(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const query: CoachesQuery = {
      pageIndex: this.tableConfig.backendPageIndex(), // 0-based for API
      pageSize: this.tableConfig.pageSize(),
      sortBy: this.tableConfig.sortField(),
      sortDir: this.tableConfig.sortOrder(),
      name: this.searchService.searchTerm()?.trim() || ''
    };

    this.coachesService.getCoaches(query)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.coaches.set(res.data);
          this.tableConfig.totalRecords.set(res.count);
          this.tableConfig.pageCount.set(res.pageCount);
          this.tableConfig.pageIndex.set((res.pageIndex ?? 0) + 1); // keep UI 1-based
        }
      });
  }

  // ─── Sorting ──────────────────────────────────────────
  onSort(field: string): void {
    this.tableConfig.onSort(field);
    this.loadCoaches();
  }

  // ─── Pagination ───────────────────────────────────────
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.tableConfig.onPageChange(page);
    this.loadCoaches();
  }

  onPageSizeChange(size: number): void {
    this.tableConfig.onPageSizeChange(size);
    this.loadCoaches();
  }

  // ─── Row selection ────────────────────────────────────
  toggleSelectAll(checked: boolean): void {
    this.selectedRows.set(checked ? [...this.coaches()] : []);
  }

  toggleRow(coach: Coach, checked: boolean): void {
    if (checked) {
      this.selectedRows.update(rows => [...rows, coach]);
    } else {
      this.selectedRows.update(rows => rows.filter(r => r.id !== coach.id));
    }
  }

  isRowSelected(coach: Coach): boolean {
    return this.selectedRows().some(r => r.id === coach.id);
  }

  // ─── Navigation ───────────────────────────────────────


// 🔥 VIEW FUNCTION
    viewCoach(coach: any) {
      this.selectedCoachId.set(coach.id);
      this.detailsVisible.set(true);
    }

    // optional
    closeDetails() {
      this.detailsVisible.set(false);
      this.selectedCoachId.set(null);
    }

  editCoach(coach: Coach): void {
    this.router.navigate(['/admin/coaches/edit-coach', coach.id]);
  }
  openCreateCoach(): void {
      this.router.navigate(['/admin/coaches/add-coach']);
    }
  // ─── Approval dialog ──────────────────────────────────
  openApprovalDialog(coach: Coach): void {
    this.selectedCoachForApproval.set(coach);
    this.approvalDialogVisible.set(true);
  }

  onCoachApproved(): void {
    this.loadCoaches();
  }

  onDialogVisibleChange(visible: boolean): void {
    this.approvalDialogVisible.set(visible);
    if (!visible) this.selectedCoachForApproval.set(null);
  }

  // ─── Toggle Activate / Deactivate ────────────────────
  toggleActivation(coach: Coach): void {
    const isActive = coach.enabled === true && coach.status === 'APPROVED';
    const action = isActive ? 'deactivate' : 'activate';
    const label = isActive ? 'Deactivate' : 'Activate';

    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} <strong>${coach.fullNameEn}</strong>?`,
      header: `${label} Coach`,
      acceptLabel: label,
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',
      acceptButtonStyleClass: isActive ? 'no-radius p-button-danger p-button-sm' : 'no-radius p-button-success p-button-sm',
      accept: () => {
        const call$ = isActive
          ? this.coachesService.deactivateCoach(coach.id)
          : this.coachesService.activateCoach(coach.id);

        call$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.coaches.update(list =>
              list.map(c => c.id === coach.id ? { ...c, enabled: !isActive } : c)
            );
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Coach ${action}d successfully` });
          }
        });
      }
    });
  }

    // ─── forget password  ─────────────────────────────────────

  sendForgetPasswordMail(coach: Coach) {
  this.confirmationService.confirm({
    message: `Are you sure you want to send reset password email to <strong>${coach.fullNameEn}</strong>?`,
    header: 'Reset Password',
    acceptLabel: 'Send Mail',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'no-radius p-button-primary p-button-sm',
    rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',

    accept: () => {
      this.coachesService.sendForgetPasswordMail(coach.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Email Sent',
              detail: `Reset password email sent to ${coach.fullNameEn}`
            });
          }
        });
    }
  });
}
  // ─── Reject coach ─────────────────────────────────────
  rejectCoach(coach: Coach): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to reject <strong>${coach.fullNameEn}</strong>?`,
      header: 'Reject Coach',
      acceptLabel: 'Reject',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'no-radius p-button-danger p-button-sm',
      rejectButtonStyleClass: 'no-radius p-button-secondary p-button-sm',
      accept: () => {
        this.coachesService.rejectCoach(coach.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.coaches.update(list =>
                list.map(c => c.id === coach.id ? { ...c, status: 'REJECTED' } : c)
              );
              this.messageService.add({ severity: 'success', summary: 'Rejected', detail: `${coach.fullNameEn} has been rejected` });
            }
          });
      }
    });
  }
}