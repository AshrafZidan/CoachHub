import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { SkeletonModule } from 'primeng/skeleton';

import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  Subject,
  takeUntil
} from 'rxjs';

import { Router } from '@angular/router';

import {
  CoachDetail
} from '../../admin/coaches-management/Coaches.model';

import {
  CoachSearchCriteria,
  FindCoachService
} from '../services/find-coache.service';

import { LookupsService } from '../../admin/services/lookups.service';

import { environment } from '../../../../environments/environment.development';
import { FilterSidebarComponent } from '../../../shared/filter-sidebar/filter-sidebar.component';
import { CoachFilterValue, FilterLookupItem } from '../../../shared/filter-sidebar/filter-sidebar.model';



@Component({
  selector: 'app-find-coach',

  standalone: true,

  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    FilterSidebarComponent
  ],

  templateUrl: './find-coach.component.html',

  styleUrls: [
    './find-coach.component.scss',
    './../../coach/coachees/coach-coachees.component.scss'
  ]
})
export class FindCoachComponent
  implements OnInit, OnDestroy {


  // ==========================================================
  // Dependencies
  // ==========================================================

  private readonly findCoachService =
    inject(FindCoachService);

  private readonly lookupsService =
    inject(LookupsService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly router =
    inject(Router);


  // ==========================================================
  // RxJS
  // ==========================================================

  private readonly destroy$ =
    new Subject<void>();

  private readonly search$ =
    new Subject<string>();


  // ==========================================================
  // Data
  // ==========================================================

  public coachToBooking =
    signal<CoachDetail | null>(null);

  coaches: CoachDetail[] = [];

  searchQuery = '';

  coachCriteria:
    CoachSearchCriteria = {};

  loading = true;

  loadingMore = false;


  // ==========================================================
  // Filter
  // ==========================================================

  filterVisible = false;

  categories:
    FilterLookupItem[] = [];

  languages:
    FilterLookupItem[] = [];

  loadingCategories = false;

  loadingLanguages = false;


  /*
   * Keep the applied filter state in the parent.
   *
   * The shared component receives this value and emits
   * a new value when Apply is clicked.
   */

  appliedFilters:
    CoachFilterValue = {
      industryIds: [],
      languageIds: [],
      gender: null,
      experience: null
    };


  // ==========================================================
  // Pagination
  // ==========================================================

  private pageIndex = 0;

  private readonly pageSize = 50;

  private pageCount = 1;

  private exhausted = false;


  // ==========================================================
  // Lifecycle
  // ==========================================================

  ngOnInit(): void {

    this.initializeSearch();

    this.loadFilterLookups();

    this.loadPage(true);
  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }


  // ==========================================================
  // Search
  // ==========================================================

  private initializeSearch(): void {

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {

        this.searchQuery =
          query.trim();

        this.resetAndLoad();
      });
  }


  onSearchChange(
    query: string
  ): void {

    this.search$.next(query);
  }


  // ==========================================================
  // Lookups
  // ==========================================================

  private loadFilterLookups(): void {

    this.loadingCategories = true;

    this.loadingLanguages = true;


    forkJoin({

      categories:
        this.lookupsService
          .getCoachingIndustries(),

      languages:
        this.lookupsService
          .getLanguages()

    })
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: response => {

          this.categories =
            response.categories ?? [];

          this.languages =
            response.languages ?? [];

          this.loadingCategories = false;

          this.loadingLanguages = false;

          this.cdr.markForCheck();
        },


        error: error => {

          console.error(
            'Failed to load coach filters:',
            error
          );

          this.loadingCategories = false;

          this.loadingLanguages = false;

          this.cdr.markForCheck();
        }
      });
  }


  // ==========================================================
  // Filter
  // ==========================================================

  onFiltersApplied(
    filters: CoachFilterValue
  ): void {

    this.appliedFilters = {
      industryIds: [
        ...filters.industryIds
      ],

      languageIds: [
        ...filters.languageIds
      ],

      gender: filters.gender,

      experience: filters.experience
    };


    this.coachCriteria =
      this.createCoachCriteria(
        this.appliedFilters
      );


    this.resetAndLoad();
  }


  onFiltersCleared(): void {

    this.appliedFilters = {

      industryIds: [],

      languageIds: [],

      gender: null,

      experience: null
    };


    this.coachCriteria = {};

    this.resetAndLoad();
  }


  // ==========================================================
  // Convert shared filter to API criteria
  // ==========================================================

  private createCoachCriteria(
    filters: CoachFilterValue
  ): CoachSearchCriteria {

    const criteria:
      CoachSearchCriteria = {};


    if (filters.gender) {

      criteria.gender =
        filters.gender;
    }


    if (
      filters.industryIds.length > 0
    ) {

      criteria.coachingIndustryIds = [
        ...filters.industryIds
      ];
    }


    if (
      filters.languageIds.length > 0
    ) {

      criteria.languageIds = [
        ...filters.languageIds
      ];
    }


    const minYears =
      this.getMinimumExperience(
        filters.experience
      );


    if (minYears !== null) {

      criteria.minYearsOfExperience =
        minYears;
    }


    return criteria;
  }


  private getMinimumExperience(
    experience:
      CoachFilterValue['experience']
  ): number | null {

    switch (experience) {

      case 'INTERMEDIATE':
        return 3;

      case 'EXPERT':
        return 7;

      case 'BEGINNER':
      default:
        return null;
    }
  }


  // ==========================================================
  // Active filter count
  // ==========================================================

  get activeFilterCount(): number {

    let count = 0;


    count +=
      this.appliedFilters
        .industryIds.length;


    count +=
      this.appliedFilters
        .languageIds.length;


    if (
      this.appliedFilters.gender
    ) {
      count++;
    }


    if (
      this.appliedFilters.experience
    ) {
      count++;
    }


    return count;
  }


  // ==========================================================
  // Reset
  // ==========================================================

  private resetAndLoad(): void {

    this.pageIndex = 0;

    this.exhausted = false;

    this.coaches = [];

    this.loadPage(true);
  }


  // ==========================================================
  // Infinite scroll
  // ==========================================================

  @HostListener('window:scroll')
  onWindowScroll(): void {

    if (
      this.exhausted ||
      this.loading ||
      this.loadingMore
    ) {
      return;
    }


    const scrolled =
      window.scrollY +
      window.innerHeight;


    const threshold =
      document.documentElement
        .scrollHeight - 200;


    if (
      scrolled >= threshold
    ) {

      this.loadPage(false);
    }
  }


  // ==========================================================
  // Load coaches
  // ==========================================================

  private loadPage(
    isFirst: boolean
  ): void {

    if (isFirst) {

      this.loading = true;

      this.pageIndex = 0;

      this.coaches = [];

    } else {

      if (this.exhausted) {
        return;
      }

      this.loadingMore = true;

      this.pageIndex++;
    }


    this.cdr.markForCheck();


    const filter:
      CoachSearchCriteria = {
        ...this.coachCriteria
      };


    if (
      this.searchQuery.trim()
    ) {

      filter.name =
        this.searchQuery.trim();
    }


    this.findCoachService
      .getCoaches(
        this.pageIndex,
        this.pageSize,
        Object.keys(filter).length
          ? filter
          : undefined
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: response => {

          const incoming =
            response.data ?? [];


          this.coaches =
            isFirst
              ? incoming
              : [
                  ...this.coaches,
                  ...incoming
                ];


          this.pageCount =
            response.pageCount ?? 1;


          this.exhausted =
            this.pageIndex + 1 >=
              this.pageCount ||
            incoming.length <
              this.pageSize;


          this.loading = false;

          this.loadingMore = false;

          this.cdr.markForCheck();
        },


        error: error => {

          console.error(
            'Coaches error:',
            error
          );


          if (!isFirst) {
            this.pageIndex--;
          }


          this.loading = false;

          this.loadingMore = false;

          this.cdr.markForCheck();
        }
      });
  }


  // ==========================================================
  // Navigation
  // ==========================================================

  navigateToCoachDetails(
    coach: CoachDetail
  ): void {

    this.router.navigate(
      ['coachee/coache-details'],
      {
        state: {
          coach
        }
      }
    );
  }


  // ==========================================================
  // Helpers
  // ==========================================================

  getInitial(
    name?: string
  ): string {

    return (
      name ?? 'C'
    )
      .charAt(0)
      .toUpperCase();
  }


  getImageUrl(
    path?: string
  ): string {

    if (!path) {
      return '';
    }


    if (
      path.startsWith('http')
    ) {
      return path;
    }


    return `${environment.apiUrl}${path}`;
  }


  onImageError(
    event: Event
  ): void {

    const img =
      event.target as HTMLImageElement;


    img.src =
      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%22%23f1e9f2%22 rx=%2210%22/%3E%3Ctext x=%2250%25%22 y=%2254%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2232%22 fill=%22%23833C88%22%3E👤%3C/text%3E%3C/svg%3E';
  }


  get skeletonItems(): number[] {

    return Array.from(
      {
        length: 6
      },
      (_, index) => index
    );
  }
}