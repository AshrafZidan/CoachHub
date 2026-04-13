import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  DestroyRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SearchService } from '../../services/global-table-search.service';
import { CoachesService } from '../services/Coaches.service';
import { CoachDetail } from '../Coaches.model';

import { CoachBasicForm } from './steps/coach-basic-form/coach-basic-form';
import { CoachProfessionalForm } from './steps/coach-professional-form/coach-professional-form';
import { CoachMediaForm } from './steps/coach-profrssional-form/coach-media-form';
import { ToastService } from '../../../../core/services/toast.service';
@Component({
  selector: 'app-edit-coach',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule,
    CoachBasicForm,
    CoachProfessionalForm,
    CoachMediaForm
  ],
  templateUrl: './edit-coach.html',
  styleUrls: ['./edit-coach.scss']
})
export class EditCoachComponent implements OnInit, OnDestroy {

  // =========================
  // INJECTIONS
  // =========================
  private searchService = inject(SearchService);
  private coachesService = inject(CoachesService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toast = inject(ToastService);


  // =========================
  // STATE
  // =========================
  step = signal(1);
  coach = signal<CoachDetail | null>(null);
  isLoading = signal(false);

  // =========================
  // COMPUTED
  // =========================
  isStep1 = computed(() => this.step() === 1);
  isStep2 = computed(() => this.step() === 2);
  isStep3 = computed(() => this.step() === 3);
  isLastStep = computed(() => this.step() === 3);
  showBackButton = computed(() => this.step() > 1);

  // =========================
  // STEP 1 FORM
  // =========================
  basicForm = this.fb.group({
    fullNameEn: ['', Validators.required],
    fullNameAr: ['', Validators.required],
    gender: ['', Validators.required],
    birthDate: [null as Date | null, Validators.required],
    countryId: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    whatsAppNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
  });

  // =========================
  // STEP 2 FORM
  // =========================
  professionalForm = this.fb.group({
    yearsOfExperience: [null as number | null, [Validators.required, Validators.min(0)]],
    coachingIndustries: [[] as string[], Validators.required],
    languages: [[] as string[], Validators.required],
    availableEveryWeek: [false as boolean, Validators.required],
    jobTitle: ['', Validators.required],
  });

  // =========================
  // STEP 3 FORM (MEDIA)
  // =========================
  mediaForm = this.fb.group({
    username: ['', Validators.required],
    profileImageUrl: [''],
    certificates: this.fb.array([])
  });

  // =========================
  // GET CERTIFICATES ARRAY
  // =========================
  get certificates(): FormArray {
    return this.mediaForm.get('certificates') as FormArray;
  }

  createCertificate(cert?: any): FormGroup {
    return this.fb.group({
      id: [cert?.id || null],
      name: [cert?.name || ''],
      fileUrl: [cert?.fileUrl || ''],
      contentType: [cert?.contentType || '']
    });
  }

  addCertificate() {
    this.certificates.push(this.createCertificate());
  }

  removeCertificate(index: number) {
    this.certificates.removeAt(index);
  }

  // =========================
  // CURRENT FORM
  // =========================
  currentForm = computed(() => {
    switch (this.step()) {
      case 1: return this.basicForm;
      case 2: return this.professionalForm;
      case 3: return this.mediaForm;
      default: return this.basicForm;
    }
  });

  isNextDisabled = computed(() => this.currentForm().invalid);

  // =========================
  // INIT
  // =========================
  constructor() {
    this.searchService.hide();
  }

ngOnInit() {
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id),
    map(id => Number(id)),
    filter(id => !isNaN(id) && id > 0),

    switchMap(id => {
      this.isLoading.set(true);

      return this.coachesService.getCoachDetails(id);
    }),

    takeUntilDestroyed(this.destroyRef)
  ).subscribe({
    next: (res) => {
      const data = res?.data;

      // 🚨 SAFE CHECK (IMPORTANT FIX)
      if (!data) {
        this.isLoading.set(false);
        this.router.navigate(['/admin/coaches']);
        return;
      }

      this.coach.set(data);

      // =========================
      // STEP 1
      // =========================
      this.basicForm.patchValue({
        fullNameEn: data.fullNameEn,
        fullNameAr: data.fullNameAr,
        gender: data.gender?.toLowerCase(),
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        countryId: data.country?.code ?? null,
        email: data.email,
        whatsAppNumber: this.parseWhatsapp(data.whatsAppNumber).number
      });

      // =========================
      // STEP 2
      // =========================
      this.professionalForm.patchValue({
        yearsOfExperience: data.yearsOfExperience ?? null,
        jobTitle: data.jobTitle,
        availableEveryWeek: data.availableEveryWeek,
        coachingIndustries: data.coachingIndustries?.map((i: any) => i.id) || [],
        languages: data.languages?.map((l: any) => l.id) || []
      });

      // =========================
      // STEP 3
      // =========================
      this.mediaForm.patchValue({
        username: data.username || '',
        profileImageUrl: data.profileImageUrl || ''
      });

      // =========================
      // CERTIFICATES
      // =========================
      this.certificates.clear();

      data.certificates?.forEach((cert: any) => {
        this.certificates.push(this.createCertificate(cert));
      });

      this.isLoading.set(false);
    },

    error: (err) => {
      console.error(err);
      this.isLoading.set(false);

      // 🚨 IMPORTANT: prevent stuck page
      this.router.navigate(['/admin/coaches']);
    }
  });
}

  ngOnDestroy() {
    this.searchService.show();
  }

  // =========================
  // HELPERS
  // =========================
  parseWhatsapp(phone: string | null) {
    if (!phone) return { code: '', number: '' };

    const match = phone.match(/^(\+\d{1,4})(\d+)$/);

    return {
      code: match?.[1] || '',
      number: match?.[2] || ''
    };
  }

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  }

  // =========================
  // NAVIGATION
  // =========================
  next() {
    const form = this.currentForm();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (this.isLastStep()) {
      this.submit();
    } else {
      this.step.update(s => s + 1);
    }
  }

  back() {
    this.step.update(s => s - 1);
  }

  // =========================
  // SUBMIT
  // =========================
 submit() {
  const media = this.mediaForm.value;

  const profileImage = media.profileImageUrl
    ? {
        contentType: 'image/jpeg',
        content: this.extractBase64(media.profileImageUrl),
        attachmentName: 'profile.jpg'
      }
    : null;

  const certificates = media.certificates?.map((c: any) => {

    // ✅ CASE 1: user uploaded / replaced
    if (c.file) {
      return {
        contentType: c.contentType || 'image/jpeg',
        content: this.extractBase64(c.file),
        attachmentName: c.name
      };
    }

    // ✅ CASE 2: existing from API
    return {
      contentType: c.contentType || 'image/jpeg',
      content: this.extractBase64(c.fileUrl), // ⚠️ only works if already base64
      attachmentName: c.name
    };
  });

  const payload = {
    ...this.basicForm.value,
    ...this.professionalForm.value,

    username: media.username,
    profileImage,
    certificates
  };
  const coachId = this.coach()?.id;
  if (this.coach() !== undefined && coachId !== undefined) {
    this.coachesService.updateCoach(coachId, payload).subscribe({
    next: () => {
      this.toast.show('success', 'Coach updated successfully', '');
      this.router.navigate(['/admin/coaches']);
    },
    error: (err) => {
      console.error('Error updating coach', err);
        this.toast.show('error', 'Failed to update coach', '');
    }
  });
}
}

extractBase64(dataUrl: string): string {
  if (!dataUrl) return '';

  // remove prefix: data:image/png;base64,
  return dataUrl.split(',')[1];
}
}