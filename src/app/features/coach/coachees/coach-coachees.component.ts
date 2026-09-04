
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { SkeletonModule } from 'primeng/skeleton';
import { Coachee, CoacheeService } from './coach-coachees.service';
import { CoacheeBookingsComponent } from './coachee-bookings/coachee-bookings.component';


@Component({
  selector: 'app-coach-coachees',
  standalone: true,
  imports: [CommonModule,CoacheeBookingsComponent,SkeletonModule],
  templateUrl: './coach-coachees.component.html',
  styleUrls: ['./coach-coachees.component.scss']
})
export class CoachCoacheesComponent implements OnInit, OnDestroy {
  private coacheeService = inject(CoacheeService);
  private cdr            = inject(ChangeDetectorRef);
  private destroy$       = new Subject<void>();
  private search$        = new Subject<string>();
  public coacheeToBooking = signal<Coachee | null>(null);
  coacheeToBookingModalVisible = signal(false);

  // ── data ─────────────────────────────────────────────────
  coachees:    Coachee[] = [];
  searchQuery: string    = '';
  loading:     boolean   = true;
  loadingMore: boolean   = false;

  // ── pagination ────────────────────────────────────────────
  private pageIndex  = 0;
  private pageSize   = 50;
  private pageCount  = 1;
  private exhausted  = false;



  // ── lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {
    // Debounce search input
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.searchQuery = query;
        this.resetAndLoad();
      });

    this.loadPage(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── search ────────────────────────────────────────────────
  onSearchChange(query: string): void {
    this.search$.next(query);
  }

  private resetAndLoad(): void {
    this.pageIndex = 0;
    this.exhausted = false;
    this.coachees  = [];
    this.loadPage(true);
  }

  // ── infinite scroll ───────────────────────────────────────
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.exhausted || this.loading || this.loadingMore) return;

    const scrolled  = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight - 200;

    if (scrolled >= threshold) {
      this.loadPage(false);
    }
  }

  // ── load page ─────────────────────────────────────────────
  private loadPage(isFirst: boolean): void {
    if (isFirst) {
      this.loading   = true;
      this.pageIndex = 0;
      this.coachees  = [];
    } else {
      if (this.exhausted) return;
      this.loadingMore = true;
      this.pageIndex++;
    }
    this.cdr.markForCheck();

    this.coacheeService
      .getCoachees(this.pageIndex, this.pageSize, this.searchQuery || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          const incoming = res.data ?? [];
          this.coachees  = isFirst ? incoming : [...this.coachees, ...incoming];
          this.pageCount = res.pageCount ?? 1;
          this.exhausted =
            this.pageIndex + 1 >= this.pageCount || incoming.length < this.pageSize;

          this.loading     = false;
          this.loadingMore = false;
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Coachees error:', err);
          this.loading     = false;
          this.loadingMore = false;
          this.cdr.markForCheck();
        },
      });
  }

  // ── actions ───────────────────────────────────────────────
  openCoachee(coachee: Coachee): void {
  this.coacheeToBooking.set(coachee);
  this.coacheeToBookingModalVisible.set(true);
}

closeCoacheeBookingModal(): void {
  this.coacheeToBookingModalVisible.set(false);
  this.coacheeToBooking.set(null);
}

  // ── helpers ───────────────────────────────────────────────
  getInitial(name?: string): string {
    return (name ?? 'C').charAt(0).toUpperCase();
  }

  getImageUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl}${path}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%22%23f1e9f2%22 rx=%2210%22/%3E%3Ctext x=%2250%25%22 y=%2254%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2232%22 fill=%22%23833C88%22%3E👤%3C/text%3E%3C/svg%3E';
  }

  get skeletonItems(): number[] {
    return Array.from({ length: this.pageSize }, (_, i) => i);
  }
}