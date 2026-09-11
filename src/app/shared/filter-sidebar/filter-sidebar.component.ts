import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';

import {
  CoachExperience,
  CoachGender,
  CoachFilterValue,
  FilterLookupItem
} from './filter-sidebar.model';


@Component({
  selector: 'app-filter-sidebar',
  standalone: true,

  imports: [
    CommonModule,
    SkeletonModule
  ],

  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss'],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FilterSidebarComponent
  implements OnChanges, OnDestroy {

  // ==========================================================
  // Inputs
  // ==========================================================

  @Input()
  visible = false;

  @Input()
  categories: FilterLookupItem[] = [];

  @Input()
  languages: FilterLookupItem[] = [];

  @Input()
  loadingCategories = false;

  @Input()
  loadingLanguages = false;

  @Input()
  initialValue: CoachFilterValue = {
    industryIds: [],
    languageIds: [],
    gender: null,
    experience: null
  };


  // ==========================================================
  // Outputs
  // ==========================================================

  @Output()
  visibleChange =
    new EventEmitter<boolean>();

  @Output()
  apply =
    new EventEmitter<CoachFilterValue>();

  @Output()
  clear =
    new EventEmitter<void>();


  // ==========================================================
  // Local filter state
  // ==========================================================

  selectedIndustryIds: number[] = [];

  selectedLanguageIds: number[] = [];

  selectedGender: CoachGender = null;

  selectedExperience: CoachExperience = null;


  // ==========================================================
  // Lifecycle
  // ==========================================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    /*
     * Copy the parent's applied filters when
     * the sidebar is opened.
     *
     * We intentionally create new arrays so the
     * child never mutates the parent state.
     */

    if (
      changes['visible'] &&
      this.visible
    ) {
      this.copyInitialValue();
      this.lockBodyScroll();
    }


    if (
      changes['initialValue'] &&
      this.visible
    ) {
      this.copyInitialValue();
    }
  }


  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }


  // ==========================================================
  // Open / Close
  // ==========================================================

  close(): void {

    this.visible = false;

    this.unlockBodyScroll();

    this.visibleChange.emit(false);
  }


  // ==========================================================
  // ESC
  // ==========================================================

  @HostListener(
    'document:keydown.escape'
  )
  onEscape(): void {

    if (this.visible) {
      this.close();
    }
  }


  // ==========================================================
  // Categories
  // ==========================================================

  toggleCategory(
    categoryId: number
  ): void {

    if (
      this.selectedIndustryIds.includes(
        categoryId
      )
    ) {

      this.selectedIndustryIds =
        this.selectedIndustryIds.filter(
          id => id !== categoryId
        );

      return;
    }


    this.selectedIndustryIds = [
      ...this.selectedIndustryIds,
      categoryId
    ];
  }


  isCategorySelected(
    categoryId: number
  ): boolean {

    return this.selectedIndustryIds.includes(
      categoryId
    );
  }


  // ==========================================================
  // Languages
  // ==========================================================

  toggleLanguage(
    languageId: number
  ): void {

    if (
      this.selectedLanguageIds.includes(
        languageId
      )
    ) {

      this.selectedLanguageIds =
        this.selectedLanguageIds.filter(
          id => id !== languageId
        );

      return;
    }


    this.selectedLanguageIds = [
      ...this.selectedLanguageIds,
      languageId
    ];
  }


  isLanguageSelected(
    languageId: number
  ): boolean {

    return this.selectedLanguageIds.includes(
      languageId
    );
  }


  // ==========================================================
  // Gender
  // ==========================================================

  selectGender(
    gender: CoachGender
  ): void {

    this.selectedGender = gender;
  }


  isGenderSelected(
    gender: 'MALE' | 'FEMALE'
  ): boolean {

    return this.selectedGender === gender;
  }


  // ==========================================================
  // Experience
  // ==========================================================

  selectExperience(
    experience: CoachExperience
  ): void {

    this.selectedExperience =
      this.selectedExperience === experience
        ? null
        : experience;
  }


  isExperienceSelected(
    experience:
      | 'BEGINNER'
      | 'INTERMEDIATE'
      | 'EXPERT'
  ): boolean {

    return this.selectedExperience ===
      experience;
  }


  // ==========================================================
  // Apply
  // ==========================================================

  onApply(): void {

    const value: CoachFilterValue = {

      industryIds: [
        ...this.selectedIndustryIds
      ],

      languageIds: [
        ...this.selectedLanguageIds
      ],

      gender:
        this.selectedGender,

      experience:
        this.selectedExperience
    };


    this.apply.emit(value);

    this.close();
  }


  // ==========================================================
  // Clear
  // ==========================================================

  onClear(): void {

    this.selectedIndustryIds = [];

    this.selectedLanguageIds = [];

    this.selectedGender = null;

    this.selectedExperience = null;

    this.clear.emit();
  }


  // ==========================================================
  // Active filters
  // ==========================================================

  get activeFilterCount(): number {

    let count = 0;


    count +=
      this.selectedIndustryIds.length;


    count +=
      this.selectedLanguageIds.length;


    if (this.selectedGender) {
      count++;
    }


    if (this.selectedExperience) {
      count++;
    }


    return count;
  }


  // ==========================================================
  // Internal
  // ==========================================================

  private copyInitialValue(): void {

    this.selectedIndustryIds = [
      ...(this.initialValue?.industryIds ?? [])
    ];

    this.selectedLanguageIds = [
      ...(this.initialValue?.languageIds ?? [])
    ];

    this.selectedGender =
      this.initialValue?.gender ?? null;

    this.selectedExperience =
      this.initialValue?.experience ?? null;
  }


  private lockBodyScroll(): void {

    document.body.classList.add(
      'filter-sidebar-open'
    );
  }


  private unlockBodyScroll(): void {

    document.body.classList.remove(
      'filter-sidebar-open'
    );
  }
}